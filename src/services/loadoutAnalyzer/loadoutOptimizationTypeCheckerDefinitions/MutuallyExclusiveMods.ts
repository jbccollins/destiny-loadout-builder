import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { usesMutuallyExclusiveMods } = params;
	const meetsOptimizationCriteria = usesMutuallyExclusiveMods;
	return {
		meetsOptimizationCriteria,
		shortCircuit: false,
	};
};

export default checker;
