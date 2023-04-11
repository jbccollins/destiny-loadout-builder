import { Loadout } from '@destinyitemmanager/dim-api-types/loadouts';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	ArmorGroup,
	ArmorIdList,
	ArmorItems,
	ArmorMetadataItem,
	getDefaultItemCounts,
	getExtraMasterworkedStats,
	ArmorItem,
	ISelectedExoticArmor,
	ItemCounts,
	StatList,
	StrictArmorItems,
	AvailableExoticArmorItem,
} from '@dlb/types/Armor';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
} from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatModSpitFromArmorStatId,
	getArmorStatMappingFromMods,
	sumArmorStatMappings,
	DefaultArmorStatMapping,
	getStat,
} from '@dlb/types/ArmorStat';
import { EModCategoryId } from '@dlb/types/IdEnums';
import {
	EArmorSlotId,
	EArmorStatId,
	EMasterworkAssumption,
	EDimLoadoutsFilterId,
	EDestinyClassId,
	EGearTierId,
	EExtraSocketModCategoryIdList,
	EExtraSocketModCategoryId,
} from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	getArtificeStatModIdFromArmorStatId,
	getMod,
	hasValidArmorStatModPermutation,
	MajorStatModIdList,
	MinorStatModIdList,
	ValidRaidModArmorSlotPlacement,
} from '@dlb/types/Mod';
import combinations from '@dlb/utils/combinations';
import { ARTIFICE_BONUS_VALUE } from '@dlb/utils/item-utils';
import { permute } from '@dlb/utils/permutations';
import { cloneDeep, isEqual, uniqWith } from 'lodash';

// No masterworked legendary piece of armor has a single stat above 32
// TODO: Can we dynamically set this per slot? Like not every user
// is going to have six heads with 30 in each of the stats. So can we create a mapping
// before processing. e.g.: {head: {mob: 28, res: 27, rec: 30, ...}, arm: {mob: 29, ...}}.
// We can even "override" this with the max stats for a specific exotic when one is chosen.
// I *think* it's impossible to have a short circuit before chest if we keep this at 30.
// But it *should* be possible once we make this dynamic. We *could* also check to see
// if there even are any masterworked items in a slot (relevant mostly for the exotic chosen)
// and if there aren't then this is just 30. Probably not needed once done dynamically anyway tho
const MAX_SINGLE_STAT_VALUE = 32;

const getArmorSlotFromNumRemainingArmorPieces = (num: number): EArmorSlotId => {
	if ([3, 2, 1, 0].includes(num)) {
		return numRemainingArmorPiecesToArmorSlot[num];
	}
	throw `num is not 3,2,1,0: ${num}`;
};

// We never need to check legs as written since we always process top down.
// TODO: This will need to change if prioritization of shortcircuiting based
// on slot length actually matters. Basically... should we process slots with more items
// first since we have more chances to short circuit? Or does it not matter at all.
// TOOD: Investigate this.
const numRemainingArmorPiecesToArmorSlot = {
	3: EArmorSlotId.Head,
	2: EArmorSlotId.Arm,
	1: EArmorSlotId.Chest,
	0: EArmorSlotId.Leg,
};

// Round a number up to the nearest 5
function roundUp5(x: number) {
	return Math.ceil(x / 5) * 5;
}

// Round a number up to the nearest 10
function roundUp10(x: number) {
	return Math.ceil(x / 10) * 10;
}

// Round a number down to the nearest 10
function roundDown10(x: number) {
	return Math.floor(x / 10) * 10;
}

// If we need 25 stats we need one minor stat and two major
function canUseMinorStatMod(x: number) {
	return roundUp5(x) % 10 === 5;
}

type GetrequiredArtificeModIdListParams = {
	desiredArmorStats: ArmorStatMapping;
	totalArmorStatMapping: ArmorStatMapping;
};

const getRequiredArtificeModIdList = ({
	desiredArmorStats,
	totalArmorStatMapping,
}: GetrequiredArtificeModIdListParams): EModId[] => {
	const requiredArtificeModIdList: EModId[] = [];
	ArmorStatIdList.forEach((armorStatId) => {
		const desiredArmorStat = desiredArmorStats[armorStatId];
		const achievedArmorStat = totalArmorStatMapping[armorStatId];
		const diff = desiredArmorStat - achievedArmorStat;
		let numRequiredArtificeMods = 0;
		if (diff > 0) {
			numRequiredArtificeMods += Math.ceil(diff / ARTIFICE_BONUS_VALUE);
			for (let i = 0; i < numRequiredArtificeMods; i++) {
				requiredArtificeModIdList.push(
					getArtificeStatModIdFromArmorStatId(armorStatId)
				);
			}
		}
	});
	return requiredArtificeModIdList;
};

const sumModCosts = (modIdList: EModId[]): number => {
	let cost = 0;
	modIdList.forEach((modId) => (cost += getMod(modId).cost));
	return cost;
};

type ArtificeAdjustedRequiredModCombo = {
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
	numUnusedArtificeMods: number; // TODO: We can get rid of this once the refactor is done
};
const getArtificeAdjustedRequiredMods = (
	armorStatModIdList: EModId[],
	destinyClassId: EDestinyClassId,
	desiredArmorStats: ArmorStatMapping,
	baseArmorStatMapping: ArmorStatMapping,
	numArtificeItems: number
): ArtificeAdjustedRequiredModCombo[] => {
	const defaultArtificeAdjustedRequiredModCombos = [
		{ armorStatModIdList, artificeModIdList: [], numUnusedArtificeMods: 0 },
	];
	if (numArtificeItems === 0) {
		return defaultArtificeAdjustedRequiredModCombos;
	}
	// TODO: This is an upper bound. With 5 major and 4 minor and 4 artifice pieces
	// it's possible to potentially be able to replace all four minor mods with artifice mods.
	// Constrain this further.
	if (armorStatModIdList.length > 9) {
		return defaultArtificeAdjustedRequiredModCombos;
	}

	// We know that at least 2 artifice mods are required to replace 1 major mod
	const numPotentiallyReplaceableMajorMods = Math.floor(numArtificeItems / 2);
	const majorMods = armorStatModIdList.filter((modId) =>
		MajorStatModIdList.includes(modId)
	);
	// We can use 5 mod slots for major mods if needed
	if (majorMods.length - 5 > numPotentiallyReplaceableMajorMods) {
		return defaultArtificeAdjustedRequiredModCombos;
	}

	// TODO: This is super inefficient and slow :(
	// Find the biggest size combinations we can make given
	// that we have a maximum of 5 armor pieces
	const combinationSize = Math.min(armorStatModIdList.length, 5);
	let combos = combinations(armorStatModIdList, combinationSize);
	// Sort combinations by cost, lowest to highest
	combos = combos.sort((a, b) => sumModCosts(a) - sumModCosts(b));
	const result: ArtificeAdjustedRequiredModCombo[] = [];
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
		if (requiredArtificeModIdList.length <= numArtificeItems) {
			result.push({
				armorStatModIdList: combo,
				artificeModIdList: requiredArtificeModIdList,
				numUnusedArtificeMods:
					numArtificeItems - requiredArtificeModIdList.length,
			});
		}
	}
	// If we fail to find a combo that works then return an empty list of artifice mods
	return result.length > 0 ? result : defaultArtificeAdjustedRequiredModCombos;
};

