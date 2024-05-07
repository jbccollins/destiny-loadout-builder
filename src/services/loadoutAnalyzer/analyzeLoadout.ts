import { EModId } from "@dlb/generated/mod/EModId";
import { getDefaultArmorSlotEnergyMapping } from "@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice";
import { AnalyzableLoadout, ELoadoutOptimizationTypeId, ELoadoutType, humanizeOptimizationTypes } from "@dlb/types/AnalyzableLoadout";
import { Armor, AvailableExoticArmor, DestinyClassToAllClassItemMetadataMapping } from "@dlb/types/Armor";
import { ArmorSlotWithClassItemIdList } from "@dlb/types/ArmorSlot";
import { ArmorStatIdList, getArmorStatMappingFromFragments, getArmorStatMappingFromMods, getDefaultArmorStatMapping } from "@dlb/types/ArmorStat";
import { EIntrinsicArmorPerkOrAttributeId, EMasterworkAssumption, EModCategoryId } from "@dlb/types/IdEnums";
import { ArmorSlotIdToModIdListMapping, getMod, getValidRaidModArmorSlotPlacements, hasActiveSeasonReducedCostVariantMods, hasAlternateSeasonReducedCostVariantMods, hasMutuallyExclusiveMods, hasUnstackableMods, replaceAllReducedCostVariantMods } from "@dlb/types/Mod";
import { ActiveSeasonArtifactModIdList } from "@dlb/types/ModCategory";
import { reducedToNormalMod } from "@dlb/utils/reduced-cost-mod-mapping";
import { isEmpty } from "lodash";
import { DoProcessArmorParams, doProcessArmor } from "../processArmor";
import { getDefaultModPlacements } from "../processArmor/getModCombos";
import { getWastedStats, roundDown10, sumModCosts } from "../processArmor/utils";
import { generatePreProcessedArmor } from "./helpers/generatePreProcessedArmor";
import { findAvailableExoticArmorItem, flattenMods, getFragmentSlots, getUnusedModSlots } from "./helpers/utils";
import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from "./loadoutAnalyzer";

export enum EModVariantCheckType {
  Base = 'Base',
  Seasonal = 'Seasonal',
}

export type ModReplacer = (
  armorSlotMods: ArmorSlotIdToModIdListMapping
) => ArmorSlotIdToModIdListMapping;

export const ModVariantCheckTypeToModReplacerMapping: Record<
  EModVariantCheckType,
  ModReplacer
> = {
  [EModVariantCheckType.Base]: (armorSlotMods) => armorSlotMods,
  [EModVariantCheckType.Seasonal]: replaceAllReducedCostVariantMods,
};

export type ArmorSlotModsVariants = {
  armorSlotMods: ArmorSlotIdToModIdListMapping;
  modVariantCheckType: EModVariantCheckType;
}[];

export type AnalyzeLoadoutParams = {
  armor: Armor;
  masterworkAssumption: EMasterworkAssumption;
  allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
  availableExoticArmor: AvailableExoticArmor;
  buggedAlternateSeasonModIdList: EModId[];
  loadout: AnalyzableLoadout;
}

export type AnalyzeLoadoutResult = {
  optimizationTypeList: ELoadoutOptimizationTypeId[];
  metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata;
  canBeOptimized: boolean;
}

export const getBaseGetLoadoutsThatCanBeOptimizedProgressMetadata = (): GetLoadoutsThatCanBeOptimizedProgressMetadata => {
  return ({
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
  })
}

export default function analyzeLoadout(params: AnalyzeLoadoutParams): AnalyzeLoadoutResult {
  const { armor, masterworkAssumption, allClassItemMetadata, availableExoticArmor, buggedAlternateSeasonModIdList, loadout } = params;
  const optimizationTypeList: ELoadoutOptimizationTypeId[] = [
    ...loadout.optimizationTypeList,
  ];
  const metadata = getBaseGetLoadoutsThatCanBeOptimizedProgressMetadata();

  // Don't even try to process without an exotic
  // TOOD: This should only trigger if there are 5 legendary pieces. If there are less than
  // five then we should use the "MissingArmor" optimization type... actually.....
  // both should trigger in the case where there are <5 total pieces and a missing exotic
  if (!loadout.exoticHash) {
    optimizationTypeList.push(ELoadoutOptimizationTypeId.NoExoticArmor);
    return {
      optimizationTypeList,
      metadata,
      canBeOptimized: true
    };
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
    const potentialRaidModArmorSlotPlacements =
      getValidRaidModArmorSlotPlacements(armorSlotMods, loadout.raidMods);

    let allNonStatModsIdList = [...loadout.raidMods];
    ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
      allNonStatModsIdList = [...allNonStatModsIdList, ...armorSlotMods[armorSlotId]];
    });
    const modArmorStatMapping = getArmorStatMappingFromMods(
      allNonStatModsIdList,
      loadout.destinyClassId
    );

    // TODO: Flesh out the non-default stuff like
    // raid mods, placements, armor slot mods,
    const doProcessArmorParams: DoProcessArmorParams = {
      masterworkAssumption,
      desiredArmorStats: loadout.desiredStatTiers,
      armorItems: preProcessedArmor,
      fragmentArmorStatMapping,
      modArmorStatMapping,
      potentialRaidModArmorSlotPlacements,
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
        allModsIdList: allNonStatModsIdList,
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
    return {
      optimizationTypeList: humanizedOptimizationTypes,
      metadata,
      canBeOptimized: true
    };
  } else {
    return {
      optimizationTypeList: [],
      metadata,
      canBeOptimized: false
    };
  }
}