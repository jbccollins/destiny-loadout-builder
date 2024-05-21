import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const { usesUnstackableMods } = params;
  return {
    meetsOptimizationCriteria: usesUnstackableMods,
    shortCircuit: false,
  };
};

export default checker;
