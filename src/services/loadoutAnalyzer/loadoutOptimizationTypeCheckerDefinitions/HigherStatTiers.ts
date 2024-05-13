import { LoadoutOptimizationTypeChecker } from "@dlb/types/AnalyzableLoadout";

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const { maxStatTierDiff } = params;
  return {
    meetsOptimizationCriteria: maxStatTierDiff > 0,
    shortCircuit: false,
  }
}

export default checker;