import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import {
	formatStringForFile,
	getSerializableValue,
} from '@dlb/scripts/generation/utils';
import { IMelee } from '@dlb/types/generation';
import { EDestinySubclassId, EElementId } from '@dlb/types/IdEnums';

export const generateMeleeMapping = (melees: IMelee[]): string => {
	const enumsToSerialize = {
		id: { enumDefinition: EMeleeId, enumName: 'EMeleeId' },
		elementId: { enumDefinition: EElementId, enumName: 'EElementId' },
		destinySubclassId: {
			enumDefinition: EDestinySubclassId,
			enumName: 'EDestinySubclassId',
		},
	};

	const serializeMelees: Record<string, unknown>[] = [];
	melees.forEach((melee) => {
		const serializedMelee = { ...melee } as Record<string, unknown>;
		Object.keys(enumsToSerialize).forEach((key) => {
			const serializedResult = getSerializableValue(
				melee[key],
				enumsToSerialize[key].enumDefinition,
				enumsToSerialize[key].enumName
			);
			serializedMelee[key] = serializedResult;
		});
		serializeMelees.push(serializedMelee);
	});

	const meleeIdToMeleeMappingString = serializeMelees.map(
		(melee) => `[${melee.id}]: ${JSON.stringify(melee, null, 2)},`
	);

	const setDataFileSource = `// This file is generated by the generateMeleeMapping.ts script.
	// Do not manually make changes to this file.

	import { EnumDictionary } from '@dlb/types/globals';
	import { IMelee } from '@dlb/types/generation';
  import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
	import { EElementId, EDestinySubclassId } from '@dlb/types/IdEnums';

	export const MeleeIdToMeleeMapping: EnumDictionary<EMeleeId, IMelee> = {
		${meleeIdToMeleeMappingString.join(' ')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};
