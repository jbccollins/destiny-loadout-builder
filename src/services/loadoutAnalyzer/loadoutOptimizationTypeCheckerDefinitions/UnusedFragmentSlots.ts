import { getFragmentSlots } from '@dlb/services/loadoutAnalyzer/helpers/utils';
import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { loadout } = params;

	const meetsOptimizationCriteria =
		getFragmentSlots(loadout.aspectIdList) > loadout.fragmentIdList.length;

	return {
		meetsOptimizationCriteria,
		shortCircuit: false,
	};
};

export default checker;
