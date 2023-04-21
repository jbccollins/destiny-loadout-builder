import { paretoOptimalModCombinations } from '@dlb/generated/modCombinations/paretoOptimalModCombinations';
import { zeroWastedStatModCombinations } from '@dlb/generated/modCombinations/zeroWastedStatModCombinations';
import { GenericRequiredModCombo } from '@dlb/scripts/generation/modCombinations/generateModCombinations';
import { StatList } from '@dlb/types/Armor';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStat,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import { EArmorStatId } from '@dlb/types/IdEnums';
import {
	MAX_POTENTIAL_STAT_BOOST,
	NUM_ARMOR_PIECES,
} from '@dlb/utils/item-utils';

export type StatModCombo = Record<EArmorStatId, GenericRequiredModCombo>;

const getDefaultStatModCombo = (): StatModCombo => ({
	[EArmorStatId.Mobility]: null,
	[EArmorStatId.Resilience]: null,
	[EArmorStatId.Recovery]: null,
	[EArmorStatId.Discipline]: null,
	[EArmorStatId.Intellect]: null,
	[EArmorStatId.Strength]: null,
});

const getUnfilteredStatModCombos = (targetStatShortfalls: ArmorStatMapping) => {
	const allGenericCombos: Record<EArmorStatId, GenericRequiredModCombo[]> = {
		[EArmorStatId.Mobility]: null,
		[EArmorStatId.Resilience]: null,
		[EArmorStatId.Recovery]: null,
		[EArmorStatId.Discipline]: null,
		[EArmorStatId.Intellect]: null,
		[EArmorStatId.Strength]: null,
	};
	ArmorStatIdList.forEach((armorStatId) => {
		const targetStatShortfall = targetStatShortfalls[armorStatId];
		if (targetStatShortfall > 0) {
			const genericCombos = getGenericModCombinations(targetStatShortfall);
			allGenericCombos[armorStatId] = genericCombos;
		}
	});
	return allGenericCombos;
};

const getAllValidStatModCombos = (
	targetStatShortfalls: ArmorStatMapping,
	numAvailableArtificePieces: number
) => {
	const unfilteredStatModCombos =
		getUnfilteredStatModCombos(targetStatShortfalls);
	let result: StatModCombo[] = [];
	ArmorStatIdList.forEach((armorStatId) => {
		const unfilteredStatModCombo = unfilteredStatModCombos[armorStatId];
		// If we don't need any mods for this stat, skip it
		if (!unfilteredStatModCombo) {
			return;
		}
		if (result.length === 0) {
			unfilteredStatModCombo.forEach((combo) => {
				// Skip combos with more artifice mods than we can slot
				if (combo.numArtificeMods > numAvailableArtificePieces) {
					return;
				}
				result.push({
					...getDefaultStatModCombo(),
					[armorStatId]: combo,
				});
			});
			return;
		}
		const newResult: StatModCombo[] = [];
		result.forEach((establishedCombo, i) => {
			let totalEstablishedStatMods = 0;
			let totalEstablishedArtificeMods = 0;
			ArmorStatIdList.forEach((armorStatId) => {
				if (!establishedCombo[armorStatId]) {
					return;
				}
				const { numMajorMods, numMinorMods, numArtificeMods } =
					establishedCombo[armorStatId];
				totalEstablishedStatMods += numMajorMods + numMinorMods;
				totalEstablishedArtificeMods += numArtificeMods;
			});
			unfilteredStatModCombo.forEach((potentialAddition) => {
				const { numMajorMods, numMinorMods, numArtificeMods } =
					potentialAddition;
				const newStatModCount =
					totalEstablishedStatMods + numMajorMods + numMinorMods;
				const newArtificeModCount =
					totalEstablishedArtificeMods + numArtificeMods;
				if (
					newStatModCount > NUM_ARMOR_PIECES ||
					newArtificeModCount > numAvailableArtificePieces
				) {
					return;
				}
				newResult.push({
					...establishedCombo,
					[armorStatId]: potentialAddition,
				});
			});
		});
		// Prune as we go
		result = newResult;
	});
	return result;
};

const getGenericModCombinations = (
	value: number,
	withZeroWastedStats = false
): GenericRequiredModCombo[] => {
	return withZeroWastedStats
		? zeroWastedStatModCombinations[value]
		: paretoOptimalModCombinations[value];
};

type GetStatModCombosFromDesiredStatsParams = {
	currentStats: StatList;
	targetStats: ArmorStatMapping;
	numArtificeItems: number;
};
export const getStatModCombosFromDesiredStats = (
	params: GetStatModCombosFromDesiredStatsParams
): StatModCombo[] => {
	const { currentStats, targetStats, numArtificeItems } = params;
	const targetStatShortfalls: ArmorStatMapping = getDefaultArmorStatMapping();
	let totalTargetStatShortfall = 0;
	ArmorStatIdList.forEach((armorStatId) => {
		const currentStat = currentStats[getArmorStat(armorStatId).index];
		const targetStat = targetStats[armorStatId];
		const shortFall = Math.max(targetStat - currentStat, 0);
		targetStatShortfalls[armorStatId] = shortFall;
		totalTargetStatShortfall += shortFall;
	});
	// If we can't possibly hit the target stats, return null
	if (totalTargetStatShortfall > MAX_POTENTIAL_STAT_BOOST) {
		return null;
	}
	// If we don't need any mods to hit our target value then return an empty array
	if (totalTargetStatShortfall === 0) {
		return [];
	}
	const allValidStatModCombos = getAllValidStatModCombos(
		targetStatShortfalls,
		numArtificeItems
	);
	return allValidStatModCombos.length > 0 ? allValidStatModCombos : null;
};