const getArtificeAdjustedRequiredModsV2 = (
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
					const recursiveResults = getArtificeAdjustedRequiredModsV2(
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

export type GetRequiredArmorStatModsParams = {
	desiredArmorStats: ArmorStatMapping;
	stats: StatList; // Includes masterworked / assume masterworked
	numRemainingArmorPieces: number;
	destinyClassId: EDestinyClassId;
	numSeenArtificeArmorItems: number;
	armorMetadataItem: ArmorMetadataItem;
	selectedExotic: AvailableExoticArmorItem;
};

export type RequiredStatMods = {
	requiredArmorStatModIdList: EModId[];
	requiredArtificeModIdList: EModId[];
	requiredArmorStatModsArmorStatMapping: ArmorStatMapping;
	numUnusedArtificeMods: number;
};
// Get the required armor stat mods for a given combination.
// If we don't have a full combination yet then assume that we have the
// max possible stat value for each remaining stat.
export const getRequiredArmorStatMods = ({
	desiredArmorStats,
	stats,
	numRemainingArmorPieces,
	destinyClassId,
	numSeenArtificeArmorItems,
	selectedExotic,
	armorMetadataItem,
}: GetRequiredArmorStatModsParams): RequiredStatMods => {
	const requiredArmorStatMods: EModId[] = [];
	stats.forEach((stat, i) => {
		const armorStat = ArmorStatIdList[i];
		const desiredStat = desiredArmorStats[armorStat];
		// Assume that for each remaining armor piece we have perfect stats
		const diff =
			desiredStat -
			(stat +
				getMaxPossibleRemainingStatValue(
					numRemainingArmorPieces,
					0, // numSeenArtificeArmorItems,
					armorMetadataItem,
					selectedExotic
				));
		// If the desired stat is less than or equal to the total possible stat
		// then we don't need any stat mods or artifice stat mods to boost that stat
		if (diff <= 0) {
			return;
		}
		const withMinorStatMod = canUseMinorStatMod(diff);
		// TODO: We can optimize this a bit I think... Like if we only need two major and one minor
		// and we have no remaining pieces then we can probably just push five minor stat mods.
		// Maybe that should be a setting.. like "Prefer minor mods" or something idk.
		const numRequiredMajorMods =
			roundUp10(diff) / 10 - (withMinorStatMod ? 1 : 0);
		const { major, minor } = getArmorStatModSpitFromArmorStatId(armorStat);
		for (let i = 0; i < numRequiredMajorMods; i++) {
			requiredArmorStatMods.push(major);
		}
		if (withMinorStatMod) {
			requiredArmorStatMods.push(minor);
		}
	});
	let requiredArtificeModIdList: EModId[] = [];
	let adjustedArmorStatMods: EModId[] = [...requiredArmorStatMods];
	let numUnusedArtificeMods = 0;

	// TODO: This is an upper bound for the number of artifice items left.
	// Constrain this further by checking which slot has an exotic and which
	// slots even have artifice pieces available.
	// In the future if we allow the usage of a loadout without an exotic this will need to change.
	const numPotentialArtificeItems =
		numSeenArtificeArmorItems + numRemainingArmorPieces;
	// Find a single permutation of artifice mods to pad the stats. Only do this if necessary
	if (
		(numRemainingArmorPieces === 0 || requiredArmorStatMods.length > 5) &&
		numPotentialArtificeItems > 0
	) {
		const baseArmorStatMapping = getArmorStatMappingFromStatList(stats);
		const artificeAdjustedRequiredMods = getArtificeAdjustedRequiredMods(
			requiredArmorStatMods,
			destinyClassId,
			desiredArmorStats,
			baseArmorStatMapping,
			numPotentialArtificeItems
		);
		const {
			armorStatModIdList: _adjustedArmorStatMods,
			artificeModIdList: _requiredArtificeModIdList,
		} = artificeAdjustedRequiredMods[0];
		adjustedArmorStatMods = _adjustedArmorStatMods;
		requiredArtificeModIdList = _requiredArtificeModIdList;
		// TODO: This isn't taking into consideration the cost of armor mods
		// potentially preventing any of these combos from working
		artificeAdjustedRequiredMods.forEach((combo) => {
			if (combo.numUnusedArtificeMods > numUnusedArtificeMods) {
				numUnusedArtificeMods = combo.numUnusedArtificeMods;
			}
		});
	}

	// Try to optimize a bit further by swapping out major mods with minor mods
	// and padding with unused artifice mods
	if (
		numRemainingArmorPieces === 0 &&
		numSeenArtificeArmorItems > 0 &&
		requiredArtificeModIdList.length <= numSeenArtificeArmorItems // TODO <= ??? Why not just <
	) {
		let optimizedArmorStatMods = [...adjustedArmorStatMods];
		for (let i = 0; i < adjustedArmorStatMods.length; i++) {
			// If this is a minor mod we can't optimize it any further
			// TODO: This is almost certainly wrong behavior. In the case
			// where all we need is a single minor mod to reach our desired stats
			// we can just replace that minor mod with one or two artifice mods
			if (MinorStatModIdList.includes(adjustedArmorStatMods[i])) {
				continue;
			}
			// TODO: If stat mods ever give more than one bonus this won't work
			// Additionally this cast to EArmorStatId won't work if there are ever class specific
			// Armor stat mods...
			const armorStatId = getMod(adjustedArmorStatMods[i]).bonuses[0]
				.stat as EArmorStatId;
			const minorMod = getArmorStatModSpitFromArmorStatId(armorStatId).minor;
			const _optimizedArmorStatMods = [...optimizedArmorStatMods];
			// Swap out the currently considered mod
			_optimizedArmorStatMods[i] = minorMod;

			const optimizedArmorStatMapping = getArmorStatMappingFromMods(
				_optimizedArmorStatMods,
				destinyClassId
			);

			const baseArmorStatMapping = getArmorStatMappingFromStatList(stats);
			const totalArmorStatMapping = sumArmorStatMappings([
				optimizedArmorStatMapping,
				baseArmorStatMapping,
			]);
			const _requiredArtificeModIdList = getRequiredArtificeModIdList({
				desiredArmorStats,
				totalArmorStatMapping,
			});
			if (_requiredArtificeModIdList.length > numSeenArtificeArmorItems) {
				continue;
			} else {
				optimizedArmorStatMods = _optimizedArmorStatMods;
				requiredArtificeModIdList = _requiredArtificeModIdList;
			}
		}
		adjustedArmorStatMods = optimizedArmorStatMods;
	}

	// TODO: If we have extra artifice mods available then try adding those to fill in the gaps.
	// This is a future optimization. We currently only add artifice mods if they are required to
	// hit the stats you want. Ideally we would prefer artifice mods over armor stat mods since
	// artifice mods have no cost. Actually... this might already be happening
	// if (
	// 	numRemainingArmorPieces === 0 &&
	// 	numSeenArtificeArmorItems > 0 &&
	// 	requiredArtificeModIdList.length < numSeenArtificeArmorItems
	// ) {
	// 	let numExtraArtificeMods = numSeenArtificeArmorItems - requiredArtificeModIdList.length
	//	// Figure out how to add more stat tiers with artifice mods here!
	// }
	return {
		requiredArmorStatModIdList: adjustedArmorStatMods,
		requiredArtificeModIdList,
		requiredArmorStatModsArmorStatMapping: getArmorStatMappingFromMods(
			adjustedArmorStatMods,
			destinyClassId
		),
		numUnusedArtificeMods,
	};
};

function deleteFromArray<T>(arr: T[], item: T): void {
	const index = arr.findIndex((x) => x === item);
	if (index >= 0) {
		arr.splice(index, 1);
	}
}

const replaceMajorModsWithMinorMods = (
	armorStatModIdList: EModId[],
	modsToReplace: EModId[],
	destinyClassId: EDestinyClassId
): void => {
	modsToReplace.forEach((modId) => {
		const index = armorStatModIdList.findIndex((x) => x === modId);
		armorStatModIdList.splice(index, 1);
		deleteFromArray(armorStatModIdList, modId);
		const { stat } = getMod(modId).bonuses[0];
		const armorStatId = getStat(stat, destinyClassId).id;
		const minorModId = getArmorStatModSpitFromArmorStatId(armorStatId).minor;
		// Push the corresponding minor mod twice
		armorStatModIdList.push(minorModId);
		armorStatModIdList.push(minorModId);
	});
};

const _extrapolateMajorModsIntoMinorMods = (
	armorStatModIdList: EModId[],
	destinyClassId: EDestinyClassId
): EModId[][] => {
	const result: EModId[][] = [];
	const unusedModSlots = 5 - armorStatModIdList.length;
	if (unusedModSlots === 0) {
		// There is no space to turn a major mod into two minor mods
		return;
	}
	// Since major mods can be swapped out for two minor mods we only have to care about
	// two cases. The case where there is only one unusedModSlot and the case where there
	// are more than one unusedModSlots. If there two - three unusedModSlots it's all the same
	// logic since no matter what, we can convert three major mods into six minor mods.
	/*
	Logic: If there are x major mods => extrapolate to these combos
	1 => two minor
	2 => every unique major mod gets two minor mods + if there are two+ unused mod slots add on the four minor mods 
	3 => every unique major mod gets a two minor mods + if there are two+ unused mod slots every unique combination of two major mods gets two minor mods each 
	4 => every unique major mod gets a minor mod 
	*/
	const majorStatModIdList = armorStatModIdList.filter((x) =>
		MajorStatModIdList.includes(x)
	);
	if (majorStatModIdList.length === 0) {
		return;
	}
	const singleMajorStatModCombos = combinations(majorStatModIdList, 1);
	singleMajorStatModCombos.forEach((combo) => {
		const _armorStatModIdList = [...armorStatModIdList];
		replaceMajorModsWithMinorMods(_armorStatModIdList, combo, destinyClassId);
		result.push(_armorStatModIdList);
	});
	if (
		unusedModSlots > 1 &&
		majorStatModIdList.length > 1 &&
		majorStatModIdList.length < 4
	) {
		const duoMajorStatModCombos = combinations(majorStatModIdList, 2);
		duoMajorStatModCombos.forEach((combo) => {
			const _armorStatModIdList = [...armorStatModIdList];
			replaceMajorModsWithMinorMods(_armorStatModIdList, combo, destinyClassId);
			result.push(_armorStatModIdList);
		});
	}
	return result;
	// return uniqWith(result, isEqual);
};

// TODO: the two extrapolate functions can be combined
// Initially they were separate because I thought the _ variant
// would be recursive
const extrapolateMajorModsIntoMinorMods = (
	statModComboList: StatModCombo[],
	destinyClassId: EDestinyClassId
): StatModCombo[] => {
	// The existing combos are valid and must be considered
	const results: StatModCombo[] = [...statModComboList];
	// Any combo that has at least one open mod slot and at least
	// one major mod can be extrapolated
	statModComboList
		.filter(
			(statModCombo) =>
				statModCombo.armorStatModIdList.length < 5 &&
				statModCombo.armorStatModIdList.findIndex((x) =>
					MajorStatModIdList.includes(x)
				) >= 0
		)
		.forEach(({ armorStatModIdList, artificeModIdList }) => {
			const extrapolatedArmorStatModIdLists =
				_extrapolateMajorModsIntoMinorMods(armorStatModIdList, destinyClassId);
			extrapolatedArmorStatModIdLists.forEach(
				(extrapolatedArmorStatModIdList) => {
					results.push({
						armorStatModIdList: extrapolatedArmorStatModIdList,
						artificeModIdList,
					});
				}
			);
		});
	return results;
};

export type StatModCombo = {
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
};

export type StatModComboWithMetadata = StatModCombo & {
	metadata: {
		totalArmorStatModCost: number;
	};
};

export type GetAllStatModCombosParams = {
	desiredArmorStats: ArmorStatMapping;
	stats: StatList; // Includes masterworked / assume masterworked
	destinyClassId: EDestinyClassId;
	numSeenArtificeArmorItems: number;
};

// Only run this once a full set of armor is known
export const getAllStatModCombos = ({
	desiredArmorStats,
	stats,
	destinyClassId,
	numSeenArtificeArmorItems,
}: GetAllStatModCombosParams): StatModComboWithMetadata[] => {
	let allStatModCombos: StatModCombo[] = [];

	/*
	Step 1:
	Figure out which armor stat mods we would need to do hit the desiredArmorStats
	*/
	const requiredArmorStatMods: EModId[] = [];
	stats.forEach((stat, i) => {
		const armorStat = ArmorStatIdList[i];
		const desiredStat = desiredArmorStats[armorStat];
		const diff = desiredStat - stat;
		// If the desired stat is less than or equal to the total possible stat
		// then we don't need any stat mods or artifice stat mods to boost that stat
		if (diff <= 0) {
			return;
		}
		const withMinorStatMod = canUseMinorStatMod(diff);
		// Note that this will only ever pick a single minor mod of the same type.
		// So it will never pick two minor mobility mods even if that is cheaper
		// than a single major mobility mod. In a future step will remidiate this.
		// In short, this step prioritizes choosing fewer mods at a higher total cost
		// if that saves an entire mod slot from being used. In some cases this can be useful.
		// In other cases it could be a hindrance. So we'll calculate out all major/minor
		// combos later on.
		const numRequiredMajorMods =
			roundUp10(diff) / 10 - (withMinorStatMod ? 1 : 0);
		const { major, minor } = getArmorStatModSpitFromArmorStatId(armorStat);
		for (let i = 0; i < numRequiredMajorMods; i++) {
			requiredArmorStatMods.push(major);
		}
		if (withMinorStatMod) {
			requiredArmorStatMods.push(minor);
		}
	});

	/*
	Step 2
	If there is a combination of mods that works, set it's extrapolation as
	the current result list. If there are any artifice armor pieces in this
	armor combo we'll handle them in the next step.
	*/
	if (numSeenArtificeArmorItems === 0 && requiredArmorStatMods.length <= 5) {
		const baseStatModCombo = {
			armorStatModIdList: requiredArmorStatMods,
			artificeModIdList: [],
			armorStatModCost: getTotalModCost(requiredArmorStatMods),
		};
		allStatModCombos = extrapolateMajorModsIntoMinorMods(
			[baseStatModCombo],
			destinyClassId
		);
	} else if (numSeenArtificeArmorItems > 0) {
		/*
		Step 2.1:
		Add artifice mods to reduce cost if possible. This potentially create
		a variety of mod combinations with different costs. These different costs
		can affect where we can place raid mods and also inform the desired
		stat tier preview. High cost combos that use fewer artifice mods might
		allow an extra stat tier and the desired stat preview needs to be aware of that.
		*/
		const baseArmorStatMapping = getArmorStatMappingFromStatList(stats);
		const artificeAdjustedRequiredMods = getArtificeAdjustedRequiredModsV2(
			requiredArmorStatMods,
			destinyClassId,
			desiredArmorStats,
			baseArmorStatMapping,
			numSeenArtificeArmorItems
		);

		artificeAdjustedRequiredMods.forEach((x) => {
			const artificeStatModCombo: StatModCombo = {
				armorStatModIdList: x.armorStatModIdList,
				artificeModIdList: x.artificeModIdList,
			};
			allStatModCombos.push(artificeStatModCombo);

			// TODO: Make getArtificeAdjustedRequiredMods return all combos of mods
			// not just combos of 5. This will require extrapolating within that function
		});
		//});
	}

	// Step 3: TODO: Optimize this further to add combos that don't NEED
	// to use artifice mods to hit the desired stat tiers but CAN use artifice
	// mods to reduce the combo cost

	// Extract metadata
	const allStatModCombosWithMetadata: StatModComboWithMetadata[] =
		allStatModCombos.map(({ armorStatModIdList, artificeModIdList }) => ({
			armorStatModIdList,
			artificeModIdList,
			metadata: {
				totalArmorStatModCost: getTotalModCost(armorStatModIdList),
			},
		}));

	// Return sorted results with the cheapest first and the tiebreaker being number
	// of mods used where fewer is better.
	return allStatModCombosWithMetadata.sort(
		(a, b) =>
			a.metadata.totalArmorStatModCost - b.metadata.totalArmorStatModCost ||
			a.armorStatModIdList.length - b.armorStatModIdList.length
	);
};

export type ShouldShortCircuitParams = {
	sumOfSeenStats: StatList;
	desiredArmorStats: ArmorStatMapping;
	numRemainingArmorPieces: number; // TODO: Can we enforce this to be one of 3 | 2 | 1
	validRaidModArmorSlotPlacements: ValidRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	specialSeenArmorSlotItems: SeenArmorSlotItems;
	armorMetadataItem: ArmorMetadataItem;
	selectedExotic: AvailableExoticArmorItem;
};

export type ShouldShortCircuitOutput = {
	shortCircuit: boolean;
	requiredArmorStatModIdList: EModId[];
	requiredArtificeModIdList: EModId[];
	requiredArmorStatModsArmorStatMapping: ArmorStatMapping;
	armorStat: EArmorStatId | null; // null means that there were to many required mods
	slot: EArmorSlotId;
	numUnusedArtificeMods: number;
	requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId;
};

// TODO: Clean up these assumptions by checking against armor metadata instead of the MAX_SINGLE_STAT_VALUE.
// A wrench... The assumption that no armor piece can roll > 30 in a single stat is no longer
// true as of lightfall. If you had the blue solstice chestpiece ornament equipped when
// lighfall launched then your chespiece permanently gained +1 to resilience. Meaning that
// the total max base stats you could have now is 69. This is very rare but we should
// consider this case.
const getMaxPossibleRemainingStatValue = (
	numRemainingArmorPieces: number,
	numSeenArtificeArmorItems: number,
	armorMetadataItem: ArmorMetadataItem,
	selectedExotic: AvailableExoticArmorItem
): number => {
	let maxPossibleRemainingStatValue =
		MAX_SINGLE_STAT_VALUE * numRemainingArmorPieces +
		numSeenArtificeArmorItems * ARTIFICE_BONUS_VALUE;
	const armorSlotId = getArmorSlotFromNumRemainingArmorPieces(
		numRemainingArmorPieces
	);
	// Check if any of the next armor slots can be artifice
	// If so then add the artifice bonus for each slot that can be artifice
	const index = 1 + ArmorSlotIdList.findIndex((x) => x === armorSlotId);
	// Get the max possible remaining artifice bonuses
	for (let i = index; i < ArmorSlotIdList.length; i++) {
		const armorSlotId = ArmorSlotIdList[i];
		if (
			armorSlotId !== selectedExotic.armorSlot && // Exotic items cannot be artifice
			armorMetadataItem.artifice.items[armorSlotId].count > 0
		) {
			maxPossibleRemainingStatValue += ARTIFICE_BONUS_VALUE;
		}
	}
	return maxPossibleRemainingStatValue;
};

const getItemCountsFromSeenArmorSlotItems = (
	seenArmorSlotItems: SeenArmorSlotItems,
	withClassItems = true
): ItemCounts => {
	const itemCounts = getDefaultItemCounts();
	ArmorSlotIdList.forEach((armorSlotId) => {
		const value = seenArmorSlotItems[armorSlotId] as
			| EExtraSocketModCategoryId
			| 'artifice';
		if (value === ARTIFICE) {
			itemCounts.artifice++;
		} else if (value !== null) {
			itemCounts[value]++;
		}
	});
	if (withClassItems) {
		Object.keys(getDefaultItemCounts()).forEach((key) => {
			if (seenArmorSlotItems.ClassItems[key]) {
				itemCounts[key]++;
			}
		});
	}
	return itemCounts;
};

/***********************/

/*

foreach armorCombination {
	let requiredClassItemType = null
	if (selectedRaidMods) {
		// ensure that there is enough raid armor in this armorCombination
		// to slot all the raid mods
		// Set requiredClassItemType if needed
	}

	// TODO on this one...
	if (selectedArmorConstraints) {
		// ensure that there is enough iron banner/plunderer's trapping etc..
		// armor to satisfy the constraints
		// Set requiredClassItemType if needed
	}

	// Get all the combinations of armorStatMods and artificeMods that
	// meet the desired stat tiers. Make sure to do this both with extra
	// artificeMods used to replace armorStatMods and without that. This will
	// be important for getting accurate desired stat tier previews.
	const validStatModPlacements = getValidStatModPlacements()

	// Find all the combinations of raid mods that fit with the valid stat mod placements
	const modCombos = getModCombos(selectedRaidMods, validStatModPlacements)
}
*/

type ArmorSlotModComboPlacementValue = {
	armorStatModId: EModId;
	artificeModId: EModId;
	raidModId: EModId;
};

type ArmorSlotModComboPlacement = Record<
	EArmorSlotId,
	ArmorSlotModComboPlacementValue
>;

// TODO: This will need to be updated for iron banner, and seasonal perk armor etc...
// A better way to would to check if it is of type vs "is not artifice"
const stripNonRaidSeenArmorSlotItems = (
	seenArmorSlotItems: SeenArmorSlotItems
) => {
	const items: Partial<Record<EArmorSlotId, EModCategoryId>> = {
		[EArmorSlotId.Head]: null,
		[EArmorSlotId.Arm]: null,
		[EArmorSlotId.Chest]: null,
		[EArmorSlotId.Leg]: null,
	};
	ArmorSlotIdList.forEach((armorSlotId) => {
		if (seenArmorSlotItems[armorSlotId] !== 'artifice') {
			// TODO: God I hate this casting shit
			items[armorSlotId] = seenArmorSlotItems[armorSlotId] as EModCategoryId;
		}
	});
	return items;
};

export type FilterValidRaidModArmorSlotPlacementsParams = {
	seenArmorSlotItems: SeenArmorSlotItems;
	requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId;
	validRaidModArmorSlotPlacements: ValidRaidModArmorSlotPlacement[];
};

export const filterValidRaidModArmorSlotPlacements = ({
	seenArmorSlotItems,
	requiredClassItemExtraModSocketCategoryId,
	validRaidModArmorSlotPlacements,
}: FilterValidRaidModArmorSlotPlacementsParams): ValidRaidModArmorSlotPlacement[] => {
	const raidSeenArmorSlotItems =
		stripNonRaidSeenArmorSlotItems(seenArmorSlotItems);
	const validPlacements: ValidRaidModArmorSlotPlacement[] = [];
	const armorItemsExtraModSocketCategories = {
		[EArmorSlotId.Head]: raidSeenArmorSlotItems.Head,
		[EArmorSlotId.Arm]: raidSeenArmorSlotItems.Arm,
		[EArmorSlotId.Chest]: raidSeenArmorSlotItems.Chest,
		[EArmorSlotId.Leg]: raidSeenArmorSlotItems.Leg,
		[EArmorSlotId.ClassItem]:
			requiredClassItemExtraModSocketCategoryId as unknown as EModCategoryId, // TODO: Fuck this cast
	};

	// Filter out the placements that put a raid mod on a non-raid armor piece
	for (let i = 0; i < validRaidModArmorSlotPlacements.length; i++) {
		const placement = validRaidModArmorSlotPlacements[i];
		let isValid = true;
		for (let j = 0; j < ArmorSlotWithClassItemIdList.length; j++) {
			const armorSlotId = ArmorSlotWithClassItemIdList[j];
			if (placement[armorSlotId]) {
				const mod = getMod(placement[armorSlotId]);
				if (
					mod.modCategoryId !== armorItemsExtraModSocketCategories[armorSlotId]
				) {
					isValid = false;
					break;
				}
			}
		}
		if (isValid) {
			validPlacements.push(placement);
		}
	}
	return validPlacements;
};

type ModCombos = {
	metadata: {
		minTotalArmorStatModCost: number;
		maxTotalArmorStatModCost: number;
		minUsedArtificeMods: number;
		maxUsedArtificeMods: number;
		minUnusedArmorEnergy: number;
		maxUnusedArmorEnergy: number;
	};
	sortedArmorSlotModComboPlacementList: ArmorSlotModComboPlacement[];
};

const getModCombos = (params: ShouldShortCircuitParams): ModCombos => {
	const {
		sumOfSeenStats,
		desiredArmorStats,
		numRemainingArmorPieces,
		validRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		destinyClassId,
		specialSeenArmorSlotItems,
		selectedExotic,
		armorMetadataItem,
	} = params;

	const modCombos: ModCombos = {
		metadata: {
			minTotalArmorStatModCost: 0,
			maxTotalArmorStatModCost: 0,
			minUsedArtificeMods: 0,
			maxUsedArtificeMods: 0,
			minUnusedArmorEnergy: 0,
			maxUnusedArmorEnergy: 0,
		},
		sortedArmorSlotModComboPlacementList: [],
	};

	const seenItemCounts = getItemCountsFromSeenArmorSlotItems(
		specialSeenArmorSlotItems
	);
	let seenArtificeCount = seenItemCounts.artifice;

	let requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId =
		null;

	let filteredValidRaidModArmorSlotPlacements = null;
	// Check to see if this combo even has enough raid pieces capable
	// of slotting the required raid mods. To do this we need to consider
	// various raid class items which is the main reason why this logic
	// is fairly lengthy/complex
	if (raidMods.length > 0) {
		// Get the counts of each raid type for this armor combo
		const seenItemCountsWithoutClassItems = getItemCountsFromSeenArmorSlotItems(
			specialSeenArmorSlotItems,
			false
		);
		// Get the counts of each raid type for our raid mods
		const raidModExtraSocketModCategoryIdCounts =
			getExtraSocketModCategoryIdCountsFromRaidModIdList(raidMods);
		// Given that class item stats are interchangeable, we need to check if we need
		// any specific raid class item to socket the required raid mods. This is
		// very common to need to do
		const {
			isValid,
			requiredClassItemExtraModSocketCategoryId:
				_requiredClassItemExtraModSocketCategoryId,
		} = hasValidSeenItemCounts(
			seenItemCountsWithoutClassItems,
			raidModExtraSocketModCategoryIdCounts,
			specialSeenArmorSlotItems.ClassItems
		);
		if (!isValid) {
			return modCombos;
		}

		requiredClassItemExtraModSocketCategoryId =
			_requiredClassItemExtraModSocketCategoryId;
		// We can't use artifice class items now...
		if (
			requiredClassItemExtraModSocketCategoryId !== null &&
			specialSeenArmorSlotItems.ClassItems.artifice
		) {
			seenArtificeCount--;
		}
		filteredValidRaidModArmorSlotPlacements =
			filterValidRaidModArmorSlotPlacements({
				seenArmorSlotItems: specialSeenArmorSlotItems,
				validRaidModArmorSlotPlacements,
				requiredClassItemExtraModSocketCategoryId,
			});

		if (filterValidRaidModArmorSlotPlacements.length === 0) {
			return modCombos;
		}

		const allStatModCombos = getAllStatModCombos({
			desiredArmorStats,
			stats: sumOfSeenStats,
			destinyClassId,
			numSeenArtificeArmorItems: seenArtificeCount,
		});
	}

	return modCombos;
};

/********************************/

export const shouldShortCircuit = (
	params: ShouldShortCircuitParams
): ShouldShortCircuitOutput => {
	const {
		sumOfSeenStats,
		desiredArmorStats,
		numRemainingArmorPieces,
		validRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		destinyClassId,
		specialSeenArmorSlotItems,
		selectedExotic,
		armorMetadataItem,
	} = params;

	/******** EXPERIMENTAL *********/

	if (numRemainingArmorPieces === 0) {
		const modCombos = getModCombos(params);
	}
	/*******************************/

	const seenItemCounts = getItemCountsFromSeenArmorSlotItems(
		specialSeenArmorSlotItems
	);

	let requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId =
		null;
	let seenArtificeCount = seenItemCounts.artifice;
	// Check to see if this combo even has enough raid pieces capable
	// of slotting the required raid mods
	if (numRemainingArmorPieces === 0 && raidMods.length > 0) {
		const seenItemCountsWithoutClassItems = getItemCountsFromSeenArmorSlotItems(
			specialSeenArmorSlotItems,
			false
		);
		const raidModExtraSocketModCategoryIdCounts =
			getExtraSocketModCategoryIdCountsFromRaidModIdList(raidMods);
		const {
			isValid,
			requiredClassItemExtraModSocketCategoryId:
				_requiredClassItemExtraModSocketCategoryId,
		} = hasValidSeenItemCounts(
			seenItemCountsWithoutClassItems,
			raidModExtraSocketModCategoryIdCounts,
			specialSeenArmorSlotItems.ClassItems
		);
		if (!isValid) {
			return {
				shortCircuit: true,
				requiredArmorStatModIdList: [],
				requiredArtificeModIdList: [],
				requiredArmorStatModsArmorStatMapping: null,
				armorStat: null,
				slot: null,
				numUnusedArtificeMods: 0,
				requiredClassItemExtraModSocketCategoryId,
			};
		}

		requiredClassItemExtraModSocketCategoryId =
			_requiredClassItemExtraModSocketCategoryId;
		// We can't use artifice class items now...
		if (
			requiredClassItemExtraModSocketCategoryId !== null &&
			specialSeenArmorSlotItems.ClassItems.artifice
		) {
			seenArtificeCount--;
		}
	}

	// TODO: Knowing the rules around stat clustering [mob, res, rec] and [dis, int, str]
	// how each of those groups adds up to a max base total of 34 we can probably short circuit
	// muuuuuch more often. If we know that we needed to have a 30 in both mob and res for a
	// single armor piece in order for it to work in this combination we can tell that's an impossible
	// piece of armor so we are done right then and there. Combine that logic
	// with dynamic MAX_SINGLE_STAT_VALUE and we can have a really efficient check here.

	const maxRemaningPossibleStatValue = getMaxPossibleRemainingStatValue(
		numRemainingArmorPieces,
		seenArtificeCount,
		armorMetadataItem,
		selectedExotic
	);

	const {
		requiredArmorStatModIdList,
		requiredArtificeModIdList,
		requiredArmorStatModsArmorStatMapping,
		numUnusedArtificeMods,
	} = getRequiredArmorStatMods({
		desiredArmorStats,
		stats: sumOfSeenStats,
		numRemainingArmorPieces,
		destinyClassId,
		numSeenArtificeArmorItems: seenArtificeCount,
		armorMetadataItem,
		selectedExotic,
	});

	const slot = getArmorSlotFromNumRemainingArmorPieces(numRemainingArmorPieces);

	if (requiredArmorStatModIdList.length > 5) {
		// console.log(`
		// 		short-circuiting ${slot}:
		// 			stat: none,
		// 			requiredArmorStatMods: ${requiredArmorStatMods}
		// 	`);
		return {
			shortCircuit: true,
			requiredArmorStatModIdList,
			requiredArtificeModIdList,
			requiredArmorStatModsArmorStatMapping,
			armorStat: null,
			slot,
			numUnusedArtificeMods,
			requiredClassItemExtraModSocketCategoryId,
		};
	}

	// TODO: This is an upper bound. We can constrain this further
	const maxNumPotentialArtificeItems =
		seenItemCounts.artifice + numRemainingArmorPieces;
	if (requiredArtificeModIdList.length > maxNumPotentialArtificeItems) {
		return {
			shortCircuit: true,
			requiredArmorStatModIdList,
			requiredArtificeModIdList,
			requiredArmorStatModsArmorStatMapping,
			armorStat: null,
			slot,
			numUnusedArtificeMods,
			requiredClassItemExtraModSocketCategoryId,
		};
	}

	const hasValidArmorStatMods = hasValidArmorStatModPermutation(
		armorSlotMods,
		requiredArmorStatModIdList,
		validRaidModArmorSlotPlacements
	);

	if (!hasValidArmorStatMods) {
		return {
			shortCircuit: true,
			requiredArmorStatModIdList,
			requiredArtificeModIdList,
			requiredArmorStatModsArmorStatMapping,
			armorStat: null,
			slot: null,
			numUnusedArtificeMods,
			requiredClassItemExtraModSocketCategoryId,
		};
	}

	for (let i = 0; i < ArmorStatIdList.length; i++) {
		const armorStat = ArmorStatIdList[i];
		if (
			sumOfSeenStats[i] +
				requiredArmorStatModsArmorStatMapping[armorStat] +
				maxRemaningPossibleStatValue <
			desiredArmorStats[armorStat]
		) {
			// console.log(`
			// 	short-circuiting ${slot}:
			// 		stat: ${desiredArmorStats[ArmorStats[i]]},
			// 		sum: ${sumOfSeenStats[i]},
			// 		value: ${stat}
			// `);
			return {
				shortCircuit: true,
				requiredArmorStatModIdList,
				requiredArtificeModIdList,
				requiredArmorStatModsArmorStatMapping,
				armorStat,
				slot,
				numUnusedArtificeMods,
				requiredClassItemExtraModSocketCategoryId,
			};
		}
	}

	return {
		shortCircuit: false,
		requiredArmorStatModIdList,
		requiredArtificeModIdList,
		requiredArmorStatModsArmorStatMapping,
		armorStat: null,
		slot: null,
		numUnusedArtificeMods,
		requiredClassItemExtraModSocketCategoryId,
	};
};

export type DoProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: StrictArmorItems;
	masterworkAssumption: EMasterworkAssumption;
	fragmentArmorStatMapping: ArmorStatMapping;
	modArmorStatMapping: ArmorStatMapping;
	validRaidModArmorSlotPlacements: ValidRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	armorMetadataItem: ArmorMetadataItem;
	selectedExotic: AvailableExoticArmorItem;
};

const getExtraSumOfSeenStats = (
	fragmentArmorStatMapping: ArmorStatMapping,
	modArmorStatMapping: ArmorStatMapping
): StatList => {
	const sumOfSeenStats: StatList = [0, 0, 0, 0, 0, 0];
	ArmorStatIdList.forEach((id, i) => {
		sumOfSeenStats[i] =
			sumOfSeenStats[i] +
			fragmentArmorStatMapping[id] +
			modArmorStatMapping[id];
	});
	return sumOfSeenStats;
};

const getArmorStatMappingFromArtificeModIdList = (
	artificeModIdList: EModId[]
): ArmorStatMapping => {
	const armorStatMapping: ArmorStatMapping = { ...DefaultArmorStatMapping };
	artificeModIdList.forEach((artificeModId) => {
		armorStatMapping[getMod(artificeModId).bonuses[0].stat] +=
			ARTIFICE_BONUS_VALUE;
	});
	return armorStatMapping;
};

const getSeenArmorSlotItemsFromClassItems = (
	armorMetadataItem: ArmorMetadataItem
): SeenArmorSlotItems => {
	const seenArmorSlotItems = getDefaultSeenArmorSlotItems();

	if (armorMetadataItem.classItem.hasArtificeClassItem) {
		seenArmorSlotItems.ClassItems.artifice = true;
	}

	EExtraSocketModCategoryIdList.forEach((extraSocketModCategoryId) => {
		if (
			armorMetadataItem.extraSocket.items[extraSocketModCategoryId].items[
				EArmorSlotId.ClassItem
			].count > 0
		) {
			seenArmorSlotItems.ClassItems[extraSocketModCategoryId] = true;
		}
	});
	return seenArmorSlotItems;
};

/**
 * @param {ArmorItems2} armorItems - [heads, arms, chests, legs]
 * @returns {ProcessArmorOutput} All the combinations of armor ids that meet the required specs
 * @description This function expects that every combination of [heads, arms, chests, legs]
 * is valid.
 */
export const doProcessArmor = ({
	desiredArmorStats,
	armorItems,
	masterworkAssumption,
	fragmentArmorStatMapping,
	modArmorStatMapping,
	validRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	selectedExotic,
}: DoProcessArmorParams): ProcessArmorOutput => {
	// Add in the class item
	const extraSumOfSeenStats = getExtraSumOfSeenStats(
		fragmentArmorStatMapping,
		modArmorStatMapping
	);
	let sumOfSeenStats = [...extraSumOfSeenStats];
	if (
		armorMetadataItem.classItem.hasMasterworkedLegendaryClassItem ||
		(masterworkAssumption !== EMasterworkAssumption.None &&
			armorMetadataItem.classItem.hasLegendaryClassItem)
	) {
		sumOfSeenStats = sumOfSeenStats.map((x) => x + 2);
	}

	const seenArmorSlotItems =
		getSeenArmorSlotItemsFromClassItems(armorMetadataItem);
	const processArmorParams: ProcessArmorParams = {
		masterworkAssumption,
		desiredArmorStats,
		armorItems,
		sumOfSeenStats: sumOfSeenStats as StatList,
		seenArmorIds: [],
		validRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		destinyClassId,
		armorMetadataItem,
		specialSeenArmorSlotItems: seenArmorSlotItems,
		selectedExotic,
	};

	const processedArmor: ProcessArmorOutput = processArmor(processArmorParams);
	return processedArmor;
};

const getNextSeenStats = (
	sumOfSeenStats: StatList,
	armorSlotItem: ArmorItem,
	masterworkAssumption: EMasterworkAssumption
): StatList =>
	sumOfSeenStats.map(
		(x, i) =>
			x +
			armorSlotItem.stats[i] +
			getExtraMasterworkedStats(armorSlotItem, masterworkAssumption)
	) as StatList;

const _processArmorBaseCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	validRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	specialSeenArmorSlotItems,
	selectedExotic,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems] = armorItems;
	const output: ProcessArmorOutput = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const {
			nextSumOfSeenStats: finalSumOfSeenStats,
			nextSeenArmorSlotItems: finalSpecialSeenArmorSlotItems,
		} = getNextValues({
			numArmorItems: 0,
			seenArmorSlotItems: specialSeenArmorSlotItems,
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption,
		});
		const armorIdList = [...seenArmorIds, armorSlotItem.id] as ArmorIdList;

		const {
			shortCircuit,
			requiredArmorStatModIdList,
			requiredArtificeModIdList,
			requiredArmorStatModsArmorStatMapping,
			numUnusedArtificeMods,
			requiredClassItemExtraModSocketCategoryId,
		} = shouldShortCircuit({
			sumOfSeenStats: finalSumOfSeenStats,
			desiredArmorStats,
			numRemainingArmorPieces: 0,
			validRaidModArmorSlotPlacements,
			armorSlotMods,
			raidMods,
			destinyClassId,
			specialSeenArmorSlotItems: finalSpecialSeenArmorSlotItems,
			armorMetadataItem,
			selectedExotic,
		});
		if (shortCircuit) {
			// console.log(`short circuiting base case.`);
			return;
		}
		const totalArmorStatMapping = sumArmorStatMappings([
			getArmorStatMappingFromStatList(finalSumOfSeenStats),
			requiredArmorStatModsArmorStatMapping,
			getArmorStatMappingFromArtificeModIdList(requiredArtificeModIdList),
		]);
		output.push({
			armorIdList,
			armorStatModIdList: requiredArmorStatModIdList,
			artificeModIdList: requiredArtificeModIdList,
			numUnusedArtificeMods,
			requiredClassItemExtraModSocketCategoryId,
			metadata: {
				// requiredStatModIdList: requiredStatMods, // TODO: Why is this necessary when it's returned right above here?
				totalModCost: getTotalModCost(requiredArmorStatModIdList),
				totalStatTiers: getTotalStatTiers(totalArmorStatMapping),
				wastedStats: getWastedStats(totalArmorStatMapping),
				totalArmorStatMapping,
				// requiredArtificeModIdList,
			},
		});
	});
	// console.log('>>>>>> Base Case output:', output);
	return output;
};

