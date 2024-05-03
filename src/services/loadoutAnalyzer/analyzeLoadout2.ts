import { EModId } from "@dlb/generated/mod/EModId";
import { getDefaultArmorSlotEnergyMapping } from "@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice";
import { AnalyzableLoadout, ELoadoutOptimizationTypeId, LoadoutOptimizationTypeToLoadoutOptimizationMapping } from "@dlb/types/AnalyzableLoadout";
import { Armor, AvailableExoticArmor, DestinyClassToAllClassItemMetadataMapping } from "@dlb/types/Armor";
import { ArmorSlotWithClassItemIdList } from "@dlb/types/ArmorSlot";
import { getArmorStatMappingFromFragments, getArmorStatMappingFromMods, getDefaultArmorStatMapping } from "@dlb/types/ArmorStat";
import { EIntrinsicArmorPerkOrAttributeId, EMasterworkAssumption } from "@dlb/types/IdEnums";
import { getValidRaidModArmorSlotPlacements, hasActiveSeasonReducedCostVariantMods, hasAlternateSeasonReducedCostVariantMods, replaceAllReducedCostVariantMods } from "@dlb/types/Mod";
import { isEmpty } from "lodash";
import { DoProcessArmorParams, doProcessArmor } from "../processArmor";
import { getDefaultModPlacements } from "../processArmor/getModCombos";
import { sumModCosts } from "../processArmor/utils";
import extractProcessedArmorData from "./extractProcessedArmorData";
import { generatePreProcessedArmor } from "./generatePreProcessedArmor";
import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from "./loadoutAnalyzer";
import { findAvailableExoticArmorItem, flattenMods, unflattenMods } from "./utils";

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
      ELoadoutOptimizationTypeId.BuggedAlternateSeasonMod,
      ELoadoutOptimizationTypeId.StatsOver100,
      ELoadoutOptimizationTypeId.UnusedFragmentSlots,
      ELoadoutOptimizationTypeId.UnspecifiedAspect,
      ELoadoutOptimizationTypeId.UnmetDIMStatConstraints,
      ELoadoutOptimizationTypeId.UnusableMods,
      ELoadoutOptimizationTypeId.UnmasterworkedArmor,
      ELoadoutOptimizationTypeId.DeprecatedMods,
      ELoadoutOptimizationTypeId.MutuallyExclusiveMods,
      ELoadoutOptimizationTypeId.UnusedModSlots,
      ELoadoutOptimizationTypeId.HasSeasonalMods,
      ELoadoutOptimizationTypeId.HasDiscountedSeasonalMods,
      ELoadoutOptimizationTypeId.UnstackableMods,
    ],
    afterProcessing: [
      ELoadoutOptimizationTypeId.HigherStatTier,
      ELoadoutOptimizationTypeId.LowerCost,
      ELoadoutOptimizationTypeId.FewerWastedStats,
      ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration,
    ]
  },
  [EModVariantCheckType.Seasonal]: {

    beforeProcessing: [
      ELoadoutOptimizationTypeId.HasDiscountedSeasonalModsCorrectable,
      // Should UnmetDIMStatConstraints be here?
    ],
    afterProcessing: [
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

export const getInitialMetadata = (): GetLoadoutsThatCanBeOptimizedProgressMetadata => {
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
  const { loadout, armor, allClassItemMetadata, availableExoticArmor, masterworkAssumption } = params;

  let metadata = getInitialMetadata();

  const allLoadoutModsIdList = flattenMods(loadout);

  // TODO: Pull the variant creation logic out into a separate function

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

  const usesAlternateSeasonReducedCostVariantMods =
    hasAlternateSeasonReducedCostVariantMods(allLoadoutModsIdList);
  const usesActiveSeasonReducedCostVariantMods =
    hasActiveSeasonReducedCostVariantMods(allLoadoutModsIdList);
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

  const optimizationTypeIdList: ELoadoutOptimizationTypeId[] = [];
  armorSlotModsVariants.forEach(({ modIdList, modVariantCheckType }) => {
    const { armorSlotMods, armorStatMods, artificeModIdList, raidMods } = unflattenMods(modIdList)

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
        const result = checker({ ...params, loadout: _loadout, modIdList, metadata });
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

    const { hasResults, metadata: _metadata } = extractProcessedArmorData(
      {
        processedArmor,
        loadout,
      }
    );

    metadata = {
      ...metadata,
      ..._metadata,
    }

    const sumOfCurrentStatModsCost = sumModCosts(loadout.armorStatMods);


    doChecks(ModVariantCheckOrder[modVariantCheckType].afterProcessing)
  })

  return {
    optimizationTypeList: optimizationTypeIdList,
    metadata,
    canBeOptimized: !isEmpty(optimizationTypeIdList),
  }
}