import { LoadoutOptimizationTypeChecker } from "@dlb/types/AnalyzableLoadout";

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const { loadout } = params;

  const meetsOptimizationCriteria = Object.values(loadout.achievedStatTiers).some(
    (x) => x >= 110
  );
  return {
    meetsOptimizationCriteria,
    shortCircuit: false,
  }
}

export default checker;