type GetNextValuesParams = {
	numArmorItems: number;
	seenArmorSlotItems: SeenArmorSlotItems;
	sumOfSeenStats: StatList;
	armorSlotItem: ArmorItem;
	masterworkAssumption: EMasterworkAssumption;
};

const getNextValues = ({
	numArmorItems,
	seenArmorSlotItems,
	sumOfSeenStats,
	armorSlotItem,
	masterworkAssumption,
}: GetNextValuesParams) => {
	const slot = getArmorSlotFromNumRemainingArmorPieces(numArmorItems);
	const nextSeenArmorSlotItems = cloneDeep(seenArmorSlotItems);
	if (armorSlotItem.isArtifice) {
		nextSeenArmorSlotItems[slot] = ARTIFICE;
	} else if (armorSlotItem.extraSocketModCategoryId !== null) {
		nextSeenArmorSlotItems[slot] = armorSlotItem.extraSocketModCategoryId;
	}
	const nextSumOfSeenStats = getNextSeenStats(
		sumOfSeenStats,
		armorSlotItem,
		masterworkAssumption
	);

	return {
		nextSeenArmorSlotItems,
		nextSumOfSeenStats,
	};
};

const _processArmorRecursiveCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	validRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	specialSeenArmorSlotItems,
	selectedExotic,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems, ...rest] = armorItems;
	const output: ProcessArmorOutput[] = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const {
			nextSumOfSeenStats,
			nextSeenArmorSlotItems: nextSpecialSeenArmorSlotItems,
		} = getNextValues({
			numArmorItems: rest.length,
			seenArmorSlotItems: specialSeenArmorSlotItems,
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption,
		});

		const { shortCircuit } = shouldShortCircuit({
			sumOfSeenStats: nextSumOfSeenStats,
			desiredArmorStats: desiredArmorStats,
			numRemainingArmorPieces: rest.length,
			validRaidModArmorSlotPlacements,
			armorSlotMods,
			raidMods,
			destinyClassId,
			specialSeenArmorSlotItems: nextSpecialSeenArmorSlotItems,
			armorMetadataItem,
			selectedExotic,
		});
		if (shortCircuit) {
			// console.log(`short circuiting recursive case. ${rest.length} slots`);
			return;
		}

		output.push(
			processArmor({
				desiredArmorStats,
				armorItems: rest,
				sumOfSeenStats: nextSumOfSeenStats,
				seenArmorIds: [...seenArmorIds, armorSlotItem.id],
				masterworkAssumption,
				validRaidModArmorSlotPlacements,
				armorSlotMods,
				raidMods,
				destinyClassId,
				armorMetadataItem,
				specialSeenArmorSlotItems: nextSpecialSeenArmorSlotItems,
				selectedExotic,
			})
		);
	});
	// TODO: Can we find a way to not have to do this flattening?
	return output.flat(1);
};

