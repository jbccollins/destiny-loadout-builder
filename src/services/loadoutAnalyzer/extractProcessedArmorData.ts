import { AnalyzableLoadout } from "@dlb/types/AnalyzableLoadout";
import { DoProcessArmorOutput } from "../processArmor";
import { getInitialMetadata } from "./analyzeLoadout2";
import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from "./loadoutAnalyzer";

type extractProcessedArmorDataParams = {
  processedArmor: DoProcessArmorOutput;
  loadout: AnalyzableLoadout;
}

type ExtractProcesedArmorOutput = {
  hasResults: boolean;
  metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata;
}

export default function extractProcessedArmorData(params: extractProcessedArmorDataParams): ExtractProcesedArmorOutput {
  const { processedArmor, loadout } = params;
  const hasResults = processedArmor.items.length > 0;
  const hasMissingArmor = loadout.armor.length < 5;

  const metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata = getInitialMetadata();

  metadata.maxPossibleDesiredStatTiers = {
    ...processedArmor.maxPossibleDesiredStatTiers,
  };
  metadata.maxPossibleReservedArmorSlotEnergy = {
    ...processedArmor.maxPossibleReservedArmorSlotEnergy,
  };

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

  return {
    hasResults,
    metadata,
  }

}