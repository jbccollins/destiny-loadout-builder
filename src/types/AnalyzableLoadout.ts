import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultRaidModIdList } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	ELoadoutOptimizationTypeId,
	GetLoadoutsThatCanBeOptimizedProgress,
	GetLoadoutsThatCanBeOptimizedProgressMetadata,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import { ArmorItem } from './Armor';
import { ArmorStatMapping, getDefaultArmorStatMapping } from './ArmorStat';
import { DLBConfig } from './DLBConfig';
import { ValidateEnumList } from './globals';
import { getDefaultArmorSlotIdToModIdListMapping } from './Mod';

export enum ELoadoutType {
	DIM = 'DIM',
	InGame = 'InGame',
}

export enum ELoadoutOptimizationCategoryId {
	NONE = 'NONE',
	COSMETIC = 'COSMETIC',
	TRANSIENT = 'TRANSIENT',
	IMPROVEMENT = 'IMPROVEMENT',
	WARNING = 'WARNING',
	PROBLEM = 'PROBLEM',
	ERROR = 'ERROR',
}

export const OrderedLoadoutOptimizationCategoryIdList = ValidateEnumList(
	Object.values(ELoadoutOptimizationCategoryId),
	[
		ELoadoutOptimizationCategoryId.IMPROVEMENT,
		ELoadoutOptimizationCategoryId.PROBLEM,
		ELoadoutOptimizationCategoryId.WARNING,
		ELoadoutOptimizationCategoryId.TRANSIENT,
		ELoadoutOptimizationCategoryId.COSMETIC,
		ELoadoutOptimizationCategoryId.ERROR,
		ELoadoutOptimizationCategoryId.NONE,
	]
);

export const SeverityOrderedLoadoutOptimizationCategoryIdList =
	ValidateEnumList(Object.values(ELoadoutOptimizationCategoryId), [
		ELoadoutOptimizationCategoryId.ERROR,
		ELoadoutOptimizationCategoryId.PROBLEM,
		ELoadoutOptimizationCategoryId.WARNING,
		ELoadoutOptimizationCategoryId.IMPROVEMENT,
		ELoadoutOptimizationCategoryId.TRANSIENT,
		ELoadoutOptimizationCategoryId.COSMETIC,
		ELoadoutOptimizationCategoryId.NONE,
	]);

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
	[ELoadoutOptimizationCategoryId.TRANSIENT]: {
		id: ELoadoutOptimizationCategoryId.TRANSIENT,
		name: 'Transient',
		description:
			'Transient optimizations do not impact gameplay and can be safely ignored. These optimizations indicate that there will be problems with this loadout in the future, but at the moment, the loadout is fine.',
		color: '#33beb7',
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
		color: '#ffff66',
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
	artificeModIdList: EModId[];
	achievedStatTiers: ArmorStatMapping;
	achievedStats: ArmorStatMapping; // The un-rounded stats
	optimizationTypeList: ELoadoutOptimizationTypeId[];
	dimStatTierConstraints: ArmorStatMapping;
	characterId: string;
	hasBonusResilienceOrnament: boolean;
	hasHalloweenMask: boolean;
} & DLBConfig;

export type RichAnalyzableLoadout = AnalyzableLoadout & {
	metadata?: GetLoadoutsThatCanBeOptimizedProgress['metadata'];
};

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
	hasHalloweenMask: false,
	icon: null,
	iconColorImage: null, // Only applicable for InGame Loadouts
	id: null,
	index: -1, // Only applicable for InGame Loadouts
	jumpId: null,
	loadoutType: ELoadoutType.DIM,
	meleeId: null,
	name: null,
	optimizationTypeList: [],
	raidMods: getDefaultRaidModIdList(),
	superAbilityId: null,
	artificeModIdList: [],
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

export const filterOptimizationTypeList = (
	optimizationTypeList: ELoadoutOptimizationTypeId[],
	ignoredLoadoutOptimizationTypeIdList: ELoadoutOptimizationTypeId[]
) => {
	return optimizationTypeList.filter(
		(optimizationType) =>
			!ignoredLoadoutOptimizationTypeIdList.includes(optimizationType)
	);
};
