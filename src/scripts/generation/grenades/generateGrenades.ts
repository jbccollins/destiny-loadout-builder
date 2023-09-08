/*
USAGE: From the root directory run "npm run generate"
*/
import { generateId, getDefinitions } from '@dlb/scripts/generation/utils';
import { IGrenade } from '@dlb/types/generation';
import { EElementId } from '@dlb/types/IdEnums';
import { bungieNetPath } from '@dlb/utils/item-utils';
import {
	DestinyInventoryItemDefinition,
	DestinySandboxPerkDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import lodash from 'lodash';
import path from 'path';
import { generateGrenadeIdEnumFileString } from './generateGrenadeIdEnum';
import { generateGrenadeMapping } from './generateGrenadeMapping';

const buildGrenadeData = (
	grenade: DestinyInventoryItemDefinition,
	sandboxPerkDefinitions: Record<number, DestinySandboxPerkDefinition>
): IGrenade => {
	// TODO: This is pretty janky and fragile. Relying on this random string to work well
	const [_, unsafeElementString] =
		grenade.plug.plugCategoryIdentifier.split('.');
	const elementId = generateId(unsafeElementString) as EElementId;
	return {
		name: grenade.displayProperties.name,
		id: generateId(grenade.displayProperties.name),
		description: grenade.displayProperties.description,
		icon: bungieNetPath(grenade.displayProperties.icon),
		hash: grenade.hash,
		elementId, // getElementIdByHash(grenade.plug.energyCapacity.energyTypeHash),
	};
};

export async function run() {
	const {
		DestinyInventoryItemDefinition: destinyInventoryItemDefinitions,
		DestinySandboxPerkDefinition: destinySandboxPerkDefinitions,
	} = await getDefinitions();
	const sandboxPerkDefinitions = destinySandboxPerkDefinitions as Record<
		number,
		DestinySandboxPerkDefinition
	>;

	console.log('Received definitions');
	console.log('Finding grenades');
	const grenades: IGrenade[] = [];

	const allGrenades = lodash(destinyInventoryItemDefinitions)
		.values()
		.filter((v) => v.plug?.plugCategoryIdentifier)
		.filter(
			(v) =>
				v.plug.plugCategoryIdentifier.includes('shared.') &&
				v.plug.plugCategoryIdentifier.includes('.grenades')
		)
		.value() as DestinyInventoryItemDefinition[];

	allGrenades.forEach((grenade) => {
		grenades.push(buildGrenadeData(grenade, sandboxPerkDefinitions));
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
