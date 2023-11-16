import { formatStringForFile } from '@dlb/scripts/generation/utils';
import { IMod } from '@dlb/types/generation';

export const generateModIdEnumFileString = (mods: IMod[]): string => {
	const modIdEnumsString = mods.map((mod) => `${mod.id} = "${mod.id}",`);
	const setDataFileSource = `// This file is generated by the generateModIdEnum.ts script.
	// Do not manually make changes to this file.
  
	export enum EModId {
		${modIdEnumsString.join('\n')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};
