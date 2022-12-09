/*
USAGE: From the root directory run "npm run generate"
*/
import lodash from 'lodash';
import path from 'path';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { getArmorSlotIdByHash } from '@dlb/types/ArmorSlot';
import {
	DestinyInventoryItemDefinition,
	DestinySandboxPerkDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import { getElementIdByHash } from '@dlb/types/Element';
import { ECategoryName, IMod } from '@dlb/types/generation';
import {
	collectRewardsFromArtifacts,
	generateId,
	getDefinitions,
} from '@dlb/scripts/generation/utils';
import { generateModIdEnumFileString } from './generateModIdEnums';
import { generateModMapping } from './generateModMapping';

// TODO: What about the Aeon Mods? Sect of Force, Insight and Vigor
const excludedModHashes = [
	2979161761, // Lucky Pants Hand Cannon Holster Mod clashes with the base hand cannon holster mod
];

const buildModData = (
	mod: DestinyInventoryItemDefinition,
	sandboxPerkDefinitions: Record<number, DestinySandboxPerkDefinition>,
	artifactMods: number[]
): IMod => {
	let armorSlotId: EArmorSlotId = null;
	mod.itemCategoryHashes.forEach((hash) => {
		const _armorSlotId = getArmorSlotIdByHash(hash);
		if (_armorSlotId) {
			armorSlotId = _armorSlotId;
		}
	});

	const isArtifactMod = artifactMods.includes(mod.hash);
	return {
		name: mod.displayProperties.name,
		id: generateId(
			`${
				isArtifactMod
					? `Artifact ${mod.displayProperties.name}`
					: mod.displayProperties.name
			}`
		),
		description:
			sandboxPerkDefinitions[mod.perks[0].perkHash].displayProperties
				.description,
		icon: mod.displayProperties.icon,
		hash: mod.hash,
		// socketCategoryId: getModSocketCategoryIdFromRawMod(mod),
		armorSocketIndex: 0,
		armorSlotId: armorSlotId,
		elementId: getElementIdByHash(mod.plug.energyCost.energyTypeHash),
		cost: mod.plug.energyCost.energyCost,
		isArtifactMod: isArtifactMod,
		category: null, //ECategoryName.CATEGORY_AMMO_FINDER,
	};
};

export async function run() {
	const {
		DestinyInventoryItemDefinition: destinyInventoryItemDefinitions,
		DestinyArtifactDefinition: destinyArtifactDefinitions,
		DestinySandboxPerkDefinition: destinySandboxPerkDefinitions,
	} = await getDefinitions();
	const sandboxPerkDefinitions = destinySandboxPerkDefinitions as Record<
		number,
		DestinySandboxPerkDefinition
	>;

	console.log('Received definitions');
	console.log('Finding mods');
	const mods: IMod[] = [];

	const modNames: Record<string, string[]> = {};

	const artifactMods = collectRewardsFromArtifacts(destinyArtifactDefinitions);

	const allMods = lodash(destinyInventoryItemDefinitions)
		.values()
		.filter((v) => v.itemCategoryHashes)
		.filter((v) => v.displayProperties)
		.filter((v) => !v.displayProperties.description.includes('deprecated'))
		.filter((v) => v.itemCategoryHashes.includes(4104513227)) // armour mods
		.filter((v) => v.plug && v.plug.energyCost) // exclude ornaments
		.value() as DestinyInventoryItemDefinition[];

	allMods
		.filter((mod) => !excludedModHashes.includes(mod.hash))
		.forEach((mod) => {
			if (!modNames[mod.itemTypeDisplayName]) {
				modNames[mod.itemTypeDisplayName] = [];
			}
			modNames[mod.itemTypeDisplayName].push(mod.displayProperties.name);
			mods.push(buildModData(mod, sandboxPerkDefinitions, artifactMods));
		});

	const modsPath = ['.', 'src', 'generated', 'mod'];

	// We must build the enums first as those are imported by other generated files
	const modIdEnumGeneratedPath = path.join(...[...modsPath, 'EModId.ts']);
	const modIdEnumExportString = generateModIdEnumFileString(mods);

	console.log('Writing to file: ', modIdEnumGeneratedPath);
	await fs.writeFile(
		path.resolve(modIdEnumGeneratedPath),
		modIdEnumExportString
	);

	const modMappingGeneratedPath = path.join(...[...modsPath, 'ModMapping.ts']);
	const modMappingExportString = generateModMapping(mods);

	console.log('Writing to file: ', modMappingGeneratedPath);
	await fs.writeFile(
		path.resolve(modMappingGeneratedPath),
		modMappingExportString
	);
}
