import {
	ARTIFICE_MOD_BONUS_VALUE,
	MAJOR_MOD_BONUS_VALUE,
	MAX_POTENTIAL_STAT_BOOST,
	MINOR_MOD_BONUS_VALUE,
	MIN_POTENTIAL_STAT_BOOST,
	NUM_ARMOR_PIECES,
} from '@dlb/utils/item-utils';
import { promises as fs } from 'fs';
import path from 'path';
import { IntRange, formatStringForFile } from '../utils';

export type GenericRequiredModCombo = {
	numArtificeMods: number;
	numMajorMods: number;
	numMinorMods: number;
	exactStatPoints: number;
};

function generateModCombinations(): GenericRequiredModCombo[] {
	const result: GenericRequiredModCombo[] = [];

	for (
		let numArtificeMods = 0;
		numArtificeMods <= NUM_ARMOR_PIECES;
		numArtificeMods++
	) {
		for (
			let numMajorMods = 0;
			numMajorMods <= NUM_ARMOR_PIECES;
			numMajorMods++
		) {
			for (
				let numMinorMods = 0;
				numMinorMods <= NUM_ARMOR_PIECES;
				numMinorMods++
			) {
				if (numMajorMods + numMinorMods <= NUM_ARMOR_PIECES) {
					const exactStatPoints =
						numArtificeMods * ARTIFICE_MOD_BONUS_VALUE +
						numMajorMods * MAJOR_MOD_BONUS_VALUE +
						numMinorMods * MINOR_MOD_BONUS_VALUE;
					result.push({
						numArtificeMods,
						numMajorMods,
						numMinorMods,
						exactStatPoints,
					});
				}
			}
		}
	}

	return result;
}

const allModCombinations = generateModCombinations();

// If we have a combination that has more optimal sub-combinations, we can discard it
function hasMoreOptimalSubCombo(
	combo: GenericRequiredModCombo,
	targetValue: number
): boolean {
	if (combo.numMajorMods === 0) {
		return false;
	}
	// swap out a single major mod for a single minor mod
	const numMajorMods = combo.numMajorMods - 1;
	const numMinorMods = combo.numMinorMods + 1;
	const numArtificeMods = combo.numArtificeMods;

	const exactStatPoints =
		numArtificeMods * ARTIFICE_MOD_BONUS_VALUE +
		numMajorMods * MAJOR_MOD_BONUS_VALUE +
		numMinorMods * MINOR_MOD_BONUS_VALUE;

	return exactStatPoints >= targetValue;
}

function isMoreOptimal(
	a: GenericRequiredModCombo,
	b: GenericRequiredModCombo
): boolean {
	const isStrictlyMoreOptimal =
		a.numArtificeMods <= b.numArtificeMods &&
		a.numMajorMods <= b.numMajorMods &&
		a.numMinorMods <= b.numMinorMods;

	return isStrictlyMoreOptimal;
}

// TODO Change this to accept a combinations param and return the optimal combinations
// This way we can filter the zero wasted stats combinations to not be so wasteful

function findOptimalCombinations(
	combinations: GenericRequiredModCombo[],
	targetValue: number
): GenericRequiredModCombo[] {
	// Filter combinations to only those that meet the target value
	const validCombinations = combinations.filter(
		(c) => c.exactStatPoints >= targetValue
	);

	const optimalCombinations: GenericRequiredModCombo[] = [];

	// Iterate over all valid combinations
	for (let i = 0; i < validCombinations.length; i++) {
		let isDominated = false;

		// Check if the current combination is dominated by any other combination
		for (let j = 0; j < validCombinations.length; j++) {
			if (
				i !== j &&
				isMoreOptimal(validCombinations[j], validCombinations[i])
			) {
				isDominated = true;
				break;
			}
		}

		// If the current combination is not dominated by any other combination, add it to the optimal combinations
		if (
			!isDominated &&
			!hasMoreOptimalSubCombo(validCombinations[i], targetValue)
		) {
			optimalCombinations.push(validCombinations[i]);

			// Remove any combination in optimalCombinations that is dominated by the new combination
			for (let j = 0; j < optimalCombinations.length - 1; j++) {
				if (isMoreOptimal(validCombinations[i], optimalCombinations[j])) {
					console.log('Removing dominated combination');
					optimalCombinations.splice(j, 1);
					j--;
				}
			}
		}
	}

	return optimalCombinations;
}

type RequiredModMapping = Record<IntRange<1, 65>, GenericRequiredModCombo[]>;
const _path = ['.', 'src', 'generated', 'modCombinations'];

const buildParetoOptimalRequiredModMapping = (): RequiredModMapping => {
	const mapping: Partial<RequiredModMapping> = {};

	for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {
		mapping[i] = findOptimalCombinations(allModCombinations, i);
	}

	return mapping as RequiredModMapping;
};

const paretoOptimalRequiredModMapping: RequiredModMapping =
	buildParetoOptimalRequiredModMapping();
const stringifiedParetoOptimalRequiredModMapping = `export const paretoOptimalModCombinations = ${JSON.stringify(
	paretoOptimalRequiredModMapping
)}`;
const formatedParetoOpmtimalString = formatStringForFile(
	stringifiedParetoOptimalRequiredModMapping
);

const generatedParetoOptimalPath = path.join(
	...[..._path, 'paretoOptimalModCombinations.ts']
);

fs.writeFile(
	path.resolve(generatedParetoOptimalPath),
	formatedParetoOpmtimalString
);

const buildZeroWastedStatsRequiredModMapping = (): RequiredModMapping => {
	const mapping: Partial<RequiredModMapping> = {};

	for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {
		const targetValue = i;
		const combos = allModCombinations.filter(
			(x) => (x.exactStatPoints - targetValue) % 10 === 0
		);
		mapping[i] = findOptimalCombinations(combos, targetValue);
	}

	return mapping as RequiredModMapping;
};

const zeroWastedStatsRequiredModMapping: RequiredModMapping =
	buildZeroWastedStatsRequiredModMapping();

const stringifiedZeroWastedStatsRequiredModMapping = `export const zeroWastedStatModCombinations = ${JSON.stringify(
	zeroWastedStatsRequiredModMapping
)}`;
const formatedZeroWastedStatString = formatStringForFile(
	stringifiedZeroWastedStatsRequiredModMapping
);

const generatedZeroWastedPath = path.join(
	...[..._path, 'zeroWastedStatModCombinations.ts']
);

fs.writeFile(
	path.resolve(generatedZeroWastedPath),
	formatedZeroWastedStatString
);
