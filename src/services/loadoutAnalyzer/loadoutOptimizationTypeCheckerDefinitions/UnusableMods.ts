import { LoadoutOptimizationTypeChecker } from "@dlb/types/AnalyzableLoadout";

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const { usesAlternateSeasonMods, usesNonBuggedAlternateSeasonMods } = params;
  const meetsOptimizationCriteria = usesAlternateSeasonMods && usesNonBuggedAlternateSeasonMods;
  return {
    meetsOptimizationCriteria,
    shortCircuit: false,
  }
}

export default checker;