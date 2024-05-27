import { EModId } from '@dlb/generated/mod/EModId';
import {
	LoadoutOptimziationTypeCheckerOutput,
	LoadoutOptimziationTypeCheckerParams,
} from '@dlb/types/AnalyzableLoadout';
import { getMod, getModByHash } from '@dlb/types/Mod';
import { normalToReducedMod } from '@dlb/utils/reduced-cost-mod-mapping';

export const noMatchResult: LoadoutOptimziationTypeCheckerOutput = {
	meetsOptimizationCriteria: false,
	shortCircuit: false,
};

export const usesBuggedAlternateSeasonMods = (
	params: LoadoutOptimziationTypeCheckerParams
): boolean => {
	const { buggedAlternateSeasonModIdList, modIdList } = params;

	const reducedCostVariantModIdList: EModId[] = [];
	modIdList.forEach((modId) => {
		const mod = getMod(modId);
		if (!mod) {
			return;
		}
		const reducedHash = normalToReducedMod[mod.hash];
		if (reducedHash) {
			const reducedMod = getModByHash(reducedHash);
			if (reducedMod) {
				reducedCostVariantModIdList.push(reducedMod.id);
			}
		}
	});

	// We still want to check if there are any bugged mods that don't have a reduced cost variant too
	const loadoutSpecificBuggedAlternateSeasonModIdList =
		buggedAlternateSeasonModIdList.filter(
			(x) => modIdList.includes(x) || reducedCostVariantModIdList.includes(x)
		);

	return loadoutSpecificBuggedAlternateSeasonModIdList.length > 0;
};
