import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { loadout } = params;

	return {
		meetsOptimizationCriteria: loadout.armor.length < 5,
		shortCircuit: false,
	};
};

export default checker;
