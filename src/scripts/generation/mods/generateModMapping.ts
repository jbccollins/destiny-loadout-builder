import {
	EArmorSlotId,
	EElementId,
	EModCategoryId,
	EModSocketCategoryId,
} from '@dlb/types/IdEnums';
import { IMod } from '@dlb/types/generation';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	formatStringForFile,
	getSerializableValue,
} from '@dlb/scripts/generation/utils';

export const generateModMapping = (mods: IMod[]): string => {
	const enumsToSerialize = {
		armorSlotId: { enumDefinition: EArmorSlotId, enumName: 'EArmorSlotId' },
		id: { enumDefinition: EModId, enumName: 'EModId' },
		elementId: { enumDefinition: EElementId, enumName: 'EElementId' },
		modSocketCategoryId: {
			enumDefinition: EModSocketCategoryId,
			enumName: 'EModSocketCategoryId',
		},
		modCategoryId: {
			enumDefinition: EModCategoryId,
			enumName: 'EModCategoryId',
		},
	};

	const serializeMods: Record<string, unknown>[] = [];
	mods.forEach((mod) => {
		const serializedMod = { ...mod } as Record<string, unknown>;
		Object.keys(enumsToSerialize).forEach((key) => {
			const serializedResult = getSerializableValue(
				mod[key],
				enumsToSerialize[key].enumDefinition,
				enumsToSerialize[key].enumName
			);
			serializedMod[key] = serializedResult;
		});
		serializeMods.push(serializedMod);
	});

	const modIdToModMappingString = serializeMods.map(
		(mod) => `[${mod.id}]: ${JSON.stringify(mod, null, 2)},`
	);

	const setDataFileSource = `// This file is generated by the generateMods.ts script.
	// Do not manually make changes to this file.

	import { EnumDictionary } from '@dlb/types/globals';
	import { IMod } from '@dlb/types/generation';
  import { EModId } from '@dlb/generated/mod/EModId';
	import {
		EArmorSlotId,
		EElementId,
		EModCategoryId,
		EModSocketCategoryId,
	} from "@dlb/types/IdEnums";	

	export const ModIdToModMapping: EnumDictionary<EModId, IMod> = {
		${modIdToModMappingString.join(' ')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};