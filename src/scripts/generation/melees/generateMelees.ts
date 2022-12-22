/*
USAGE: From the root directory run "npm run generate"
*/
import lodash from 'lodash';
import path from 'path';
import {
	EDestinyClassId,
	EDestinySubclassId,
	EElementId,
} from '@dlb/types/IdEnums';
import {
	DestinyInventoryItemDefinition,
	DestinySandboxPerkDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import { generateId, getDefinitions } from '@dlb/scripts/generation/utils';
import { IMelee } from '@dlb/types/generation';
import { generateMeleeIdEnumFileString } from './generateMeleeIdEnum';
import { generateMeleeMapping } from './generateMeleeMapping';
import { bungieNetPath } from '@dlb/utils/item-utils';
import {
	DestinySubclassIdList,
	getDestinySubclass,
} from '@dlb/types/DestinySubclass';

const buildMeleeData = (
	melee: DestinyInventoryItemDefinition,
	sandboxPerkDefinitions: Record<number, DestinySandboxPerkDefinition>
): IMelee => {
	// TODO: This is pretty janky and fragile. Relying on this random string to work well
	const [unsafeDestinyClassId, unsafeElementString] =
		melee.plug.plugCategoryIdentifier.split('.');
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
		name: melee.displayProperties.name,
		id: generateId(melee.displayProperties.name),
		description: melee.displayProperties.description,
		icon: bungieNetPath(melee.displayProperties.icon),
		hash: melee.hash,
		elementId,
		destinySubclassId,
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
		melees.push(buildMeleeData(melee, sandboxPerkDefinitions));
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
