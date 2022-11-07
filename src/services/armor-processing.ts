import { Description } from '@mui/icons-material';
import { ArmorStatOrder, DesiredArmorStats, EArmorStatName } from './data';
import type { ItemTierName } from '@dlb/dim/search/d2-known-values';
import { BucketHashes } from '@dlb/dim/data/d2/generated-enums';
// No legendary piece of armor has a single stat above 30
// TODO: Can we dynamically set this per slot? Like not every user
// is going to have six helmets with 30 in each of the stats. So can we create a mapping
// before processing. e.g.: {helmet: {mob: 28, res: 27, rec: 30, ...}, gauntlets: {mob: 29, ...}}.
// We can even "override" this with the max stats for a specific exotic when one is chosen.
const MAX_BASE_STAT_VALUE = 30;

export type StatList = [number, number, number, number, number, number];

export type DestinyItem = {
	// Unique identifier for this specific piece of armor.
	id: string;
	// Non-unique identifier. All "Crest of Alpha Lupi" armor pieces will have the same hash.
	hash: string;
};

// "extend" the DestinyItem type
export type ArmorItem = DestinyItem & {
	// Mobility, Resilience, Recovery, Discipline, Intellect, Strength
	stats: StatList;
	// Is this piece of armor an exotic
	isExotic: boolean;
	// // Is this piece of armor masterworked
	// isMasterworked: boolean;
};

// Strictly enforce the length of this array [Helmets, Gauntlets, Chest Armors, Leg Armors]
export type StrictArmorItems = [
	ArmorItem[],
	ArmorItem[],
	ArmorItem[],
	ArmorItem[]
];

// We don't export this type... only in this file should we be able to use non-strict armor items
// Otherwise we MUST pass in an array of length 4 for each [Helmet, Gauntlet, Chest, Leg]
type ArmorItems = ArmorItem[];

// Four armor ids [Helmet, Gauntlet, Chest, Leg]
export type ArmorIdList = [string, string, string, string];

export const ArmorSlotHashOrder = {
	[BucketHashes.Helmet]: 0,
	[BucketHashes.Gauntlets]: 1,
	[BucketHashes.ChestArmor]: 2,
	[BucketHashes.LegArmor]: 3
};

export type SelectedExoticArmor = {
	hash: string;
	slot:
		| BucketHashes.Helmet
		| BucketHashes.Gauntlets
		| BucketHashes.ChestArmor
		| BucketHashes.LegArmor;
};

export type ProcessArmorOutput = ArmorIdList[];

export type DoProcessArmorParams = {
	desiredArmorStats: DesiredArmorStats;
	armorItems: StrictArmorItems;
};

type ProcessArmorParams = {
	desiredArmorStats: DesiredArmorStats;
	armorItems: ArmorItems[];
	sumOfSeenStats: StatList;
	seenArmorIds: string[];
};

export type ShouldShortCircuitParams = {
	sumOfSeenStats: StatList;
	armorStats: StatList;
	desiredArmorStats: DesiredArmorStats;
	numRemainingArmorPieces: number; // TODO: Can we enforce this to be one of 3 | 2 | 1
};

const getArmorSlotFromNumRemainingArmorPieces = (num: number) => {
	if ([3, 2, 1].includes(num)) {
		return numRemainingArmorPiecesToArmorSlot[num];
	}
	throw `num is not 3,2,1: ${num}`;
};
const numRemainingArmorPiecesToArmorSlot = {
	3: 'helmet',
	2: 'gauntlets',
	1: 'chest armor'
};

export const shouldShortCircuit = (
	params: ShouldShortCircuitParams
): [
	boolean,
	EArmorStatName | null,
	'helmet' | 'gauntlets' | 'chest armor' | ''
] => {
	const {
		sumOfSeenStats,
		armorStats,
		desiredArmorStats,
		numRemainingArmorPieces
	} = params;
	const maxRemaning = MAX_BASE_STAT_VALUE * numRemainingArmorPieces;

	// TODO: I hate this entries thing, can we just use a forEach() or a normal for loop?
	for (const [i, stat] of armorStats.entries()) {
		if (
			stat + sumOfSeenStats[i] + maxRemaning <
			desiredArmorStats[ArmorStatOrder[i]]
		) {
			const slot = getArmorSlotFromNumRemainingArmorPieces(
				numRemainingArmorPieces
			);
			console.log(`
				short-circuiting ${slot}:
					stat: ${desiredArmorStats[ArmorStatOrder[i]]},
					sum: ${sumOfSeenStats[i]},
					value: ${stat}
			`);
			return [true, ArmorStatOrder[i], slot];
		}
	}
	return [false, null, ''];
};

/**
 * @param {ArmorItems2} armorItems - [helmets, gauntlets, chestArmors, legArmors]
 * @returns {ProcessArmorOutput} All the combinations of armor ids that meet the required specs
 * @description This function expects that every combination of [helmets, gauntlets, chestArmors, legArmors]
 * is valid.
 */
export const doProcessArmor = ({
	desiredArmorStats,
	armorItems
}: DoProcessArmorParams): ProcessArmorOutput => {
	return processArmor({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats: [0, 0, 0, 0, 0, 0],
		seenArmorIds: []
	});
};

const getNextSeenStats = (
	sumOfSeenStats: StatList,
	armorSlotItem: ArmorItem
): StatList =>
	sumOfSeenStats.map((x, i) => x + armorSlotItem.stats[i]) as StatList;

const _processArmorBaseCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems] = armorItems;
	const output: ProcessArmorOutput = [];
	armorSlotItems.forEach((armorSlotItem) => {
		let isValid = true;
		const finalSumOfSeenStats = getNextSeenStats(sumOfSeenStats, armorSlotItem);
		for (let i = 0; i < ArmorStatOrder.length; i++) {
			if (desiredArmorStats[ArmorStatOrder[i]] > finalSumOfSeenStats[i]) {
				// skip
				isValid = false;
				break;
			}
		}
		if (isValid) {
			output.push([...seenArmorIds, armorSlotItem.id] as ArmorIdList);
		}
	});
	return output;
};

const _processArmorRecursiveCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems, ...rest] = armorItems;
	const output: ProcessArmorOutput[] = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const [shortCircuit] = shouldShortCircuit({
			sumOfSeenStats,
			armorStats: armorSlotItem.stats,
			desiredArmorStats: desiredArmorStats,
			numRemainingArmorPieces: rest.length
		});
		if (shortCircuit) {
			console.log(`short circuiting ${rest.length} slots`);
			return;
		}

		const nextSumOfSeenStats = getNextSeenStats(sumOfSeenStats, armorSlotItem);
		output.push(
			processArmor({
				desiredArmorStats,
				armorItems: rest,
				sumOfSeenStats: nextSumOfSeenStats,
				seenArmorIds: [...seenArmorIds, armorSlotItem.id]
			})
		);
	});
	return output.flat(1);
};

export const processArmor = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds
}: ProcessArmorParams): ProcessArmorOutput => {
	if (armorItems.length === 1) {
		return _processArmorBaseCase({
			desiredArmorStats,
			armorItems,
			sumOfSeenStats,
			seenArmorIds
		});
	}

	return _processArmorRecursiveCase({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats,
		seenArmorIds
	});
};
