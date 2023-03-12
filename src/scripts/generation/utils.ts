import axios, { AxiosResponse } from 'axios';
import lodash from 'lodash';
import prettier from 'prettier';
import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';
import { IBonuses, StatBonus } from '@dlb/types/globals';
import { EArmorStatId } from '@dlb/types/IdEnums';
import {
	DestinyArtifactDefinition,
	DestinyArtifactTierDefinition,
	DestinyInventoryItemDefinition,
	DestinySandboxPerkDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { getArmorStatIdFromBungieHash } from '@dlb/types/ArmorStat';

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

export const collectRewardsFromArtifacts = (
	destinyArtifactDefinitions: Record<number, DestinyArtifactDefinition>
) => {
	return lodash(destinyArtifactDefinitions)
		.values()
		.flatMap((artifact) => artifact.tiers)
		.flatMap((tier) => tier.items)
		.map((item) => item.itemHash)
		.value();
	// return lodash(destinyArtifactDefinitions.tiers)
	// 	.flatMap((tier) => tier.items)
	// 	.map((item) => item.itemHash)
	// 	.value();
};

// King's Fall => KingsFall
// Vault of Glass => VaultOfGlass
export const generateId = (name: string): string => {
	const words = name.split(' ');
	return words
		.map((word) => {
			if (word === '') {
				return 'Unknown';
			}
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

export function getSerializableValue<
	TEnumKey extends string, // EArmorSlotId
	TEnumVal extends string | number // "arm"
>(
	// input: Record<string, unknown>, // {..., armorslotId: "arm" ....}
	// keyToReplace: string, // "armorSlotId"
	value: string | number,
	enumDefinition: { [key in TEnumKey]: TEnumVal }, // EArmorSlotId
	enumName: string // "EArmorSlotId"
): string {
	const stringifiedEnumKey = getEnumKeyByEnumValue(enumDefinition, value);
	return stringifiedEnumKey
		? `${SERIALIZED}${enumName}.${stringifiedEnumKey}`
		: `${SERIALIZED}null`;
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

// Pull the extraction of bonuses out into a common function that can be used by mods and fragments
export const getBonuses = (
	item: DestinyInventoryItemDefinition
): StatBonus[] => {
	const bonuses: StatBonus[] = [];
	// TODO: This is a super fragile hack. Checking this length is just checking
	// to see if this has three bonuses. If it does I'm assuming it's the three
	// class ability stat bonuses. I can't figure out a better way to determine this
	// Relevant discord discussion:
	// https://discord.com/channels/296008008956248066/296008136785920001/1072704762367184966
	if (item.investmentStats.length === 4) {
		// Just pick a random value... in theory they should all be the same
		bonuses.push({
			stat: 'ClassAbilityStat',
			value: item.investmentStats[3].value,
		});
	} else {
		item.investmentStats.forEach(({ statTypeHash, value }) => {
			const armorStatId = getArmorStatIdFromBungieHash(statTypeHash);
			if (armorStatId) {
				bonuses.push({ stat: armorStatId, value });
			}
		});
	}
	return bonuses;
};

// Pull the serialization of bounses out into a common function to be used by mods and fragments
export const getSerializedBonusStats = (
	item: IBonuses
): Record<number, string> => {
	const bonuses: Record<number, string> = {};
	// TODO: Pull the serialization of bounses out into a common function to be used by mods and fragments
	item.bonuses.forEach((bonus, i) => {
		if (bonus.stat === 'ClassAbilityStat') {
			bonuses[i] = 'ClassAbilityStat';
			return;
		}
		const serializedBonusStat = getSerializableValue(
			bonus.stat,
			EArmorStatId,
			'EArmorStatId'
		);
		bonuses[i] = serializedBonusStat;
	});
	return bonuses;
};

// TODO: The description ordering of 'Into the Fray' is different than every other
// description. So we can't just dopp perks[0]. We have to check all perks :(
export const getDescription = (
	item: DestinyInventoryItemDefinition,
	sandboxPerkDefinitions: Record<number, DestinySandboxPerkDefinition>
) => {
	let description = 'No description found';
	for (const perk of item.perks) {
		const desc =
			sandboxPerkDefinitions[perk.perkHash].displayProperties.description;
		if (desc) {
			description = desc;
			break;
		}
	}
	return description;
};
