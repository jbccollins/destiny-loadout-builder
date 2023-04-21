import { IntRange, formatStringForFile } from '@dlb/scripts/generation/utils';
import {
	canUseMinorStatMod,
	roundUp10,
} from '@dlb/services/processArmor/utils';
import combinations from '@dlb/utils/combinations';
import {
	ARTIFICE_MOD_BONUS_VALUE,
	MAJOR_MOD_BONUS_VALUE,
	MAX_POTENTIAL_STAT_BOOST,
	MINOR_MOD_BONUS_VALUE,
	MIN_POTENTIAL_STAT_BOOST,
	NUM_ARMOR_PIECES,
	NUM_POTENTIAL_ARTIFICER_PIECES,
} from '@dlb/utils/item-utils';
import { isEqual, uniqWith } from 'lodash';
import path from 'path';
import { promises as fs } from 'fs';

// TODO: Move this type somewhere else as it's used outside of generation
// Contains the counts of required mods for ANY stat
export type GenericRequiredModCombo = {
	/** The number of artifice mods this pick contains. */
	numArtificeMods: number;
	/** The number of major mods this pick contains. */
	numMajorMods: number;
	/** The number of minor mods this pick contains */
	numMinorMods: number;
	/** The exact number of points this set of mods provides (if we ask for 1 stat point, an artifice mod might give 3) */
	exactStatPoints: number;
};

type GetGenericRequiredModComboParams = Omit<
	GenericRequiredModCombo,
	'exactStatPoints'
>;
const getGenericRequiredModCombo = ({
	numArtificeMods,
	numMajorMods,
	numMinorMods,
}: GetGenericRequiredModComboParams): GenericRequiredModCombo => ({
	numArtificeMods,
	numMajorMods,
	numMinorMods,
	exactStatPoints:
		numArtificeMods * ARTIFICE_MOD_BONUS_VALUE +
		numMajorMods * MAJOR_MOD_BONUS_VALUE +
		numMinorMods * MINOR_MOD_BONUS_VALUE,
});

enum EStatModType {
	Major = 'Major',
	Minor = 'Minor',
	Aritifce = 'Artifice',
}

const StatModValues: Record<EStatModType, number> = {
	[EStatModType.Major]: MAJOR_MOD_BONUS_VALUE,
	[EStatModType.Minor]: MINOR_MOD_BONUS_VALUE,
	[EStatModType.Aritifce]: ARTIFICE_MOD_BONUS_VALUE,
};

// Figure out which major/minor stat mods we would need to do hit the targetValue
const getBaseRequiredArmorStatMods = (
	targetValue: number
): GenericRequiredModCombo => {
	// Note that this will only ever pick a single minor mod
	// We will extrapolate out all the possible minor and artifice mod substitutions later
	const withMinorStatMod = canUseMinorStatMod(targetValue);
	const numMinorMods = withMinorStatMod ? 1 : 0;
	const numMajorMods = roundUp10(targetValue) / 10 - numMinorMods;

	return getGenericRequiredModCombo({
		numArtificeMods: 0,
		numMajorMods,
		numMinorMods,
	});
};

const getTotalFromStatModTypeList = (
	statModTypeList: EStatModType[]
): number => {
	let total = 0;
	statModTypeList.forEach((statModType) => {
		total += StatModValues[statModType];
	});
	return total;
};

type GetNumRequiredArtificeModsParams = {
	startingValue: number;
	targetValue: number;
};
const getNumRequiredArtificeMods = ({
	startingValue,
	targetValue,
}: GetNumRequiredArtificeModsParams): number => {
	let result = 0;
	const diff = targetValue - startingValue;
	if (diff > 0) {
		result = Math.ceil(diff / ARTIFICE_MOD_BONUS_VALUE);
	}
	return result;
};

// Reduce a combo down to a list of major/minor mods
const getComboAsStatModTypeList = (
	combo: GenericRequiredModCombo
): EStatModType[] => {
	const { numMajorMods, numMinorMods } = combo;
	const majorModsAsList = Array(numMajorMods).fill(EStatModType.Major);
	const minorModsAsList = Array(numMinorMods).fill(EStatModType.Minor);
	const allStatModsAsList: EStatModType[] = [
		...majorModsAsList,
		...minorModsAsList,
	];
	return allStatModsAsList;
};

// Reduce a combo down to a list of major/minor mods
const getComboFromStatModTypeList = (
	staModTypeList: EStatModType[]
): GenericRequiredModCombo => {
	const numMajorMods = staModTypeList.filter(
		(statModType) => statModType === EStatModType.Major
	).length;
	const numMinorMods = staModTypeList.filter(
		(statModType) => statModType === EStatModType.Minor
	).length;
	return getGenericRequiredModCombo({
		numArtificeMods: 0,
		numMajorMods,
		numMinorMods,
	});
};

