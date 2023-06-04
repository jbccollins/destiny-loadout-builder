import { BucketHashes } from '@dlb/dim/data/d2/generated-enums';
import {
	DestinyCollectibleComponent,
	DestinyCollectiblesComponent,
	DestinyItemComponent,
	DestinyProfileCollectiblesComponent,
	DestinyProfileResponse,
	DictionaryComponentResponse,
	SingleComponentResponse,
} from 'bungie-api-ts-no-const-enum/destiny2';
import _, { isEqual, uniqWith } from 'lodash';

import { getStores } from '@dlb/dim//bungie-api/destiny2-api';
import { DestinyAccount } from '@dlb/dim/accounts/destiny-account';
import { getBuckets } from '@dlb/dim/destiny2/d2-buckets';
import {
	D2ManifestDefinitions,
	getDefinitions,
} from '@dlb/dim/destiny2/d2-definitions';
import { DimStore } from '@dlb/dim/inventory/store-types';
import { processItems } from '@dlb/dim/inventory/store/d2-item-factory';
import { InventoryBuckets } from './inventory-buckets';
import { makeCharacter, makeVault } from './store/d2-store-factory';

export function mergeCollectibles(
	profileCollectibles: SingleComponentResponse<DestinyProfileCollectiblesComponent>,
	characterCollectibles: DictionaryComponentResponse<DestinyCollectiblesComponent>
) {
	const allCollectibles = {
		...profileCollectibles?.data?.collectibles,
	};

	_.forIn(characterCollectibles?.data || {}, ({ collectibles }) => {
		Object.assign(allCollectibles, collectibles);
	});

	return allCollectibles;
}

export type LoadStoresDataResult = {
	stores: DimStore[];
	inGameLoadoutItemIdList: string[];
};

export const loadStoresData = (
	account: DestinyAccount
): Promise<LoadStoresDataResult> => {
	const promise = (async () => {
		// TODO: if we've already loaded profile recently, don't load it again

		try {
			// const { mockProfileData, readOnly } = getState().inventory;

			const [defs, profileInfo] = await Promise.all([
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				getDefinitions()!,
				//dispatch(loadNewItems(account)),
				getStores(account),
			]);

			if (!defs || !profileInfo) {
				return;
			}

			const buckets = getBuckets(defs);
			const stores = buildStores(defs, buckets, profileInfo);

			const currencies = processCurrencies(profileInfo, defs);

			const inGameLoadoutItemIdList = processInGameLoadouts(profileInfo);
			const result: LoadStoresDataResult = {
				stores,
				inGameLoadoutItemIdList,
			};

			return result;
		} catch (e) {
			console.error('d2-stores', 'Error loading stores', e);

			// It's important that we swallow all errors here - otherwise
			// our observable will fail on the first error. We could work
			// around that with some rxjs operators, but it's easier to
			// just make this never fail.
			return undefined;
		}
	})();
	return promise;
};

export function buildStores(
	defs: D2ManifestDefinitions,
	buckets: InventoryBuckets,
	profileInfo: DestinyProfileResponse
): DimStore[] {
	// TODO: components may be hidden (privacy)

	if (
		!profileInfo.profileInventory.data ||
		!profileInfo.characterInventories.data ||
		!profileInfo.characters.data
	) {
		console.error(
			'Vault or character inventory was missing - bailing in order to avoid corruption'
		);
	}

	const lastPlayedDate = findLastPlayedDate(profileInfo);

	const mergedCollectibles = mergeCollectibles(
		profileInfo.profileCollectibles,
		profileInfo.characterCollectibles
	);

	const vault = processVault(defs, buckets, profileInfo, mergedCollectibles);

	const characters = Object.keys(profileInfo.characters.data).map(
		(characterId) =>
			processCharacter(
				defs,
				buckets,
				characterId,
				profileInfo,
				mergedCollectibles,
				lastPlayedDate
			)
	);

	const stores = [...characters, vault];

	// const allItems = stores.flatMap((s) => s.items);

	// const characterProgress = getCharacterProgressions(profileInfo);

	// for (const s of stores) {
	// 	updateBasePower(
	// 		allItems,
	// 		s,
	// 		defs,
	// 		characterProgress,
	// 		profileInfo.profileProgression?.data?.seasonalArtifact
	// 			.powerBonusProgression.progressionHash
	// 	);
	// }

	return stores;
}

