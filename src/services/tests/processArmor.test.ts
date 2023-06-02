import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	doProcessArmor,
	getDefaultProcessedArmorItemMetadataClassItem,
} from '@dlb/services/processArmor/index';
import { getDefaultSeenArmorSlotItems } from '@dlb/services/processArmor/seenArmorSlotItems';
import { enforceValidLegendaryArmorBaseStats as es } from '@dlb/services/test-utils';
import {
	ArmorItem,
	getDefaultAllClassItemMetadata,
	getDefaultArmorMetadata,
	getDefaultAvailableExoticArmorItem,
} from '@dlb/types/Armor';
import {
	getArmorStatMappingFromFragments,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EGearTierId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import {
	getDefaultArmorSlotIdToModIdListMapping,
	getDefaultValidRaidModArmorSlotPlacement,
} from '@dlb/types/Mod';
import { describe, expect, test } from '@jest/globals';
import { cloneDeep } from 'lodash';

const testFunction = doProcessArmor;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

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
	socketableRaidAndNightmareModTypeId: null,
	intrinsicArmorPerkOrAttributeId: null,
};

const getDefaultArmorItem = () => cloneDeep(defaultArmorItem);

// const defaultArmorMetadataWithArtificeClassItem: ArmorMetadata = {
// 	...getDefaultArmorMetadata(),

// 	[EDestinyClassId.Warlock]: {
// 		...getDefaultArmorMetadata()[EDestinyClassId.Warlock],
// 		classItem: {
// 			...getDefaultArmorMetadata()[EDestinyClassId.Warlock].classItem,
// 			Artifice: {
// 				exists: true,
// 				isMasterworked: true,
// 				exampleId: '1',
// 			},
// 		},
// 	},
// };

// const defaultArmorMetadataWithLastWishAndArtificeClassItem: ArmorMetadata =
// 	cloneDeep(defaultArmorMetadataWithArtificeClassItem);
// defaultArmorMetadataWithLastWishAndArtificeClassItem[
// 	EDestinyClassId.Warlock
// ].classItem.LastWish = {
// 	exists: true,
// 	isMasterworked: true,
// 	exampleId: '1',
// };

