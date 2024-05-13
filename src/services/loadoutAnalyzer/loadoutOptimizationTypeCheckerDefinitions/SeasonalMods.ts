import { ELoadoutType, LoadoutOptimizationTypeChecker } from "@dlb/types/AnalyzableLoadout";
import { EModVariantCheckType } from "../helpers/types";

const negativeCase = {
  meetsOptimizationCriteria: false,
  shortCircuit: false
}

const positiveCase = {
  meetsOptimizationCriteria: true,
  shortCircuit: false
}

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const {
    usesActiveSeasonArtifactModsWithNoFullCostVariant,
    variantHasResultsMapping,
    usesActiveSeasonReducedCostArtifactMods,
    usesAlternateSeasonArtifactMods,
    loadout,
  } = params;

  // If a loadout uses alternate season artifact mods then that is just so much worse
  // than using current seasonal mods so we just don't even care.
  if (usesAlternateSeasonArtifactMods) {
    return negativeCase
  }

  if (usesActiveSeasonArtifactModsWithNoFullCostVariant) {
    return positiveCase
  }

  if (usesActiveSeasonReducedCostArtifactMods) {
    // DIM will automatically correct this for the user once the season expires so
    // we don't want to trigger a false positive on this one.
    if (loadout.loadoutType === ELoadoutType.DIM && variantHasResultsMapping[EModVariantCheckType.Seasonal]) {
      return negativeCase;
    }
    return positiveCase;
  }

  return negativeCase;
}

export default checker;