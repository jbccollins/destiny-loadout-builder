import { EModId } from '@dlb/generated/mod/EModId';
import { EModVariantCheckType } from '@dlb/services/loadoutAnalyzer/helpers/types';
import { ELoadoutType, LoadoutOptimizationTypeChecker } from '@dlb/types/AnalyzableLoadout';
import { getMod, getModByHash } from '@dlb/types/Mod';
import { normalToReducedMod } from '@dlb/utils/reduced-cost-mod-mapping';

// At this point in time the modIdList will have been "corrected" to only have the 
// full cost variants of every mod. We need to check if any of the full cost variants
// have a bugged reduced cost variant.
const checker: LoadoutOptimizationTypeChecker = (params) => {
	const { buggedAlternateSeasonModIdList, modIdList, loadout, variantHasResultsMapping } = params;

	const reducedCostVariantModIdList: EModId[] = []
	modIdList.forEach(modId => {
		const mod = getMod(modId)
		if (!mod) {
			return;
		}
		const reducedHash = normalToReducedMod[mod.hash]
		if (reducedHash) {
			const reducedMod = getModByHash(reducedHash)
			if (reducedMod) {
				reducedCostVariantModIdList.push(reducedMod.id)
			}
		}
	})

	// We still want to check if there are any bugged mods that don't have a reduced cost variant too
	const loadoutSpecificBuggedAlternateSeasonModIdList =
		buggedAlternateSeasonModIdList.filter((x) => modIdList.includes(x) || reducedCostVariantModIdList.includes(x));

	let meetsOptimizationCriteria = loadoutSpecificBuggedAlternateSeasonModIdList.length > 0;

	// If DIM can correct this bugged mod then we don't want to surface this to the user
	if (loadout.loadoutType === ELoadoutType.DIM && variantHasResultsMapping[EModVariantCheckType.Seasonal]) {
		meetsOptimizationCriteria = false;
	}

	return {
		meetsOptimizationCriteria,
		shortCircuit: false,
	};
};

export default checker;
