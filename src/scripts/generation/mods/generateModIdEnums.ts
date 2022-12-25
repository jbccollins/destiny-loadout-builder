import { IMod } from '@dlb/types/generation';
import { formatStringForFile } from '@dlb/scripts/generation/utils';

export const generateModIdEnumFileString = (mods: IMod[]): string => {
	const modIdEnumsString = mods.map((mod) => `${mod.id} = '${mod.id}',`);
	const setDataFileSource = `// This file is generated by the generateModIdEnums.ts script.
	// Do not manually make changes to this file.
  
	export enum EModId {
		${modIdEnumsString.join('\n')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};