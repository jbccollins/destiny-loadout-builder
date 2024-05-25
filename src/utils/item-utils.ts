/**
 * Expand a relative bungie.net asset path to a full path.
 */
export function bungieNetPath(src: string): string {
	if (!src) {
		return '';
	}
	if (src.startsWith('~')) {
		return src.substr(1);
	}
	return `https://www.bungie.net${src}`;
}

export const MAJOR_MOD_BONUS_VALUE = 10;
export const MINOR_MOD_BONUS_VALUE = 5;
export const ARTIFICE_MOD_BONUS_VALUE = 3;
// Four out of five of our armor pieces can be artificer armor
export const NUM_POTENTIAL_ARTIFICER_PIECES = 5;
export const NUM_ARMOR_PIECES = 5;

// 5 major mods + 5 artifice mods gived a max stat boost of 65
export const MAX_POTENTIAL_STAT_BOOST = 65;
export const MIN_POTENTIAL_STAT_BOOST = 1;
