import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';
import lowerCostChecker from './LowerCost';

const checker: LoadoutOptimizationTypeChecker = (params) => {
  const meetsOptimizationCriteria = lowerCostChecker(params).meetsOptimizationCriteria;
  return {
    meetsOptimizationCriteria,
    shortCircuit: false,
    metadataOverrides: meetsOptimizationCriteria ? {
      lowestExoticArtificeCost: params.metadata.lowestCost
    } : {}
  };
};

export default checker;