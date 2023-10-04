import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EModId } from '@dlb/generated/mod/EModId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { getDefaultRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	ELoadoutOptimizationTypeId,
	GetLoadoutsThatCanBeOptimizedProgressMetadata,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import { ArmorItem } from './Armor';
import { ArmorStatMapping, getDefaultArmorStatMapping } from './ArmorStat';
import { EDestinyClassId, EDestinySubclassId } from './IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	getDefaultArmorSlotIdToModIdListMapping,
} from './Mod';

export enum ELoadoutType {
	DIM = 'DIM',
	InGame = 'InGame',
}

export enum ELoadoutOptimizationCategoryId {
	NONE = 'NONE',
	COSMETIC = 'COSMETIC',
	IMPROVEMENT = 'IMPROVEMENT',
	WARNING = 'WARNING',
	PROBLEM = 'PROBLEM',
	ERROR = 'ERROR',
}

export const OrderedLoadoutOptimizationCategoryIdList = [
	ELoadoutOptimizationCategoryId.IMPROVEMENT,
	ELoadoutOptimizationCategoryId.PROBLEM,
	ELoadoutOptimizationCategoryId.WARNING,
	ELoadoutOptimizationCategoryId.COSMETIC,
	ELoadoutOptimizationCategoryId.ERROR,
	ELoadoutOptimizationCategoryId.NONE,
];

export const SeverityOrderedLoadoutOptimizationCategoryIdList = [
	ELoadoutOptimizationCategoryId.ERROR,
	ELoadoutOptimizationCategoryId.PROBLEM,
	ELoadoutOptimizationCategoryId.WARNING,
	ELoadoutOptimizationCategoryId.IMPROVEMENT,
	ELoadoutOptimizationCategoryId.COSMETIC,
	ELoadoutOptimizationCategoryId.NONE,
];

export interface ILoadoutOptimizationCategory {
	id: ELoadoutOptimizationCategoryId;
	name: string;
	description: string;
	color: string;
	severity: number;
}

export const LoadoutOptimizerCategoryIdToLoadoutOptimizerCategoryMapping: Record<
	ELoadoutOptimizationCategoryId,
	ILoadoutOptimizationCategory
> = {
	[ELoadoutOptimizationCategoryId.NONE]: {
		id: ELoadoutOptimizationCategoryId.NONE,
		name: 'None',
		description: 'No optimizations found, this loadout is as good as it gets!',
		color: 'white',
		severity: 0,
	},
	[ELoadoutOptimizationCategoryId.COSMETIC]: {
		id: ELoadoutOptimizationCategoryId.COSMETIC,
		name: 'Cosmetic',
		description:
			'Cosmetic optimizations do not impact gameplay and can be safely ignored. These are primarly for aesthetic purposes.',
		color: 'lightblue',
		severity: 0,
	},
	[ELoadoutOptimizationCategoryId.IMPROVEMENT]: {
		id: ELoadoutOptimizationCategoryId.IMPROVEMENT,
		name: 'Improvement',
		description:
			'Improvement optimizations are not required, but can significantly improve a loadout.',
		color: 'lightgreen',
		severity: 1,
	},
	[ELoadoutOptimizationCategoryId.WARNING]: {
		id: ELoadoutOptimizationCategoryId.WARNING,
		name: 'Warning',
		description:
			'Warnings indicate that something about a loadout looks fishy but the loadout can still be equipped as intended.',
		color: 'yellow',
		severity: 2,
	},
	[ELoadoutOptimizationCategoryId.PROBLEM]: {
		id: ELoadoutOptimizationCategoryId.PROBLEM,
		name: 'Problem',
		description:
			"Problems indicate that, in it's current state, a loadout cannot be equipped as intended.",
		color: 'darkorange',
		severity: 3,
	},
	[ELoadoutOptimizationCategoryId.ERROR]: {
		id: ELoadoutOptimizationCategoryId.ERROR,
		name: 'Error',
		description:
			'Errors indicate that something went wrong when processing a loadout. This should never happen. If you see this, please report it in the discord.',
		color: '#FA8072',
		severity: 0,
	},
};

