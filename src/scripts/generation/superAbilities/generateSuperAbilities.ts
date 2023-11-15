/*
USAGE: From the root directory run "npm run generate"
*/
import { generateId, getDefinitions } from '@dlb/scripts/generation/utils';
import {
	DestinySubclassIdList,
	getDestinySubclass,
} from '@dlb/types/DestinySubclass';
import { EDestinyClassId, EElementId } from '@dlb/types/IdEnums';
import { ISuperAbility } from '@dlb/types/generation';
import { bungieNetPath } from '@dlb/utils/item-utils';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import lodash from 'lodash';
import path from 'path';
import { generateSuperAbilityIdEnumFileString } from './generateSuperAbilityIdEnum';
import { generateSuperAbilityMapping } from './generateSuperAbilityMapping';

const buildSuperAbilityData = (
	superAbility: DestinyInventoryItemDefinition
): ISuperAbility => {
	// TODO: This is pretty janky and fragile. Relying on this random string to work well
	const [unsafeDestinyClassId, unsafeElementString] =
		superAbility.plug.plugCategoryIdentifier.split('.');
	const elementId = generateId(unsafeElementString) as EElementId;
	const destinyClassId = generateId(unsafeDestinyClassId) as EDestinyClassId;
	const destinySubclassId = DestinySubclassIdList.find((destinySubclassId) => {
		const {
			elementId: subclassElementId,
			destinyClassId: subclassDestinyClassId,
		} = getDestinySubclass(destinySubclassId);
		return (
			elementId === subclassElementId &&
			destinyClassId == subclassDestinyClassId
		);
	});
	return {
		name: superAbility.displayProperties.name,
		id: generateId(superAbility.displayProperties.name),
		description: superAbility.displayProperties.description,
		icon: bungieNetPath(superAbility.displayProperties.icon),
		hash: superAbility.hash,
		elementId,
		destinySubclassId,
	};
};

export async function run() {
	const { DestinyInventoryItemDefinition: destinyInventoryItemDefinitions } =
		await getDefinitions();

	console.log('Received definitions');
	console.log('Finding superAbilities');
	const superAbilities: ISuperAbility[] = [];

	const allSuperAbilitys = lodash(destinyInventoryItemDefinitions)
		.values()
		.filter((v) => v.plug?.plugCategoryIdentifier)
		.filter((v) => v.plug.plugCategoryIdentifier.includes('.supers'))
		.value() as DestinyInventoryItemDefinition[];

	allSuperAbilitys.forEach((superAbility) => {
		superAbilities.push(buildSuperAbilityData(superAbility));
	});

	const superAbilitiesPath = ['.', 'src', 'generated', 'superAbility'];

	// We must build the enums first as those are imported by other generated files
	const superAbilityIdEnumGeneratedPath = path.join(
		...[...superAbilitiesPath, 'ESuperAbilityId.ts']
	);
	const superAbilityIdEnumExportString =
		generateSuperAbilityIdEnumFileString(superAbilities);

	console.log('Writing to file: ', superAbilityIdEnumGeneratedPath);
	await fs.writeFile(
		path.resolve(superAbilityIdEnumGeneratedPath),
		superAbilityIdEnumExportString
	);

	const superAbilityMappingGeneratedPath = path.join(
		...[...superAbilitiesPath, 'SuperAbilityMapping.ts']
	);
	const superAbilityMappingExportString =
		generateSuperAbilityMapping(superAbilities);

	console.log('Writing to file: ', superAbilityMappingGeneratedPath);
	await fs.writeFile(
		path.resolve(superAbilityMappingGeneratedPath),
		superAbilityMappingExportString
	);
}