export type ProcessedArmorItemMetadata = {
	totalModCost: number;
	totalStatTiers: number;
	wastedStats: number;
	totalArmorStatMapping: ArmorStatMapping;
	// requiredStatModIdList: EModId[];
	// requiredArtificeModIdList: EArmorStatId[];
};

type ProcessArmorOutputItem = {
	armorIdList: ArmorIdList;
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
	numUnusedArtificeMods: number;
	requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId;
	// Anything that the user can sort the results by should be pre-calculated right here
	metadata: ProcessedArmorItemMetadata;
};
export type ProcessArmorOutput = ProcessArmorOutputItem[];

type ProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: ArmorItems[];
	sumOfSeenStats: StatList;
	seenArmorIds: string[];
	masterworkAssumption: EMasterworkAssumption;
	validRaidModArmorSlotPlacements: ValidRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	armorMetadataItem: ArmorMetadataItem;
	specialSeenArmorSlotItems: SeenArmorSlotItems;
	selectedExotic: AvailableExoticArmorItem;
};

const processArmor = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	validRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	specialSeenArmorSlotItems,
	selectedExotic,
}: ProcessArmorParams): ProcessArmorOutput => {
	if (armorItems.length === 1) {
		return _processArmorBaseCase({
			desiredArmorStats,
			armorItems,
			sumOfSeenStats,
			seenArmorIds,
			masterworkAssumption,
			validRaidModArmorSlotPlacements,
			armorSlotMods,
			raidMods,
			destinyClassId,
			armorMetadataItem,
			specialSeenArmorSlotItems,
			selectedExotic,
		});
	}

	return _processArmorRecursiveCase({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats,
		seenArmorIds,
		masterworkAssumption,
		validRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		destinyClassId,
		armorMetadataItem,
		specialSeenArmorSlotItems,
		selectedExotic,
	});
};

