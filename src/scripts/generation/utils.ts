import axios, { AxiosResponse } from 'axios';
import lodash from 'lodash';
import prettier from 'prettier';
import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';

const API_KEY = process.env.NEXT_PUBLIC_BNET_API_KEY;
const CACHED_DEFINITIONS_DIRECTORY = './src/scripts/cached-definitions/';

const fileExists = async (path: string) =>
	!!(await fs.stat(path).catch(() => false));

const hashString = (string: string) =>
	crypto.createHash('md5').update(string).digest('hex');

export async function getDefinitions() {
	try {
		await fs.access(CACHED_DEFINITIONS_DIRECTORY);
	} catch (e) {
		console.log('Creating the cached-definitions directory');
		await fs.mkdir(CACHED_DEFINITIONS_DIRECTORY);
	}

	const manifestResponse = await axios.get(
		'https://www.bungie.net/Platform/Destiny2/Manifest/',
		{ headers: { 'x-api-key': API_KEY } }
	);

	const definitonsPath =
		manifestResponse.data.Response.jsonWorldContentPaths.en;
	const definitionsUrl = `https://www.bungie.net${definitonsPath}`;

	const hash = hashString(definitionsUrl);

	const cachedDefinitionsFilePath = path.join(
		CACHED_DEFINITIONS_DIRECTORY,
		`${hash}.json`
	);
	// TODO: Maybe bungie-api-ts has a type for this but it doesn't matter much
	// A lot of stuff in this could be typed better
	let tempDefinitions: unknown;

	if (await fileExists(cachedDefinitionsFilePath)) {
		console.log('Reading cached definitions');
		try {
			const tempDefinitionsFile = await fs.readFile(cachedDefinitionsFilePath);
			tempDefinitions = JSON.parse(tempDefinitionsFile.toString());
		} catch (e) {
			console.error('Error parsing out cached definitions');
		}

		if (tempDefinitions) {
			return tempDefinitions;
		} else {
			console.error('Cached definitions are falsey');
		}
	}

	console.log(
		'No cached definitions found. Requesting definitions from remote'
	);

	const definitionsResponse = await axios.get(definitionsUrl, {
		headers: { 'x-api-key': API_KEY },
	});
	// .catch((e) => {
	// 	console.error(`Failed to fetch definitions. Error: ${e}`);
	// })) as AxiosResponse<unknown, unknown>; // TODO: Make a better type

	const definitions = definitionsResponse.data;

	try {
		console.log('Caching definitions');

		for (const file of await fs.readdir(CACHED_DEFINITIONS_DIRECTORY)) {
			console.log(`Removing old definitions file: ${file}`);
			await fs.unlink(path.join(CACHED_DEFINITIONS_DIRECTORY, file));
		}

		await fs.writeFile(cachedDefinitionsFilePath, JSON.stringify(definitions));
	} catch (e) {
		console.error(e);
	}

	console.log(`Cached definitions stored at: ${cachedDefinitionsFilePath}`);

	return definitions;
}

// TODO: Type this
export const collectRewardsFromArtifacts = (DestinyArtifactDefinition) => {
	return lodash(DestinyArtifactDefinition)
		.values()
		.flatMap((artifact) => artifact.tiers)
		.flatMap((tier) => tier.items)
		.map((item) => item.itemHash)
		.value();
};

// King's Fall => KingsFall
// Vault of Glass => VaultOfGlass
export const generateId = (name: string): string => {
	const words = name.split(' ');
	return words
		.map((word) => {
			return (word[0].toUpperCase() + word.substring(1)).replace(
				// Replace all non-alphanumeric characters
				/[^a-zA-Z0-9]/g,
				''
			);
		})
		.join('');
};

// usage getEnumKeyByEnumValue(EArmorSlotId, armorSlotId)
// https://stackoverflow.com/a/68533063/4071059
export function getEnumKeyByEnumValue<
	TEnumKey extends string,
	TEnumVal extends string | number
>(myEnum: { [key in TEnumKey]: TEnumVal }, enumValue: TEnumVal): string {
	const keys = (Object.keys(myEnum) as TEnumKey[]).filter(
		(x) => myEnum[x] === enumValue
	);
	return keys.length > 0 ? keys[0] : '';
}

const SERIALIZED = 'SERIALIZED';
export function getSerializableObject<
	TEnumKey extends string, // EArmorSlotId
	TEnumVal extends string | number // "arm"
>(
	input: Record<string, unknown>, // {..., armorslotId: "arm" ....}
	keyToReplace: string, // "armorSlotId"
	enumDefinition: { [key in TEnumKey]: TEnumVal }, // EArmorSlotId
	enumName: string // "EArmorSlotId"
): unknown {
	const res = {
		...input,
	};

	const stringifiedEnumKey = getEnumKeyByEnumValue(
		enumDefinition,
		res[keyToReplace] as string | number
	);
	res[keyToReplace] = stringifiedEnumKey
		? `${SERIALIZED}${enumName}.${stringifiedEnumKey}`
		: `${SERIALIZED}null`;

	return res;
}

// Replace all unquoted and quoted instances of SERIALIZEDEArmorSlotId.Arm with ArmorSlotId.Arm
const replaceRegexString = `['"]*${SERIALIZED}([A-Za-z.0-9]*)['"]*`;
const replaceRegex = new RegExp(replaceRegexString, 'g');

export const formatStringForFile = (s: string) => {
	let deSerializedString = `${s}`;
	const matches = s.match(replaceRegex);
	if (matches) {
		matches.forEach((match) => {
			const replacementValue = match
				.replace(/["']/g, '')
				.replace(SERIALIZED, '');
			deSerializedString = deSerializedString.replace(match, replacementValue);
		});
	}
	return prettier.format(deSerializedString, { parser: 'typescript' });
};
