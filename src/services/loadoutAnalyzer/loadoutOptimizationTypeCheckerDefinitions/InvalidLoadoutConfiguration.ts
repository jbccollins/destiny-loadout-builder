import { LoadoutOptimizationTypeChecker } from "@dlb/types/AnalyzableLoadout";

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const { hasResults } = params;
  return {
    meetsOptimizationCriteria: !hasResults,
    shortCircuit: false,
  }
}

export default checker;