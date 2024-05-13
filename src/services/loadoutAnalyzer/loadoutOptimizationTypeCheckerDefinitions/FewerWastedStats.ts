import { LoadoutOptimizationTypeChecker } from "@dlb/types/AnalyzableLoadout";

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const { metadata } = params;

  return {
    meetsOptimizationCriteria: metadata.lowestWastedStats < metadata.currentWastedStats,
    shortCircuit: false,
  }
}

export default checker;