// Transform the shape of the application's armor to be processed.
// Filter out any armor items that will definitely not be used.
export const preProcessArmor = (
	armorGroup: ArmorGroup,
	selectedExoticArmor: ISelectedExoticArmor,
	dimLoadouts: Loadout[],
	dimLoadoutsFilterId: EDimLoadoutsFilterId,
	minimumGearTier: EGearTierId
): StrictArmorItems => {
	const excludedItemIds: Record<string, boolean> = {};
	if (dimLoadoutsFilterId === EDimLoadoutsFilterId.None) {
		dimLoadouts.forEach((loadout) =>
			loadout.equipped.forEach((equipped) => {
				excludedItemIds[equipped.id] = true;
			})
		);
	}

	const strictArmorItems: StrictArmorItems = [[], [], [], []];
	ArmorSlotIdList.forEach((armorSlot, i) => {
		if (armorSlot === selectedExoticArmor.armorSlot) {
			strictArmorItems[i] = Object.values(armorGroup[armorSlot].exotic).filter(
				(item) =>
					!excludedItemIds[item.id] && item.hash === selectedExoticArmor.hash
			);
			return;
		}
		strictArmorItems[i] = Object.values(armorGroup[armorSlot].nonExotic).filter(
			(item) => {
				// TODO: Write a better comparator for gear tiers
				if (
					item.gearTierId === EGearTierId.Uncommon ||
					item.gearTierId === EGearTierId.Common ||
					item.gearTierId === EGearTierId.Unknown
				) {
					return false;
				}
				// TODO: If the gear tier selector ever allows lower than blue this will need to be changed
				if (
					minimumGearTier === EGearTierId.Legendary &&
					item.gearTierId !== EGearTierId.Legendary
				) {
					return false;
				}
				return !excludedItemIds[item.id];
			}
		);
	});
	return strictArmorItems;
};

