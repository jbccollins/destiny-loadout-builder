import { ELoadoutVariantCheckType } from '@dlb/services/loadoutAnalyzer/helpers/types';
import {
	ELoadoutType,
	LoadoutOptimizationTypeChecker,
} from '@dlb/types/AnalyzableLoadout';
import { noMatchResult } from './helpers';

const positiveCase = {
	meetsOptimizationCriteria: true,
	shortCircuit: false,
};

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const {
		usesActiveSeasonArtifactModsWithNoFullCostVariant,
		variantHasResultsMapping,
		usesActiveSeasonReducedCostArtifactMods,
		usesAlternateSeasonNonBuggedArtifactMods,
		loadout,
	} = params;

	// If a loadout uses alternate season artifact mods then that is just so much worse
	// than using current seasonal mods so we just don't even care.
	if (usesAlternateSeasonNonBuggedArtifactMods) {
		return noMatchResult;
	}

	if (usesActiveSeasonArtifactModsWithNoFullCostVariant) {
		return positiveCase;
	}

	if (usesActiveSeasonReducedCostArtifactMods) {
		// DIM will automatically correct this for the user once the season expires so
		// we don't want to trigger a false positive on this one.
		if (
			loadout.loadoutType === ELoadoutType.DIM &&
			variantHasResultsMapping[ELoadoutVariantCheckType.SeasonalMods]
		) {
			return noMatchResult;
		}
		return positiveCase;
	}

	return noMatchResult;
};

export default checker;
