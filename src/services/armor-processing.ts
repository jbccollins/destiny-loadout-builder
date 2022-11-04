import { ArmorStatOrder, DesiredArmorStats, EArmorStatName } from './data';

// No legendary piece of armor has a single stat above 30
const MAX_BASE_STAT_VALUE = 30;

type StatList = [number, number, number, number, number, number];

export type ArmorItem = {
	id: number;
	// Mobility, Resilience, Recovery, Discipline, Intellect, Strength
	stats: StatList;
};
// Helmets, Gauntlets, Chest Armors, Leg Armors
export type ArmorItems = [ArmorItem[], ArmorItem[], ArmorItem[], ArmorItem[]];

// Four armor ids [Helmet, Gauntlet, Chest, Leg]
export type ProcessArmorOutput = [number, number, number, number][];

export type ProcessArmorParams = {
	desiredArmorStats: DesiredArmorStats;
	armorItems: ArmorItems;
};

export type ShouldShortCircuitParams = {
	sumOfSeenStats: StatList;
	armorStats: StatList;
	desiredArmorStats: DesiredArmorStats;
	numRemaingArmorPieces: number;
};

export const shouldShortCircuit = (
	params: ShouldShortCircuitParams
): [boolean, EArmorStatName | null] => {
	const {
		sumOfSeenStats,
		armorStats,
		desiredArmorStats,
		numRemaingArmorPieces
	} = params;
	const maxRemaning = MAX_BASE_STAT_VALUE * numRemaingArmorPieces;

	// TODO: I hate this entries thing, can we just use a forEach() or a normal for loop?
	for (const [i, stat] of armorStats.entries()) {
		if (
			stat + sumOfSeenStats[i] + maxRemaning <
			desiredArmorStats[ArmorStatOrder[i]]
		) {
			console.log(`
				short-circuiting gauntlet:
					stat: ${desiredArmorStats[ArmorStatOrder[i]]},
					sum: ${sumOfSeenStats[i]},
					value: ${stat}
			`);
			return [true, ArmorStatOrder[i]];
		}
	}
	return [false, null];
};

export const processArmor = ({
	desiredArmorStats,
	armorItems
}: ProcessArmorParams): ProcessArmorOutput => {
	const [helmets, gauntlets, chestArmors, legArmors] = armorItems;
	const output: ProcessArmorOutput = [];

	let helmet: ArmorItem;
	let gauntlet: ArmorItem;
	let chestArmor: ArmorItem;
	let legArmor: ArmorItem;
	helmets.forEach((helmet) => {
		/*
			Keep track of the sums of each stat that we've seen so far.
			We can use this to short circuit some of the looping.
		*/
		const [shortCircuit] = shouldShortCircuit({
			sumOfSeenStats: [0, 0, 0, 0, 0, 0],
			armorStats: helmet.stats,
			desiredArmorStats: desiredArmorStats,
			numRemaingArmorPieces: 3
		});
		if (shortCircuit) {
			console.log('breaking on helmet');
			return;
		}

		gauntlets.forEach((gauntlet) => {
			const [shortCircuit] = shouldShortCircuit({
				sumOfSeenStats: [...helmet.stats],
				armorStats: gauntlet.stats,
				desiredArmorStats: desiredArmorStats,
				numRemaingArmorPieces: 2
			});
			if (shortCircuit) {
				return;
			}
			chestArmors.forEach((chestArmor) => {
				legArmors.forEach((legArmor) => {
					let isValid = true;
					ArmorStatOrder.forEach((stat, i) => {
						if (
							desiredArmorStats[stat] >
							helmet.stats[i] +
								gauntlet.stats[i] +
								chestArmor.stats[i] +
								legArmor.stats[i]
						) {
							// skip
							isValid = false;
							return;
						}
					});
					if (isValid) {
						output.push([helmet.id, gauntlet.id, chestArmor.id, legArmor.id]);
					}
				});
			});
		});
	});
	return output;
};
