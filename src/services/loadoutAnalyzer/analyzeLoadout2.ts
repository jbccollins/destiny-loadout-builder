import { EModId } from "@dlb/generated/mod/EModId";
import { getDefaultArmorSlotEnergyMapping } from "@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice";
import { DoProcessArmorParams, doProcessArmor } from "@dlb/services/processArmor";
import { AnalyzableLoadout, ELoadoutOptimizationTypeId, LoadoutOptimizationTypeToLoadoutOptimizationMapping } from "@dlb/types/AnalyzableLoadout";
import { Armor, AvailableExoticArmor, DestinyClassToAllClassItemMetadataMapping } from "@dlb/types/Armor";
import { ArmorSlotWithClassItemIdList } from "@dlb/types/ArmorSlot";
import { getArmorStatMappingFromFragments, getArmorStatMappingFromMods, getDefaultArmorStatMapping } from "@dlb/types/ArmorStat";
import { EIntrinsicArmorPerkOrAttributeId, EMasterworkAssumption } from "@dlb/types/IdEnums";
import { getValidRaidModArmorSlotPlacements, replaceAllReducedCostVariantMods } from "@dlb/types/Mod";
import { cloneDeep, isEmpty } from "lodash";
import extractMetadataPostArmorProcessing from "./helpers/extractMetadataPostArmorProecessing";
import extractMetadataPreArmorProcessing from "./helpers/extractMetadataPreArmorProcessing";
import { generatePreProcessedArmor } from "./helpers/generatePreProcessedArmor";
import { findAvailableExoticArmorItem, unflattenMods } from "./helpers/utils";
import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from "./loadoutAnalyzer";

export enum EModVariantCheckType {
  Base = 'Base',
  Seasonal = 'Seasonal',
}

export type ModVariantCheckSplit = {
  beforeProcessing: ELoadoutOptimizationTypeId[];
  afterProcessing: ELoadoutOptimizationTypeId[];
}

// Order matters here for short-circuiting
export const ModVariantCheckOrder: Record<EModVariantCheckType, ModVariantCheckSplit> = {
  [EModVariantCheckType.Base]: {
    beforeProcessing: [
      ELoadoutOptimizationTypeId.NoExoticArmor,
      ELoadoutOptimizationTypeId.MissingArmor,
      ELoadoutOptimizationTypeId.BuggedAlternateSeasonMods,
      ELoadoutOptimizationTypeId.WastedStatTiers,
      ELoadoutOptimizationTypeId.UnusedFragmentSlots,
      ELoadoutOptimizationTypeId.UnspecifiedAspect,
      ELoadoutOptimizationTypeId.UnmetDIMStatConstraints,
      ELoadoutOptimizationTypeId.UnusableMods,
      ELoadoutOptimizationTypeId.UnmasterworkedArmor,
      ELoadoutOptimizationTypeId.DeprecatedMods,
      ELoadoutOptimizationTypeId.MutuallyExclusiveMods,
      ELoadoutOptimizationTypeId.UnusedModSlots,
      ELoadoutOptimizationTypeId.SeasonalMods,
      ELoadoutOptimizationTypeId.DiscountedSeasonalMods,
      ELoadoutOptimizationTypeId.UnstackableMods,
    ],
    afterProcessing: [
      ELoadoutOptimizationTypeId.HigherStatTiers,
      ELoadoutOptimizationTypeId.LowerCost,
      ELoadoutOptimizationTypeId.FewerWastedStats,
      ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration,
    ]
  },
  [EModVariantCheckType.Seasonal]: {
    beforeProcessing: [],
    afterProcessing: [
      ELoadoutOptimizationTypeId.DiscountedSeasonalModsCorrectable,
    ]
  },
}

export type ModReplacer = (
  modIdList: EModId[]
) => EModId[];

export const ModVariantCheckTypeToModReplacerMapping: Record<
  EModVariantCheckType,
  ModReplacer
> = {
  [EModVariantCheckType.Base]: (armorSlotMods) => armorSlotMods,
  [EModVariantCheckType.Seasonal]: replaceAllReducedCostVariantMods,
};

