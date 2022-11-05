import { StatList } from './armor-processing';
/**
 *
 * @param stats
 * @description All legendary armor 2.0 items in Destiny 2 follow a set of rules.
 * When testing we want to make sure the armor that we are testing with follows those rules.
 */

export const enforceValidLegendaryArmorBaseStats = (
	stats: StatList
): StatList => {
	if (stats.length !== 6) {
		throw `stats.length !== 6: ${stats}`;
	}
	const firstThreeSum = stats.slice(0, 3).reduce((a, b) => a + b);
	const lastThreeSum = stats.slice(3, 6).reduce((a, b) => a + b);
	if (firstThreeSum > 34 || lastThreeSum > 34) {
		throw `stat buckets do not add up to 34: ${stats}`;
	}
	if (stats.some((x) => x < 2)) {
		throw `found stat < 2: ${stats}`;
	}

	if (stats.some((x) => x > 30)) {
		throw `found stat > 30: ${stats}`;
	}

	if (stats.some((x) => [3, 4, 5].includes(x))) {
		throw `found stat that equals one of 3,4,5: ${stats}`;
	}
	return stats;
};
