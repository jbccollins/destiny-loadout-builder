import { formatStringForFile } from '@dlb/scripts/generation/utils';
import { IJump } from '@dlb/types/generation';

export const generateJumpIdEnumFileString = (jumps: IJump[]): string => {
	const jumpIdEnumsString = jumps.map((jump) => `${jump.id} = '${jump.id}',`);
	const setDataFileSource = `// This file is generated by the generateJumpIdEnum.ts script.
	// Do not manually make changes to this file.
  
	export enum EJumpId {
		${jumpIdEnumsString.join('\n')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};
