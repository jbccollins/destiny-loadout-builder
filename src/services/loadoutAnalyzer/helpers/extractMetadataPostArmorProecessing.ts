import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from "@dlb/services/loadoutAnalyzer/loadoutAnalyzer";
import { DoProcessArmorOutput } from "@dlb/services/processArmor";
import { roundDown10 } from "@dlb/services/processArmor/utils";
import { AnalyzableLoadout } from "@dlb/types/AnalyzableLoadout";
import { ArmorStatIdList } from "@dlb/types/ArmorStat";
import { cloneDeep } from "lodash";

type extractProcessedArmorDataParams = {
  processedArmor: DoProcessArmorOutput;
  loadout: AnalyzableLoadout;
  preArmorProcessingMetadata: GetLoadoutsThatCanBeOptimizedProgressMetadata;
}

type ExtractProcesedArmorOutput = {
  metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata;
  hasResults: boolean;
  maxStatTierDiff: number;
}

export default function extractMetadataPostArmorProcessing(params: extractProcessedArmorDataParams): ExtractProcesedArmorOutput {
  const { processedArmor, loadout, preArmorProcessingMetadata } = params;
  const hasResults = processedArmor.items.length > 0;
  const hasMissingArmor = loadout.armor.length < 5;

  const metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata = cloneDeep(preArmorProcessingMetadata);

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

  let maxDiff = -Infinity;
  for (const armorStatId of ArmorStatIdList) {
    const processedArmorVal =
      processedArmor.maxPossibleDesiredStatTiers[armorStatId];
    const existingVal = roundDown10(
      loadout.desiredStatTiers[armorStatId]
    );
    maxDiff = Math.max(
      maxDiff,
      processedArmorVal / 10 - existingVal / 10
    );
  }

  // metadata.maxStatTierDiff = maxDiff >= 0 ? maxDiff : -Infinity;
  const maxStatTierDiff = maxDiff >= 0 ? maxDiff : -Infinity;

  return {
    metadata,
    hasResults,
    maxStatTierDiff
  }

}