type GetArtificeAdjustedRequiredModsParams = {
	baseRequiredModCombo: GenericRequiredModCombo;
	targetValue: number;
};

const getArtificeAdjustedRequiredMods = ({
	baseRequiredModCombo,
	targetValue,
}: GetArtificeAdjustedRequiredModsParams): GenericRequiredModCombo[] => {
	const { numMajorMods, numMinorMods } = baseRequiredModCombo;
	const numArmorStatMods = numMajorMods + numMinorMods;
	const results: GenericRequiredModCombo[] = [];
	// This is an upper bound. With 5 major and 4 minor and 4 artifice pieces
	// it's potentially possible to replace all four minor mods with artifice mods.
	// TODO: Can we constrain this further?
	if (numArmorStatMods > 9) {
		return results;
	}

	// We know that at least 2 artifice mods are required to replace 1 major mod
	const numPotentiallyReplaceableMajorMods = Math.floor(
		NUM_POTENTIAL_ARTIFICER_PIECES / 2
	);

	// We can use 5 mod slots for major mods if needed
	// If we need more than 5 major mods then this is impossible
	if (numMajorMods - NUM_ARMOR_PIECES > numPotentiallyReplaceableMajorMods) {
		return results;
	}

	const allStatModsAsList = getComboAsStatModTypeList(baseRequiredModCombo);

	// This is inefficient and slow but it doesn't really matter
	// since this is a just a one time generation script.
	// Find the biggest size combinations we can make given
	// that we have a maximum of 5 armor pieces
	const combinationSize = Math.min(numArmorStatMods, NUM_ARMOR_PIECES);
	const combos = combinations(allStatModsAsList, combinationSize);
	// Make sure we check the case where we can achieve the desired stats
	// with only artifice mods.
	// TODO: WTF is this? Idk why we would need to do this. Why did I write it? Test it?
	if (combos.length === 0) {
		combos.push([]);
	}
	for (let i = 0; i < combos.length; i++) {
		const combo = combos[i];
		const comboTotal = getTotalFromStatModTypeList(combo);
		const numRequiredArtificeMods = getNumRequiredArtificeMods({
			targetValue: targetValue,
			startingValue: comboTotal,
		});

		// If we need more artifice mods than we can slot then this combo is impossible
		if (numRequiredArtificeMods > NUM_POTENTIAL_ARTIFICER_PIECES) {
			continue;
		}

		const result: GenericRequiredModCombo = getGenericRequiredModCombo({
			numMajorMods: combo.filter((x) => x === EStatModType.Major).length,
			numMinorMods: combo.filter((x) => x === EStatModType.Minor).length,
			numArtificeMods: numRequiredArtificeMods,
		});

		// Check if we can replace any major mods with two minor mods
		const extrapolatedResults = getExtrapolatedStatModTypeCombos([result]);

		extrapolatedResults.forEach((extrapolatedResult) => {
			results.push(extrapolatedResult);
		});

		// We now need to check if it's possible to achieve the desired stats with
		// fewer armor stat mods, but more artifice mods, for each extrapolated combo
		// I think this recursiveCombinationSize thing will create duplicate results.
		// These will be removed by the uniqWith but it's still not ideal.
		extrapolatedResults.forEach((extrapolatedResult) => {
			const extrapolatedResultStatModsAsList =
				getComboAsStatModTypeList(extrapolatedResult);
			const recursiveCombinationSize =
				extrapolatedResultStatModsAsList.length - 1;
			const recursiveCombinations = combinations(
				extrapolatedResultStatModsAsList,
				recursiveCombinationSize
			);
			// Check the case where we can achieve the desired stats
			// with only artifice mods.
			if (
				recursiveCombinations.length === 0 &&
				extrapolatedResultStatModsAsList.length > 0
			) {
				recursiveCombinations.push([]);
			}
			recursiveCombinations.forEach((recursiveCombination) => {
				const recursiveResults = getArtificeAdjustedRequiredMods({
					baseRequiredModCombo:
						getComboFromStatModTypeList(recursiveCombination),
					targetValue,
				});
				recursiveResults.forEach((result) => results.push(result));
			});
		});
	}
	// This uniqWith is necessary because we may have created duplicate results
	// If it's possible to replace a major mod with two artifice mods then it will
	// also be possible to replace the extrapolated major mod with two artifice mods
	return uniqWith(results, isEqual);
};

