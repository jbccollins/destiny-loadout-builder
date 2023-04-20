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
export const ARTIFICE_BONUS_VALUE = 3;
