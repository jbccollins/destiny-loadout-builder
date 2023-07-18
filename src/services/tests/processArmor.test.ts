import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { ARTIFICE } from '@dlb/services/processArmor/constants';
import {
	doProcessArmor,
	getDefaultProcessedArmorItemMetadataClassItem,
} from '@dlb/services/processArmor/index';
import { getDefaultSeenArmorSlotItems } from '@dlb/services/processArmor/seenArmorSlotItems';
import { enforceValidLegendaryArmorBaseStats as es } from '@dlb/services/test-utils';
import {
	AllClassItemMetadata,
	ArmorItem,
	getDefaultAllClassItemMetadata,
} from '@dlb/types/Armor';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EGearTierId,
	EMasterworkAssumption,
	ERaidAndNightMareModTypeId,
} from '@dlb/types/IdEnums';
import {
	getDefaultArmorSlotIdToModIdListMapping,
	getDefaultPotentialRaidModArmorSlotPlacement,
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

const defaultClassItemMetadataWithMasterworkedLegendary: AllClassItemMetadata =
	{
		...getDefaultAllClassItemMetadata(),
		Legendary: {
			hasMasterworkedVariant: true,
			items: [
				{
					...getDefaultArmorItem(),
					isMasterworked: true,
					id: '4',
				},
			],
		},
	};

const defaultClassItemMetadataWithMasterworkedArtifice: AllClassItemMetadata = {
	...getDefaultAllClassItemMetadata(),
	Legendary: {
		hasMasterworkedVariant: true,
		items: [
			{
				...getDefaultArmorItem(),
				isMasterworked: true,
				isArtifice: true,
				id: '4',
			},
		],
	},
	Artifice: {
		hasMasterworkedVariant: true,
		items: [
			{
				...getDefaultArmorItem(),
				isMasterworked: true,
				isArtifice: true,
				id: '4',
			},
		],
	},
};

const defaultClassItemMetadataWithUnMasterworkedRaidClassItem: AllClassItemMetadata =
	{
		...getDefaultAllClassItemMetadata(),
		Legendary: {
			hasMasterworkedVariant: false,
			items: [
				{
					...getDefaultArmorItem(),
					socketableRaidAndNightmareModTypeId:
						ERaidAndNightMareModTypeId.RootOfNightmares,
					isMasterworked: false,
					id: '4',
				},
			],
		},
		RootOfNightmares: {
			hasMasterworkedVariant: false,
			items: [
				{
					...getDefaultArmorItem(),
					socketableRaidAndNightmareModTypeId:
						ERaidAndNightMareModTypeId.RootOfNightmares,
					isMasterworked: false,
					id: '4',
				},
			],
		},
	};

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
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				modArmorStatMapping: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: [
					getDefaultPotentialRaidModArmorSlotPlacement(),
				],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: EDestinyClassId.Warlock,
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
						classItem: getDefaultProcessedArmorItemMetadataClassItem(),
						totalModCost: 0,
						totalStatTiers: 24,
						wastedStats: 32,
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
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
	// 1
	[
		'It returns results with artifice boosts required',
		[
			{
				useZeroWastedStats: false,
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				allClassItemMetadata: defaultClassItemMetadataWithMasterworkedArtifice,
				masterworkAssumption: EMasterworkAssumption.All,
				desiredArmorStats: {
					[EArmorStatId.Mobility]: 0,
					[EArmorStatId.Resilience]: 100,
					[EArmorStatId.Recovery]: 100,
					[EArmorStatId.Discipline]: 100,
					[EArmorStatId.Intellect]: 0,
					[EArmorStatId.Strength]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				modArmorStatMapping: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: [
					getDefaultPotentialRaidModArmorSlotPlacement(),
				],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: EDestinyClassId.Warlock,
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
		],
		{
			items: [
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
						seenArmorSlotItems: {
							...getDefaultSeenArmorSlotItems(),
							[EArmorSlotId.Head]: {
								...getDefaultSeenArmorSlotItems()[EArmorSlotId.Head],
								isArtifice: true,
							},
							[EArmorSlotId.Arm]: {
								...getDefaultSeenArmorSlotItems()[EArmorSlotId.Arm],
								isArtifice: true,
							},
							[EArmorSlotId.Chest]: {
								...getDefaultSeenArmorSlotItems()[EArmorSlotId.Chest],
								isArtifice: true,
							},
						},
						classItem: {
							...getDefaultProcessedArmorItemMetadataClassItem(),
							hasMasterworkedVariant: true,
						},
						baseArmorStatMapping: {
							[EArmorStatId.Mobility]: 16,
							[EArmorStatId.Resilience]: 44,
							[EArmorStatId.Recovery]: 98,
							[EArmorStatId.Discipline]: 102,
							[EArmorStatId.Intellect]: 16,
							[EArmorStatId.Strength]: 32,
						},
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
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Mobility]: 20,
				[EArmorStatId.Resilience]: 100,
				[EArmorStatId.Recovery]: 100,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 20,
				[EArmorStatId.Strength]: 40,
			},
			maxPossibleReservedArmorSlotEnergy: {
				[EArmorSlotId.Head]: 8,
				[EArmorSlotId.Arm]: 8,
				[EArmorSlotId.Chest]: 8,
				[EArmorSlotId.Leg]: 8,
				[EArmorSlotId.ClassItem]: 8,
			},
		},
	],
	// 2
	[
		'It returns results when five major mods are required',
		[
			{
				masterworkAssumption: EMasterworkAssumption.None,
				desiredArmorStats: {
					[EArmorStatId.Mobility]: 100,
					[EArmorStatId.Resilience]: 0,
					[EArmorStatId.Recovery]: 0,
					[EArmorStatId.Discipline]: 0,
					[EArmorStatId.Intellect]: 0,
					[EArmorStatId.Strength]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				modArmorStatMapping: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: [
					getDefaultPotentialRaidModArmorSlotPlacement(),
				],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: EDestinyClassId.Warlock,
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
		],
		{
			items: [
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
						// TODO: Do we actually need to store the baseArmorStatMapping in redux?
						baseArmorStatMapping: {
							[EArmorStatId.Mobility]: 50,
							[EArmorStatId.Resilience]: 22,
							[EArmorStatId.Recovery]: 64,
							[EArmorStatId.Discipline]: 64,
							[EArmorStatId.Intellect]: 64,
							[EArmorStatId.Strength]: 8,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Mobility]: 100,
							[EArmorStatId.Resilience]: 22,
							[EArmorStatId.Recovery]: 64,
							[EArmorStatId.Discipline]: 64,
							[EArmorStatId.Intellect]: 64,
							[EArmorStatId.Strength]: 8,
						},
						seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
						classItem: getDefaultProcessedArmorItemMetadataClassItem(),
						totalModCost: 15,
						totalStatTiers: 30,
						wastedStats: 22,
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 20,
				[EArmorStatId.Recovery]: 60,
				[EArmorStatId.Discipline]: 60,
				[EArmorStatId.Intellect]: 60,
				[EArmorStatId.Strength]: 0,
			},
			maxPossibleReservedArmorSlotEnergy: {
				[EArmorSlotId.Head]: 7,
				[EArmorSlotId.Arm]: 7,
				[EArmorSlotId.Chest]: 7,
				[EArmorSlotId.Leg]: 7,
				[EArmorSlotId.ClassItem]: 7,
			},
		},
	],
	// 3
	[
		'It returns results when five major mods and two artifice mods are required',
		[
			{
				masterworkAssumption: EMasterworkAssumption.All,
				desiredArmorStats: {
					[EArmorStatId.Mobility]: 0,
					[EArmorStatId.Resilience]: 100,
					[EArmorStatId.Recovery]: 100,
					[EArmorStatId.Discipline]: 100,
					[EArmorStatId.Intellect]: 0,
					[EArmorStatId.Strength]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				modArmorStatMapping: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: [
					getDefaultPotentialRaidModArmorSlotPlacement(),
				],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: EDestinyClassId.Warlock,
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				allClassItemMetadata: defaultClassItemMetadataWithMasterworkedArtifice,
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
		],
		{
			items: [
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
						// TODO: Do we actually need to store the baseArmorStatMapping in redux?
						baseArmorStatMapping: {
							[EArmorStatId.Mobility]: 16,
							[EArmorStatId.Resilience]: 76,
							[EArmorStatId.Recovery]: 66,
							[EArmorStatId.Discipline]: 98,
							[EArmorStatId.Intellect]: 22,
							[EArmorStatId.Strength]: 31,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Mobility]: 18,
							[EArmorStatId.Resilience]: 101,
							[EArmorStatId.Recovery]: 101,
							[EArmorStatId.Discipline]: 100,
							[EArmorStatId.Intellect]: 24,
							[EArmorStatId.Strength]: 33,
						},
						seenArmorSlotItems: {
							...getDefaultSeenArmorSlotItems(),
							[EArmorSlotId.Head]: {
								...getDefaultSeenArmorSlotItems()[EArmorSlotId.Head],
								isArtifice: true,
							},
						},
						classItem: {
							hasMasterworkedVariant: true,
							requiredClassItemMetadataKey: ARTIFICE,
						},
						totalModCost: 20,
						totalStatTiers: 36,
						wastedStats: 17,
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 100,
				[EArmorStatId.Recovery]: 100,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 20,
				[EArmorStatId.Strength]: 30,
			},
			maxPossibleReservedArmorSlotEnergy: {
				[EArmorSlotId.Head]: 6,
				[EArmorSlotId.Arm]: 6,
				[EArmorSlotId.Chest]: 6,
				[EArmorSlotId.Leg]: 6,
				[EArmorSlotId.ClassItem]: 6,
			},
		},
	],
	// 4
	[
		'It returns results when five major mods and four artifice mods are required',
		[
			{
				masterworkAssumption: EMasterworkAssumption.All,
				desiredArmorStats: {
					[EArmorStatId.Mobility]: 0,
					[EArmorStatId.Resilience]: 100,
					[EArmorStatId.Recovery]: 100,
					[EArmorStatId.Discipline]: 100,
					[EArmorStatId.Intellect]: 0,
					[EArmorStatId.Strength]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				modArmorStatMapping: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: [
					getDefaultPotentialRaidModArmorSlotPlacement(),
				],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: EDestinyClassId.Warlock,
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				allClassItemMetadata: defaultClassItemMetadataWithMasterworkedArtifice,
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
		],
		{
			items: [
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
						// TODO: Do we actually need to store the baseArmorStatMapping in redux?
						baseArmorStatMapping: {
							[EArmorStatId.Mobility]: 16,
							[EArmorStatId.Resilience]: 82,
							[EArmorStatId.Recovery]: 60,
							[EArmorStatId.Discipline]: 92,
							[EArmorStatId.Intellect]: 29,
							[EArmorStatId.Strength]: 30,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Mobility]: 18,
							[EArmorStatId.Resilience]: 100,
							[EArmorStatId.Recovery]: 102,
							[EArmorStatId.Discipline]: 100,
							[EArmorStatId.Intellect]: 31,
							[EArmorStatId.Strength]: 32,
						},
						seenArmorSlotItems: {
							...getDefaultSeenArmorSlotItems(),
							[EArmorSlotId.Head]: {
								...getDefaultSeenArmorSlotItems()[EArmorSlotId.Head],
								isArtifice: true,
							},
							[EArmorSlotId.Arm]: {
								...getDefaultSeenArmorSlotItems()[EArmorSlotId.Arm],
								isArtifice: true,
							},
							[EArmorSlotId.Leg]: {
								...getDefaultSeenArmorSlotItems()[EArmorSlotId.Leg],
								isArtifice: true,
							},
						},
						classItem: {
							hasMasterworkedVariant: true,
							requiredClassItemMetadataKey: ARTIFICE,
						},
						totalModCost: 20,
						totalStatTiers: 37,
						wastedStats: 13,
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 100,
				[EArmorStatId.Recovery]: 100,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 30,
				[EArmorStatId.Strength]: 30,
			},
			maxPossibleReservedArmorSlotEnergy: {
				[EArmorSlotId.Head]: 6,
				[EArmorSlotId.Arm]: 6,
				[EArmorSlotId.Chest]: 6,
				[EArmorSlotId.Leg]: 6,
				[EArmorSlotId.ClassItem]: 6,
			},
		},
	],
	[
		'It returns results with a raid chest and class item when the chestpiece has no capacity',
		[
			{
				masterworkAssumption: EMasterworkAssumption.None,
				desiredArmorStats: {
					[EArmorStatId.Mobility]: 0,
					[EArmorStatId.Resilience]: 0,
					[EArmorStatId.Recovery]: 0,
					[EArmorStatId.Discipline]: 0,
					[EArmorStatId.Intellect]: 0,
					[EArmorStatId.Strength]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				modArmorStatMapping: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: [
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.ReleaseRecover,
					},
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.Arm]: EModId.ReleaseRecover,
					},
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.Chest]: EModId.ReleaseRecover,
					},
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.Leg]: EModId.ReleaseRecover,
					},
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.ClassItem]: EModId.ReleaseRecover,
					},
				],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [EModId.ReleaseRecover],
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: EDestinyClassId.Warlock,
				reservedArmorSlotEnergy: {
					...getDefaultArmorSlotEnergyMapping(),
					[EArmorSlotId.Chest]: 10,
				},
				useZeroWastedStats: false,
				allClassItemMetadata:
					defaultClassItemMetadataWithUnMasterworkedRaidClassItem,
				armorItems: [
					[
						{
							...getDefaultArmorItem(),
							id: '0',
							stats: [0, 0, 0, 0, 0, 0],
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
							stats: [0, 0, 0, 0, 0, 0],
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
							stats: [0, 0, 0, 0, 0, 0],
							hash: -1,
							gearTierId: EGearTierId.Legendary,
							isMasterworked: false,
							isArtifice: false,
							socketableRaidAndNightmareModTypeId:
								ERaidAndNightMareModTypeId.RootOfNightmares,
						},
					],
					[
						{
							...getDefaultArmorItem(),
							id: '3',
							stats: [0, 0, 0, 0, 0, 0],
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
							[EArmorStatId.Mobility]: 0,
							[EArmorStatId.Resilience]: 0,
							[EArmorStatId.Recovery]: 0,
							[EArmorStatId.Discipline]: 0,
							[EArmorStatId.Intellect]: 0,
							[EArmorStatId.Strength]: 0,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Mobility]: 0,
							[EArmorStatId.Resilience]: 0,
							[EArmorStatId.Recovery]: 0,
							[EArmorStatId.Discipline]: 0,
							[EArmorStatId.Intellect]: 0,
							[EArmorStatId.Strength]: 0,
						},
						seenArmorSlotItems: {
							...getDefaultSeenArmorSlotItems(),
							[EArmorSlotId.Chest]: {
								...getDefaultSeenArmorSlotItems().Chest,
								raidAndNightmareModTypeId:
									ERaidAndNightMareModTypeId.RootOfNightmares,
							},
						},
						classItem: {
							...getDefaultProcessedArmorItemMetadataClassItem(),
							requiredClassItemMetadataKey:
								ERaidAndNightMareModTypeId.RootOfNightmares,
						},
						totalModCost: 0,
						totalStatTiers: 0,
						wastedStats: 0,
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Mobility]: 40,
				[EArmorStatId.Resilience]: 40,
				[EArmorStatId.Recovery]: 40,
				[EArmorStatId.Discipline]: 40,
				[EArmorStatId.Intellect]: 40,
				[EArmorStatId.Strength]: 40,
			},
			maxPossibleReservedArmorSlotEnergy: {
				[EArmorSlotId.Head]: 10,
				[EArmorSlotId.Arm]: 10,
				[EArmorSlotId.Chest]: 10,
				[EArmorSlotId.Leg]: 10,
				[EArmorSlotId.ClassItem]: 9,
			},
		},
	],
];

// const nameOfTestToDebug =
// 	'It returns results with a raid chest and class item when the chestpiece has no capacity';
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
