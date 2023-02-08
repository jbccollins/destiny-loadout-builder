/*
USAGE: From the root directory run "npm run generate"
*/
import lodash from 'lodash';
import path from 'path';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { getArmorSlotIdByHash } from '@dlb/types/ArmorSlot';
import {
	DestinyEnergyTypeDefinition,
	DestinyInventoryItemDefinition,
	DestinySandboxPerkDefinition,
	DestinyStatDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import { getElementIdByHash } from '@dlb/types/Element';
import { IMod } from '@dlb/types/generation';
import {
	collectRewardsFromArtifacts,
	generateId,
	getBonuses,
	getDefinitions,
} from '@dlb/scripts/generation/utils';
import { generateModIdEnumFileString } from './generateModIdEnum';
import { generateModMapping } from './generateModMapping';
import { generateModDisplayNameIdEnumFileString } from './generateModDisplayNameIdEnum';
import { getModSocketCategoryIdByModDisplayNameId } from '@dlb/types/ModSocketCategory';
import { EModDisplayNameId } from '@dlb/generated/mod/EModDisplayNameId';
import { bungieNetPath } from '@dlb/utils/item-utils';
import { EModId } from '@dlb/generated/mod/EModId';
import { getModCategoryIdByModName } from '@dlb/types/ModCategory';

// TODO: What about the Aeon Mods? Sect of Force, Insight and Vigor
const excludedModHashes = [
	2979161761, // Lucky Pants Hand Cannon Holster Mod clashes with the base hand cannon holster mod
];

// const getModSocketCategoryIdFromRawMod = (rawMod: DestinyInventoryItemDefinition): EModSocketCategoryId {}

const getElementOverlayIcon = (
	mod: DestinyInventoryItemDefinition,
	energyTypeDefinitions: Record<number, DestinyEnergyTypeDefinition>,
	statDefinitions: Record<number, DestinyStatDefinition>
): string => {
	if (mod.plug?.energyCost?.energyTypeHash) {
		const energyType =
			energyTypeDefinitions[mod.plug.energyCost.energyTypeHash];
		if (energyType?.capacityStatHash) {
			return statDefinitions[energyType.capacityStatHash].displayProperties
				?.icon;
		}
	}
	return null;
};
const buildModData = (
	mod: DestinyInventoryItemDefinition,
	sandboxPerkDefinitions: Record<number, DestinySandboxPerkDefinition>,
	energyTypeDefinitions: Record<number, DestinyEnergyTypeDefinition>,
	statDefinitions: Record<number, DestinyStatDefinition>,
	artifactMods: number[]
): IMod => {
	let armorSlotId: EArmorSlotId = null;
	mod.itemCategoryHashes.forEach((hash) => {
		const _armorSlotId = getArmorSlotIdByHash(hash);
		if (_armorSlotId) {
			armorSlotId = _armorSlotId;
			// TODO: Should it break here?
		}
	});

	const isArtifactMod = artifactMods.includes(mod.hash);
	const elementOverlayIcon = getElementOverlayIcon(
		mod,
		energyTypeDefinitions,
		statDefinitions
	);

	const modId = generateId(
		`${
			isArtifactMod
				? `Artifact ${mod.displayProperties.name}`
				: mod.displayProperties.name
		}`
	) as EModId;

	const displayNameId = generateId(
		mod.itemTypeDisplayName
	) as EModDisplayNameId;
	return {
		name: mod.displayProperties.name,
		id: modId,
		description:
			sandboxPerkDefinitions[mod.perks[0].perkHash].displayProperties
				.description,
		icon: bungieNetPath(mod.displayProperties.icon),
		hash: mod.hash,
		modSocketCategoryId:
			getModSocketCategoryIdByModDisplayNameId(displayNameId),
		armorSocketIndex: 0,
		armorSlotId: armorSlotId,
		elementId: getElementIdByHash(mod.plug.energyCost.energyTypeHash),
		cost: mod.plug.energyCost.energyCost,
		isArtifactMod: isArtifactMod,
		modCategoryId: getModCategoryIdByModName(
			displayNameId,
			mod.displayProperties.name
		),
		elementOverlayIcon: elementOverlayIcon
			? bungieNetPath(elementOverlayIcon)
			: null,
		similarModsAllowed: !mod.plug.insertionRules?.some((x) =>
			x?.failureMessage.includes('Similar mod already applied')
		),
		bonuses: getBonuses(mod),
	};
};

export async function run() {
	const {
		DestinyInventoryItemDefinition: destinyInventoryItemDefinitions,
		DestinyArtifactDefinition: destinyArtifactDefinitions,
		DestinySandboxPerkDefinition: destinySandboxPerkDefinitions,
		DestinyEnergyTypeDefinition: destinyEnergyTypeDefinitions,
		DestinyStatDefinition: destinyStatDefinitions,
	} = await getDefinitions();
	const sandboxPerkDefinitions = destinySandboxPerkDefinitions as Record<
		number,
		DestinySandboxPerkDefinition
	>;
	const energyTypeDefinitions = destinyEnergyTypeDefinitions as Record<
		number,
		DestinyEnergyTypeDefinition
	>;
	const statDefinitions = destinyStatDefinitions as Record<
		number,
		DestinyStatDefinition
	>;

	console.log('Received definitions');
	console.log('Finding mods');
	const mods: IMod[] = [];

	const modDisplayNames: Set<string> = new Set<string>();

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
			if (mod.displayProperties.name === 'Minor Resilience Mod') {
				console.log('derp');
			}
			modDisplayNames.add(generateId(mod.itemTypeDisplayName));
			mods.push(
				buildModData(
					mod,
					sandboxPerkDefinitions,
					energyTypeDefinitions,
					statDefinitions,
					artifactMods
				)
			);
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

	const modDisplayNameIdEnumGeneratedPath = path.join(
		...[...modsPath, 'EModDisplayNameId.ts']
	);
	const modDisplayNameIdEnumExportString =
		generateModDisplayNameIdEnumFileString(Array.from(modDisplayNames));

	console.log('Writing to file: ', modDisplayNameIdEnumGeneratedPath);
	await fs.writeFile(
		path.resolve(modDisplayNameIdEnumGeneratedPath),
		modDisplayNameIdEnumExportString
	);
}