// Convert an ordered list of stats into a mapping
const getArmorStatMappingFromStatList = (
	statList: StatList
): ArmorStatMapping => {
	const res: ArmorStatMapping = {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	};
	ArmorStatIdList.forEach((armorStatId, i) => {
		res[armorStatId] = statList[i];
	});
	return res;
};

// Get the total number of stat tiers for an ArmorStatMapping
const getTotalStatTiers = (armorStatMapping: ArmorStatMapping): number => {
	let res = 0;
	ArmorStatIdList.forEach((armorStatId) => {
		res += roundDown10(armorStatMapping[armorStatId]) / 10;
	});
	return res;
};

const getTotalModCost = (armorStatModIds: EModId[]): number => {
	let res = 0;
	armorStatModIds.forEach((id) => {
		res += getMod(id).cost;
	});
	return res;
};

const getWastedStats = (armorStatMapping: ArmorStatMapping): number => {
	let res = 0;
	ArmorStatIdList.forEach((armorStatId) => {
		res += armorStatMapping[armorStatId] % 10;
	});
	return res;
};

const ARTIFICE = 'artifice';

export type SeenArmorSlotClassItems = Record<
	EExtraSocketModCategoryId,
	boolean
> & {
	artifice: boolean;
};
export type SeenArmorSlotItems = {
	[EArmorSlotId.Head]: EExtraSocketModCategoryId | 'artifice';
	[EArmorSlotId.Arm]: EExtraSocketModCategoryId | 'artifice';
	[EArmorSlotId.Chest]: EExtraSocketModCategoryId | 'artifice';
	[EArmorSlotId.Leg]: EExtraSocketModCategoryId | 'artifice';
	ClassItems: SeenArmorSlotClassItems;
};

