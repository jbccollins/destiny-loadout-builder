import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { loadout } = params;

	return {
		meetsOptimizationCriteria: loadout.aspectIdList.length === 1,
		shortCircuit: false,
	};
};

export default checker;
