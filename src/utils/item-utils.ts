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
