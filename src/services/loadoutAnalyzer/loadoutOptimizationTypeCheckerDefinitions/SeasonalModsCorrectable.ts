import {
	ELoadoutType,
	LoadoutOptimizationTypeChecker,
} from '@dlb/types/AnalyzableLoadout';
import { ELoadoutVariantCheckType } from '../helpers/types';

const checker: LoadoutOptimizationTypeChecker = (params) => {
	const {
		variantHasResultsMapping,
		loadout,
		usesActiveSeasonArtifactModsWithNoFullCostVariant,
		usesActiveSeasonReducedCostArtifactMods,
		usesAlternateSeasonArtifactMods,
	} = params;

	// DIM will auto-correct loadouts that are correctable so
	// we don't need to surface this to the user.
	// And if there are active seasonal mods that don't have a full cost variant
	// then neither DIM nor the user can correct that so we also don't need to surface that.
	// If the loadout has alternate season artifact mods then it is just so much worse
	// than using current seasonal mods so we just don't even care.
	if (
		loadout.loadoutType === ELoadoutType.DIM ||
		usesActiveSeasonArtifactModsWithNoFullCostVariant ||
		usesAlternateSeasonArtifactMods
	) {
		return {
			meetsOptimizationCriteria: false,
			shortCircuit: false,
		};
	}

	const meetsOptimizationCriteria =
		usesActiveSeasonReducedCostArtifactMods &&
		variantHasResultsMapping[ELoadoutVariantCheckType.SeasonalMods];

	return {
		meetsOptimizationCriteria,
		shortCircuit: false,
	};
};

export default checker;