function processCurrencies(
	profileInfo: DestinyProfileResponse,
	defs: D2ManifestDefinitions
) {
	const profileCurrencies = profileInfo.profileCurrencies.data
		? profileInfo.profileCurrencies.data.items
		: [];
	const currencies = profileCurrencies.map((c) => ({
		itemHash: c.itemHash,
		quantity: c.quantity,
		displayProperties: defs.InventoryItem.get(c.itemHash)
			?.displayProperties ?? {
			name: 'Unknown',
			description: 'Unknown item',
		},
	}));
	return currencies;
}

/**
 * Process a single character from its raw form to a DIM store, with all the items.
 */
function processCharacter(
	defs: D2ManifestDefinitions,
	buckets: InventoryBuckets,
	characterId: string,
	profileInfo: DestinyProfileResponse,
	mergedCollectibles: {
		[hash: number]: DestinyCollectibleComponent;
	},
	lastPlayedDate: Date
): DimStore {
	const character = profileInfo.characters.data?.[characterId];
	const characterInventory =
		profileInfo.characterInventories.data?.[characterId]?.items || [];
	const profileInventory = profileInfo.profileInventory.data?.items || [];
	const characterEquipment =
		profileInfo.characterEquipment.data?.[characterId]?.items || [];
	const profileRecords = profileInfo.profileRecords?.data;
	const itemComponents = profileInfo.itemComponents;
	// TODO: Do I need to add this back in? Maybe re-audit this whole copied file
	// const uninstancedItemObjectives =
	// 	getCharacterProgressions(profileInfo, characterId)
	// 		?.uninstancedItemObjectives || [];

	const store = makeCharacter(defs, character, lastPlayedDate, profileRecords);

	// We work around the weird account-wide buckets by assigning them to the current character
	const items = characterInventory.concat(characterEquipment.flat());

	if (store.current) {
		for (const i of profileInventory) {
			const bucket = buckets.byHash[i.bucketHash];
			// items that can be stored in a vault
			if (
				bucket &&
				(bucket.vaultBucket || bucket.hash === BucketHashes.SpecialOrders)
			) {
				items.push(i);
			}
		}
	}

	const processedItems = processItems(
		defs,
		buckets,
		store,
		items,
		itemComponents,
		mergedCollectibles,
		[], // uninstancedItemObjectives,
		profileRecords
	);
	store.items = processedItems;
	return store;
}

export const processInGameLoadouts = (
	profileResponse: DestinyProfileResponse
): string[] => {
	const characterLoadouts = profileResponse?.characterLoadouts?.data;
	console.log(characterLoadouts);
	const results: string[] = [];
	if (characterLoadouts) {
		Object.values(characterLoadouts).forEach((value) => {
			value.loadouts.forEach((loadout) => {
				loadout.items.forEach((item) => {
					results.push(item.itemInstanceId);
				});
			});
		});
	}
	return uniqWith(results, isEqual);
};

function processVault(
	defs: D2ManifestDefinitions,
	buckets: InventoryBuckets,
	profileInfo: DestinyProfileResponse,
	mergedCollectibles: {
		[hash: number]: DestinyCollectibleComponent;
	}
): DimStore {
	const profileInventory = profileInfo.profileInventory.data
		? profileInfo.profileInventory.data.items
		: [];
	const profileRecords = profileInfo.profileRecords?.data; // Not present in the initial load
	const itemComponents = profileInfo.itemComponents;

	const store = makeVault();

	const items: DestinyItemComponent[] = [];
	for (const i of profileInventory) {
		const bucket = buckets.byHash[i.bucketHash];
		// items that cannot be stored in the vault, and are therefore *in* a vault
		if (
			bucket &&
			!bucket.vaultBucket &&
			bucket.hash !== BucketHashes.SpecialOrders
		) {
			items.push(i);
		}
	}

	const processedItems = processItems(
		defs,
		buckets,
		store,
		items,
		itemComponents,
		mergedCollectibles,
		undefined,
		profileRecords
	);
	store.items = processedItems;

	return store;
}

