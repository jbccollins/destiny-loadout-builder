import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { buggedAlternateSeasonModIdList, modIdList } = params;

	const loadoutSpecificBuggedAlternateSeasonModIdList =
		buggedAlternateSeasonModIdList.filter((x) => modIdList.includes(x));

	return {
		meetsOptimizationCriteria:
			loadoutSpecificBuggedAlternateSeasonModIdList.length > 0,
		shortCircuit: false,
	};
};

export default checker;
