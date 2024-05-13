import { LoadoutOptimizationTypeChecker } from "@dlb/types/AnalyzableLoadout";

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const { hasUnusedModSlots } = params;

  const meetsOptimizationCriteria = hasUnusedModSlots;

  return {
    meetsOptimizationCriteria,
    shortCircuit: false,
  }
}

export default checker;