/**
 * Find the date of the most recently played character.
 */
function findLastPlayedDate(profileInfo: DestinyProfileResponse) {
	const dateLastPlayed = profileInfo.profile.data?.dateLastPlayed;
	if (dateLastPlayed) {
		return new Date(dateLastPlayed);
	}
	return new Date(0);
}

export const fakeCharacterStatHashes = {
	maxGearPower: -3,
	powerBonus: -2,
	maxTotalPower: -1,
};

// // Add a fake stat for "max base power"
// function updateBasePower(
// 	allItems: DimItem[],
// 	store: DimStore,
// 	defs: D2ManifestDefinitions,
// 	characterProgress: DestinyCharacterProgressionComponent | undefined,
// 	bonusPowerProgressionHash: number | undefined
// ) {
// 	if (!store.isVault) {
// 		const def = defs.Stat.get(StatHashes.Power);
// 		const { equippable, unrestricted } = maxLightItemSet(allItems, store);

// 		// // ALL WEAPONS count toward your drops. armor on another character doesn't count.
// 		// // (maybe just because it's on a different class? who knows. can't test.)
// 		// const dropPowerItemSet = maxLightItemSet(
// 		// 	allItems.filter(
// 		// 		(i) => i.bucket.inWeapons || i.owner === 'vault' || i.owner === store.id
// 		// 	),
// 		// 	store
// 		// ).unrestricted;
// 		const dropPowerLevel = 0; //getLight(store, dropPowerItemSet);

// 		const unrestrictedMaxGearPower = getLight(store, unrestricted);
// 		const unrestrictedPowerFloor = Math.floor(unrestrictedMaxGearPower);
// 		const equippableMaxGearPower = getLight(store, equippable);

// 		const statProblems: DimCharacterStat['statProblems'] = {};

// 		statProblems.notEquippable =
// 			unrestrictedMaxGearPower !== equippableMaxGearPower;
// 		statProblems.notOnStore = dropPowerLevel !== unrestrictedMaxGearPower;

// 		statProblems.hasClassified = allItems.some(
// 			(i) =>
// 				i.classified &&
// 				(i.location.inWeapons ||
// 					i.location.inArmor ||
// 					(i.power && i.bucket.hash === BucketHashes.Ghost))
// 		);

// 		store.stats.maxGearPower = {
// 			hash: fakeCharacterStatHashes.maxGearPower,
// 			name: 'Stats.MaxGearPowerAll',
// 			// used to be t('Stats.MaxGearPower'), a translation i don't want to lose yet
// 			statProblems,
// 			description: '',
// 			richTooltip: ItemPowerSet(unrestricted, unrestrictedPowerFloor),
// 			value: unrestrictedMaxGearPower,
// 			icon: 'helmet-icon' // helmetIcon
// 		};

// 		const artifactPower = getArtifactBonus(store);
// 		store.stats.powerModifier = {
// 			hash: fakeCharacterStatHashes.powerBonus,
// 			name: 'Stats.PowerModifier',
// 			description: '',
// 			richTooltip: ArtifactXP(characterProgress, bonusPowerProgressionHash),
// 			value: artifactPower,
// 			icon: 'xp-icon' // xpIcon
// 		};

// 		store.stats.maxTotalPower = {
// 			hash: fakeCharacterStatHashes.maxTotalPower,
// 			name: 'Stats.MaxTotalPower',
// 			statProblems,
// 			description: '',
// 			value: unrestrictedMaxGearPower + artifactPower,
// 			icon: bungieNetPath(def.displayProperties.icon)
// 		};
// 	}
// }
