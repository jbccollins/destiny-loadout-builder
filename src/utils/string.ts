export function toDashCase(src: string): string {
	if (!src) {
		return '';
	}
	return src.trim().replace(/\s/g, '-');
}
