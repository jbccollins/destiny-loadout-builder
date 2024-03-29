import { formatStringForFile } from '@dlb/scripts/generation/utils';
import { ISuperAbility } from '@dlb/types/generation';

export const generateSuperAbilityIdEnumFileString = (
	superAbilities: ISuperAbility[]
): string => {
	const superAbilityIdEnumsString = superAbilities.map(
		(superAbility) => `${superAbility.id} = '${superAbility.id}',`
	);
	const setDataFileSource = `// This file is generated by the generateSuperAbilityIdEnum.ts script.
	// Do not manually make changes to this file.
  
	export enum ESuperAbilityId {
		${superAbilityIdEnumsString.join('\n')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};
