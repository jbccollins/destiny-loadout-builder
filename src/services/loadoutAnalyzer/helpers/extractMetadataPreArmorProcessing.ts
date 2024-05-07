import { EModId } from "@dlb/generated/mod/EModId";
import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from "@dlb/services/loadoutAnalyzer/loadoutAnalyzer";
import { getWastedStats, sumModCosts } from "@dlb/services/processArmor/utils";
import { AnalyzableLoadout } from "@dlb/types/AnalyzableLoadout";
import { getMod, hasActiveSeasonReducedCostVariantMods, hasAlternateSeasonMods, hasAlternateSeasonReducedCostVariantMods, hasMutuallyExclusiveMods, hasNonBuggedAlternateSeasonMods } from "@dlb/types/Mod";
import { flattenMods, getInitialMetadata } from "./utils";

type ExtractProcessedArmorDataParams = {
  loadout: AnalyzableLoadout;
  buggedAlternateSeasonModIdList: EModId[];
}

type ExtractProcessedArmorDataOutput = {
  metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata,
  allLoadoutModsIdList: EModId[],
  usesAlternateSeasonReducedCostVariantMods: boolean,
  usesActiveSeasonReducedCostVariantMods: boolean,
  usesNonBuggedAlternateSeasonMods: boolean,
  usesBuggedAlternateSeasonMods: boolean,
  usesAlternateSeasonMods: boolean,
  usesMutuallyExclusiveMods: boolean,
};

export default function extractMetadataPreArmorProcessing(params: ExtractProcessedArmorDataParams): ExtractProcessedArmorDataOutput {
  const { loadout, buggedAlternateSeasonModIdList } = params;
  const metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata = getInitialMetadata();
  const allLoadoutModsIdList = flattenMods(loadout);
  const allModsIdList = allLoadoutModsIdList.map((x) => getMod(x));

  metadata.currentCost = sumModCosts(loadout.armorStatMods);
  const wastedStats = getWastedStats(loadout.achievedStats);
  metadata.currentWastedStats = wastedStats;

  const usesAlternateSeasonReducedCostVariantMods =
    hasAlternateSeasonReducedCostVariantMods(allLoadoutModsIdList);
  const usesActiveSeasonReducedCostVariantMods =
    hasActiveSeasonReducedCostVariantMods(allLoadoutModsIdList);

  const loadoutSpecificBuggedAlternateSeasonModIdList =
    buggedAlternateSeasonModIdList.filter((x) =>
      allLoadoutModsIdList.includes(x)
    );
  const usesNonBuggedAlternateSeasonMods = hasNonBuggedAlternateSeasonMods(allLoadoutModsIdList, loadoutSpecificBuggedAlternateSeasonModIdList);
  const usesBuggedAlternateSeasonMods =
    loadoutSpecificBuggedAlternateSeasonModIdList.length > 0;

  const usesAlternateSeasonMods = hasAlternateSeasonMods(allLoadoutModsIdList);

  const [usesMutuallyExclusiveMods, mutuallyExclusiveModGroups] =
    hasMutuallyExclusiveMods(allModsIdList);
  metadata.mutuallyExclusiveModGroups = mutuallyExclusiveModGroups;

  return {
    metadata,
    usesAlternateSeasonReducedCostVariantMods,
    usesActiveSeasonReducedCostVariantMods,
    allLoadoutModsIdList,
    usesNonBuggedAlternateSeasonMods,
    usesBuggedAlternateSeasonMods,
    usesAlternateSeasonMods,
    usesMutuallyExclusiveMods
  };
}