export const getLoadoutOptimizationCategory = (
	id: ELoadoutOptimizationCategoryId
): ILoadoutOptimizationCategory => {
	return LoadoutOptimizerCategoryIdToLoadoutOptimizerCategoryMapping[id];
};

// We should be able to completely populate the redux store from this config
// such that using the tool "just works"
export type DLBConfig = {
	classAbilityId: EClassAbilityId;
	jumpId: EJumpId;
	superAbilityId: ESuperAbilityId;
	meleeId: EMeleeId;
	grenadeId: EGrenadeId;
	aspectIdList: EAspectId[];
	fragmentIdList: EFragmentId[];
	desiredStatTiers: ArmorStatMapping;
	destinyClassId: EDestinyClassId;
	destinySubclassId: EDestinySubclassId;
	exoticHash: number;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: [EModId, EModId, EModId, EModId];
};

export type AnalysisResults = Record<
	string,
	{
		optimizationTypeList: ELoadoutOptimizationTypeId[];
		metadata?: GetLoadoutsThatCanBeOptimizedProgressMetadata;
	}
>;

export type AnalyzableLoadout = {
	armor: ArmorItem[];
	id: string;
	loadoutType: ELoadoutType;
	icon: string;
	iconColorImage: string;
	index: number;
	name: string;
	armorStatMods: EModId[];
	achievedStatTiers: ArmorStatMapping;
	achievedStats: ArmorStatMapping; // The un-rounded stats
	optimizationTypeList: ELoadoutOptimizationTypeId[];
	dimStatTierConstraints: ArmorStatMapping;
	characterId: string;
	hasBonusResilienceOrnament: boolean;
} & DLBConfig;

export type AnalyzableLoadoutMapping = Record<string, AnalyzableLoadout>;

export type AnalyzableLoadoutBreakdown = {
	validLoadouts: AnalyzableLoadoutMapping;
	invalidLoadouts: AnalyzableLoadoutMapping;
};

export const getDefaultAnalyzableLoadout = (): AnalyzableLoadout => ({
	achievedStats: getDefaultArmorStatMapping(),
	achievedStatTiers: getDefaultArmorStatMapping(),
	armor: [],
	armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	armorStatMods: [],
	aspectIdList: [],
	characterId: null, // Only applicable for InGame Loadouts
	classAbilityId: null,
	desiredStatTiers: getDefaultArmorStatMapping(),
	destinyClassId: null,
	destinySubclassId: null,
	dimStatTierConstraints: getDefaultArmorStatMapping(),
	exoticHash: null,
	fragmentIdList: [],
	grenadeId: null,
	hasBonusResilienceOrnament: false,
	icon: null,
	iconColorImage: null, // Only applicable for InGame Loadouts
	id: null,
	index: -1, // Only applicable for InGame Loadouts
	jumpId: null,
	loadoutType: ELoadoutType.DIM,
	meleeId: null,
	name: null,
	optimizationTypeList: [],
	raidMods: getDefaultRaidMods(),
	superAbilityId: null,
});

export const getDefaultAnalyzableLoadoutBreakdown =
	(): AnalyzableLoadoutBreakdown => ({
		validLoadouts: {},
		invalidLoadouts: {},
	});

export enum ELoadoutTypeFilter {
	All = 'All',
	DIM = 'DIM',
	D2 = 'D2',
}

export const LodaoutTypeFilterToLoadoutTypeMapping: Record<
	ELoadoutTypeFilter,
	ELoadoutType[]
> = {
	[ELoadoutTypeFilter.All]: [ELoadoutType.DIM, ELoadoutType.InGame],
	[ELoadoutTypeFilter.DIM]: [ELoadoutType.DIM],
	[ELoadoutTypeFilter.D2]: [ELoadoutType.InGame],
};

export const ELoadoutFilterTypeList = [
	ELoadoutTypeFilter.All,
	ELoadoutTypeFilter.D2,
	ELoadoutTypeFilter.DIM,
];
