/*
USAGE: From the root directory run "npm run generate"
*/
import { generateId, getDefinitions } from '@dlb/scripts/generation/utils';
import { EElementId } from '@dlb/types/IdEnums';
import { IJump } from '@dlb/types/generation';
import { bungieNetPath } from '@dlb/utils/item-utils';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import lodash from 'lodash';
import path from 'path';
import { generateJumpIdEnumFileString } from './generateJumpIdEnum';
import { generateJumpMapping } from './generateJumpMapping';

const buildJumpData = (jump: DestinyInventoryItemDefinition): IJump => {
	// TODO: This is pretty janky and fragile. Relying on this random string to work well
	const [destinyClassIdString, unsafeElementString] =
		jump.plug.plugCategoryIdentifier.split('.');
	const elementId = generateId(unsafeElementString) as EElementId;

	// Protect against the case where both prismatic warlock and prismatic hunter have blink
	let _id = jump.displayProperties.name + elementId;
	if (elementId === EElementId.Prism) {
		_id = _id + generateId(destinyClassIdString);
	}

	return {
		name: jump.displayProperties.name,
		id: generateId(_id),
		description: jump.displayProperties.description,
		icon: bungieNetPath(jump.displayProperties.icon),
		hash: jump.hash,
		elementId,
	};
};

export async function run() {
	const { DestinyInventoryItemDefinition: destinyInventoryItemDefinitions } =
		await getDefinitions();

	console.log('Received definitions');
	console.log('Finding jumps');
	const jumps: IJump[] = [];

	const allJumps = lodash(destinyInventoryItemDefinitions)
		.values()
		.filter((v) => v.plug?.plugCategoryIdentifier)
		.filter((v) => v.plug.plugCategoryIdentifier.includes('.movement'))
		.value() as DestinyInventoryItemDefinition[];

	allJumps.forEach((jump) => {
		jumps.push(buildJumpData(jump));
	});

	const jumpsPath = ['.', 'src', 'generated', 'jump'];

	// We must build the enums first as those are imported by other generated files
	const jumpIdEnumGeneratedPath = path.join(...[...jumpsPath, 'EJumpId.ts']);
	const jumpIdEnumExportString = generateJumpIdEnumFileString(jumps);

	console.log('Writing to file: ', jumpIdEnumGeneratedPath);
	await fs.writeFile(
		path.resolve(jumpIdEnumGeneratedPath),
		jumpIdEnumExportString
	);

	const jumpMappingGeneratedPath = path.join(
		...[...jumpsPath, 'JumpMapping.ts']
	);
	const jumpMappingExportString = generateJumpMapping(jumps);

	console.log('Writing to file: ', jumpMappingGeneratedPath);
	await fs.writeFile(
		path.resolve(jumpMappingGeneratedPath),
		jumpMappingExportString
	);
}
