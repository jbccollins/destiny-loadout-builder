import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { ARTIFICE } from '@dlb/services/processArmor/constants';
import { getDefaultModPlacements } from '@dlb/services/processArmor/getModCombos';
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
	EExoticArtificeAssumption,
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
	isCollectible: false,
	isLocked: false,
};

const getDefaultArmorItem = () => cloneDeep(defaultArmorItem);

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
				allLoadoutArmorItemsIdList: [],
				masterworkAssumption: EMasterworkAssumption.None,
				exoticArtificeAssumption: EExoticArtificeAssumption.None,
				useExoticClassItem: false,
				useBonusResilience: false,
				selectedExoticArmorItem: null,
				desiredArmorStats: {
					[EArmorStatId.Weapons]: 0,
					[EArmorStatId.Health]: 60,
					[EArmorStatId.Class]: 60,
					[EArmorStatId.Grenade]: 0,
					[EArmorStatId.Super]: 0,
					[EArmorStatId.Melee]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				assumedStatValuesStatMapping: getDefaultArmorStatMapping(),
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
				alwaysConsiderCollectionsRolls: false,
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
					modPlacement: getDefaultModPlacements().placement,
					metadata: {
						// TODO: Do we actually need to store the baseArmorStatMapping in redux?
						baseArmorStatMapping: {
							[EArmorStatId.Weapons]: 10,
							[EArmorStatId.Health]: 66,
							[EArmorStatId.Class]: 66,
							[EArmorStatId.Grenade]: 66,
							[EArmorStatId.Super]: 66,
							[EArmorStatId.Melee]: 10,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Weapons]: 10,
							[EArmorStatId.Health]: 66,
							[EArmorStatId.Class]: 66,
							[EArmorStatId.Grenade]: 66,
							[EArmorStatId.Super]: 66,
							[EArmorStatId.Melee]: 10,
						},
						seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
						classItem: getDefaultProcessedArmorItemMetadataClassItem(),
						totalModCost: 0,
						totalStatTiers: 26,
						wastedStats: 24,
						numUniqueArmorStatMods: 0,
						numSharedArmorItemsAcrossLoadouts: 0,
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Weapons]: 60,
				[EArmorStatId.Health]: 100,
				[EArmorStatId.Class]: 100,
				[EArmorStatId.Grenade]: 100,
				[EArmorStatId.Super]: 100,
				[EArmorStatId.Melee]: 60,
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
				allLoadoutArmorItemsIdList: [],
				useBonusResilience: false,
				selectedExoticArmorItem: null,
				useZeroWastedStats: false,
				alwaysConsiderCollectionsRolls: false,
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				allClassItemMetadata: defaultClassItemMetadataWithMasterworkedArtifice,
				masterworkAssumption: EMasterworkAssumption.All,
				exoticArtificeAssumption: EExoticArtificeAssumption.None,
				useExoticClassItem: false,
				desiredArmorStats: {
					[EArmorStatId.Weapons]: 0,
					[EArmorStatId.Health]: 100,
					[EArmorStatId.Class]: 100,
					[EArmorStatId.Grenade]: 100,
					[EArmorStatId.Super]: 0,
					[EArmorStatId.Melee]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				assumedStatValuesStatMapping: getDefaultArmorStatMapping(),
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
						EModId.HealthMod,
						EModId.HealthMod,
						EModId.HealthMod,
						EModId.MinorHealthMod,
						EModId.HealthMod,
					],
					artificeModIdList: [
						EModId.HealthForged,
						EModId.HealthForged,
						EModId.HealthForged,
					],
					modPlacement: {
						...getDefaultModPlacements().placement,
						[EArmorSlotId.Arm]: {
							...getDefaultModPlacements().placement.Arm,
							armorStatModId: EModId.HealthMod,
						},
						[EArmorSlotId.Chest]: {
							...getDefaultModPlacements().placement.Chest,
							armorStatModId: EModId.HealthMod,
						},
						[EArmorSlotId.ClassItem]: {
							...getDefaultModPlacements().placement.ClassItem,
							armorStatModId: EModId.HealthMod,
						},
						[EArmorSlotId.Head]: {
							...getDefaultModPlacements().placement.Head,
							armorStatModId: EModId.HealthMod,
						},
						[EArmorSlotId.Leg]: {
							...getDefaultModPlacements().placement.Leg,
							armorStatModId: EModId.MinorHealthMod,
						},
					},
					metadata: {
						totalModCost: 18,
						totalStatTiers: 35,
						wastedStats: 24,
						numUniqueArmorStatMods: 2,
						numSharedArmorItemsAcrossLoadouts: 0,
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
							[EArmorStatId.Weapons]: 18,
							[EArmorStatId.Health]: 46,
							[EArmorStatId.Class]: 100,
							[EArmorStatId.Grenade]: 104,
							[EArmorStatId.Super]: 18,
							[EArmorStatId.Melee]: 34,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Weapons]: 18,
							[EArmorStatId.Health]: 100,
							[EArmorStatId.Class]: 100,
							[EArmorStatId.Grenade]: 104,
							[EArmorStatId.Super]: 18,
							[EArmorStatId.Melee]: 34,
						},
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Weapons]: 20,
				[EArmorStatId.Health]: 100,
				[EArmorStatId.Class]: 100,
				[EArmorStatId.Grenade]: 100,
				[EArmorStatId.Super]: 20,
				[EArmorStatId.Melee]: 40,
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
				allLoadoutArmorItemsIdList: [],
				useBonusResilience: false,
				selectedExoticArmorItem: null,
				masterworkAssumption: EMasterworkAssumption.None,
				exoticArtificeAssumption: EExoticArtificeAssumption.None,
				useExoticClassItem: false,
				desiredArmorStats: {
					[EArmorStatId.Weapons]: 100,
					[EArmorStatId.Health]: 0,
					[EArmorStatId.Class]: 0,
					[EArmorStatId.Grenade]: 0,
					[EArmorStatId.Super]: 0,
					[EArmorStatId.Melee]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				assumedStatValuesStatMapping: getDefaultArmorStatMapping(),
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
				alwaysConsiderCollectionsRolls: false,
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
						EModId.WeaponsMod,
						EModId.WeaponsMod,
						EModId.WeaponsMod,
						EModId.WeaponsMod,
						EModId.WeaponsMod,
					],
					artificeModIdList: [],
					modPlacement: {
						...getDefaultModPlacements().placement,
						[EArmorSlotId.Arm]: {
							...getDefaultModPlacements().placement.Arm,
							armorStatModId: EModId.WeaponsMod,
						},
						[EArmorSlotId.Chest]: {
							...getDefaultModPlacements().placement.Chest,
							armorStatModId: EModId.WeaponsMod,
						},
						[EArmorSlotId.ClassItem]: {
							...getDefaultModPlacements().placement.ClassItem,
							armorStatModId: EModId.WeaponsMod,
						},
						[EArmorSlotId.Head]: {
							...getDefaultModPlacements().placement.Head,
							armorStatModId: EModId.WeaponsMod,
						},
						[EArmorSlotId.Leg]: {
							...getDefaultModPlacements().placement.Leg,
							armorStatModId: EModId.WeaponsMod,
						},
					},
					metadata: {
						// TODO: Do we actually need to store the baseArmorStatMapping in redux?
						baseArmorStatMapping: {
							[EArmorStatId.Weapons]: 52,
							[EArmorStatId.Health]: 24,
							[EArmorStatId.Class]: 66,
							[EArmorStatId.Grenade]: 66,
							[EArmorStatId.Super]: 66,
							[EArmorStatId.Melee]: 10,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Weapons]: 102,
							[EArmorStatId.Health]: 24,
							[EArmorStatId.Class]: 66,
							[EArmorStatId.Grenade]: 66,
							[EArmorStatId.Super]: 66,
							[EArmorStatId.Melee]: 10,
						},
						seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
						classItem: getDefaultProcessedArmorItemMetadataClassItem(),
						totalModCost: 15,
						totalStatTiers: 31,
						wastedStats: 24,
						numUniqueArmorStatMods: 1,
						numSharedArmorItemsAcrossLoadouts: 0,
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Weapons]: 100,
				[EArmorStatId.Health]: 20,
				[EArmorStatId.Class]: 60,
				[EArmorStatId.Grenade]: 60,
				[EArmorStatId.Super]: 60,
				[EArmorStatId.Melee]: 10,
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
				allLoadoutArmorItemsIdList: [],
				useBonusResilience: false,
				selectedExoticArmorItem: null,
				masterworkAssumption: EMasterworkAssumption.All,
				exoticArtificeAssumption: EExoticArtificeAssumption.None,
				useExoticClassItem: false,
				desiredArmorStats: {
					[EArmorStatId.Weapons]: 0,
					[EArmorStatId.Health]: 100,
					[EArmorStatId.Class]: 100,
					[EArmorStatId.Grenade]: 100,
					[EArmorStatId.Super]: 0,
					[EArmorStatId.Melee]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				assumedStatValuesStatMapping: getDefaultArmorStatMapping(),
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
				alwaysConsiderCollectionsRolls: false,
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
						EModId.ClassMod,
						EModId.HealthMod,
						EModId.HealthMod,
						EModId.ClassMod,
						EModId.ClassMod,
					],
					artificeModIdList: [EModId.HealthForged, EModId.ClassForged],
					modPlacement: {
						...getDefaultModPlacements().placement,
						[EArmorSlotId.Arm]: {
							...getDefaultModPlacements().placement.Arm,
							armorStatModId: EModId.HealthMod,
						},
						[EArmorSlotId.Chest]: {
							...getDefaultModPlacements().placement.Chest,
							armorStatModId: EModId.HealthMod,
						},
						[EArmorSlotId.ClassItem]: {
							...getDefaultModPlacements().placement.ClassItem,
							armorStatModId: EModId.ClassMod,
						},
						[EArmorSlotId.Head]: {
							...getDefaultModPlacements().placement.Head,
							armorStatModId: EModId.ClassMod,
						},
						[EArmorSlotId.Leg]: {
							...getDefaultModPlacements().placement.Leg,
							armorStatModId: EModId.ClassMod,
						},
					},
					metadata: {
						// TODO: Do we actually need to store the baseArmorStatMapping in redux?
						baseArmorStatMapping: {
							[EArmorStatId.Weapons]: 18,
							[EArmorStatId.Health]: 78,
							[EArmorStatId.Class]: 68,
							[EArmorStatId.Grenade]: 100,
							[EArmorStatId.Super]: 24,
							[EArmorStatId.Melee]: 33,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Weapons]: 18,
							[EArmorStatId.Health]: 101,
							[EArmorStatId.Class]: 101,
							[EArmorStatId.Grenade]: 100,
							[EArmorStatId.Super]: 24,
							[EArmorStatId.Melee]: 33,
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
						numUniqueArmorStatMods: 2,
						numSharedArmorItemsAcrossLoadouts: 0,
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Weapons]: 10,
				[EArmorStatId.Health]: 100,
				[EArmorStatId.Class]: 100,
				[EArmorStatId.Grenade]: 100,
				[EArmorStatId.Super]: 20,
				[EArmorStatId.Melee]: 30,
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
				allLoadoutArmorItemsIdList: [],
				useBonusResilience: false,
				selectedExoticArmorItem: null,
				masterworkAssumption: EMasterworkAssumption.All,
				exoticArtificeAssumption: EExoticArtificeAssumption.None,
				useExoticClassItem: false,
				desiredArmorStats: {
					[EArmorStatId.Weapons]: 0,
					[EArmorStatId.Health]: 100,
					[EArmorStatId.Class]: 100,
					[EArmorStatId.Grenade]: 100,
					[EArmorStatId.Super]: 0,
					[EArmorStatId.Melee]: 0,
				},
				fragmentArmorStatMapping: getDefaultArmorStatMapping(),
				assumedStatValuesStatMapping: getDefaultArmorStatMapping(),
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
				alwaysConsiderCollectionsRolls: false,
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
						EModId.ClassMod,
						EModId.HealthMod,
						EModId.ClassMod,
						EModId.ClassMod,
						EModId.ClassMod,
					],
					artificeModIdList: [
						EModId.HealthForged,
						EModId.HealthForged,
						EModId.GrenadeForged,
						EModId.GrenadeForged,
					],
					modPlacement: {
						...getDefaultModPlacements().placement,
						[EArmorSlotId.Arm]: {
							...getDefaultModPlacements().placement.Arm,
							armorStatModId: EModId.HealthMod,
						},
						[EArmorSlotId.Chest]: {
							...getDefaultModPlacements().placement.Chest,
							armorStatModId: EModId.ClassMod,
						},
						[EArmorSlotId.ClassItem]: {
							...getDefaultModPlacements().placement.ClassItem,
							armorStatModId: EModId.ClassMod,
						},
						[EArmorSlotId.Head]: {
							...getDefaultModPlacements().placement.Head,
							armorStatModId: EModId.ClassMod,
						},
						[EArmorSlotId.Leg]: {
							...getDefaultModPlacements().placement.Leg,
							armorStatModId: EModId.ClassMod,
						},
					},
					metadata: {
						// TODO: Do we actually need to store the baseArmorStatMapping in redux?
						baseArmorStatMapping: {
							[EArmorStatId.Weapons]: 18,
							[EArmorStatId.Health]: 84,
							[EArmorStatId.Class]: 62,
							[EArmorStatId.Grenade]: 94,
							[EArmorStatId.Super]: 31,
							[EArmorStatId.Melee]: 32,
						},
						totalArmorStatMapping: {
							[EArmorStatId.Weapons]: 18,
							[EArmorStatId.Health]: 100,
							[EArmorStatId.Class]: 102,
							[EArmorStatId.Grenade]: 100,
							[EArmorStatId.Super]: 31,
							[EArmorStatId.Melee]: 32,
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
						numUniqueArmorStatMods: 2,
						numSharedArmorItemsAcrossLoadouts: 0,
					},
				},
			],
			// TOOD: Rename totalItemCount to untruncatedItemCount
			totalItemCount: 1,
			// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
			maxPossibleDesiredStatTiers: {
				[EArmorStatId.Weapons]: 10,
				[EArmorStatId.Health]: 100,
				[EArmorStatId.Class]: 100,
				[EArmorStatId.Grenade]: 100,
				[EArmorStatId.Super]: 30,
				[EArmorStatId.Melee]: 30,
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
	// This test no longer makes sense given that raid mod costs are gone
	// [
	// 	'It returns results with a raid chest and class item when the chestpiece has no capacity',
	// 	[
	// 		{
	// 			useBonusResilience: false,
	// 			selectedExoticArmorItem: null,
	// 			masterworkAssumption: EMasterworkAssumption.None,
	// 			exoticArtificeAssumption: EExoticArtificeAssumption.None,
	// 			useExoticClassItem: false,
	// 			desiredArmorStats: {
	// 				[EArmorStatId.Mobility]: 0,
	// 				[EArmorStatId.Resilience]: 0,
	// 				[EArmorStatId.Recovery]: 0,
	// 				[EArmorStatId.Discipline]: 0,
	// 				[EArmorStatId.Intellect]: 0,
	// 				[EArmorStatId.Strength]: 0,
	// 			},
	// 			fragmentArmorStatMapping: getDefaultArmorStatMapping(),
	// 			assumedStatValuesStatMapping: getDefaultArmorStatMapping(),
	// 			modArmorStatMapping: getDefaultArmorStatMapping(),
	// 			potentialRaidModArmorSlotPlacements: [
	// 				{
	// 					...getDefaultPotentialRaidModArmorSlotPlacement(),
	// 					[EArmorSlotId.Head]: EModId.ReleaseRecover,
	// 				},
	// 				{
	// 					...getDefaultPotentialRaidModArmorSlotPlacement(),
	// 					[EArmorSlotId.Arm]: EModId.ReleaseRecover,
	// 				},
	// 				{
	// 					...getDefaultPotentialRaidModArmorSlotPlacement(),
	// 					[EArmorSlotId.Chest]: EModId.ReleaseRecover,
	// 				},
	// 				{
	// 					...getDefaultPotentialRaidModArmorSlotPlacement(),
	// 					[EArmorSlotId.Leg]: EModId.ReleaseRecover,
	// 				},
	// 				{
	// 					...getDefaultPotentialRaidModArmorSlotPlacement(),
	// 					[EArmorSlotId.ClassItem]: EModId.ReleaseRecover,
	// 				},
	// 			],
	// 			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	// 			raidMods: [EModId.ReleaseRecover],
	// 			intrinsicArmorPerkOrAttributeIds: [],
	// 			destinyClassId: EDestinyClassId.Warlock,
	// 			reservedArmorSlotEnergy: {
	// 				...getDefaultArmorSlotEnergyMapping(),
	// 				[EArmorSlotId.Chest]: 10,
	// 			},
	// 			useZeroWastedStats: false,
	// 			alwaysConsiderCollectionsRolls: false,
	// 			allClassItemMetadata:
	// 				defaultClassItemMetadataWithUnMasterworkedRaidClassItem,
	// 			armorItems: [
	// 				[
	// 					{
	// 						...getDefaultArmorItem(),
	// 						id: '0',
	// 						stats: [0, 0, 0, 0, 0, 0],
	// 						hash: -1,
	// 						gearTierId: EGearTierId.Legendary,
	// 						isMasterworked: false,
	// 						isArtifice: false,
	// 					},
	// 				],
	// 				[
	// 					{
	// 						...getDefaultArmorItem(),
	// 						id: '1',
	// 						stats: [0, 0, 0, 0, 0, 0],
	// 						hash: -1,
	// 						gearTierId: EGearTierId.Legendary,
	// 						isMasterworked: false,
	// 						isArtifice: false,
	// 					},
	// 				],
	// 				[
	// 					{
	// 						...getDefaultArmorItem(),
	// 						id: '2',
	// 						stats: [0, 0, 0, 0, 0, 0],
	// 						hash: -1,
	// 						gearTierId: EGearTierId.Legendary,
	// 						isMasterworked: false,
	// 						isArtifice: false,
	// 						socketableRaidAndNightmareModTypeId:
	// 							ERaidAndNightMareModTypeId.RootOfNightmares,
	// 					},
	// 				],
	// 				[
	// 					{
	// 						...getDefaultArmorItem(),
	// 						id: '3',
	// 						stats: [0, 0, 0, 0, 0, 0],
	// 						hash: -1,
	// 						gearTierId: EGearTierId.Legendary,
	// 						isMasterworked: false,
	// 						isArtifice: false,
	// 					},
	// 				],
	// 			],
	// 		},
	// 	],
	// 	{
	// 		items: [
	// 			{
	// 				armorIdList: ['0', '1', '2', '3'],
	// 				armorStatModIdList: [],
	// 				artificeModIdList: [],
	// 				modPlacement: {
	// 					...getDefaultModPlacements().placement,
	// 					ClassItem: {
	// 						armorStatModId: null,
	// 						raidModId: EModId.ReleaseRecover,
	// 					},
	// 				},
	// 				metadata: {
	// 					// TODO: Do we actually need to store the baseArmorStatMapping in redux?
	// 					baseArmorStatMapping: {
	// 						[EArmorStatId.Mobility]: 2,
	// 						[EArmorStatId.Resilience]: 2,
	// 						[EArmorStatId.Recovery]: 2,
	// 						[EArmorStatId.Discipline]: 2,
	// 						[EArmorStatId.Intellect]: 2,
	// 						[EArmorStatId.Strength]: 2,
	// 					},
	// 					totalArmorStatMapping: {
	// 						[EArmorStatId.Mobility]: 2,
	// 						[EArmorStatId.Resilience]: 2,
	// 						[EArmorStatId.Recovery]: 2,
	// 						[EArmorStatId.Discipline]: 2,
	// 						[EArmorStatId.Intellect]: 2,
	// 						[EArmorStatId.Strength]: 2,
	// 					},
	// 					seenArmorSlotItems: {
	// 						...getDefaultSeenArmorSlotItems(),
	// 						[EArmorSlotId.Chest]: {
	// 							...getDefaultSeenArmorSlotItems().Chest,
	// 							raidAndNightmareModTypeId:
	// 								ERaidAndNightMareModTypeId.RootOfNightmares,
	// 						},
	// 					},
	// 					classItem: {
	// 						...getDefaultProcessedArmorItemMetadataClassItem(),
	// 						requiredClassItemMetadataKey:
	// 							ERaidAndNightMareModTypeId.RootOfNightmares,
	// 					},
	// 					totalModCost: 0,
	// 					totalStatTiers: 0,
	// 					wastedStats: 12,
	// 				},
	// 			},
	// 		],
	// 		// TOOD: Rename totalItemCount to untruncatedItemCount
	// 		totalItemCount: 1,
	// 		// TODO: Change max posible desired stat tiers to actual tiers, not values. So divide these by 10
	// 		maxPossibleDesiredStatTiers: {
	// 			[EArmorStatId.Mobility]: 40,
	// 			[EArmorStatId.Resilience]: 40,
	// 			[EArmorStatId.Recovery]: 40,
	// 			[EArmorStatId.Discipline]: 40,
	// 			[EArmorStatId.Intellect]: 40,
	// 			[EArmorStatId.Strength]: 40,
	// 		},
	// 		maxPossibleReservedArmorSlotEnergy: {
	// 			[EArmorSlotId.Head]: 10,
	// 			[EArmorSlotId.Arm]: 10,
	// 			[EArmorSlotId.Chest]: 10,
	// 			[EArmorSlotId.Leg]: 10,
	// 			[EArmorSlotId.ClassItem]: 20,
	// 		},
	// 	},
	// ],
];

// const nameOfTestToDebug =
// 	'It returns results with very tight tolerances and maximum stat mod usage';
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
