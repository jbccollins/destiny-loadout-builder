/*
USAGE: From the root directory run "npm run generate"
*/
import { EModDisplayNameId } from '@dlb/generated/mod/EModDisplayNameId';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	generateId,
	getBonuses,
	getDefinitions,
	getDescription,
} from '@dlb/scripts/generation/utils';
import { getArmorSlotIdByHash } from '@dlb/types/ArmorSlot';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import {
	getModCategoryId,
	getRaidAndNightmareModTypeId,
} from '@dlb/types/ModCategory';
import { getModSocketCategoryIdByModDisplayNameId } from '@dlb/types/ModSocketCategory';
import { IMod } from '@dlb/types/generation';
import { bungieNetPath } from '@dlb/utils/item-utils';
import {
	DestinyEnergyTypeDefinition,
	DestinyInventoryItemDefinition,
	DestinySandboxPerkDefinition,
	DestinyStatDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import lodash from 'lodash';
import path from 'path';
import { generateModDisplayNameIdEnumFileString } from './generateModDisplayNameIdEnum';
import { generateModIdEnumFileString } from './generateModIdEnum';
import { generateModMapping } from './generateModMapping';

// TODO: The bungie manifest currently is not including the
// 'itemTypeDisplayName' field for these mods that come from the
// artifact. When that is fixed we can delete this.
const specialArtifactStatModNames = [
	'Minor Mobility Mod',
	'Minor Resilience Mod',
	'Minor Recovery Mod',
	'Minor Discipline Mod',
	'Minor Intellect Mod',
	'Minor Strength Mod',
	'Mobility Mod',
	'Resilience Mod',
	'Recovery Mod',
	'Discipline Mod',
	'Intellect Mod',
	'Strength Mod',
];

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
		if (mod.itemTypeDisplayName === 'Minor Recovery Mod') {
			console.log('TODO: Fix armorSlot for artifice stat mods');
		}
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

	let modId = generateId(
		`${isArtifactMod
			? `Artifact ${mod.displayProperties.name}`
			: mod.displayProperties.name
		}`
	) as EModId;

	// Fucking Bungie fucked up the name for this one. In the API this is
	// named stasis resistance. FUUUUCK
	if (mod.hash === 1176372075) {
		modId = "ArtifactStrandResistance" as EModId;
	}

	if ((modId as string) == 'Unknown') {
		console.warn('Skipping unknown mod hash: ', mod.hash);
		return null;
	}

	let displayNameId = generateId(mod.itemTypeDisplayName) as EModDisplayNameId;

	//TODO: Get rid of this when the manifest returns proper 'itemTypeDisplayNames' for these mods
	if (
		displayNameId === EModDisplayNameId.Unknown &&
		specialArtifactStatModNames.includes(mod.displayProperties.name)
	) {
		displayNameId = EModDisplayNameId.GeneralArmorMod;
	}

	// FUUUUUUCK
	const modName = mod.hash === 1176372075 ? "Strand Resistance" : mod.displayProperties.name;
	const modDescription = getDescription(mod, sandboxPerkDefinitions);
	return {
		name: modName,
		id: modId,
		description: modDescription,
		icon: bungieNetPath(mod.displayProperties.icon),
		hash: mod.hash,
		modSocketCategoryId:
			getModSocketCategoryIdByModDisplayNameId(displayNameId),
		armorSocketIndex: 0,
		armorSlotId: armorSlotId,
		cost: mod.plug.energyCost?.energyCost ?? 0,
		isArtifactMod: isArtifactMod,
		modCategoryId: getModCategoryId(
			displayNameId,
			modName,
			modDescription,
			modId,
			isArtifactMod
		),
		elementOverlayIcon: elementOverlayIcon
			? bungieNetPath(elementOverlayIcon)
			: null,
		similarModsAllowed: !mod.plug.insertionRules?.some((x) =>
			x?.failureMessage.includes('Similar mod already applied')
		),
		bonuses: getBonuses(mod),
		raidAndNightmareModTypeId: getRaidAndNightmareModTypeId(displayNameId),
	};
};

export async function run() {
	const {
		DestinyInventoryItemDefinition: destinyInventoryItemDefinitions,
		// DestinyArtifactDefinition: destinyArtifactDefinitions,
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

	// TODO: The artifact now needs to be ripped out into it's own generation
	// since artifact mods are no longer equippable
	// const artifactItems = collectRewardsFromArtifacts(destinyArtifactDefinitions);

	const allMods = lodash(destinyInventoryItemDefinitions)
		.values()
		.filter((v) => {
			if (v.displayProperties?.name === "Release Recover") {
				console.log("Found Release Recover", v.hash);
			}
			return true
		})
		.filter((v) => v.displayProperties?.name !== 'Empty Mod Socket')
		.filter((v) => v.itemCategoryHashes)
		.filter((v) => v.displayProperties)
		.filter((v) => !v.displayProperties.description.includes('deprecated'))
		.filter((v) => v.itemCategoryHashes.includes(4104513227)) // armor mods
		// exclude ornaments while still including the no-cost artifce 'forged' mods
		.filter(
			(v) =>
				v.plug &&
				(v.plug.energyCost ||
					v.plug.plugCategoryIdentifier === 'enhancements.artifice' || // Artifice mods
					v.plug.plugCategoryIdentifier === 'enhancements.season_outlaw') || // Last Wish Raid Mods
				v.plug.plugCategoryIdentifier?.includes("enhancements.raid") // All other raid mods
		)
		.value() as DestinyInventoryItemDefinition[];

	const artifactMods = allMods
		.filter(
			(mod) =>
				mod.plug?.enabledRules &&
				mod.plug?.enabledRules.length > 0 &&
				mod.plug?.enabledRules.find(
					(rule) =>
						rule.failureMessage === 'Must Be Selected in the Seasonal Artifact'
				)
		)
		.map((mod) => mod.hash);

	allMods
		.filter((mod) => !excludedModHashes.includes(mod.hash))
		.forEach((mod) => {
			modDisplayNames.add(generateId(mod.itemTypeDisplayName));
			const m = buildModData(
				mod,
				sandboxPerkDefinitions,
				energyTypeDefinitions,
				statDefinitions,
				artifactMods
			);
			if (m) {
				// 'Unknown' or 'ArtifactUnknown' are not valid mod ids
				if (m.id.includes('Unknown')) {
					console.log('Unknown mod:', m.name, m.id, m.hash);
					return;
				}
				mods.push(m);
			}
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
