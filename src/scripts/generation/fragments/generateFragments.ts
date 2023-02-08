/*
USAGE: From the root directory run "npm run generate"
*/
import lodash from 'lodash';
import path from 'path';
import {
	DestinyInventoryItemDefinition,
	DestinySandboxPerkDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { promises as fs } from 'fs';
import {
	generateId,
	getBonuses,
	getDefinitions,
} from '@dlb/scripts/generation/utils';
import { IFragment } from '@dlb/types/generation';
import { generateFragmentIdEnumFileString } from './generateFragmentIdEnum';
import { generateFragmentMapping } from './generateFragmentMapping';
import { bungieNetPath } from '@dlb/utils/item-utils';
import { getArmorStatIdFromBungieHash } from '@dlb/types/ArmorStat';
import { StatBonus } from '@dlb/types/globals';

const buildFragmentData = (
	fragment: DestinyInventoryItemDefinition,
	sandboxPerkDefinitions: Record<number, DestinySandboxPerkDefinition>
): IFragment => {
	if (fragment.displayProperties.name === 'Spark of Focus') {
		console.log('lol');
	}
	return {
		name: fragment.displayProperties.name,
		id: generateId(fragment.displayProperties.name),
		description:
			sandboxPerkDefinitions[fragment.perks[0].perkHash].displayProperties
				.description,
		icon: bungieNetPath(fragment.displayProperties.icon),
		hash: fragment.hash,
		bonuses: getBonuses(fragment),
		//fragementSlots: fragment.plug.energyCapacity.capacityValue,
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
	console.log('Finding fragments');
	const fragments: IFragment[] = [];

	const allFragments = lodash(destinyInventoryItemDefinitions)
		.values()
		.filter((v) => v.traitIds)
		.filter((v) => v.traitIds.includes('item_type.fragment'))
		.value() as DestinyInventoryItemDefinition[];

	allFragments.forEach((fragment) => {
		fragments.push(buildFragmentData(fragment, sandboxPerkDefinitions));
	});

	const fragmentsPath = ['.', 'src', 'generated', 'fragment'];

	// We must build the enums first as those are imported by other generated files
	const fragmentIdEnumGeneratedPath = path.join(
		...[...fragmentsPath, 'EFragmentId.ts']
	);
	const fragmentIdEnumExportString =
		generateFragmentIdEnumFileString(fragments);

	console.log('Writing to file: ', fragmentIdEnumGeneratedPath);
	await fs.writeFile(
		path.resolve(fragmentIdEnumGeneratedPath),
		fragmentIdEnumExportString
	);

	const fragmentMappingGeneratedPath = path.join(
		...[...fragmentsPath, 'FragmentMapping.ts']
	);
	const fragmentMappingExportString = generateFragmentMapping(fragments);

	console.log('Writing to file: ', fragmentMappingGeneratedPath);
	await fs.writeFile(
		path.resolve(fragmentMappingGeneratedPath),
		fragmentMappingExportString
	);
}
