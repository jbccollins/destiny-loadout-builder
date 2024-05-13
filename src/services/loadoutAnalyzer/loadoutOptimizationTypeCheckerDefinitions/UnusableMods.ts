import { LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const {
		usesAlternateSeasonArtifactMods,
		usesAlternateSeasonNonBuggedArtifactMods,
	} = params;
	const meetsOptimizationCriteria =
		usesAlternateSeasonArtifactMods && usesAlternateSeasonNonBuggedArtifactMods;
	return {
		meetsOptimizationCriteria,
		shortCircuit: false,
	};
};

export default checker;
