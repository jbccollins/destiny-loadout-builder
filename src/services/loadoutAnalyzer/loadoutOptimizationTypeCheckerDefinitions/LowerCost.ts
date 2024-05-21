import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { maxStatTierDiff, metadata } = params;
	return {
		meetsOptimizationCriteria:
			maxStatTierDiff >= 0 && metadata.lowestCost < metadata.currentCost,
		shortCircuit: false,
	};
};

export default checker;
