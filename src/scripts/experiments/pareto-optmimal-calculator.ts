export function findParetoOptimalCombinations(
	target: number,
	currentCombination: number[] = [],
	combinations: number[][] = []
): number[][] {
	if (
		currentCombination.reduce((sum, num) => sum + (num === 5 ? 1 : 2), 0) >=
		target
	) {
		combinations.push([...currentCombination]);
		return combinations;
	}

	// Try adding a 5 to the combination (weight 1).
	currentCombination.push(5);
	combinations = findParetoOptimalCombinations(
		target,
		currentCombination,
		combinations
	);
	currentCombination.pop();

	// Try adding a 10 to the combination (weight 2).
	currentCombination.push(10);
	combinations = findParetoOptimalCombinations(
		target,
		currentCombination,
		combinations
	);
	currentCombination.pop();

	return combinations;
}

function findParetoOptimalCombinationsForArray(arr: number[]): number[][][] {
	const paretoOptimalCombinations: number[][][] = [];

	for (const num of arr) {
		const combinations = findParetoOptimalCombinations(num);
		paretoOptimalCombinations.push(combinations);
	}

	return paretoOptimalCombinations;
}

// Example usage:
const inputArray = [2, 4, 12];
const paretoOptimalCombinations =
	findParetoOptimalCombinationsForArray(inputArray);

console.log('Pareto-optimal combinations:');
console.log(paretoOptimalCombinations);
