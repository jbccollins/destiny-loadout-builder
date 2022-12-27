// https://stackoverflow.com/a/37580979

import { uniqWith, isEqual } from 'lodash';

// Find all the permutations of an array
export function permute<T>(permutation: T[]) {
	if (permutation.length > 5) {
		throw 'Fuck you. No permutations longer than 5.';
	}
	if (permutation.length === 0) {
		return [];
	}
	const length = permutation.length;
	const result = [permutation.slice()];
	const c = new Array(length).fill(0);
	let i = 1;
	let k = 0;
	let p = null;

	while (i < length) {
		if (c[i] < i) {
			k = i % 2 && c[i];
			p = permutation[i];
			permutation[i] = permutation[k];
			permutation[k] = p;
			++c[i];
			i = 1;
			result.push(permutation.slice());
		} else {
			c[i] = 0;
			++i;
		}
	}

	// TODO: This is inefficient. We should just generate only unique permutations in the first place.
	return uniqWith(result, isEqual);
}
