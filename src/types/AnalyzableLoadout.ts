import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EModId } from '@dlb/generated/mod/EModId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { getDefaultRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { ELoadoutOptimizationType } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
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

export interface ILoadoutOptimizationCategory {
	id: ELoadoutOptimizationCategoryId;
	name: string;
	description: string;
	color: string;
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
	},
	[ELoadoutOptimizationCategoryId.COSMETIC]: {
		id: ELoadoutOptimizationCategoryId.COSMETIC,
		name: 'Cosmetic',
		description:
			'Cosmetic optimizations do not impact gameplay and can be safely ignored. These are primarly for aesthetic purposes.',
		color: 'lightblue',
	},
	[ELoadoutOptimizationCategoryId.IMPROVEMENT]: {
		id: ELoadoutOptimizationCategoryId.IMPROVEMENT,
		name: 'Improvement',
		description:
			'Improvement optimizations are not required, but can significantly improve a loadout.',
		color: 'lightgreen',
	},
	[ELoadoutOptimizationCategoryId.WARNING]: {
		id: ELoadoutOptimizationCategoryId.WARNING,
		name: 'Warning',
		description:
			'Warnings indicate that something about a loadout looks fishy but the loadout can still be equipped as intended.',
		color: 'yellow',
	},
	[ELoadoutOptimizationCategoryId.PROBLEM]: {
		id: ELoadoutOptimizationCategoryId.PROBLEM,
		name: 'Problem',
		description:
			"Problems indicate that, in it's current state, a loadout cannot be equipped as intended.",
		color: 'darkorange',
	},
	[ELoadoutOptimizationCategoryId.ERROR]: {
		id: ELoadoutOptimizationCategoryId.ERROR,
		name: 'Error',
		description:
			'Errors indicate that something went wrong when processing a loadout. This should never happen. If you see this, please report it in the discord.',
		color: '#FA8072',
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
		optimizationTypeList: ELoadoutOptimizationType[];
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
	optimizationTypeList: ELoadoutOptimizationType[];
	dimStatTierConstraints: ArmorStatMapping;
	characterId: string;
} & DLBConfig;

export type AnalyzableLoadoutMapping = Record<string, AnalyzableLoadout>;

export type AnalyzableLoadoutBreakdown = {
	validLoadouts: AnalyzableLoadoutMapping;
	invalidLoadouts: AnalyzableLoadoutMapping;
};

export const getDefaultAnalyzableLoadout = (): AnalyzableLoadout => ({
	exoticHash: null,
	armor: [],
	desiredStatTiers: getDefaultArmorStatMapping(),
	armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	raidMods: getDefaultRaidMods(),
	id: null,
	name: null,
	loadoutType: ELoadoutType.DIM,
	icon: null,
	destinyClassId: null,
	destinySubclassId: null,
	classAbilityId: null,
	jumpId: null,
	superAbilityId: null,
	meleeId: null,
	grenadeId: null,
	aspectIdList: [],
	fragmentIdList: [],
	armorStatMods: [],
	achievedStatTiers: getDefaultArmorStatMapping(),
	achievedStats: getDefaultArmorStatMapping(),
	optimizationTypeList: [],
	dimStatTierConstraints: getDefaultArmorStatMapping(),
	characterId: null, // Only applicable for InGame Loadouts
	iconColorImage: null, // Only applicable for InGame Loadouts
	index: -1, // Only applicable for InGame Loadouts
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
