import { getStatModCombosFromDesiredStats } from '@dlb/services/processArmor/getStatModCombosFromDesiredStats';
import { getArmorStatMappingFromStatList } from '@dlb/services/processArmor/utils';
import { StatList } from '@dlb/types/Armor';
import { ArmorStatIdList } from '@dlb/types/ArmorStat';
import { promises as fs } from 'fs';
import path from 'path';

const flipObject = (data: object) =>
	Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));

function findUniqueCombinations(
	targetSum: number,
	remainingIntegers: number,
	currentCombination: number[] = [],
	combinations: number[][] = [],
	minNextValue: number = 0
): number[][] {
	if (remainingIntegers === 0) {
		// If we have used all integers, check if the current combination adds up to the target sum.
		if (currentCombination.reduce((sum, num) => sum + num, 0) <= targetSum) {
			combinations.push([...currentCombination].sort((a, b) => b - a));
		}
		return combinations;
	}

	// Recursively generate combinations for each integer from minNextValue to the target sum.
	for (let i = minNextValue; i <= targetSum; i++) {
		currentCombination.push(i);
		combinations = findUniqueCombinations(
			targetSum,
			remainingIntegers - 1,
			currentCombination,
			combinations,
			i
		);
		currentCombination.pop();
	}

	return combinations;
}

const debug = false;

(async function main() {
	// Define the target sum and the number of integers.
	const targetSum = 62;
	const numIntegers = 6;
	/*
		{
			1M2m3a: 287,
		}
	*/
	const modTupleKeyMapping: Record<string, number> = {};

	// Calculate all unique combinations.
	const combinations = findUniqueCombinations(targetSum, numIntegers);

	console.log('Num combinations:', combinations.length);

	/* key => numArtificeItems => statModCombos
	{
		201005050000: {
			0: [[2M,1M,1m,1m,null,null]]
		}
	}
	*/
	const results: Record<string, number[][][]> = {};
	// Each valid number of artifice mods
	(debug ? combinations.slice(10000, 10005) : combinations).forEach(
		(combination, i) => {
			// combinations.forEach((combination, i) => {
			// Join numbers, pad single digits with 0 prefix
			const paddedCombination = combination.map((x) =>
				String(x).padStart(2, '0')
			);
			const key = paddedCombination.join('');
			results[key] = [];
			for (let j = 0; j <= 4; j++) {
				results[key].push([]); // results[key][j] => [statModCombo, statModCombo, ...]
				const targetStats = getArmorStatMappingFromStatList(
					combination as StatList
				);
				const statModCombos = getStatModCombosFromDesiredStats({
					currentStats: [0, 0, 0, 0, 0, 0],
					targetStats,
					numArtificeItems: j,
					useZeroWastedStats: false,
				});
				if (statModCombos === null) {
					results[key][j] = null;
					continue;
				}
				statModCombos.forEach((statModCombo) => {
					const minifiedCombo: number[] = [];
					ArmorStatIdList.forEach((armorStatId) => {
						if (statModCombo[armorStatId] === null) {
							// minifiedCombo.push(null);
							return;
						}
						const { numMajorMods, numMinorMods, numArtificeMods } =
							statModCombo[armorStatId];
						let minifiedComboKey = '';
						[numMajorMods, numMinorMods, numArtificeMods].forEach(
							(numMods, l) => {
								if (numMods === 0) {
									return;
								}
								const suffix = l === 0 ? 'M' : l === 1 ? 'm' : 'a';
								minifiedComboKey += numMods + suffix;
							}
						);
						if (!(minifiedComboKey in modTupleKeyMapping)) {
							modTupleKeyMapping[minifiedComboKey] =
								Object.keys(modTupleKeyMapping).length;
						}
						minifiedCombo.push(modTupleKeyMapping[minifiedComboKey]);
					});
					results[key][j].push(minifiedCombo);
				});
			}
		}
	);

	const allCombinationsPath = path.join(
		...['.', 'src', 'generated', 'experiments', 'all-combinations.json']
	);
	console.log('Writing to file: ', allCombinationsPath);
	await fs.writeFile(
		path.resolve(allCombinationsPath),
		debug ? JSON.stringify(results, null, 2) : JSON.stringify(results)
	);
	const modTupleKeyMappingPath = path.join(
		...['.', 'src', 'generated', 'experiments', 'mod-tuple-key-mapping.json']
	);
	console.log('Writing to file: ', modTupleKeyMappingPath);
	await fs.writeFile(
		path.resolve(modTupleKeyMappingPath),
		debug
			? JSON.stringify(flipObject(modTupleKeyMapping), null, 2)
			: JSON.stringify(flipObject(modTupleKeyMapping))
	);
})();
