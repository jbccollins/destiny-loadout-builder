import {
	doProcessArmor,
	ProcessArmorOutput,
	DoProcessArmorParams,
} from '@dlb/services/armor-processing';
import { describe, expect, test } from '@jest/globals';
import { enforceValidLegendaryArmorBaseStats as es } from '@dlb/services/test-utils';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EExtraSocketModCategoryId,
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
import {
	ArmorItem,
	getDefaultArmorMetadata,
	getDefaultAvailableExoticArmorItem,
} from '@dlb/types/Armor';
import { cloneDeep } from 'lodash';

type ProcessArmorTestCase = {
	name: string;
	input: DoProcessArmorParams;
	output: ProcessArmorOutput;
};

const defaultArmorItem: ArmorItem = {
	name: '',
	icon: '',
	id: '',
	baseStatTotal: 0,
	power: 0,
	stats: [0, 0, 0, 0, 0, 0],
	armorSlot: null,
	hash: 0,
	destinyClassName: EDestinyClassId.Warlock,
	isMasterworked: false,
	gearTierId: EGearTierId.Legendary,
	isArtifice: false,
	extraSocketModCategoryId: null,
};

const getDefaultArmorItem = () => cloneDeep(defaultArmorItem);

const defaultArmorMetadataWithArtificeClassItem = {
	...getDefaultArmorMetadata(),
};
defaultArmorMetadataWithArtificeClassItem[EDestinyClassId.Warlock].classItem = {
	hasArtificeClassItem: true,
	hasLegendaryClassItem: true,
	hasMasterworkedArtificeClassItem: true,
	hasMasterworkedLegendaryClassItem: true,
};

const defaultArmorMetadataWithLastWishAndArtificeClassItem = {
	...getDefaultArmorMetadata(),
};
defaultArmorMetadataWithLastWishAndArtificeClassItem[
	EDestinyClassId.Warlock
].classItem = {
	hasArtificeClassItem: true,
	hasLegendaryClassItem: true,
	hasMasterworkedArtificeClassItem: true,
	hasMasterworkedLegendaryClassItem: true,
};
defaultArmorMetadataWithLastWishAndArtificeClassItem[
	EDestinyClassId.Warlock
].extraSocket.items[EExtraSocketModCategoryId.LastWish].items[
	EArmorSlotId.ClassItem
].count = 4;