export type ModVariants = {
  modIdList: EModId[];
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



export default function analyzeLoadout(params: AnalyzeLoadoutParams): AnalyzeLoadoutResult {
  const { loadout, armor, allClassItemMetadata, availableExoticArmor, masterworkAssumption, buggedAlternateSeasonModIdList } = params;

  const {
    allLoadoutModsIdList,
    usesAlternateSeasonReducedCostVariantMods,
    usesActiveSeasonReducedCostVariantMods,
    usesAlternateSeasonMods,
    usesNonBuggedAlternateSeasonMods,
    usesBuggedAlternateSeasonMods,
    usesMutuallyExclusiveMods,
    ...rest
  } = extractMetadataPreArmorProcessing({
    loadout,
    buggedAlternateSeasonModIdList
  })

  let metadata = cloneDeep(rest.metadata);

  // DIM Loadouts will try to auto-correct any discounted mods from previous seasons
  // by replacing them with the full cost variants. Sometimes there is not enough
  // armor energy capacity to slot the full cost variants. We will check for both
  // the discounted and full cost variants to see if DIM can handle this or not.
  const armorSlotModsVariants: ModVariants = [
    {
      modIdList: ModVariantCheckTypeToModReplacerMapping[
        EModVariantCheckType.Base
      ](allLoadoutModsIdList),
      modVariantCheckType: EModVariantCheckType.Base,
    },
  ];

  // The alternate check overrides the seasonal check
  // So don't even bother checking for seasonal loadouts if
  // the base variant mods contain alternate season reduced cost mods
  if (
    !usesAlternateSeasonReducedCostVariantMods &&
    usesActiveSeasonReducedCostVariantMods
  ) {
    armorSlotModsVariants.push({
      modIdList: ModVariantCheckTypeToModReplacerMapping[
        EModVariantCheckType.Seasonal
      ](allLoadoutModsIdList),
      modVariantCheckType: EModVariantCheckType.Seasonal,
    });
  }

  const optimizationTypeIdList: ELoadoutOptimizationTypeId[] = [...loadout.optimizationTypeList];

  armorSlotModsVariants.forEach(({ modIdList, modVariantCheckType }) => {
    const { armorSlotMods, armorStatMods, artificeModIdList, raidMods } = unflattenMods(modIdList)
    let hasResults = false;
    let maxStatTierDiff = -Infinity;

    // Replace the mods in the loadout with the mods from the variant
    const _loadout: AnalyzableLoadout = {
      armorSlotMods,
      armorStatMods,
      artificeModIdList,
      raidMods,
      ...loadout,
    }

    const doChecks = (optimizationTypes: ELoadoutOptimizationTypeId[]): boolean => {
      let shortCircuit = false;
      for (const optimizationType of optimizationTypes) {
        const checker = LoadoutOptimizationTypeToLoadoutOptimizationMapping[optimizationType].checker;
        const result = checker({
          ...params,
          loadout: _loadout,
          modIdList,
          metadata,
          hasResults,
          maxStatTierDiff,
          usesAlternateSeasonMods,
          usesNonBuggedAlternateSeasonMods,
          usesBuggedAlternateSeasonMods,
          usesMutuallyExclusiveMods,
        });
        if (result.meetsOptimizationCriteria) {
          optimizationTypeIdList.push(optimizationType);
          if (result.shortCircuit) {
            shortCircuit = true;
            break;
          }
        }

      }
      return shortCircuit;
    }

    const shortCircuit = doChecks(ModVariantCheckOrder[modVariantCheckType].beforeProcessing)
    if (shortCircuit) {
      return {
        optimizationTypeList: optimizationTypeIdList,
        metadata,
        canBeOptimized: !isEmpty(optimizationTypeIdList),
      }
    }

    const {
      preProcessedArmor,
      allClassItemMetadata: _allClassItemMetadata,
    } = generatePreProcessedArmor({
      armor,
      loadout,
      allClassItemMetadata,
      availableExoticArmor,
    });

    // Collect any stats that are not directly provided by explicit stat mods
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
      fragmentArmorStatMapping: getArmorStatMappingFromFragments(
        loadout.fragmentIdList,
        loadout.destinyClassId
      ),
      modArmorStatMapping,
      potentialRaidModArmorSlotPlacements: getValidRaidModArmorSlotPlacements(armorSlotMods, loadout.raidMods),
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

    const processedArmor = doProcessArmor(doProcessArmorParams);

    const postProcessingData = extractMetadataPostArmorProcessing(
      {
        processedArmor,
        loadout,
        preArmorProcessingMetadata: metadata,
      }
    );

    hasResults = postProcessingData.hasResults;
    maxStatTierDiff = postProcessingData.maxStatTierDiff;

    metadata = cloneDeep(postProcessingData.metadata);

    doChecks(ModVariantCheckOrder[modVariantCheckType].afterProcessing)
  })

  return {
    optimizationTypeList: optimizationTypeIdList,
    metadata,
    canBeOptimized: !isEmpty(optimizationTypeIdList),
  }
}