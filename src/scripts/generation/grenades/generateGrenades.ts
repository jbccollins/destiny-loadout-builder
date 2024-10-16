/*
USAGE: From the root directory run "npm run generate"
*/
import { generateId, getDefinitions } from '@dlb/scripts/generation/utils';
import { EElementId } from '@dlb/types/IdEnums';
import { IGrenade } from '@dlb/types/generation';
import { bungieNetPath } from '@dlb/utils/item-utils';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import lodash from 'lodash';
import path from 'path';
import { generateGrenadeIdEnumFileString } from './generateGrenadeIdEnum';
import { generateGrenadeMapping } from './generateGrenadeMapping';

const buildGrenadeData = (
	grenade: DestinyInventoryItemDefinition
): IGrenade => {
	// TODO: This is pretty janky and fragile. Relying on this random string to work well
	const [, unsafeElementString] =
		grenade.plug.plugCategoryIdentifier.split('.');
	const elementId = generateId(unsafeElementString) as EElementId;
	let _id = grenade.displayProperties.name;
	if (
		grenade.itemTypeDisplayName.includes('| Light Ability') ||
		grenade.itemTypeDisplayName.includes('| Darkness Ability')
	) {
		_id = _id + ' Prism';
	}
	return {
		name: grenade.displayProperties.name,
		id: generateId(_id),
		description: grenade.displayProperties.description,
		icon: bungieNetPath(grenade.displayProperties.icon),
		hash: grenade.hash,
		elementId, // getElementIdByHash(grenade.plug.energyCapacity.energyTypeHash),
	};
};

export async function run() {
	const { DestinyInventoryItemDefinition: destinyInventoryItemDefinitions } =
		await getDefinitions();

	console.log('Received definitions');
	console.log('Finding grenades');
	const grenades: IGrenade[] = [];

	const allGrenades = lodash(destinyInventoryItemDefinitions)
		.values()
		.filter((v) => v.plug?.plugCategoryIdentifier)
		.filter(
			(v) =>
				(v.plug.plugCategoryIdentifier.includes('shared.') &&
					v.plug.plugCategoryIdentifier.includes('.grenades')) ||
				v.plug.plugCategoryIdentifier.includes('.prism.grenades')
		)
		.value() as DestinyInventoryItemDefinition[];

	allGrenades.forEach((grenade) => {
		grenades.push(buildGrenadeData(grenade));
	});

	const grenadesPath = ['.', 'src', 'generated', 'grenade'];

	// We must build the enums first as those are imported by other generated files
	const grenadeIdEnumGeneratedPath = path.join(
		...[...grenadesPath, 'EGrenadeId.ts']
	);
	const grenadeIdEnumExportString = generateGrenadeIdEnumFileString(grenades);

	console.log('Writing to file: ', grenadeIdEnumGeneratedPath);
	await fs.writeFile(
		path.resolve(grenadeIdEnumGeneratedPath),
		grenadeIdEnumExportString
	);

	const grenadeMappingGeneratedPath = path.join(
		...[...grenadesPath, 'GrenadeMapping.ts']
	);
	const grenadeMappingExportString = generateGrenadeMapping(grenades);

	console.log('Writing to file: ', grenadeMappingGeneratedPath);
	await fs.writeFile(
		path.resolve(grenadeMappingGeneratedPath),
		grenadeMappingExportString
	);
}
