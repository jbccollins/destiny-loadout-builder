/*
USAGE: From the root directory run "npm run generate"
*/
import { generateId, getDefinitions } from '@dlb/scripts/generation/utils';
import { EElementId } from '@dlb/types/IdEnums';
import { IClassAbility } from '@dlb/types/generation';
import { bungieNetPath } from '@dlb/utils/item-utils';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import lodash from 'lodash';
import path from 'path';
import { generateClassAbilityIdEnumFileString } from './generateClassAbilityIdEnum';
import { generateClassAbilityMapping } from './generateClassAbilityMapping';

const buildClassAbilityData = (
	classAbility: DestinyInventoryItemDefinition
): IClassAbility => {
	// TODO: This is pretty janky and fragile. Relying on this random string to work well
	const [_, unsafeElementString] =
		classAbility.plug.plugCategoryIdentifier.split('.');
	const elementId = generateId(unsafeElementString) as EElementId;
	return {
		name: classAbility.displayProperties.name,
		id: generateId(classAbility.displayProperties.name + elementId),
		description: classAbility.displayProperties.description,
		icon: bungieNetPath(classAbility.displayProperties.icon),
		hash: classAbility.hash,
		elementId
	};
};

export async function run() {
	const { DestinyInventoryItemDefinition: destinyInventoryItemDefinitions } =
		await getDefinitions();

	console.log('Received definitions');
	console.log('Finding classAbilities');
	const classAbilities: IClassAbility[] = [];

	const allClassAbilitys = lodash(destinyInventoryItemDefinitions)
		.values()
		.filter((v) => v.plug?.plugCategoryIdentifier)
		.filter((v) => v.plug.plugCategoryIdentifier.includes('.class_abilities'))
		.value() as DestinyInventoryItemDefinition[];

	allClassAbilitys.forEach((classAbility) => {
		classAbilities.push(buildClassAbilityData(classAbility));
	});

	const classAbilitiesPath = ['.', 'src', 'generated', 'classAbility'];

	// We must build the enums first as those are imported by other generated files
	const classAbilityIdEnumGeneratedPath = path.join(
		...[...classAbilitiesPath, 'EClassAbilityId.ts']
	);
	const classAbilityIdEnumExportString =
		generateClassAbilityIdEnumFileString(classAbilities);

	console.log('Writing to file: ', classAbilityIdEnumGeneratedPath);
	await fs.writeFile(
		path.resolve(classAbilityIdEnumGeneratedPath),
		classAbilityIdEnumExportString
	);

	const classAbilityMappingGeneratedPath = path.join(
		...[...classAbilitiesPath, 'ClassAbilityMapping.ts']
	);
	const classAbilityMappingExportString =
		generateClassAbilityMapping(classAbilities);

	console.log('Writing to file: ', classAbilityMappingGeneratedPath);
	await fs.writeFile(
		path.resolve(classAbilityMappingGeneratedPath),
		classAbilityMappingExportString
	);
}
