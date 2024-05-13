import { EModId } from "@dlb/generated/mod/EModId";
import { DoProcessArmorOutput } from "@dlb/services/processArmor";
import { roundDown10 } from "@dlb/services/processArmor/utils";
import { AnalyzableLoadout } from "@dlb/types/AnalyzableLoadout";
import { ArmorStatIdList } from "@dlb/types/ArmorStat";
import { cloneDeep, isEmpty } from "lodash";
import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from "./types";
import { getUnusedModSlots } from "./utils";

export type PostProcessingInfo = {
  hasResults: boolean;
  maxStatTierDiff: number;
  hasUnusedModSlots: boolean;
}

export const getDefaultPostArmorProcessingInfo = (): PostProcessingInfo => ({
  hasResults: false,
  maxStatTierDiff: -Infinity,
  hasUnusedModSlots: false,
})

type ExtractMetadataPostArmorProcessingParams = {
  processedArmor: DoProcessArmorOutput;
  loadout: AnalyzableLoadout;
  preArmorProcessingMetadata: GetLoadoutsThatCanBeOptimizedProgressMetadata;
  modIdList: EModId[];
}

type ExtractMetadataPostArmorProcessingOutput = {
  metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata;
  info: PostProcessingInfo;
}

export default function extractMetadataPostArmorProcessing(params: ExtractMetadataPostArmorProcessingParams): ExtractMetadataPostArmorProcessingOutput {
  const { processedArmor, loadout, preArmorProcessingMetadata, modIdList } = params;
  const hasResults = processedArmor.items.length > 0;
  const hasMissingArmor = loadout.armor.length < 5;

  const metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata = cloneDeep(preArmorProcessingMetadata);
  const info: PostProcessingInfo = {
    hasResults,
    maxStatTierDiff: -Infinity,
    hasUnusedModSlots: false
  }

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
  info.maxStatTierDiff = maxDiff >= 0 ? maxDiff : -Infinity;

  const unusedModSlots = getUnusedModSlots({
    modIdList,
    maxPossibleReservedArmorSlotEnergy:
      metadata.maxPossibleReservedArmorSlotEnergy,
  });

  if (!isEmpty(unusedModSlots)) {
    metadata.unusedModSlots = { ...unusedModSlots };
    info.hasUnusedModSlots = true;
  }

  return {
    metadata,
    info,
  }
}