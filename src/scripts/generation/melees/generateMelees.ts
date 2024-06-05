/*
USAGE: From the root directory run "npm run generate"
*/
import { generateId, getDefinitions } from '@dlb/scripts/generation/utils';
import { EElementId } from '@dlb/types/IdEnums';
import { IMelee } from '@dlb/types/generation';
import { bungieNetPath } from '@dlb/utils/item-utils';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import lodash from 'lodash';
import path from 'path';
import { generateMeleeIdEnumFileString } from './generateMeleeIdEnum';
import { generateMeleeMapping } from './generateMeleeMapping';

const buildMeleeData = (melee: DestinyInventoryItemDefinition): IMelee => {
	// TODO: This is pretty janky and fragile. Relying on this random string to work well
	const [_, unsafeElementString] = melee.plug.plugCategoryIdentifier.split('.');
	const elementId = generateId(unsafeElementString) as EElementId;
	let _id = melee.displayProperties.name;
	if (elementId === EElementId.Prism) {
		_id = _id + generateId(EElementId.Prism);
	}
	return {
		name: melee.displayProperties.name,
		id: generateId(_id),
		description: melee.displayProperties.description,
		icon: bungieNetPath(melee.displayProperties.icon),
		hash: melee.hash,
		elementId,
	};
};

export async function run() {
	const { DestinyInventoryItemDefinition: destinyInventoryItemDefinitions } =
		await getDefinitions();

	console.log('Received definitions');
	console.log('Finding melees');
	const melees: IMelee[] = [];

	const allMelees = lodash(destinyInventoryItemDefinitions)
		.values()
		.filter((v) => v.plug?.plugCategoryIdentifier)
		.filter((v) =>
			// v.plug.plugCategoryIdentifier.includes('shared.') &&
			v.plug.plugCategoryIdentifier.includes('.melee')
		)
		.value() as DestinyInventoryItemDefinition[];

	allMelees.forEach((melee) => {
		melees.push(buildMeleeData(melee));
	});

	const meleesPath = ['.', 'src', 'generated', 'melee'];

	// We must build the enums first as those are imported by other generated files
	const meleeIdEnumGeneratedPath = path.join(...[...meleesPath, 'EMeleeId.ts']);
	const meleeIdEnumExportString = generateMeleeIdEnumFileString(melees);

	console.log('Writing to file: ', meleeIdEnumGeneratedPath);
	await fs.writeFile(
		path.resolve(meleeIdEnumGeneratedPath),
		meleeIdEnumExportString
	);

	const meleeMappingGeneratedPath = path.join(
		...[...meleesPath, 'MeleeMapping.ts']
	);
	const meleeMappingExportString = generateMeleeMapping(melees);

	console.log('Writing to file: ', meleeMappingGeneratedPath);
	await fs.writeFile(
		path.resolve(meleeMappingGeneratedPath),
		meleeMappingExportString
	);
}
