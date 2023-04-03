import { Loadout } from '@destinyitemmanager/dim-api-types/loadouts';
import { EModId } from '@dlb/generated/mod/EModId';
import { SelectedExoticArmorState } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
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
} from '@dlb/types/ArmorStat';
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
	ValidRaidModArmorSlotPlacements,
} from '@dlb/types/Mod';
import combinations from '@dlb/utils/combinations';
import { ARTIFICE_BONUS_VALUE } from '@dlb/utils/item-utils';
import { cloneDeep, isEqual } from 'lodash';

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
	numUnusedArtificeMods: number;
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

	// Try to optimize a bit further by swapping out major mods with minor mods and padding with artifice mods
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

export type ShouldShortCircuitParams = {
	sumOfSeenStats: StatList;
	desiredArmorStats: ArmorStatMapping;
	numRemainingArmorPieces: number; // TODO: Can we enforce this to be one of 3 | 2 | 1
	validRaidModArmorSlotPlacements: ValidRaidModArmorSlotPlacements;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
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
	seenArmorSlotItems: SeenArmorSlotItems
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
	Object.keys(getDefaultItemCounts()).forEach((key) => {
		if (seenArmorSlotItems.ClassItems[key]) {
			itemCounts[key]++;
		}
	});
	return itemCounts;
};

export const shouldShortCircuit = (
	params: ShouldShortCircuitParams
): ShouldShortCircuitOutput => {
	const {
		sumOfSeenStats,
		desiredArmorStats,
		numRemainingArmorPieces,
		validRaidModArmorSlotPlacements,
		armorSlotMods,
		destinyClassId,
		specialSeenArmorSlotItems,
		selectedExotic,
		armorMetadataItem,
	} = params;

	const seenItemCounts = getItemCountsFromSeenArmorSlotItems(
		specialSeenArmorSlotItems
	);
	// TODO: Knowing the rules around stat clustering [mob, res, rec] and [dis, int, str]
	// how each of those groups adds up to a max base total of 34 we can probably short circuit
	// muuuuuch more often. If we know that we needed to have a 30 in both mob and res for a
	// single armor piece in order for it to work in this combination we can tell that's an impossible
	// piece of armor so we are done right then and there. Combine that logic
	// with dynamic MAX_SINGLE_STAT_VALUE and we can have a really efficient check here.
	const maxRemaningPossibleStatValue = getMaxPossibleRemainingStatValue(
		numRemainingArmorPieces,
		seenItemCounts.artifice,
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
		numSeenArtificeArmorItems: seenItemCounts.artifice,
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
	};
};

export type DoProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: StrictArmorItems;
	masterworkAssumption: EMasterworkAssumption;
	fragmentArmorStatMapping: ArmorStatMapping;
	modArmorStatMapping: ArmorStatMapping;
	validRaidModArmorSlotPlacements: ValidRaidModArmorSlotPlacements;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
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
		} = shouldShortCircuit({
			sumOfSeenStats: finalSumOfSeenStats,
			desiredArmorStats,
			numRemainingArmorPieces: 0,
			validRaidModArmorSlotPlacements,
			armorSlotMods,
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
	validRaidModArmorSlotPlacements: ValidRaidModArmorSlotPlacements;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
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

export type SeenArmorSlotItems = {
	[EArmorSlotId.Head]: EExtraSocketModCategoryId | 'artifice';
	[EArmorSlotId.Arm]: EExtraSocketModCategoryId | 'artifice';
	[EArmorSlotId.Chest]: EExtraSocketModCategoryId | 'artifice';
	[EArmorSlotId.Leg]: EExtraSocketModCategoryId | 'artifice';
	ClassItems: Record<EExtraSocketModCategoryId, boolean> & {
		artifice: boolean;
	};
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
		},
	};
};
