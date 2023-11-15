import { formatStringForFile } from '@dlb/scripts/generation/utils';
import { IMelee } from '@dlb/types/generation';

export const generateMeleeIdEnumFileString = (melees: IMelee[]): string => {
	const meleeIdEnumsString = melees.map(
		(melee) => `${melee.id} = "${melee.id}",`
	);
	const setDataFileSource = `// This file is generated by the generateMeleeIdEnum.ts script.
	// Do not manually make changes to this file.
  
	export enum EMeleeId {
		${meleeIdEnumsString.join('\n')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};
