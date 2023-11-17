import { del, get, set } from '@dlb/dim/utils/idb-keyval';
import { emptyArray, emptyObject } from '@dlb/dim/utils/util';
import {
	AllDestinyManifestComponents,
	DestinyInventoryItemDefinition,
	DestinyItemActionBlockDefinition,
	DestinyItemTalentGridBlockDefinition,
	DestinyItemTranslationBlockDefinition,
	getDestinyManifest,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { deepEqual } from 'fast-equals';
import { unauthenticatedHttpClient } from '../bungie-api/bungie-service-helper';
import { HttpStatusError } from '../bungie-api/http-client';

// Module-local state
const localStorageKey = 'd2-manifest-version';
const idbKey = 'd2-manifest';
let version: string | null = null;

async function saveManifestToIndexedDB(
	typedArray: object,
	version: string,
	tableAllowList: string[]
) {
	try {
		await set(idbKey, typedArray);
		console.log(`Successfully stored manifest file.`);
		localStorage.setItem(localStorageKey, version);
		localStorage.setItem(
			`${localStorageKey}-whitelist`,
			JSON.stringify(tableAllowList)
		);
	} catch (e) {
		console.error('Error saving manifest file', e);
	}
}

type Mutable<T> = { -readonly [P in keyof T]: Mutable<T[P]> };
/** Functions that can reduce the size of a table after it"s downloaded but before it"s saved to cache. */
const tableTrimmers = {
	DestinyInventoryItemDefinition(table: {
		[hash: number]: DestinyInventoryItemDefinition;
	}) {
		for (const key in table) {
			const def = table[key] as Mutable<DestinyInventoryItemDefinition>;

			// Deleting properties can actually make memory usage go up as V8 replaces some efficient
			// structures from JSON parsing. Only replace objects with empties, and always test with the
			// memory profiler. Don't assume that deleting something makes this smaller.

			def.action = emptyObject<Mutable<DestinyItemActionBlockDefinition>>();
			def.backgroundColor = emptyObject();
			def.translationBlock =
				emptyObject<Mutable<DestinyItemTranslationBlockDefinition>>();
			if (def.equippingBlock?.displayStrings?.length) {
				def.equippingBlock.displayStrings = emptyArray();
			}
			if (def.preview?.derivedItemCategories?.length) {
				def.preview.derivedItemCategories = emptyArray();
			}
			def.talentGrid =
				emptyObject<Mutable<DestinyItemTalentGridBlockDefinition>>();

			if (def.sockets) {
				def.sockets.intrinsicSockets = emptyArray();
				for (const socket of def.sockets.socketEntries) {
					if (
						socket.reusablePlugSetHash &&
						socket.reusablePlugItems.length > 0
					) {
						socket.reusablePlugItems = emptyArray();
					}
				}
			}
		}

		return table;
	},
};

const getManifest = async () => {
	const response = await getDestinyManifest(unauthenticatedHttpClient);
	return response.Response;
};

async function loadManifest(
	tableAllowList: string[]
): Promise<AllDestinyManifestComponents> {
	let components: {
		[key: string]: string;
	} | null = null;
	try {
		const data = await getManifest();

		const path = data.jsonWorldContentPaths.en;
		components = data.jsonWorldComponentContentPaths.en;

		// Use the path as the version, rather than the "version" field, because
		// Bungie can update the manifest file without changing that version.
		version = path;
	} catch (e) {
		// If we can"t get info about the current manifest, try to just use whatever"s already saved.
		version = localStorage.getItem(localStorageKey);
		if (version) {
			return await loadManifestFromCache(version, tableAllowList);
		} else {
			throw e;
		}
	}

	try {
		return await loadManifestFromCache(version, tableAllowList);
	} catch (e) {
		return await loadManifestRemote(version, components, tableAllowList);
	}
}

/**
 * Returns a promise for the manifest data as a Uint8Array. Will cache it on success.
 */
async function loadManifestRemote(
	version: string,
	components: {
		[key: string]: string;
	},
	tableAllowList: string[]
): Promise<AllDestinyManifestComponents> {
	const manifest = await downloadManifestComponents(components, tableAllowList);
	// We intentionally don't wait on this promise
	saveManifestToIndexedDB(manifest, version, tableAllowList);
	console.log('>>>>>>>>>>> [MANIFEST] loaded manifest from remote');
	return manifest;
}

export async function downloadManifestComponents(
	components: {
		[key: string]: string;
	},
	tableAllowList: string[]
) {
	// Adding a cache buster to work around bad cached CloudFlare data: https://github.com/DestinyItemManager/DIM/issues/5101
	// try canonical component URL which should likely be already cached,
	// then fall back to appending "?bust" then "?bust-[random numbers]",
	// in case cloudflare has inappropriately cached another domain"s CORS headers or a 404 that"s no longer a 404
	const cacheBusterStrings = [
		'',
		'?bust',
		`?bust-${Math.random().toString().split('.')[1] ?? 'cacheBust'}`,
	];

	const manifest: Partial<AllDestinyManifestComponents> = {};

	// Load the manifest tables we want table-by-table, in parallel. This is
	// faster and downloads less data than the single huge file.
	const futures = tableAllowList
		.map((t) => `Destiny${t}Definition`)
		.map(async (table) => {
			let response: Response | null = null;
			let error = null;
			let body = null;

			for (const query of cacheBusterStrings) {
				try {
					response = await fetch(
						`https://www.bungie.net${components[table]}${query}`
					);
					if (response.ok) {
						// Sometimes the file is found, but isn't parseable as JSON
						body = await response.json();
						break;
					}
					error ??= response;
				} catch (e) {
					error ??= e;
				}
			}
			if (!body && error) {
				throw error;
			}

			manifest[table] =
				table in tableTrimmers ? tableTrimmers[table]!(body) : body;
		});

	await Promise.all(futures);

	return manifest as AllDestinyManifestComponents;
}

/**
 * Returns a promise for the cached manifest of the specified
 * version as a Uint8Array, or rejects.
 */
async function loadManifestFromCache(
	version: string,
	tableAllowList: string[]
): Promise<AllDestinyManifestComponents> {
	const currentManifestVersion = localStorage.getItem(localStorageKey);
	const currentAllowList = JSON.parse(
		localStorage.getItem(`${localStorageKey}-whitelist`) || '[]'
	) as string[];
	if (
		currentManifestVersion === version &&
		deepEqual(currentAllowList, tableAllowList)
	) {
		const manifest = await get<AllDestinyManifestComponents>(idbKey);
		if (!manifest) {
			await deleteManifestFile();
			throw new Error('Empty cached manifest file');
		}
		console.log('>>>>>>>>>>> [MANIFEST] loaded manifest from cache');
		return manifest;
	} else {
		// Delete the existing manifest first, to make space
		await deleteManifestFile();
		throw new Error(`version mismatch: ${version} ${currentManifestVersion}`);
	}
}

export function deleteManifestFile() {
	localStorage.removeItem(localStorageKey);
	return del(idbKey);
}

export async function doGetManifest(
	tableAllowList: string[]
): Promise<AllDestinyManifestComponents> {
	try {
		const manifest = await loadManifest(tableAllowList);
		if (!manifest.DestinyVendorDefinition) {
			throw new Error('Manifest corrupted, please reload');
		}
		return manifest;
	} catch (e) {
		let message = (e as Error).message;
		if (
			e instanceof TypeError ||
			(e instanceof HttpStatusError && e.status === -1)
		) {
			console.error();
			message = navigator.onLine
				? 'BungieService.NotConnectedOrBlocked'
				: 'BungieService.NotConnected';
		} else if (e instanceof HttpStatusError) {
			if (e.status === 503 || e.status === 522 /* cloudflare */) {
				message = 'BungieService.Difficulties';
			} else if (e.status < 200 || e.status >= 400) {
				(message = 'BungieService.NetworkError'),
					{
						status: e.status,
						statusText: e.message,
					};
			}
		} else {
			// Something may be wrong with the manifest
			await deleteManifestFile();
		}

		console.error('Manifest loading error', e, message);
		throw e;
	}
}