export const getDefaultSeenArmorSlotItems = (): SeenArmorSlotItems => {
	return {
		[EArmorSlotId.Head]: null,
		[EArmorSlotId.Arm]: null,
		[EArmorSlotId.Chest]: null,
		[EArmorSlotId.Leg]: null,
		ClassItems: {
			artifice: false,
			[EExtraSocketModCategoryId.DeepStoneCrypt]: false,
			[EExtraSocketModCategoryId.GardenOfSalvation]: false,
			[EExtraSocketModCategoryId.KingsFall]: false,
			[EExtraSocketModCategoryId.LastWish]: false,
			[EExtraSocketModCategoryId.Nightmare]: false,
			[EExtraSocketModCategoryId.VaultOfGlass]: false,
			[EExtraSocketModCategoryId.VowOfTheDisciple]: false,
			[EExtraSocketModCategoryId.RootOfNightmares]: false,
		},
	};
};

export const getExtraSocketModCategoryIdCountsFromRaidModIdList = (
	raidModIdList: EModId[]
): Partial<Record<EExtraSocketModCategoryId, number>> => {
	const counts: Partial<Record<EExtraSocketModCategoryId, number>> = {};
	for (let i = 0; i < raidModIdList.length; i++) {
		const mod = getMod(raidModIdList[i]);
		if (!counts[mod.modCategoryId]) {
			counts[mod.modCategoryId] = 0;
		}
		counts[mod.modCategoryId]++;
	}
	return counts;
};

