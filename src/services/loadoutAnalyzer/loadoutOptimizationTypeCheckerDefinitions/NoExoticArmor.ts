import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { loadout } = params;

	return {
		meetsOptimizationCriteria: !loadout.exoticHash,
		shortCircuit: true,
	};
};

export default checker;
