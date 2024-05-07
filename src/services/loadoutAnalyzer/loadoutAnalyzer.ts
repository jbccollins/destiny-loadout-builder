import { EModId } from '@dlb/generated/mod/EModId';
import {
	ArmorSlotEnergyMapping,
	getDefaultArmorSlotEnergyMapping,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';

import {
	doProcessArmor,
	DoProcessArmorParams
} from '@dlb/services/processArmor';
import {
	ArmorStatAndRaidModComboPlacement,
	getDefaultModPlacements,
} from '@dlb/services/processArmor/getModCombos';
import {
	getWastedStats,
	roundDown10,
	sumModCosts,
} from '@dlb/services/processArmor/utils';
import {
	AnalyzableLoadout,
	ELoadoutOptimizationTypeId,
	ELoadoutType,
	humanizeOptimizationTypes
} from '@dlb/types/AnalyzableLoadout';
import {
	Armor,
	AvailableExoticArmor,
	DestinyClassToAllClassItemMetadataMapping
} from '@dlb/types/Armor';
import {
	ArmorSlotWithClassItemIdList
} from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatMappingFromFragments,
	getArmorStatMappingFromMods,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EIntrinsicArmorPerkOrAttributeId,
	EMasterworkAssumption,
	EModCategoryId
} from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	getMod,
	getValidRaidModArmorSlotPlacements,
	hasActiveSeasonReducedCostVariantMods,
	hasAlternateSeasonReducedCostVariantMods,
	hasMutuallyExclusiveMods,
	hasUnstackableMods,
	replaceAllReducedCostVariantMods
} from '@dlb/types/Mod';
import { ActiveSeasonArtifactModIdList } from '@dlb/types/ModCategory';
import { reducedToNormalMod } from '@dlb/utils/reduced-cost-mod-mapping';
import { isEmpty } from 'lodash';
import { generatePreProcessedArmor } from './helpers/generatePreProcessedArmor';
import { findAvailableExoticArmorItem, flattenMods, getFragmentSlots, getUnusedModSlots } from './helpers/utils';

// Return all AnalyzableLoadouts that can reach higher stat tiers or that
// can reach the same stat tiers, but for cheaper.
// TODO: Possibly in the future make this also return loadouts with fewer
// wasted stats

export enum EGetLoadoutsThatCanBeOptimizedProgressType {
	Progress = 'progress',
	Error = 'error',
}
export type GetLoadoutsThatCanBeOptimizedProgressMetadata = {
	maxPossibleDesiredStatTiers: ArmorStatMapping;
	maxPossibleReservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	// maxStatTierDiff: number;
	lowestCost: number;
	currentCost: number;
	lowestWastedStats: number;
	currentWastedStats: number;
	mutuallyExclusiveModGroups: string[]; // TODO: Rework this to contain the actual mod ids
	unstackableModIdList: EModId[];
	modPlacement: ArmorStatAndRaidModComboPlacement;
	unusedModSlots: Partial<Record<EArmorSlotId, number>>;
};
export type GetLoadoutsThatCanBeOptimizedProgress = {
	type: EGetLoadoutsThatCanBeOptimizedProgressType;
	canBeOptimized?: boolean;
	loadoutId: string;
	optimizationTypeList: ELoadoutOptimizationTypeId[];
	metadata?: GetLoadoutsThatCanBeOptimizedProgressMetadata;
};

export type GetLoadoutsThatCanBeOptimizedParams = {
	loadouts: Record<string, AnalyzableLoadout>;
	armor: Armor;
	masterworkAssumption: EMasterworkAssumption;
	allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
	progressCallback: (
		progress: GetLoadoutsThatCanBeOptimizedProgress
	) => unknown;
	availableExoticArmor: AvailableExoticArmor;
	buggedAlternateSeasonModIdList: EModId[];
};
export type GetLoadoutsThatCanBeOptimizedOutputItem = {
	optimizationTypeList: ELoadoutOptimizationTypeId[];
	loadoutId: string;
};

enum EModVariantCheckType {
	Base = 'Base',
	Seasonal = 'Seasonal',
}

type ModReplacer = (
	armorSlotMods: ArmorSlotIdToModIdListMapping
) => ArmorSlotIdToModIdListMapping;