const getExtrapolatedStatModTypeCombos = (
	combos: GenericRequiredModCombo[]
): GenericRequiredModCombo[] => {
	// The existing combo is valid
	const results: GenericRequiredModCombo[] = [...combos];

	// Any combo that has at least one open mod slot and at least
	// one major mod can be extrapolated
	combos
		.filter((combo) => {
			const { numMajorMods, numMinorMods } = combo;
			const numArmorStatMods = numMajorMods + numMinorMods;
			return numArmorStatMods < NUM_ARMOR_PIECES && numMajorMods > 0;
		})
		.forEach((combo) => {
			const { numMajorMods, numMinorMods } = combo;
			const numArmorStatMods = numMajorMods + numMinorMods;
			// Any combo that has at least one open mod slot and at least
			// one major mod can be extrapolated
			if (numMajorMods === 0 || numArmorStatMods >= NUM_ARMOR_PIECES) {
				return;
			}

			// Since major mods can be swapped out for two minor mods we only have to care about
			// two cases. The case where there is only one unusedModSlot and the case where there
			// are more than one unusedModSlots. If there two - three unusedModSlots it's all the same
			// logic since no matter what, we can't convert three major mods into six minor mods.
			/*
      Logic: If there are x major mods => extrapolate to these combos
      1 => two minor
      2 => every unique major mod gets two minor mods; and if there are two+ unused mod slots add on the four minor mods 
      3 => every unique major mod gets a two minor mods; and if there are two+ unused mod slots every unique combination of two major mods gets two minor mods each 
      4 => every unique major mod gets a minor mod 
      */
			const unusedModSlots = NUM_ARMOR_PIECES - numArmorStatMods;

			// 1,4 => ...
			const singleReplacementCombo: GenericRequiredModCombo = { ...combo };
			replaceMajorModsWithMinorMods(singleReplacementCombo, 1);
			results.push(singleReplacementCombo);

			// 2,3 => ...
			if (unusedModSlots > 1 && numMajorMods > 1 && numMajorMods < 4) {
				const doubleReplacementCombo: GenericRequiredModCombo = { ...combo };
				replaceMajorModsWithMinorMods(doubleReplacementCombo, 2);
				results.push(doubleReplacementCombo);
			}
		});
	return results;
};

export const replaceMajorModsWithMinorMods = (
	combo: GenericRequiredModCombo,
	numModsToReplace: number
): void => {
	for (let i = 0; i < numModsToReplace; i++) {
		combo.numMajorMods--;
		combo.numMinorMods += 2;
	}
};

// My base stat is 34
// I want to get to 70
// I need 36 more points
// How many ways can I achieve 36 exactly?
// Chat GPT wrote this lmao
function getExactMatchCombos(targetValue: number): GenericRequiredModCombo[] {
	const coins = [
		ARTIFICE_MOD_BONUS_VALUE,
		MINOR_MOD_BONUS_VALUE,
		MAJOR_MOD_BONUS_VALUE,
	];
	const results: number[][] = [];

	const backtrack = (combination: number[], sum: number, index: number) => {
		if (sum === targetValue) {
			results.push(combination);
			return;
		}
		if (sum > targetValue) {
			return;
		}
		for (let i = index; i < coins.length; i++) {
			backtrack([...combination, coins[i]], sum + coins[i], i);
		}
	};

	backtrack([], 0, 0);

	return results
		.map((result) => {
			const numArtificeMods = result.filter(
				(value) => value === ARTIFICE_MOD_BONUS_VALUE
			).length;
			const numMinorMods = result.filter(
				(value) => value === MINOR_MOD_BONUS_VALUE
			).length;
			const numMajorMods = result.filter(
				(value) => value === MAJOR_MOD_BONUS_VALUE
			).length;
			return getGenericRequiredModCombo({
				numArtificeMods,
				numMinorMods,
				numMajorMods,
			});
		})
		.filter(
			(combo) =>
				combo.numArtificeMods <= NUM_POTENTIAL_ARTIFICER_PIECES &&
				combo.numMajorMods + combo.numMinorMods <= NUM_ARMOR_PIECES
		);
}

type RequiredModMapping = Record<IntRange<1, 62>, GenericRequiredModCombo[]>;
const _path = ['.', 'src', 'generated', 'modCombinations'];

const buildZeroWastedStatsRequiredModMapping = (): RequiredModMapping => {
	const mapping: Partial<RequiredModMapping> = {};

	for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {
		const targetValue = i;
		const combos = getExactMatchCombos(targetValue);
		mapping[i] = combos.length > 0 ? combos : null;
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

const buildParetoOptimalRequiredModMapping = (): RequiredModMapping => {
	const mapping: Partial<RequiredModMapping> = {};

	for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {
		const targetValue = i;
		const baseRequiredModCombo = getBaseRequiredArmorStatMods(targetValue);
		const artificeAdjustedRequiredMods = getArtificeAdjustedRequiredMods({
			baseRequiredModCombo,
			targetValue,
		});
		mapping[i] = artificeAdjustedRequiredMods;
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

const generatedParetoOptimailPath = path.join(
	...[..._path, 'paretoOptimalModCombinations.ts']
);

fs.writeFile(
	path.resolve(generatedParetoOptimailPath),
	formatedParetoOpmtimalString
);