const testCases: TestCase[] = [
	// 0
	[
		'It returns results with one item in each slot',
		[
			{
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
				modArmorStatMapping: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: [
					getDefaultValidRaidModArmorSlotPlacement(),
				],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				destinyClassId: EDestinyClassId.Warlock,
				armorMetadataItem: getDefaultArmorMetadata().Warlock,
				selectedExotic: getDefaultAvailableExoticArmorItem(),
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
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
		],
		{
			items: [
				{
					armorIdList: ['0', '1', '2', '3'],
					armorStatModIdList: [],
					artificeModIdList: [],
					metadata: {
						// TODO: Do we actually need to store the baseArmorStatMapping in redux?
						baseArmorStatMapping: {
							[EArmorStatId.Mobility]: 8,
							[EArmorStatId.Resilience]: 64,
							[EArmorStatId.Recovery]: 64,
							[EArmorStatId.Discipline]: 64,
							[EArmorStatId.Intellect]: 64,
							[EArmorStatId.Strength]: 8,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Mobility]: 8,
							[EArmorStatId.Resilience]: 64,
							[EArmorStatId.Recovery]: 64,
							[EArmorStatId.Discipline]: 64,
							[EArmorStatId.Intellect]: 64,
							[EArmorStatId.Strength]: 8,
						},
						seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
						totalModCost: 0,
						totalStatTiers: 24,
						wastedStats: 32,
						classItem: getDefaultProcessedArmorItemMetadataClassItem(),
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncateItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Mobility]: 50,
				[EArmorStatId.Resilience]: 100,
				[EArmorStatId.Recovery]: 100,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 100,
				[EArmorStatId.Strength]: 50,
			},
			maxPossibleReservedArmorSlotEnergy: {
				[EArmorSlotId.Head]: 10,
				[EArmorSlotId.Arm]: 10,
				[EArmorSlotId.Chest]: 10,
				[EArmorSlotId.Leg]: 10,
				[EArmorSlotId.ClassItem]: 10,
			},
		},
	],
	// // 1
	// {
	// 	name: 'It returns results with artifice boosts required',
	// 	input: {
	// 		masterworkAssumption: EMasterworkAssumption.All,
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 0,
	// 			[EArmorStatId.Resilience]: 100,
	// 			[EArmorStatId.Recovery]: 100,
	// 			[EArmorStatId.Discipline]: 100,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		fragmentArmorStatMapping: getArmorStatMappingFromFragments(
	// 			[],
	// 			EDestinyClassId.Warlock
	// 		),
	// 		modArmorStatMapping: getDefaultArmorStatMapping(),
	// 		validRaidModArmorSlotPlacements: [
	// 			getDefaultValidRaidModArmorSlotPlacement(),
	// 		],
	// 		armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	// 		raidMods: [],
	// 		destinyClassId: EDestinyClassId.Warlock,
	// 		armorMetadataItem: defaultArmorMetadataWithArtificeClassItem.Warlock,
	// 		selectedExotic: getDefaultAvailableExoticArmorItem(),
	// 		armorItems: [
	// 			// Res x3, [helmet, arms, chest]
	// 			[
	// 				{
	// 					// Deep Explorer Hood
	// 					...getDefaultArmorItem(),
	// 					id: '0',
	// 					stats: es([2, 6, 26, 24, 2, 6]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: true,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Deep Explorer Gloves
	// 					...getDefaultArmorItem(),
	// 					id: '1',
	// 					stats: es([2, 10, 20, 23, 2, 8]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: true,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Deep Explorer Vestments
	// 					...getDefaultArmorItem(),
	// 					id: '2',
	// 					stats: es([2, 6, 26, 26, 2, 2]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: true,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Lunafaction Boots
	// 					...getDefaultArmorItem(),
	// 					id: '3',
	// 					stats: es([2, 14, 18, 21, 2, 8]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Exotic,
	// 					isMasterworked: true,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 		],
	// 	},

	// 	output: [
	// 		{
	// 			armorIdList: ['0', '1', '2', '3'],
	// 			armorStatModIdList: [
	// 				EModId.ResilienceMod,
	// 				EModId.ResilienceMod,
	// 				EModId.ResilienceMod,
	// 				EModId.ResilienceMod,
	// 				EModId.MinorResilienceMod,
	// 			],
	// 			artificeModIdList: [
	// 				EModId.ResilienceForged,
	// 				EModId.ResilienceForged,
	// 				EModId.ResilienceForged,
	// 			],
	// 			numUnusedArtificeMods: 2,
	// 			requiredClassItemExtraModSocketCategoryId: null,
	// 			metadata: {
	// 				totalModCost: 18,
	// 				totalStatTiers: 35,
	// 				wastedStats: 24,
	// 				totalArmorStatMapping: {
	// 					[EArmorStatId.Mobility]: 18,
	// 					[EArmorStatId.Resilience]: 100,
	// 					[EArmorStatId.Recovery]: 100,
	// 					[EArmorStatId.Discipline]: 104,
	// 					[EArmorStatId.Intellect]: 18,
	// 					[EArmorStatId.Strength]: 34,
	// 				},
	// 			},
	// 		},
	// 	],
	// },
	// // 2
	// {
	// 	// TODO: This test is identical to the other test with the same name. It just has
	// 	// armor metadata with Last Wish class items. Make this unique
	// 	name: 'It returns results with artifice boosts required',
	// 	input: {
	// 		masterworkAssumption: EMasterworkAssumption.All,
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 0,
	// 			[EArmorStatId.Resilience]: 100,
	// 			[EArmorStatId.Recovery]: 100,
	// 			[EArmorStatId.Discipline]: 100,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		fragmentArmorStatMapping: getArmorStatMappingFromFragments(
	// 			[],
	// 			EDestinyClassId.Warlock
	// 		),
	// 		modArmorStatMapping: getDefaultArmorStatMapping(),
	// 		validRaidModArmorSlotPlacements: [
	// 			getDefaultValidRaidModArmorSlotPlacement(),
	// 		],
	// 		armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	// 		raidMods: [],
	// 		destinyClassId: EDestinyClassId.Warlock,
	// 		armorMetadataItem:
	// 			defaultArmorMetadataWithLastWishAndArtificeClassItem.Warlock,
	// 		selectedExotic: getDefaultAvailableExoticArmorItem(),
	// 		armorItems: [
	// 			// Res x3, [helmet, arms, chest]
	// 			[
	// 				{
	// 					// Deep Explorer Hood
	// 					...getDefaultArmorItem(),
	// 					id: '0',
	// 					stats: es([2, 6, 26, 24, 2, 6]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: true,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Deep Explorer Gloves
	// 					...getDefaultArmorItem(),
	// 					id: '1',
	// 					stats: es([2, 10, 20, 23, 2, 8]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: true,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Deep Explorer Vestments
	// 					...getDefaultArmorItem(),
	// 					id: '2',
	// 					stats: es([2, 6, 26, 26, 2, 2]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: true,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Lunafaction Boots
	// 					...getDefaultArmorItem(),
	// 					id: '3',
	// 					stats: es([2, 14, 18, 21, 2, 8]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Exotic,
	// 					isMasterworked: true,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 		],
	// 	},

	// 	output: [
	// 		{
	// 			armorIdList: ['0', '1', '2', '3'],
	// 			armorStatModIdList: [
	// 				EModId.ResilienceMod,
	// 				EModId.ResilienceMod,
	// 				EModId.ResilienceMod,
	// 				EModId.ResilienceMod,
	// 				EModId.MinorResilienceMod,
	// 			],
	// 			artificeModIdList: [
	// 				EModId.ResilienceForged,
	// 				EModId.ResilienceForged,
	// 				EModId.ResilienceForged,
	// 			],
	// 			numUnusedArtificeMods: 2,
	// 			requiredClassItemExtraModSocketCategoryId: null,
	// 			metadata: {
	// 				totalModCost: 18,
	// 				totalStatTiers: 35,
	// 				wastedStats: 24,
	// 				totalArmorStatMapping: {
	// 					[EArmorStatId.Mobility]: 18,
	// 					[EArmorStatId.Resilience]: 100,
	// 					[EArmorStatId.Recovery]: 100,
	// 					[EArmorStatId.Discipline]: 104,
	// 					[EArmorStatId.Intellect]: 18,
	// 					[EArmorStatId.Strength]: 34,
	// 				},
	// 			},
	// 		},
	// 	],
	// },
	// // 3
	// {
	// 	name: 'It returns results when five major mods are required',
	// 	input: {
	// 		masterworkAssumption: EMasterworkAssumption.None,
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 100,
	// 			[EArmorStatId.Resilience]: 0,
	// 			[EArmorStatId.Recovery]: 0,
	// 			[EArmorStatId.Discipline]: 0,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		fragmentArmorStatMapping: getArmorStatMappingFromFragments(
	// 			[],
	// 			EDestinyClassId.Warlock
	// 		),
	// 		modArmorStatMapping: getDefaultArmorStatMapping(),
	// 		validRaidModArmorSlotPlacements: [
	// 			getDefaultValidRaidModArmorSlotPlacement(),
	// 		],
	// 		armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	// 		raidMods: [],
	// 		destinyClassId: EDestinyClassId.Warlock,
	// 		armorMetadataItem: getDefaultArmorMetadata().Warlock,
	// 		selectedExotic: getDefaultAvailableExoticArmorItem(),
	// 		armorItems: [
	// 			[
	// 				{
	// 					...getDefaultArmorItem(),
	// 					id: '0',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: false,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					...getDefaultArmorItem(),
	// 					id: '1',
	// 					stats: es([16, 2, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: false,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					...getDefaultArmorItem(),
	// 					id: '2',
	// 					stats: es([16, 2, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: false,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					...getDefaultArmorItem(),
	// 					id: '3',
	// 					stats: es([16, 2, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: false,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 		],
	// 	},
	// 	output: [
	// 		{
	// 			armorIdList: ['0', '1', '2', '3'],
	// 			armorStatModIdList: [
	// 				EModId.MobilityMod,
	// 				EModId.MobilityMod,
	// 				EModId.MobilityMod,
	// 				EModId.MobilityMod,
	// 				EModId.MobilityMod,
	// 			],
	// 			artificeModIdList: [],
	// 			numUnusedArtificeMods: 0,
	// 			requiredClassItemExtraModSocketCategoryId: null,
	// 			metadata: {
	// 				totalModCost: 15,
	// 				totalStatTiers: 30,
	// 				wastedStats: 22,
	// 				totalArmorStatMapping: {
	// 					[EArmorStatId.Mobility]: 100,
	// 					[EArmorStatId.Resilience]: 22,
	// 					[EArmorStatId.Recovery]: 64,
	// 					[EArmorStatId.Discipline]: 64,
	// 					[EArmorStatId.Intellect]: 64,
	// 					[EArmorStatId.Strength]: 8,
	// 				},
	// 			},
	// 		},
	// 	],
	// },
	// // 4
	// {
	// 	name: 'It returns results when five major mods and two artifice mods are required',
	// 	input: {
	// 		masterworkAssumption: EMasterworkAssumption.All,
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 0,
	// 			[EArmorStatId.Resilience]: 100,
	// 			[EArmorStatId.Recovery]: 100,
	// 			[EArmorStatId.Discipline]: 100,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		fragmentArmorStatMapping: getArmorStatMappingFromFragments(
	// 			[],
	// 			EDestinyClassId.Warlock
	// 		),
	// 		modArmorStatMapping: getDefaultArmorStatMapping(),
	// 		validRaidModArmorSlotPlacements: [
	// 			getDefaultValidRaidModArmorSlotPlacement(),
	// 		],
	// 		armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	// 		raidMods: [],
	// 		destinyClassId: EDestinyClassId.Warlock,
	// 		armorMetadataItem: defaultArmorMetadataWithArtificeClassItem.Warlock,
	// 		selectedExotic: {
	// 			...getDefaultAvailableExoticArmorItem(),
	// 			armorSlot: EArmorSlotId.Chest,
	// 		},
	// 		armorItems: [
	// 			[
	// 				{
	// 					// Deep Explorer Hood
	// 					...getDefaultArmorItem(),
	// 					id: '0',
	// 					stats: es([2, 14, 16, 26, 2, 2]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: true,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Dreambane Gloves
	// 					...getDefaultArmorItem(),
	// 					id: '1',
	// 					stats: es([2, 15, 16, 24, 2, 6]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: false,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Starfire Protocol
	// 					...getDefaultArmorItem(),
	// 					id: '2',
	// 					stats: [2, 13, 20, 14, 8, 9], // no es() since starfire has extra res and rec
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Exotic,
	// 					isMasterworked: true,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Warmind's Avatar Pants
	// 					...getDefaultArmorItem(),
	// 					id: '3',
	// 					stats: es([2, 26, 6, 26, 2, 6]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: false,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 		],
	// 	},
	// 	output: [
	// 		{
	// 			armorIdList: ['0', '1', '2', '3'],
	// 			armorStatModIdList: [
	// 				EModId.ResilienceMod,
	// 				EModId.ResilienceMod,
	// 				EModId.RecoveryMod,
	// 				EModId.RecoveryMod,
	// 				EModId.RecoveryMod,
	// 			],
	// 			artificeModIdList: [EModId.ResilienceForged, EModId.RecoveryForged],
	// 			numUnusedArtificeMods: 0,
	// 			requiredClassItemExtraModSocketCategoryId: null,
	// 			metadata: {
	// 				totalModCost: 20,
	// 				totalStatTiers: 36,
	// 				wastedStats: 17,
	// 				totalArmorStatMapping: {
	// 					[EArmorStatId.Mobility]: 18,
	// 					[EArmorStatId.Resilience]: 101,
	// 					[EArmorStatId.Recovery]: 101,
	// 					[EArmorStatId.Discipline]: 100,
	// 					[EArmorStatId.Intellect]: 24,
	// 					[EArmorStatId.Strength]: 33,
	// 				},
	// 			},
	// 		},
	// 	],
	// },
	// // 5
	// {
	// 	name: 'I have no fucking clue',
	// 	input: {
	// 		masterworkAssumption: EMasterworkAssumption.All,
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 0,
	// 			[EArmorStatId.Resilience]: 100,
	// 			[EArmorStatId.Recovery]: 100,
	// 			[EArmorStatId.Discipline]: 100,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		fragmentArmorStatMapping: getArmorStatMappingFromFragments(
	// 			[],
	// 			EDestinyClassId.Warlock
	// 		),
	// 		modArmorStatMapping: getDefaultArmorStatMapping(),
	// 		validRaidModArmorSlotPlacements: [
	// 			getDefaultValidRaidModArmorSlotPlacement(),
	// 		],
	// 		armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	// 		raidMods: [],
	// 		destinyClassId: EDestinyClassId.Warlock,
	// 		armorMetadataItem: defaultArmorMetadataWithArtificeClassItem.Warlock,
	// 		selectedExotic: {
	// 			...getDefaultAvailableExoticArmorItem(),
	// 			armorSlot: EArmorSlotId.Chest,
	// 		},
	// 		armorItems: [
	// 			[
	// 				{
	// 					// Deep Explorer Hood
	// 					...getDefaultArmorItem(),
	// 					id: '0',
	// 					stats: es([2, 14, 16, 26, 2, 2]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: true,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Deep Explorer Gloves
	// 					...getDefaultArmorItem(),
	// 					id: '1',
	// 					stats: es([2, 26, 6, 22, 2, 9]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: false,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Starfire Protocol
	// 					...getDefaultArmorItem(),
	// 					id: '2',
	// 					stats: [2, 13, 20, 14, 8, 9], // no es() since starfire has extra res and rec
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Exotic,
	// 					isMasterworked: true,
	// 					isArtifice: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					// Deep Explorer Boots
	// 					...getDefaultArmorItem(),
	// 					id: '3',
	// 					stats: es([2, 21, 10, 22, 9, 2]),
	// 					hash: -1,
	// 					gearTierId: EGearTierId.Legendary,
	// 					isMasterworked: false,
	// 					isArtifice: true,
	// 				},
	// 			],
	// 		],
	// 	},
	// 	output: [
	// 		{
	// 			armorIdList: ['0', '1', '2', '3'],
	// 			armorStatModIdList: [
	// 				EModId.ResilienceMod,
	// 				EModId.RecoveryMod,
	// 				EModId.RecoveryMod,
	// 				EModId.RecoveryMod,
	// 				EModId.RecoveryMod,
	// 			],
	// 			artificeModIdList: [
	// 				EModId.ResilienceForged,
	// 				EModId.ResilienceForged,
	// 				EModId.DisciplineForged,
	// 				EModId.DisciplineForged,
	// 			],
	// 			numUnusedArtificeMods: 0,
	// 			requiredClassItemExtraModSocketCategoryId: null,
	// 			metadata: {
	// 				totalModCost: 20,
	// 				totalStatTiers: 37,
	// 				wastedStats: 13,
	// 				totalArmorStatMapping: {
	// 					[EArmorStatId.Mobility]: 18,
	// 					[EArmorStatId.Resilience]: 100,
	// 					[EArmorStatId.Recovery]: 102,
	// 					[EArmorStatId.Discipline]: 100,
	// 					[EArmorStatId.Intellect]: 31,
	// 					[EArmorStatId.Strength]: 32,
	// 				},
	// 			},
	// 		},
	// 	],
	// },
];

// const nameOfTestToDebug = 'Lots of stats';
const nameOfTestToDebug = null;
describe('doProcessArmor', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
