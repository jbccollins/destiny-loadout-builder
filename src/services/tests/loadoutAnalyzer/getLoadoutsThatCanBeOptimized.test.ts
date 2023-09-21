import { Loadout } from '@destinyitemmanager/dim-api-types';
import {
	buildLoadouts,
	getLoadoutsThatCanBeOptimized,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import allClassItemMetadata from '@dlb/services/tests/fixtures/all-class-item-metadata.json';
import armor from '@dlb/services/tests/fixtures/armor.json';
import availableExoticArmor from '@dlb/services/tests/fixtures/available-exotic-armor.json';
import dimLoadouts from '@dlb/services/tests/fixtures/dim-loadouts.json';
import {
	Armor,
	AvailableExoticArmor,
	DestinyClassToAllClassItemMetadataMapping,
} from '@dlb/types/Armor';
import { EMasterworkAssumption } from '@dlb/types/IdEnums';
const testFunction = getLoadoutsThatCanBeOptimized;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: number];
const loadouts = buildLoadouts(
	dimLoadouts as Loadout[],
	armor as unknown as Armor,
	allClassItemMetadata as unknown as DestinyClassToAllClassItemMetadataMapping,
	EMasterworkAssumption.All,
	availableExoticArmor as unknown as AvailableExoticArmor
);

const testCases: TestCase[] = [
	[
		'Base',
		[
			{
				loadouts: loadouts.validLoadouts,
				armor: armor as unknown as Armor,
				masterworkAssumption: EMasterworkAssumption.All,
				allClassItemMetadata:
					allClassItemMetadata as unknown as DestinyClassToAllClassItemMetadataMapping,
				progressCallback: () => null,
				availableExoticArmor:
					availableExoticArmor as unknown as AvailableExoticArmor,
			},
		],
		42,
	],
];

// const nameOfTestToDebug = 'Base';
const nameOfTestToDebug = null;
describe('getLoadoutsThatCanBeOptimized', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result.length).toEqual(output);
	});
});
