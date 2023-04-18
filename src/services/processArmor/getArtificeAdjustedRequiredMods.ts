import { EModId } from '@dlb/generated/mod/EModId';
import {
	ArmorStatMapping,
	getArmorStatMappingFromMods,
	sumArmorStatMappings,
} from '@dlb/types/ArmorStat';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { MajorStatModIdList } from '@dlb/types/Mod';
import combinations from '@dlb/utils/combinations';
import { isEqual, uniqWith } from 'lodash';
import { getRequiredArtificeModIdList } from './getRequiredArtificeModIdList';
import { StatModCombo } from './getAllStatModCombos';
import { extrapolateMajorModsIntoMinorMods } from './extrapolateMajorModsIntoMinorMods';

export const getArtificeAdjustedRequiredMods = (
	armorStatModIdList: EModId[],
	destinyClassId: EDestinyClassId,
	desiredArmorStats: ArmorStatMapping,
	baseArmorStatMapping: ArmorStatMapping,
	numArtificeItems: number
): StatModCombo[] => {
	const results: StatModCombo[] = [];
	if (numArtificeItems === 0) {
		return results;
	}
	// TODO: This is an upper bound. With 5 major and 4 minor and 4 artifice pieces
	// it's possible to potentially be able to replace all four minor mods with artifice mods.
	// Constrain this further.
	if (armorStatModIdList.length > 9) {
		return results;
	}

	// We know that at least 2 artifice mods are required to replace 1 major mod
	const numPotentiallyReplaceableMajorMods = Math.floor(numArtificeItems / 2);
	const majorMods = armorStatModIdList.filter((modId) =>
		MajorStatModIdList.includes(modId)
	);
	// We can use 5 mod slots for major mods if needed
	// If we need more than 5 major mods then this is impossible
	if (majorMods.length - 5 > numPotentiallyReplaceableMajorMods) {
		return results;
	}

	// TODO: This is super inefficient and slow :(
	// Find the biggest size combinations we can make given
	// that we have a maximum of 5 armor pieces
	const combinationSize = Math.min(armorStatModIdList.length, 5);
	const combos = combinations(armorStatModIdList, combinationSize);
	// Make sure we check the case where we can achieve the desired stats
	// with only artifice mods.
	if (combos.length === 0) {
		combos.push([]);
	}
	for (let i = 0; i < combos.length; i++) {
		const combo = combos[i];
		const combotStatMapping = getArmorStatMappingFromMods(
			combo,
			destinyClassId
		);
		const requiredArtificeModIdList = getRequiredArtificeModIdList({
			desiredArmorStats,
			totalArmorStatMapping: sumArmorStatMappings([
				combotStatMapping,
				baseArmorStatMapping,
			]),
		});
		const numUnusedArtificeMods =
			numArtificeItems - requiredArtificeModIdList.length;

		// If we need more artifice mods than we have then this is impossible
		if (numUnusedArtificeMods < 0) {
			continue;
		}

		const result: StatModCombo = {
			armorStatModIdList: combo,
			artificeModIdList: requiredArtificeModIdList,
		};

		// Check if we can replace any major mods with two minor mods
		const extrapolatedResults = extrapolateMajorModsIntoMinorMods(
			[result],
			destinyClassId
		);

		extrapolatedResults.forEach((extrapolatedResult) => {
			results.push(extrapolatedResult);
		});

		// We now need to check if it's possible to achieve the desired stats with
		// fewer armor stat mods, but more artifice mods, for each extrapolated combo
		if (numUnusedArtificeMods > 0) {
			// TODO: I think this recursiveCombinationSize thing will create duplicate results.
			// These will be removed by the uniqWith but it's still not ideal.
			extrapolatedResults.forEach((extrapolatedResult) => {
				const recursiveCombinationSize =
					extrapolatedResult.armorStatModIdList.length - 1;
				const recursiveCombos = combinations(
					extrapolatedResult.armorStatModIdList,
					recursiveCombinationSize
				);
				// Check the case where we can achieve the desired stats
				// with only artifice mods.
				if (recursiveCombos.length === 0 && armorStatModIdList.length > 0) {
					recursiveCombos.push([]);
				}
				recursiveCombos.forEach((recursiveCombo) => {
					const recursiveResults = getArtificeAdjustedRequiredMods(
						recursiveCombo,
						destinyClassId,
						desiredArmorStats,
						baseArmorStatMapping,
						numArtificeItems
					);
					recursiveResults.forEach((result) => results.push(result));
				});
			});
		}
	}
	// This uniqWith is necessary because we may have created duplicate results
	// If it's possible to replace a major mod with two artifice mods then it will
	// also be possible to replace the extrapolated major mod with two artifice mods
	return uniqWith(results, isEqual);
};
