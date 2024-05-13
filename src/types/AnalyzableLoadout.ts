import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultRaidModIdList } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { AnalyzeLoadoutParams, EModVariantCheckType, GetLoadoutsThatCanBeOptimizedProgress, GetLoadoutsThatCanBeOptimizedProgressMetadata } from '@dlb/services/loadoutAnalyzer/helpers/types';
import { default as buggedAlternateSeasonModsChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/BuggedAlternateSeasonMods';
import { default as fewerWastedStatsChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/FewerWastedStats';
import { default as higherStatTiersChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/HigherStatTiers';
import { default as invalidLoadoutConfigurationChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/InvalidLoadoutConfiguration';
import { default as lowerCostChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/LowerCost';
import { default as missingArmorChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/MissingArmor';
import { default as mutuallyExclusiveModsChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/MutuallyExclusiveMods';
import { default as noExoticArmorChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/NoExoticArmor';
import { default as seasonalModsChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/SeasonalMods';
import { default as seasonalModsCorrectableChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/SeasonalModsCorrectable';
import { default as unmasterworkedArmorChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/UnmasterworkedArmor';
import { default as unmetDIMStatConstraintsChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/UnmetDIMStatConstraints';
import { default as unspecifiedAspectChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/UnspecifiedAspect';
import { default as unusableModsChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/UnusableMods';
import { default as unusedFragmentSlotsChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/UnusedFragmentSlots';
import { default as unusedModSlotsChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/UnusedModSlots';
import { default as wastedStatTiersChecker } from '@dlb/services/loadoutAnalyzer/loadoutOptimizationTypeCheckerDefinitions/WastedStatTiers';
import { ArmorItem } from './Armor';
import { ArmorStatMapping, getDefaultArmorStatMapping } from './ArmorStat';
import { DLBConfig } from './DLBConfig';
import { getDefaultArmorSlotIdToModIdListMapping } from './Mod';
import { EnumDictionary, ValidateEnumList } from './globals';

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
	dlbGeneratedId: string;
	deprecatedModIdList: EModId[];
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
	deprecatedModIdList: [],
	icon: null,
	iconColorImage: null, // Only applicable for InGame Loadouts
	index: -1, // Only applicable for InGame Loadouts
	jumpId: null,
	loadoutType: ELoadoutType.DIM,
	meleeId: null,
	name: null,
	optimizationTypeList: [],
	raidMods: getDefaultRaidModIdList(),
	superAbilityId: null,
	artificeModIdList: [],
	dlbGeneratedId: '',
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

export enum ELoadoutOptimizationTypeId {
	HigherStatTiers = 'HigherStatTiers',
	LowerCost = 'LowerCost',
	MissingArmor = 'MissingArmor',
	NoExoticArmor = 'NoExoticArmor',
	DeprecatedMods = 'DeprecatedMods',
	WastedStatTiers = 'WastedStatTiers',
	UnusedFragmentSlots = 'UnusedFragmentSlots',
	UnspecifiedAspect = 'UnspecifiedAspect',
	UnmetDIMStatConstraints = 'UnmetDIMStatConstraints',
	UnusableMods = 'UnusableMods',
	UnmasterworkedArmor = 'UnmasterworkedArmor',
	FewerWastedStats = 'FewerWastedStats',
	InvalidLoadoutConfiguration = 'InvalidLoadoutConfiguration',
	MutuallyExclusiveMods = 'MutuallyExclusiveMods',
	UnusedModSlots = 'UnusedModSlots',
	SeasonalMods = 'SeasonalMods',
	SeasonalModsCorrectable = 'SeasonalModsCorrectable',
	UnstackableMods = 'UnstackableMods',
	BuggedAlternateSeasonMods = 'BuggedAlternateSeasonMods',
	None = 'None',
	Error = 'Error',
}

export type LoadoutOptimziationTypeCheckerOutput = {
	meetsOptimizationCriteria: boolean;
	shortCircuit: boolean; // Stop processing other optimization types if true
}

export type LoadoutOptimziationTypeCheckerParams = AnalyzeLoadoutParams & {
	modIdList: EModId[];
	metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata;
	variantHasResultsMapping: Record<EModVariantCheckType, boolean>;
	hasResults: boolean;
	hasUnusedModSlots: boolean;
	maxStatTierDiff: number;
	usesAlternateSeasonArtifactMods: boolean;
	usesAlternateSeasonBuggedArtifactMods: boolean;
	usesAlternateSeasonNonBuggedArtifactMods: boolean;
	usesMutuallyExclusiveMods: boolean;
	usesActiveSeasonArtifactModsWithNoFullCostVariant: boolean;
	usesActiveSeasonReducedCostArtifactMods: boolean;
	usesActiveSeasonArtifactMods: boolean;
}

export type LoadoutOptimizationTypeChecker = (params: LoadoutOptimziationTypeCheckerParams) => LoadoutOptimziationTypeCheckerOutput

export interface ILoadoutOptimization {
	id: ELoadoutOptimizationTypeId;
	name: string;
	description: string;
	category: ELoadoutOptimizationCategoryId;
	checker: LoadoutOptimizationTypeChecker;
}

const NOOP_CHECKER: LoadoutOptimizationTypeChecker = () => {
	return {
		meetsOptimizationCriteria: false,
		shortCircuit: false,
	};
}

export const LoadoutOptimizationTypeToLoadoutOptimizationMapping: EnumDictionary<
	ELoadoutOptimizationTypeId,
	ILoadoutOptimization
> = {
	[ELoadoutOptimizationTypeId.HigherStatTiers]: {
		id: ELoadoutOptimizationTypeId.HigherStatTiers,
		name: 'Higher Stat Tier',
		description:
			'Recreating this loadout with a different combination of armor and/or stat boosting mods can achieve higher stat tiers.',
		category: ELoadoutOptimizationCategoryId.IMPROVEMENT,
		checker: higherStatTiersChecker
	},
	[ELoadoutOptimizationTypeId.LowerCost]: {
		id: ELoadoutOptimizationTypeId.LowerCost,
		name: 'Lower Cost',
		description:
			'Recreating this loadout with a different combination of armor and/or stat boosting mods can achieve the same stat tiers for a lower total stat mod cost. This may allow you to socket more mods or more expensive mods.',
		category: ELoadoutOptimizationCategoryId.IMPROVEMENT,
		checker: lowerCostChecker
	},
	[ELoadoutOptimizationTypeId.FewerWastedStats]: {
		id: ELoadoutOptimizationTypeId.FewerWastedStats,
		name: 'Fewer Wasted Stats',
		description:
			'Recreating this loadout with a different combination of armor and/or stat boosting mods can achieve the same stat tiers but with fewer wasted stats. Any stat that does not end in a 0 is considered a wasted stat. For example, 89 Recovery provides the same benefit as 80 Recovery so there are 9 wasted stats. Reducing wasted stats may not increase the stat tiers that you are able to achieve, but it does look aesthetically nice to have all your stats end in a 0 :)',
		category: ELoadoutOptimizationCategoryId.COSMETIC,
		checker: fewerWastedStatsChecker
	},
	[ELoadoutOptimizationTypeId.MissingArmor]: {
		id: ELoadoutOptimizationTypeId.MissingArmor,
		name: 'Missing Armor',
		description:
			'This loadout is missing one or more armor pieces. You may have deleted armor pieces that were in this loadout.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
		checker: missingArmorChecker
	},
	[ELoadoutOptimizationTypeId.NoExoticArmor]: {
		id: ELoadoutOptimizationTypeId.NoExoticArmor,
		name: 'No Exotic Armor',
		description:
			'This loadout does not have an exotic armor piece. You may have deleted the exotic armor piece that was in this loadout.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
		checker: noExoticArmorChecker
	},
	[ELoadoutOptimizationTypeId.DeprecatedMods]: {
		id: ELoadoutOptimizationTypeId.DeprecatedMods,
		name: 'Deprecated Mods',
		description:
			'This loadout uses mods that are no longer in the game. This usually means you had an old "Charged With Light", "Warmind Cell", or "Elemental Well" mod equipped.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
		checker: NOOP_CHECKER // Intentional. This check happens before the loadout is every analyzed since deprecated mods mess up armor processing
	},
	[ELoadoutOptimizationTypeId.UnspecifiedAspect]: {
		id: ELoadoutOptimizationTypeId.UnspecifiedAspect,
		name: 'Unused Aspect Slot',
		description:
			'This loadout only specifies one aspect. Consider adding another aspect to this loadout.',
		category: ELoadoutOptimizationCategoryId.WARNING,
		checker: unspecifiedAspectChecker
	},
	[ELoadoutOptimizationTypeId.WastedStatTiers]: {
		id: ELoadoutOptimizationTypeId.WastedStatTiers,
		name: 'Wasted Stat Tiers',
		description:
			"This loadout has one or more stats of 110 or higher. There is likely a way to shuffle mods around to avoid wasting an entire stat tier's worth of stat points.",
		category: ELoadoutOptimizationCategoryId.WARNING,
		checker: wastedStatTiersChecker
	},
	[ELoadoutOptimizationTypeId.UnusedFragmentSlots]: {
		id: ELoadoutOptimizationTypeId.UnusedFragmentSlots,
		name: 'Unused Fragment Slots',
		description:
			"This loadout has one or more unused fragment slots. Occasionally Bungie adds more fragment slots to an aspect. You may want to add another fragment, it's free real estate!",
		category: ELoadoutOptimizationCategoryId.WARNING,
		checker: unusedFragmentSlotsChecker
	},
	[ELoadoutOptimizationTypeId.UnmetDIMStatConstraints]: {
		id: ELoadoutOptimizationTypeId.UnmetDIMStatConstraints,
		name: 'Unmet DIM Stat Constraints',
		description:
			'[DIM Loadout Specific] This loadout was created using DIM\'s "Loadout Optimizer" tool, or another similar tool. At the time that this loadout was created, you were able to hit higher stat tiers that you can currently hit. This can happen when Bungie adds stat penalties to an existing fragment that is part of your loadout.',
		category: ELoadoutOptimizationCategoryId.WARNING,
		checker: unmetDIMStatConstraintsChecker
	},
	[ELoadoutOptimizationTypeId.UnusableMods]: {
		id: ELoadoutOptimizationTypeId.UnusableMods,
		name: 'Unusable Mods',
		description:
			'This loadout uses mods that are no longer available. This usually happens when you were using a mod that was available during a previous season via artifact unlocks.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
		checker: unusableModsChecker
	},
	[ELoadoutOptimizationTypeId.UnmasterworkedArmor]: {
		id: ELoadoutOptimizationTypeId.UnmasterworkedArmor,
		name: 'Unmasterworked Armor',
		description:
			'This loadout contains unmasterworked armor. Masterworking armor provides a +2 bonus to all stats and adds additional energy capacity to the armor. Masterworking armor in this loadout may allow you to socket more expensive mods which may be beneficial to your build.',
		category: ELoadoutOptimizationCategoryId.WARNING,
		checker: unmasterworkedArmorChecker
	},
	[ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration]: {
		id: ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration,
		name: 'Invalid Loadout Configuration',
		description:
			"Something about this loadout is not configured correctly and no combination of armor pieces can make it valid. This should theoretically never happen for D2 Loadouts. If this is a DIM loadout, this can happen if you created a loadout using discounted mods from an old season. DIM will automatically attempt swap over to using the full cost variants of such mods. When DIM does such a swap, there sometimes won't be enough armor energy capacity to slot the full cost variants, which results in this optimization type. In rare cases this can happen if you somehow managed to create a loadout where the total mod cost for a given armor slot exceeded 10. This would likely only happen if there was a bug in DIM or another third party loadout creation tool.",
		category: ELoadoutOptimizationCategoryId.PROBLEM,
		checker: invalidLoadoutConfigurationChecker
	},
	[ELoadoutOptimizationTypeId.MutuallyExclusiveMods]: {
		id: ELoadoutOptimizationTypeId.MutuallyExclusiveMods,
		name: 'Mutually Exclusive Mods',
		description:
			'This loadout uses mods that are mutually exclusive. This is rare, but can happen if Bungie decides to make two mods mutually exclusive after you have already equipped both of them together. It can also happen if there is a bug in DIM or another third party loadout creation tool that let you create a loadout with such mods.',
		category: ELoadoutOptimizationCategoryId.PROBLEM,
		checker: mutuallyExclusiveModsChecker
	},
	[ELoadoutOptimizationTypeId.UnusedModSlots]: {
		id: ELoadoutOptimizationTypeId.UnusedModSlots,
		name: 'Unused Mod Slots',
		description:
			"This loadout has space to slot additional mods. It's free real estate!",
		category: ELoadoutOptimizationCategoryId.IMPROVEMENT,
		checker: unusedModSlotsChecker
	},
	[ELoadoutOptimizationTypeId.SeasonalMods]: {
		id: ELoadoutOptimizationTypeId.SeasonalMods,
		name: 'Seasonal Mods',
		description:
			'This loadout uses mods unlocked via the current seasonal artifact that will become unavailable once the season ends.',
		category: ELoadoutOptimizationCategoryId.TRANSIENT,
		checker: seasonalModsChecker
	},
	[ELoadoutOptimizationTypeId.SeasonalModsCorrectable]: {
		id: ELoadoutOptimizationTypeId.SeasonalModsCorrectable,
		name: 'Seasonal Mods (Correctable)',
		description:
			'[D2 Loadout Specific] This loadout uses discounted mods unlocked via the current seasonal artifact that will become unavailable once the season ends. This loadout has enough armor energy capacity to slot the full cost variants of such mods. Consider manually swapping these mods for their full cost variants to ensure that this loadout is usable after the current season ends.',
		category: ELoadoutOptimizationCategoryId.TRANSIENT,
		checker: seasonalModsCorrectableChecker
	},
	[ELoadoutOptimizationTypeId.UnstackableMods]: {
		id: ELoadoutOptimizationTypeId.UnstackableMods,
		name: 'Unstackable Mods',
		description:
			'This loadout uses multiple copies of mods with benefits that do not stack.',
		category: ELoadoutOptimizationCategoryId.WARNING,
		checker: NOOP_CHECKER
	},
	[ELoadoutOptimizationTypeId.BuggedAlternateSeasonMods]: {
		id: ELoadoutOptimizationTypeId.BuggedAlternateSeasonMods,
		name: 'Bugged Alternate Season Mod',
		description:
			'This loadout contains a bugged mod. The Bungie API has a bug where some players have access to discounted mods that were available via artifact unlocks in a previous season. If you are affected by this bug there is nothing you can do to fix it, but this will only ever be a positive thing for your current builds since the discounted mods are cheaper. However, this may break your build in the future if Bungie ever fixes this bug.',
		category: ELoadoutOptimizationCategoryId.TRANSIENT,
		checker: buggedAlternateSeasonModsChecker
	},
	[ELoadoutOptimizationTypeId.None]: {
		id: ELoadoutOptimizationTypeId.None,
		name: 'No Optimizations Found',
		description:
			'No optimizations found. This loadout is as good as it gets :)',
		category: ELoadoutOptimizationCategoryId.NONE,
		checker: NOOP_CHECKER
	},
	[ELoadoutOptimizationTypeId.Error]: {
		id: ELoadoutOptimizationTypeId.Error,
		name: 'Processing Error',
		description: 'An error occurred while processing this loadout.',
		category: ELoadoutOptimizationCategoryId.ERROR,
		checker: NOOP_CHECKER
	},
};

export const OrderedLoadoutOptimizationTypeList: ELoadoutOptimizationTypeId[] =
	ValidateEnumList(Object.values(ELoadoutOptimizationTypeId), [
		ELoadoutOptimizationTypeId.HigherStatTiers,
		ELoadoutOptimizationTypeId.LowerCost,
		ELoadoutOptimizationTypeId.UnusedModSlots,
		ELoadoutOptimizationTypeId.MissingArmor,
		ELoadoutOptimizationTypeId.UnusableMods,
		ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration,
		ELoadoutOptimizationTypeId.MutuallyExclusiveMods,
		ELoadoutOptimizationTypeId.NoExoticArmor,
		ELoadoutOptimizationTypeId.DeprecatedMods,
		ELoadoutOptimizationTypeId.UnusedFragmentSlots,
		ELoadoutOptimizationTypeId.UnspecifiedAspect,
		ELoadoutOptimizationTypeId.UnmasterworkedArmor,
		ELoadoutOptimizationTypeId.UnmetDIMStatConstraints,
		ELoadoutOptimizationTypeId.WastedStatTiers,
		ELoadoutOptimizationTypeId.UnstackableMods,
		ELoadoutOptimizationTypeId.SeasonalMods,
		ELoadoutOptimizationTypeId.SeasonalModsCorrectable,
		ELoadoutOptimizationTypeId.BuggedAlternateSeasonMods,
		ELoadoutOptimizationTypeId.FewerWastedStats,
		ELoadoutOptimizationTypeId.Error,
		ELoadoutOptimizationTypeId.None,
	]);

export const OrderedLoadoutOptimizationTypeListWithoutNone =
	OrderedLoadoutOptimizationTypeList.filter(
		(x) => x !== ELoadoutOptimizationTypeId.None
	);

export const getLoadoutOptimization = (
	id: ELoadoutOptimizationTypeId
): ILoadoutOptimization => {
	return LoadoutOptimizationTypeToLoadoutOptimizationMapping[id];
};

export const NoneOptimization = getLoadoutOptimization(
	ELoadoutOptimizationTypeId.None
);

export const IgnorableLoadoutOptimizationTypes =
	OrderedLoadoutOptimizationTypeList.filter(
		(x) =>
			![
				ELoadoutOptimizationTypeId.Error,
				ELoadoutOptimizationTypeId.None,
			].includes(x)
	).map((loadoutOptimizationTypeId) => {
		const loadoutOptimizationType = getLoadoutOptimization(
			loadoutOptimizationTypeId
		);
		const { category } = loadoutOptimizationType;
		const color = getLoadoutOptimizationCategory(category).color;
		return {
			...loadoutOptimizationType,
			color,
		};
	});

// There maybe multiple optimizations types that, while techincally correct, are confusing
// to a user. For example, if you are missing an armor piece, then the lower cost and higher stat tier checks aren't
// really relevant since a massive chunk of stats are missing. So we filter out some of the optimization types
export const humanizeOptimizationTypes = (
	optimizationTypeList: ELoadoutOptimizationTypeId[]
): ELoadoutOptimizationTypeId[] => {
	let filteredOptimizationTypeList: ELoadoutOptimizationTypeId[] = [
		...optimizationTypeList,
	];

	// TODO: I think that missing armor should take precedence over no exotic armor

	// Missing armor takes precedence over higher stat tier, lower cost, unmet stat constraints and fewer wasted stats
	if (
		filteredOptimizationTypeList.includes(
			ELoadoutOptimizationTypeId.MissingArmor
		)
	) {
		filteredOptimizationTypeList = filteredOptimizationTypeList.filter(
			(x) =>
				![
					ELoadoutOptimizationTypeId.HigherStatTiers,
					ELoadoutOptimizationTypeId.LowerCost,
					ELoadoutOptimizationTypeId.UnmetDIMStatConstraints,
					ELoadoutOptimizationTypeId.FewerWastedStats,
				].includes(x)
		);
	}
	// Higher stat tier takes precedence over fewer wasted stats
	if (
		filteredOptimizationTypeList.includes(
			ELoadoutOptimizationTypeId.HigherStatTiers
		)
	) {
		filteredOptimizationTypeList = filteredOptimizationTypeList.filter(
			(x) => !(x === ELoadoutOptimizationTypeId.FewerWastedStats)
		);
	}
	// Dedupe and sort the list
	filteredOptimizationTypeList = Array.from(
		new Set(filteredOptimizationTypeList)
	).sort(
		(a, b) =>
			SeverityOrderedLoadoutOptimizationCategoryIdList.indexOf(
				getLoadoutOptimization(a).category
			) -
			SeverityOrderedLoadoutOptimizationCategoryIdList.indexOf(
				getLoadoutOptimization(b).category
			)
	);
	return filteredOptimizationTypeList;
};
