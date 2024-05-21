import { EModVariantCheckType } from '@dlb/services/loadoutAnalyzer/helpers/types';
import { ELoadoutType, LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';
import { noMatchResult, usesBuggedAlternateSeasonMods } from './helpers';

// At this point in time the modIdList will have been "corrected" to only have the 
// full cost variants of every mod. We need to check if any of the full cost variants
// have a bugged reduced cost variant.
const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { loadout, variantHasResultsMapping } = params;


	// If DIM can correct this bugged mod then we don't want to surface this to the user
	if (loadout.loadoutType === ELoadoutType.DIM && variantHasResultsMapping[EModVariantCheckType.Seasonal]) {
		return noMatchResult;
	}

	const meetsOptimizationCriteria = usesBuggedAlternateSeasonMods(params)

	return {
		meetsOptimizationCriteria,
		shortCircuit: false,
	};
};

export default checker;
