import {
	doProcessArmor,
	ProcessArmorOutput,
	DoProcessArmorParams,
} from '@dlb/services/armor-processing';
import { describe, expect, test } from '@jest/globals';
import { enforceValidLegendaryArmorBaseStats as es } from '@dlb/services/test-utils';
import {
	EArmorStatId,
	EDestinyClassId,
	EGearTierId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import {
	DefaultArmorStatMapping,
	getArmorStatMappingFromFragments,
} from '@dlb/types/ArmorStat';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	DefaultValidPlacement,
	getDefaultArmorSlotIdToModIdListMapping,
} from '@dlb/types/Mod';
import { getDefaultArmorMetadata } from '@dlb/types/Armor';

type ProcessArmorTestCase = {
	name: string;
	input: DoProcessArmorParams;
	output: ProcessArmorOutput;
};

const defaultArmorMetadataWithArtificeClassItem = {
	...getDefaultArmorMetadata(),
};
defaultArmorMetadataWithArtificeClassItem[EDestinyClassId.Warlock].classItem = {
	hasArtificeClassItem: true,
	hasLegendaryClassItem: true,
	hasMasterworkedArtificeClassItem: true,
	hasMasterworkedLegendaryClassItem: true,
};

const processArmorTestCases: ProcessArmorTestCase[] = [
	{
		name: 'It returns results with one item in each slot',
		input: {
			masterworkAssumption: EMasterworkAssumption.None,
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 60,
				[EArmorStatId.Recovery]: 60,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			fragmentArmorStatMapping: getArmorStatMappingFromFragments(
				[],
				EDestinyClassId.Warlock
			),
			modArmorStatMapping: { ...DefaultArmorStatMapping },
			validCombatStyleModArmorSlotPlacements: [{ ...DefaultValidPlacement }],
			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: getDefaultArmorMetadata().Warlock,
			armorItems: [
				[
					{
						id: '0',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: false,
					},
				],
				[
					{
						id: '1',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: false,
					},
				],
				[
					{
						id: '2',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: false,
					},
				],
				[
					{
						id: '3',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: false,
					},
				],
			],
		},

		output: [
			{
				armorIdList: ['0', '1', '2', '3'],
				armorStatModIdList: [],
				artificeModArmorStatIdList: [],
				metadata: {
					totalModCost: 0,
					totalStatTiers: 24,
					wastedStats: 32,
					totalArmorStatMapping: {
						[EArmorStatId.Mobility]: 8,
						[EArmorStatId.Resilience]: 64,
						[EArmorStatId.Recovery]: 64,
						[EArmorStatId.Discipline]: 64,
						[EArmorStatId.Intellect]: 64,
						[EArmorStatId.Strength]: 8,
					},
				},
			},
		],
	},
	{
		name: 'It returns results with artifice boosts required',
		input: {
			masterworkAssumption: EMasterworkAssumption.All,
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 100,
				[EArmorStatId.Recovery]: 100,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			fragmentArmorStatMapping: getArmorStatMappingFromFragments(
				[],
				EDestinyClassId.Warlock
			),
			modArmorStatMapping: { ...DefaultArmorStatMapping },
			validCombatStyleModArmorSlotPlacements: [{ ...DefaultValidPlacement }],
			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataWithArtificeClassItem.Warlock,
			armorItems: [
				// Res x3, [helmet, arms, chest]
				[
					{
						// Deep Explorer Hood
						id: '0',
						stats: es([2, 6, 26, 24, 2, 6]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: true,
						isArtifice: true,
					},
				],
				[
					{
						// Deep Explorer Gloves
						id: '1',
						stats: es([2, 10, 20, 23, 2, 8]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: true,
						isArtifice: true,
					},
				],
				[
					{
						// Deep Explorer Vestments
						id: '2',
						stats: es([2, 6, 26, 26, 2, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: true,
						isArtifice: true,
					},
				],
				[
					{
						// Lunafaction Boots
						id: '3',
						stats: es([2, 14, 18, 21, 2, 8]),
						hash: -1,
						gearTierId: EGearTierId.Exotic,
						isMasterworked: true,
						isArtifice: false,
					},
				],
			],
		},

		output: [
			{
				armorIdList: ['0', '1', '2', '3'],
				armorStatModIdList: [
					EModId.ResilienceMod,
					EModId.ResilienceMod,
					EModId.ResilienceMod,
					EModId.ResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModArmorStatIdList: [
					EArmorStatId.Resilience,
					EArmorStatId.Resilience,
					EArmorStatId.Resilience,
				],
				metadata: {
					totalModCost: 13,
					totalStatTiers: 35,
					wastedStats: 24,
					totalArmorStatMapping: {
						[EArmorStatId.Mobility]: 18,
						[EArmorStatId.Resilience]: 100,
						[EArmorStatId.Recovery]: 100,
						[EArmorStatId.Discipline]: 104,
						[EArmorStatId.Intellect]: 18,
						[EArmorStatId.Strength]: 34,
					},
				},
			},
		],
	},
	{
		name: 'It returns results when five major mods are required',
		input: {
			masterworkAssumption: EMasterworkAssumption.None,
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			fragmentArmorStatMapping: getArmorStatMappingFromFragments(
				[],
				EDestinyClassId.Warlock
			),
			modArmorStatMapping: { ...DefaultArmorStatMapping },
			validCombatStyleModArmorSlotPlacements: [{ ...DefaultValidPlacement }],
			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			destinyClassId: EDestinyClassId.Hunter,
			armorMetadataItem: getDefaultArmorMetadata().Warlock,
			armorItems: [
				[
					{
						id: '0',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: false,
					},
				],
				[
					{
						id: '1',
						stats: es([16, 2, 16, 16, 16, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: false,
					},
				],
				[
					{
						id: '2',
						stats: es([16, 2, 16, 16, 16, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: false,
					},
				],
				[
					{
						id: '3',
						stats: es([16, 2, 16, 16, 16, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: false,
					},
				],
			],
		},
		output: [
			{
				armorIdList: ['0', '1', '2', '3'],
				armorStatModIdList: [
					EModId.MobilityMod,
					EModId.MobilityMod,
					EModId.MobilityMod,
					EModId.MobilityMod,
					EModId.MobilityMod,
				],
				artificeModArmorStatIdList: [],
				metadata: {
					totalModCost: 15,
					totalStatTiers: 30,
					wastedStats: 22,
					totalArmorStatMapping: {
						[EArmorStatId.Mobility]: 100,
						[EArmorStatId.Resilience]: 22,
						[EArmorStatId.Recovery]: 64,
						[EArmorStatId.Discipline]: 64,
						[EArmorStatId.Intellect]: 64,
						[EArmorStatId.Strength]: 8,
					},
				},
			},
		],
	},
];

// TODO: It would be nice to just loop over all these without the verbose
// test() function boilerplate but I can't figure out how to run an individual
// test case that way :(

describe('processArmor', () => {
	// test(processArmorTestCases[0].name, () => {
	// 	const { input, output } = processArmorTestCases[0];
	// 	expect(doProcessArmor(input)).toEqual(output);
	// });
	test(processArmorTestCases[1].name, () => {
		const { input, output } = processArmorTestCases[1];
		expect(doProcessArmor(input)).toEqual(output);
	});
	// test(processArmorTestCases[2].name, () => {
	// 	const { input, output } = processArmorTestCases[2];
	// 	expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	// });
	// test(processArmorTestCases[3].name, () => {
	// 	const { input, output } = processArmorTestCases[3];
	// 	expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	// });
	// test(processArmorTestCases[4].name, () => {
	// 	const { input, output } = processArmorTestCases[4];
	// 	expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	// });
	// test(processArmorTestCases[5].name, () => {
	// 	const { input, output } = processArmorTestCases[5];
	// 	expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	// });
});