const processArmorTestCases: ProcessArmorTestCase[] = [
	// 0
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
			validRaidModArmorSlotPlacements: [{ ...DefaultValidPlacement }],
			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: getDefaultArmorMetadata().Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
			armorItems: [
				[
					{
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
				artificeModIdList: [],
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
	// 1
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
			validRaidModArmorSlotPlacements: [{ ...DefaultValidPlacement }],
			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataWithArtificeClassItem.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
			armorItems: [
				// Res x3, [helmet, arms, chest]
				[
					{
						// Deep Explorer Hood
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
				artificeModIdList: [
					EModId.ResilienceForged,
					EModId.ResilienceForged,
					EModId.ResilienceForged,
				],
				metadata: {
					totalModCost: 18,
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
	// 2
	{
		// TODO: This test is identical to the other test with the same name. It just has
		// armor metadata with Last Wish class items. Make this unique
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
			validRaidModArmorSlotPlacements: [{ ...DefaultValidPlacement }],
			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem:
				defaultArmorMetadataWithLastWishAndArtificeClassItem.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
			armorItems: [
				// Res x3, [helmet, arms, chest]
				[
					{
						// Deep Explorer Hood
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
				artificeModIdList: [
					EModId.ResilienceForged,
					EModId.ResilienceForged,
					EModId.ResilienceForged,
				],
				metadata: {
					totalModCost: 18,
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
	// 3
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
			validRaidModArmorSlotPlacements: [{ ...DefaultValidPlacement }],
			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: getDefaultArmorMetadata().Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
			armorItems: [
				[
					{
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
						...getDefaultArmorItem(),
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
				artificeModIdList: [],
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
	// 4
	{
		name: 'It returns results when five major mods and two artifice mods are required',
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
			validRaidModArmorSlotPlacements: [{ ...DefaultValidPlacement }],
			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataWithArtificeClassItem.Warlock,
			selectedExotic: {
				...getDefaultAvailableExoticArmorItem(),
				armorSlot: EArmorSlotId.Chest,
			},
			armorItems: [
				[
					{
						// Deep Explorer Hood
						...getDefaultArmorItem(),
						id: '0',
						stats: es([2, 14, 16, 26, 2, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: true,
						isArtifice: true,
					},
				],
				[
					{
						// Dreambane Gloves
						...getDefaultArmorItem(),
						id: '1',
						stats: es([2, 15, 16, 24, 2, 6]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: false,
					},
				],
				[
					{
						// Starfire Protocol
						...getDefaultArmorItem(),
						id: '2',
						stats: [2, 13, 20, 14, 8, 9], // no es() since starfire has extra res and rec
						hash: -1,
						gearTierId: EGearTierId.Exotic,
						isMasterworked: true,
						isArtifice: false,
					},
				],
				[
					{
						// Warmind's Avatar Pants
						...getDefaultArmorItem(),
						id: '3',
						stats: es([2, 26, 6, 26, 2, 6]),
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
					EModId.ResilienceMod,
					EModId.ResilienceMod,
					EModId.RecoveryMod,
					EModId.RecoveryMod,
					EModId.RecoveryMod,
				],
				artificeModIdList: [EModId.ResilienceForged, EModId.RecoveryForged],
				metadata: {
					totalModCost: 20,
					totalStatTiers: 36,
					wastedStats: 17,
					totalArmorStatMapping: {
						[EArmorStatId.Mobility]: 18,
						[EArmorStatId.Resilience]: 101,
						[EArmorStatId.Recovery]: 101,
						[EArmorStatId.Discipline]: 100,
						[EArmorStatId.Intellect]: 24,
						[EArmorStatId.Strength]: 33,
					},
				},
			},
		],
	},
	// 5
	{
		name: 'I have no fucking clue',
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
			validRaidModArmorSlotPlacements: [{ ...DefaultValidPlacement }],
			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			destinyClassId: EDestinyClassId.Warlock,
			armorMetadataItem: defaultArmorMetadataWithArtificeClassItem.Warlock,
			selectedExotic: {
				...getDefaultAvailableExoticArmorItem(),
				armorSlot: EArmorSlotId.Chest,
			},
			armorItems: [
				[
					{
						// Deep Explorer Hood
						...getDefaultArmorItem(),
						id: '0',
						stats: es([2, 14, 16, 26, 2, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: true,
						isArtifice: true,
					},
				],
				[
					{
						// Deep Explorer Gloves
						...getDefaultArmorItem(),
						id: '1',
						stats: es([2, 26, 6, 22, 2, 9]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: true,
					},
				],
				[
					{
						// Starfire Protocol
						...getDefaultArmorItem(),
						id: '2',
						stats: [2, 13, 20, 14, 8, 9], // no es() since starfire has extra res and rec
						hash: -1,
						gearTierId: EGearTierId.Exotic,
						isMasterworked: true,
						isArtifice: false,
					},
				],
				[
					{
						// Deep Explorer Boots
						...getDefaultArmorItem(),
						id: '3',
						stats: es([2, 21, 10, 22, 9, 2]),
						hash: -1,
						gearTierId: EGearTierId.Legendary,
						isMasterworked: false,
						isArtifice: true,
					},
				],
			],
		},
		output: [
			{
				armorIdList: ['0', '1', '2', '3'],
				armorStatModIdList: [
					EModId.ResilienceMod,
					EModId.RecoveryMod,
					EModId.RecoveryMod,
					EModId.RecoveryMod,
					EModId.RecoveryMod,
				],
				artificeModIdList: [
					EModId.ResilienceForged,
					EModId.ResilienceForged,
					EModId.DisciplineForged,
					EModId.DisciplineForged,
				],
				metadata: {
					totalModCost: 20,
					totalStatTiers: 37,
					wastedStats: 13,
					totalArmorStatMapping: {
						[EArmorStatId.Mobility]: 18,
						[EArmorStatId.Resilience]: 100,
						[EArmorStatId.Recovery]: 102,
						[EArmorStatId.Discipline]: 100,
						[EArmorStatId.Intellect]: 31,
						[EArmorStatId.Strength]: 32,
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
	test(processArmorTestCases[0].name, () => {
		const { input, output } = processArmorTestCases[0];
		expect(doProcessArmor(input)).toEqual(output);
	});
	test(processArmorTestCases[1].name, () => {
		const { input, output } = processArmorTestCases[1];
		expect(doProcessArmor(input)).toEqual(output);
	});
	test(processArmorTestCases[2].name, () => {
		const { input, output } = processArmorTestCases[2];
		expect(doProcessArmor(input)).toEqual(output);
	});
	test(processArmorTestCases[3].name, () => {
		const { input, output } = processArmorTestCases[3];
		expect(doProcessArmor(input)).toEqual(output);
	});
	test(processArmorTestCases[4].name, () => {
		const { input, output } = processArmorTestCases[4];
		expect(doProcessArmor(input)).toEqual(output);
	});
	test(processArmorTestCases[5].name, () => {
		const { input, output } = processArmorTestCases[5];
		expect(doProcessArmor(input)).toEqual(output);
	});
});