export const hasValidSeenItemCounts = (
	seenItemCountsWithoutClassItems: ItemCounts,
	raidModExtraSocketModCategoryIdCounts: Partial<
		Record<EExtraSocketModCategoryId, number>
	>,
	seenArmorSlotClassItems: SeenArmorSlotClassItems
): {
	isValid: boolean;
	requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId;
} => {
	let isValid = true;
	let requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId =
		null;
	const extraSocketModCategoryIdList = Object.keys(
		raidModExtraSocketModCategoryIdCounts
	) as unknown as EExtraSocketModCategoryId[];
	if (extraSocketModCategoryIdList.length > 0) {
		// Check to see if we have armor that can fit these mods
		for (let i = 0; i < extraSocketModCategoryIdList.length; i++) {
			const extraSocketModCategoryId = extraSocketModCategoryIdList[i];
			if (
				raidModExtraSocketModCategoryIdCounts[extraSocketModCategoryId] >
				seenItemCountsWithoutClassItems[extraSocketModCategoryId]
			) {
				// Add in the class item if we have to
				// TODO: This logic will need to change for combos where we have enough
				// non-class item pieces but they don't have the mod space to fit the raid
				// mods without using the class item for a raid mod
				if (
					requiredClassItemExtraModSocketCategoryId === null &&
					seenArmorSlotClassItems[extraSocketModCategoryId] &&
					raidModExtraSocketModCategoryIdCounts[extraSocketModCategoryId] ===
						seenItemCountsWithoutClassItems[extraSocketModCategoryId] + 1
				) {
					requiredClassItemExtraModSocketCategoryId = extraSocketModCategoryId;
					continue;
				}
				isValid = false;
				requiredClassItemExtraModSocketCategoryId = null;
				break;
			}
		}
	}
	return { isValid, requiredClassItemExtraModSocketCategoryId };
};