const ModVariantCheckTypeToModReplacerMapping: Record<
	EModVariantCheckType,
	ModReplacer
> = {
	[EModVariantCheckType.Base]: (armorSlotMods) => armorSlotMods,
	[EModVariantCheckType.Seasonal]: replaceAllReducedCostVariantMods,
};

type ArmorSlotModsVariants = {
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	modVariantCheckType: EModVariantCheckType;
}[];

// We assume that the DIM mods will be swapped appropriately
// before the analyzer even runs. This is how DIM behaves internally
// and we want to mimic that behavior.
// "Seasonal D2" doesn't require any mod swapping. Just check if the loadout contains an in-season reduced cost mod
// "Unusable Mods" should be D2 specific. DIM loadouts will never have unusable mods since we pre-swap the mods on initial DIM loadout ingestion.
// "Unavailable Mods" is gone. DIM loadouts will never have unavailable mods since we pre-swap the mods on initial DIM loadout ingestion.
// "Invalid Loadout Configuration" might need to be DIM specific. The description should mention that the user may have initially created that loadout using reduced cost mods that are now out-of-season
// If "Invalid Loadout Configuration" is DIM specific, then we need to have separate checks for mutually exclusive mods and
export const getLoadoutsThatCanBeOptimized = (
	params: GetLoadoutsThatCanBeOptimizedParams
): GetLoadoutsThatCanBeOptimizedOutputItem[] => {
	const result: GetLoadoutsThatCanBeOptimizedOutputItem[] = [];
	const {
		loadouts,
		armor,
		masterworkAssumption,
		allClassItemMetadata,
		progressCallback,
		availableExoticArmor,
		buggedAlternateSeasonModIdList,
	} = params;
	Object.values(loadouts).forEach((loadout) => {
		try {
			// throw new Error('test');
			const optimizationTypeList: ELoadoutOptimizationTypeId[] = [
				...loadout.optimizationTypeList,
			];
			const metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata = {
				maxPossibleDesiredStatTiers: getDefaultArmorStatMapping(),
				maxPossibleReservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				lowestCost: Infinity,
				currentCost: Infinity,
				lowestWastedStats: Infinity,
				currentWastedStats: Infinity,
				mutuallyExclusiveModGroups: [],
				unstackableModIdList: [],
				modPlacement: getDefaultModPlacements().placement,
				unusedModSlots: {},
			};

			// Don't even try to process without an exotic
			if (!loadout.exoticHash) {
				optimizationTypeList.push(ELoadoutOptimizationTypeId.NoExoticArmor);
				result.push({
					optimizationTypeList: optimizationTypeList,
					loadoutId: loadout.dlbGeneratedId,
				});
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: true,
					loadoutId: loadout.dlbGeneratedId,
					optimizationTypeList: optimizationTypeList,
					metadata: metadata,
				});
				return;
			}

			let hasBaseVariantModsResults = false;
			// DIM Loadouts will try to auto-correct any discounted mods from previous seasons
			// by replacing them with the full cost variants. Sometimes there is not enough
			// armor energy capacity to slot the full cost variants. We will check for both
			// the discounted and full cost variants to see if DIM can handle this or not.
			const armorSlotModsVariants: ArmorSlotModsVariants = [
				{
					armorSlotMods: ModVariantCheckTypeToModReplacerMapping[
						EModVariantCheckType.Base
					](loadout.armorSlotMods),
					modVariantCheckType: EModVariantCheckType.Base,
				},
			];

			const allLoadoutModsIdList = flattenMods(loadout);

			const loadoutSpecificBuggedAlternateSeasonModIdList =
				buggedAlternateSeasonModIdList.filter((x) =>
					allLoadoutModsIdList.includes(x)
				);

			const hasBuggedAlternateSeasonMod =
				loadoutSpecificBuggedAlternateSeasonModIdList.length > 0;

			const hasNonBuggedAlternateSeasonMod = allLoadoutModsIdList.some((x) => {
				const mod = getMod(x);
				return (
					mod.isArtifactMod &&
					mod.modCategoryId === EModCategoryId.AlternateSeasonalArtifact &&
					!ActiveSeasonArtifactModIdList.includes(x) &&
					!loadoutSpecificBuggedAlternateSeasonModIdList.includes(x)
				);
			});

			const _hasAlternateSeasonReducedCostVariantMods =
				hasAlternateSeasonReducedCostVariantMods(allLoadoutModsIdList);
			const _hasActiveSeasonReducedCostVariantMods =
				hasActiveSeasonReducedCostVariantMods(allLoadoutModsIdList);
			// The alternate check overrides the seasonal check
			// So don't even bother checking for seasonal loadouts if
			// the base variant mods contain alternate season reduced cost mods
			if (
				!_hasAlternateSeasonReducedCostVariantMods &&
				_hasActiveSeasonReducedCostVariantMods
			) {
				armorSlotModsVariants.push({
					armorSlotMods: ModVariantCheckTypeToModReplacerMapping[
						EModVariantCheckType.Seasonal
					](loadout.armorSlotMods),
					modVariantCheckType: EModVariantCheckType.Seasonal,
				});
			}

			const hasActiveSeasonArtifactModsWithNoFullCostVariant =
				ActiveSeasonArtifactModIdList.some(
					(x) =>
						allLoadoutModsIdList.includes(x) &&
						!reducedToNormalMod[getMod(x).hash]
				);

			for (let i = 0; i < armorSlotModsVariants.length; i++) {
				const { armorSlotMods, modVariantCheckType } = armorSlotModsVariants[i];

				const {
					preProcessedArmor,
					allClassItemMetadata: _allClassItemMetadata,
				} = generatePreProcessedArmor({
					armor,
					loadout,
					allClassItemMetadata,
					availableExoticArmor,
				});

				const fragmentArmorStatMapping = getArmorStatMappingFromFragments(
					loadout.fragmentIdList,
					loadout.destinyClassId
				);
				const validRaidModArmorSlotPlacements =
					getValidRaidModArmorSlotPlacements(armorSlotMods, loadout.raidMods);

				let allModsIdList = [...loadout.raidMods];
				ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
					allModsIdList = [...allModsIdList, ...armorSlotMods[armorSlotId]];
				});
				const modsArmorStatMapping = getArmorStatMappingFromMods(
					allModsIdList,
					loadout.destinyClassId
				);

				// TODO: Flesh out the non-default stuff like
				// raid mods, placements, armor slot mods,
				const doProcessArmorParams: DoProcessArmorParams = {
					masterworkAssumption,
					desiredArmorStats: loadout.desiredStatTiers,
					armorItems: preProcessedArmor,
					fragmentArmorStatMapping,
					modArmorStatMapping: modsArmorStatMapping,
					potentialRaidModArmorSlotPlacements: validRaidModArmorSlotPlacements,
					armorSlotMods,
					raidMods: loadout.raidMods.filter((x) => x !== null),
					intrinsicArmorPerkOrAttributeIds: loadout.hasHalloweenMask
						? [EIntrinsicArmorPerkOrAttributeId.HalloweenMask]
						: [],
					destinyClassId: loadout.destinyClassId,
					reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
					useZeroWastedStats: false,
					useBonusResilience: loadout.hasBonusResilienceOrnament,
					selectedExoticArmorItem: findAvailableExoticArmorItem(
						loadout.exoticHash,
						loadout.destinyClassId,
						availableExoticArmor
					),
					alwaysConsiderCollectionsRolls: false,
					allClassItemMetadata: _allClassItemMetadata,
					assumedStatValuesStatMapping: getDefaultArmorStatMapping(),
				};
				const sumOfCurrentStatModsCost = sumModCosts(loadout.armorStatMods);
				const processedArmor = doProcessArmor(doProcessArmorParams);
				let maxDiff = -1;

				const flattenedMods = flattenMods(loadout).map((x) => getMod(x));

				if (modVariantCheckType === EModVariantCheckType.Base) {
					hasBaseVariantModsResults = processedArmor.items.length > 0;

					metadata.maxPossibleDesiredStatTiers = {
						...processedArmor.maxPossibleDesiredStatTiers,
					};
					metadata.maxPossibleReservedArmorSlotEnergy = {
						...processedArmor.maxPossibleReservedArmorSlotEnergy,
					};
					const hasMissingArmor = loadout.armor.length < 5;
					let hasHigherStatTiers = false;
					let hasFewerWastedStats = false;
					let hasLowerCost = false;
					let hasUnusedModSlots = false;
					let hasUnmetDIMStatTierConstraints = false;
					let hasStatOver100 = false;
					let hasUnusedFragmentSlots = false;
					let hasUnmasterworkedArmor = false;
					let hasUnspecifiedAspect = false;
					let hasInvalidLoadoutConfiguration = false;
					let _hasMutuallyExclusiveMods = false;
					let _mutuallyExclusiveModGroups: string[] = [];
					let _hasUnstackableMods = false;
					let _unstackableModIdList: EModId[] = [];

					// In one loop find the lowest cost and lowest wasted stats
					processedArmor.items.forEach((x) => {
						if (x.metadata.totalModCost < metadata.lowestCost) {
							metadata.lowestCost = x.metadata.totalModCost;
						}
						if (x.metadata.wastedStats < metadata.lowestWastedStats) {
							metadata.lowestWastedStats = x.metadata.wastedStats;
						}
						// If this is the currently equipped set of armor, then we can use the mod placement
						if (
							!hasMissingArmor &&
							x.armorIdList.every((processedArmorId) =>
								loadout.armor.find((x) => x.id === processedArmorId)
							)
						) {
							metadata.modPlacement = x.modPlacement;
						}
					});

					ArmorStatIdList.forEach((armorStatId) => {
						const processedArmorVal =
							processedArmor.maxPossibleDesiredStatTiers[armorStatId];
						const existingVal = roundDown10(
							loadout.desiredStatTiers[armorStatId]
						);
						maxDiff = Math.max(
							maxDiff,
							processedArmorVal / 10 - existingVal / 10
						);
						if (maxDiff > 0) {
							hasHigherStatTiers = true;
						}
					});

					// // Pick the first valid placment as a placeholder
					// // We only use this for rendering armor slot mods
					// if (!modPlacement && processedArmor.items.length > 0) {
					// 	modPlacement = processedArmor.items[0].modPlacement;
					// }
					// TODO: Should this only be done on the first loop?
					metadata.currentCost = sumOfCurrentStatModsCost;
					hasLowerCost =
						maxDiff >= 0 && metadata.lowestCost < sumOfCurrentStatModsCost;

					const wastedStats = getWastedStats(loadout.achievedStats);
					metadata.currentWastedStats = wastedStats;
					hasFewerWastedStats = metadata.lowestWastedStats < wastedStats;

					const unusedModSlots = getUnusedModSlots({
						allModsIdList,
						maxPossibleReservedArmorSlotEnergy:
							metadata.maxPossibleReservedArmorSlotEnergy,
					});
					if (!isEmpty(unusedModSlots)) {
						metadata.unusedModSlots = { ...unusedModSlots };
						hasUnusedModSlots = true;
					}
					hasUnmetDIMStatTierConstraints =
						loadout.loadoutType === ELoadoutType.DIM &&
						ArmorStatIdList.some(
							(armorStatId) =>
								loadout.achievedStatTiers[armorStatId] <
								loadout.dimStatTierConstraints[armorStatId]
						);

					hasStatOver100 = Object.values(loadout.achievedStatTiers).some(
						(x) => x > 100
					);
					hasUnusedFragmentSlots =
						getFragmentSlots(loadout.aspectIdList) >
						loadout.fragmentIdList.length;

					hasUnmasterworkedArmor = loadout.armor.some((x) => !x.isMasterworked);
					hasUnspecifiedAspect = loadout.aspectIdList.length === 1;
					hasInvalidLoadoutConfiguration = processedArmor.items.length === 0;

					[_hasMutuallyExclusiveMods, _mutuallyExclusiveModGroups] =
						hasMutuallyExclusiveMods(flattenedMods);
					metadata.mutuallyExclusiveModGroups = _mutuallyExclusiveModGroups;

					[_hasUnstackableMods, _unstackableModIdList] =
						hasUnstackableMods(flattenedMods);
					metadata.unstackableModIdList = _unstackableModIdList;

					if (hasHigherStatTiers) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.HigherStatTiers
						);
					}
					if (hasLowerCost) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.LowerCost);
					}
					if (hasMissingArmor) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.MissingArmor);
					}
					if (hasStatOver100) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.WastedStatTiers);
					}
					if (hasUnusedFragmentSlots) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnusedFragmentSlots
						);
					}
					if (hasUnmetDIMStatTierConstraints) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnmetDIMStatConstraints
						);
					}
					if (hasUnmasterworkedArmor) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnmasterworkedArmor
						);
					}
					if (hasFewerWastedStats) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.FewerWastedStats
						);
					}
					if (hasUnspecifiedAspect) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnspecifiedAspect
						);
					}
					if (hasInvalidLoadoutConfiguration) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration
						);
					}
					if (_hasMutuallyExclusiveMods) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.MutuallyExclusiveMods
						);
					}
					if (_hasUnstackableMods) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnstackableMods
						);
					}
					if (hasUnusedModSlots) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.UnusedModSlots
						);
					}
					// Only add the unusable mods optimization type if we are sure that
					// the unusable mods aren't also bugged alternate season mods
					if (
						_hasAlternateSeasonReducedCostVariantMods &&
						hasNonBuggedAlternateSeasonMod
					) {
						optimizationTypeList.push(ELoadoutOptimizationTypeId.UnusableMods);
					}
					if (hasBuggedAlternateSeasonMod) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.BuggedAlternateSeasonMods
						);
					}
					if (hasActiveSeasonArtifactModsWithNoFullCostVariant) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.SeasonalMods
						);
					}
				} else if (modVariantCheckType === EModVariantCheckType.Seasonal) {
					const hasNoVariantSwapResults =
						hasBaseVariantModsResults && // The base check returned results
						processedArmor.items.length === 0; // We have no results on the second pass

					let hasCorrectableSeasonalMods = false;
					// DIM will auto-correct the loadout if it can
					// But in-game loadouts must be manually corrected
					if (loadout.loadoutType === ELoadoutType.InGame) {
						hasCorrectableSeasonalMods =
							!hasNoVariantSwapResults &&
							_hasActiveSeasonReducedCostVariantMods;
					}
					if (hasCorrectableSeasonalMods) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.DiscountedSeasonalModsCorrectable
						);
					}

					// Don't add both "HasSeasonalMods" and "HasSeasonalModsCorrectable"
					if (hasNoVariantSwapResults && !hasCorrectableSeasonalMods) {
						optimizationTypeList.push(
							ELoadoutOptimizationTypeId.DiscountedSeasonalMods
						);
					}
				}
			}

			const humanizedOptimizationTypes =
				humanizeOptimizationTypes(optimizationTypeList);

			// Do this to fake a high score
			// const humanizedOptimizationTypes = [];

			if (humanizedOptimizationTypes.length > 0) {
				result.push({
					optimizationTypeList: humanizedOptimizationTypes,
					loadoutId: loadout.dlbGeneratedId,
				});
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: true,
					loadoutId: loadout.dlbGeneratedId,
					optimizationTypeList: humanizedOptimizationTypes,
					metadata,
				});
				return;
			} else {
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: false,
					loadoutId: loadout.dlbGeneratedId,
					optimizationTypeList: [],
					metadata,
				});
				return;
			}
		} catch (e) {
			progressCallback({
				type: EGetLoadoutsThatCanBeOptimizedProgressType.Error,
				loadoutId: loadout.dlbGeneratedId,
				optimizationTypeList: [ELoadoutOptimizationTypeId.Error],
			});
		}
	});

	return result;
};

// Worker types
export enum EMessageType {
	Progress = 'progress',
	Results = 'results',
	Error = 'error',
}

export type Message = {
	type: EMessageType;
	payload:
	| GetLoadoutsThatCanBeOptimizedProgress
	| GetLoadoutsThatCanBeOptimizedOutputItem[]
	| Error;
};

export type Progress = {
	loadoutType: ELoadoutType;
};

export type PostMessageParams = Omit<
	GetLoadoutsThatCanBeOptimizedParams,
	'progressCallback'
>;

export interface GetLoadoutsThatCanBeOptimizedWorker
	extends Omit<Worker, 'postMessage'> {
	postMessage(data: PostMessageParams): void;
}

/* Just some notes here: 
- DIM Loadouts have a set class item. If we can still use that to achieve the same or higher stat tiers then we should.
	If that's not possible then c'est la vie. This can happen if the user gets an artifice class item or something.

*/
