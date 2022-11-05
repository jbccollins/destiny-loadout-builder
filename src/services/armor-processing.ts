import { ArmorStatOrder, DesiredArmorStats, EArmorStatName } from './data';

// No legendary piece of armor has a single stat above 30
const MAX_BASE_STAT_VALUE = 30;

export type StatList = [number, number, number, number, number, number];

export type ArmorItem = {
	id: number;
	// Mobility, Resilience, Recovery, Discipline, Intellect, Strength
	stats: StatList;
};
// Helmets, Gauntlets, Chest Armors, Leg Armors
export type ArmorItems = [ArmorItem[], ArmorItem[], ArmorItem[], ArmorItem[]];
export type ArmorItems2 = ArmorItem[][];

// Four armor ids [Helmet, Gauntlet, Chest, Leg]
export type ArmorIdList = [number, number, number, number];

export type ProcessArmorOutput = ArmorIdList[];

// export type ProcessArmorParams = {
// 	desiredArmorStats: DesiredArmorStats;
// 	armorItems: ArmorItems;
// };

export type DoProcessArmorParams = {
	desiredArmorStats: DesiredArmorStats;
	armorItems: ArmorItems2;
};

type ProcessArmorParams = {
	desiredArmorStats: DesiredArmorStats;
	armorItems: ArmorItems2;
	sumOfSeenStats: StatList;
	seenArmorIds: number[];
};

type ProcessArmorBaseCaseParams = {
	desiredArmorStats: DesiredArmorStats;
	armorSlotItems: ArmorItem[];
	sumOfSeenStats: StatList;
	seenArmorIds: number[];
};

export type ShouldShortCircuitParams = {
	sumOfSeenStats: StatList;
	armorStats: StatList;
	desiredArmorStats: DesiredArmorStats;
	numRemainingArmorPieces: number; // TODO: 3 | 2 | 1
};

const getArmorSlotFromNumRemainingArmorPieces = (num: number) => {
	if ([3, 2, 1].includes(num)) {
		return numRemainingArmorPiecesToArmorSlot[num];
	}
	throw `num is n ot 3,2,1: ${num}`;
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
 * @param {ArmorItems2} armorItems - [helments, gauntlets, chestArmors, legArmors]
 * @returns {ProcessArmorOutput} All the combinations of armor ids that meet the required specs
 */
export const doProcessArmor = ({
	desiredArmorStats,
	armorItems
}: DoProcessArmorParams): ProcessArmorOutput => {
	if (armorItems.length != 4) {
		throw 'armorItems must be of length four and represent: [helments, gauntlets, chestArmors, legArmors]';
	}
	return processArmor2({
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

const _processArmor2BaseCase = ({
	desiredArmorStats,
	armorSlotItems,
	sumOfSeenStats,
	seenArmorIds
}: ProcessArmorBaseCaseParams): ProcessArmorOutput => {
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

const _processArmor2RecursiveCase = ({
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
			processArmor2({
				desiredArmorStats,
				armorItems: rest,
				sumOfSeenStats: nextSumOfSeenStats,
				seenArmorIds: [...seenArmorIds, armorSlotItem.id]
			})
		);
	});
	return output.flat(1);
	return armorSlotItems
		.map((armorSlotItem) => {
			const nextSumOfSeenStats = getNextSeenStats(
				sumOfSeenStats,
				armorSlotItem
			);
			return processArmor2({
				desiredArmorStats,
				armorItems: rest,
				sumOfSeenStats: nextSumOfSeenStats,
				seenArmorIds: [...seenArmorIds, armorSlotItem.id]
			});
		})
		.flat(1); // TODO: can I just use .flatMap() instead?;
};

export const processArmor2 = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds
}: ProcessArmorParams): ProcessArmorOutput => {
	if (armorItems.length === 1) {
		return _processArmor2BaseCase({
			desiredArmorStats,
			armorSlotItems: armorItems[0],
			sumOfSeenStats,
			seenArmorIds
		});
	}

	return _processArmor2RecursiveCase({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats,
		seenArmorIds
	});
};

// export const processArmor = ({
// 	desiredArmorStats,
// 	armorItems
// }: ProcessArmorParams): ProcessArmorOutput => {
// 	const [helmets, gauntlets, chestArmors, legArmors] = armorItems;
// 	const output: ProcessArmorOutput = [];

// 	helmets.forEach((helmet) => {
// 		/*
// 			Keep track of the sums of each stat that we've seen so far.
// 			We can use this to short circuit some of the looping.
// 		*/
// 		const [shortCircuit] = shouldShortCircuit({
// 			sumOfSeenStats: [0, 0, 0, 0, 0, 0],
// 			armorStats: helmet.stats,
// 			desiredArmorStats: desiredArmorStats,
// 			numRemaingArmorPieces: 3
// 		});
// 		if (shortCircuit) {
// 			console.log('breaking on helmet');
// 			return;
// 		}

// 		gauntlets.forEach((gauntlet) => {
// 			const [shortCircuit] = shouldShortCircuit({
// 				sumOfSeenStats: [...helmet.stats],
// 				armorStats: gauntlet.stats,
// 				desiredArmorStats: desiredArmorStats,
// 				numRemaingArmorPieces: 2
// 			});
// 			if (shortCircuit) {
// 				return;
// 			}
// 			chestArmors.forEach((chestArmor) => {
// 				legArmors.forEach((legArmor) => {
// 					let isValid = true;
// 					ArmorStatOrder.forEach((stat, i) => {
// 						if (
// 							desiredArmorStats[stat] >
// 							helmet.stats[i] +
// 								gauntlet.stats[i] +
// 								chestArmor.stats[i] +
// 								legArmor.stats[i]
// 						) {
// 							// skip
// 							isValid = false;
// 							return;
// 						}
// 					});
// 					if (isValid) {
// 						output.push([helmet.id, gauntlet.id, chestArmor.id, legArmor.id]);
// 					}
// 				});
// 			});
// 		});
// 	});
// 	return output;
// };
