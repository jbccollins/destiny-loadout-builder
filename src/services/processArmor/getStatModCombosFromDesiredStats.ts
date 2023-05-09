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
	ARTIFICE_MOD_BONUS_VALUE,
	MAX_POTENTIAL_STAT_BOOST,
	NUM_ARMOR_PIECES,
	NUM_POTENTIAL_ARTIFICER_PIECES,
} from '@dlb/utils/item-utils';
import { filterRedundantStatModCombos } from './filterRedundantModCombos';

export type StatModCombo = Record<EArmorStatId, GenericRequiredModCombo>;

export const getDefaultStatModCombo = (): StatModCombo => ({
	[EArmorStatId.Mobility]: null,
	[EArmorStatId.Resilience]: null,
	[EArmorStatId.Recovery]: null,
	[EArmorStatId.Discipline]: null,
	[EArmorStatId.Intellect]: null,
	[EArmorStatId.Strength]: null,
});

const getUnfilteredStatModCombos = (
	targetStatShortfalls: ArmorStatMapping,
	useZeroWastedStats = false
) => {
	const allGenericCombos: Record<EArmorStatId, GenericRequiredModCombo[]> = {
		[EArmorStatId.Mobility]: null,
		[EArmorStatId.Resilience]: null,
		[EArmorStatId.Recovery]: null,
		[EArmorStatId.Discipline]: null,
		[EArmorStatId.Intellect]: null,
		[EArmorStatId.Strength]: null,
	};
	for (let i = 0; i < ArmorStatIdList.length; i++) {
		const armorStatId = ArmorStatIdList[i];
		const targetStatShortfall = targetStatShortfalls[armorStatId];

		if (targetStatShortfall > 0) {
			let genericCombos: GenericRequiredModCombo[] = null;

			// Try adding +10 to the target stat until we get a result
			// This should only matter for specific zero wasted stats cases
			for (let i = targetStatShortfall; i < MAX_POTENTIAL_STAT_BOOST; i += 10) {
				genericCombos = getGenericModCombinations(i, useZeroWastedStats);
				if (genericCombos !== null) {
					break;
				}
			}

			if (genericCombos === null) {
				// Break immediately. This means that there is no way to achieve the target stats.
				return null;
			}
			allGenericCombos[armorStatId] = genericCombos;
		}
	}
	return allGenericCombos;
};

export type GetAllValidStatModCombosParams = {
	targetStatShortfalls: ArmorStatMapping;
	numAvailableArtificePieces: number;
	useZeroWastedStats?: boolean;
};
export const getAllValidStatModCombos = ({
	targetStatShortfalls,
	numAvailableArtificePieces,
	useZeroWastedStats = false,
}: GetAllValidStatModCombosParams) => {
	const unfilteredStatModCombos = getUnfilteredStatModCombos(
		targetStatShortfalls,
		useZeroWastedStats
	);

	if (unfilteredStatModCombos === null) {
		return null;
	}
	let result: StatModCombo[] = [];

	for (let i = 0; i < ArmorStatIdList.length; i++) {
		const armorStatId = ArmorStatIdList[i];
		const unfilteredStatModCombo = unfilteredStatModCombos[armorStatId];
		// If we don't need any mods for this stat, skip it
		if (!unfilteredStatModCombo) {
			continue;
		}
		// The first time we get here, we need to initialize the result
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
			continue;
		}
		const newResult: StatModCombo[] = [];
		result.forEach((establishedCombo) => {
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
		// If the result ever becomes empty, we know it's impossible to achieve the desired stats
		// so we can prune the search early
		if (newResult.length === 0) {
			return null;
		}
		// Prune as we go
		result = newResult;
	}
	return result; //filterRedundantStatModCombos(result);
};

const getGenericModCombinations = (
	value: number,
	useZeroWastedStats = false
): GenericRequiredModCombo[] => {
	return useZeroWastedStats
		? zeroWastedStatModCombinations[value]
		: paretoOptimalModCombinations[value];
};

type GetStatModCombosFromDesiredStatsParams = {
	currentStats: StatList;
	targetStats: ArmorStatMapping;
	numArtificeItems: number;
	useZeroWastedStats?: boolean;
};
export const getStatModCombosFromDesiredStats = (
	params: GetStatModCombosFromDesiredStatsParams
): StatModCombo[] => {
	const { currentStats, targetStats, numArtificeItems, useZeroWastedStats } =
		params;
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
	if (
		totalTargetStatShortfall >
		MAX_POTENTIAL_STAT_BOOST -
			(NUM_POTENTIAL_ARTIFICER_PIECES - numArtificeItems) *
				ARTIFICE_MOD_BONUS_VALUE
	) {
		return null;
	}
	// If we don't need any mods to hit our target value then return an empty array
	if (totalTargetStatShortfall === 0) {
		return [];
	}
	const allValidStatModCombos = getAllValidStatModCombos({
		targetStatShortfalls,
		numAvailableArtificePieces: numArtificeItems,
		useZeroWastedStats,
	});
	if (allValidStatModCombos === null) {
		return null;
	}
	return allValidStatModCombos.length > 0 ? allValidStatModCombos : null;
};
