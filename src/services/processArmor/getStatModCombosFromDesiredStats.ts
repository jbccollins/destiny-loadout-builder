import { paretoOptimalModCombinations } from '@dlb/generated/modCombinations/paretoOptimalModCombinations';
import { zeroWastedStatModCombinations } from '@dlb/generated/modCombinations/zeroWastedStatModCombinations';
import { GenericRequiredModCombo } from '@dlb/scripts/generation/modCombinations/generateModCombinations';
import { StatList } from '@dlb/types/Armor';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStat,
	getArmorStatModSpitFromArmorStatId,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import { EArmorStatId } from '@dlb/types/IdEnums';
import { getMod } from '@dlb/types/Mod';
import {
	ARTIFICE_MOD_BONUS_VALUE,
	MAX_POTENTIAL_STAT_BOOST,
	NUM_ARMOR_PIECES
} from '@dlb/utils/item-utils';
import { roundUp10 } from './utils';

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
	useZeroWastedStats: boolean,
	totalTargetStatShortfall: number,
	numArtificeItems: number,
	currentStats: StatList
) => {
	const allGenericCombos: Record<EArmorStatId, GenericRequiredModCombo[]> = {
		[EArmorStatId.Mobility]: null,
		[EArmorStatId.Resilience]: null,
		[EArmorStatId.Recovery]: null,
		[EArmorStatId.Discipline]: null,
		[EArmorStatId.Intellect]: null,
		[EArmorStatId.Strength]: null,
	};
	// We will recreate the totalTargetStatShortfall as we go
	// when we want zero wasted stats.
	let _totalTargetStatShortfall = useZeroWastedStats
		? 0
		: totalTargetStatShortfall;
	for (let i = 0; i < ArmorStatIdList.length; i++) {
		const armorStatId = ArmorStatIdList[i];
		const targetStatShortfall = targetStatShortfalls[armorStatId];

		if (
			targetStatShortfall > 0 ||
			(useZeroWastedStats && currentStats[i] % 10 !== 0)
		) {
			let _targetStatShortfall = targetStatShortfall;
			if (useZeroWastedStats) {
				if (targetStatShortfall === 0) {
					// Round the base armor stats up to the nearest 10 if there is no shortfall
					_targetStatShortfall = roundUp10(currentStats[i]) - currentStats[i];
				}
				_totalTargetStatShortfall += _targetStatShortfall;
				// If we can't possibly hit the target stats, return null
				if (
					!canPotentiallyHitTargetStats(
						_totalTargetStatShortfall,
						numArtificeItems
					)
				) {
					return null;
				}
			}
			let genericCombos: GenericRequiredModCombo[] = null;

			// Try adding +10 to the target stat until we get a result
			// This should only matter for specific zero wasted stats cases
			// TODO: I think this logic might be shakey. Is there any case where there
			// is a way to achieve the +10 with fewer artifice mods than the +0?
			// If so then we need to include the +10, +20 etc here.
			let iterations = 0;
			for (
				let i = _targetStatShortfall;
				i < MAX_POTENTIAL_STAT_BOOST;
				i += 10
			) {
				genericCombos = getGenericModCombinations(i, useZeroWastedStats);
				if (genericCombos !== null) {
					break;
				}
				iterations++;
			}

			if (genericCombos === null) {
				// Break immediately. This means that there is no way to achieve the target stats.
				return null;
			}
			allGenericCombos[armorStatId] = genericCombos;
			_totalTargetStatShortfall += iterations * 10;
			// If we can't possibly hit the target stats, return null
			if (
				!canPotentiallyHitTargetStats(
					_totalTargetStatShortfall,
					numArtificeItems
				)
			) {
				return null;
			}
		}
	}
	return allGenericCombos;
};

export type GetAllValidStatModCombosParams = {
	targetStatShortfalls: ArmorStatMapping;
	numAvailableArtificePieces: number;
	totalTargetStatShortfall: number;
	useZeroWastedStats: boolean;
	currentStats: StatList;
};
export const getAllValidStatModCombos = ({
	targetStatShortfalls,
	numAvailableArtificePieces,
	useZeroWastedStats,
	totalTargetStatShortfall,
	currentStats,
}: GetAllValidStatModCombosParams) => {
	const unfilteredStatModCombos = getUnfilteredStatModCombos(
		targetStatShortfalls,
		useZeroWastedStats,
		totalTargetStatShortfall,
		numAvailableArtificePieces,
		currentStats
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
			let hasCombo = false;
			unfilteredStatModCombo.forEach((combo) => {
				// Skip combos with more artifice mods than we can slot
				if (combo.numArtificeMods > numAvailableArtificePieces) {
					return;
				}
				hasCombo = true;
				result.push({
					...getDefaultStatModCombo(),
					[armorStatId]: combo,
				});
			});
			if (!hasCombo) {
				return null;
			}
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
	// TODO: Find a better way to filter out redundant combos
	// Preferably do it as we go instead of at the end which requires
	// a double loop
	return result; //filterRedundantStatModCombos(result);
};

const getGenericModCombinations = (
	value: number,
	useZeroWastedStats: boolean
): GenericRequiredModCombo[] => {
	return useZeroWastedStats
		? zeroWastedStatModCombinations[value]
		: paretoOptimalModCombinations[value];
};

const getMaxPotentialStatBoost = (numArtificeItems: number) =>
	MAX_POTENTIAL_STAT_BOOST -
	// Subtract the "missing" artifice pieces
	(NUM_ARMOR_PIECES - numArtificeItems) *
	ARTIFICE_MOD_BONUS_VALUE;

const canPotentiallyHitTargetStats = (
	totalTargetStatShortfall: number,
	numArtificeItems: number
) => totalTargetStatShortfall <= getMaxPotentialStatBoost(numArtificeItems);

type GetStatModCombosFromDesiredStatsParams = {
	currentStats: StatList;
	targetStats: ArmorStatMapping;
	numArtificeItems: number;
	useZeroWastedStats: boolean;
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
		!canPotentiallyHitTargetStats(totalTargetStatShortfall, numArtificeItems)
	) {
		return null;
	}
	// If we don't need any mods to hit our target value then return an empty array
	// TODO: actually check if this combo doesn't already have zero wasted stats
	if (totalTargetStatShortfall === 0 && !useZeroWastedStats) {
		return [];
	}
	const allValidStatModCombos = getAllValidStatModCombos({
		targetStatShortfalls,
		numAvailableArtificePieces: numArtificeItems,
		useZeroWastedStats,
		totalTargetStatShortfall,
		currentStats,
	});
	if (allValidStatModCombos === null) {
		return null;
	}
	// Sort cheapest to most expensive
	if (allValidStatModCombos.length > 0) {
		allValidStatModCombos.sort((a, b) => {
			let aCost = 0;
			let bCost = 0;
			ArmorStatIdList.forEach((armorStatId) => {
				const aVal = a[armorStatId];
				const bVal = b[armorStatId];
				const split = getArmorStatModSpitFromArmorStatId(armorStatId);
				if (aVal) {
					aCost += aVal.numMajorMods * getMod(split.major).cost;
					aCost += aVal.numMinorMods * getMod(split.minor).cost;
				}
				if (bVal) {
					bCost += bVal.numMajorMods * getMod(split.major).cost;
					bCost += bVal.numMinorMods * getMod(split.minor).cost;
				}
			});
			return aCost - bCost;
		});
	}
	return allValidStatModCombos.length > 0 ? allValidStatModCombos : null;
};
