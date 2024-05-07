import { LoadoutOptimizationTypeChecker } from "@dlb/types/AnalyzableLoadout";

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const { loadout } = params;

  const meetsOptimizationCriteria = loadout.armor.some((x) => !x.isMasterworked);
  return {
    meetsOptimizationCriteria,
    shortCircuit: false,
  }
}

export default checker;