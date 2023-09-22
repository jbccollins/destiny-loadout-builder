import { Loadout } from '@destinyitemmanager/dim-api-types';
import { buildAnalyzableLoadoutsBreakdown } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import allClassItemMetadata from '@dlb/services/tests/fixtures/all-class-item-metadata.json';
import armor from '@dlb/services/tests/fixtures/armor.json';
import availableExoticArmor from '@dlb/services/tests/fixtures/available-exotic-armor.json';
import dimLoadouts2 from '@dlb/services/tests/fixtures/dim-loadouts-2.json';
import dimLoadouts from '@dlb/services/tests/fixtures/dim-loadouts.json';
import {
	Armor,
	AvailableExoticArmor,
	DestinyClassToAllClassItemMetadataMapping,
} from '@dlb/types/Armor';
import { EMasterworkAssumption } from '@dlb/types/IdEnums';

const testFunction = buildAnalyzableLoadoutsBreakdown;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: number];

const testCases: TestCase[] = [
	[
		'Base',
		[
			{
				dimLoadouts: dimLoadouts as Loadout[],
				armor: armor as unknown as Armor,
				allClassItemMetadata:
					allClassItemMetadata as unknown as DestinyClassToAllClassItemMetadataMapping,
				masterworkAssumption: EMasterworkAssumption.All,
				availableExoticArmor:
					availableExoticArmor as unknown as AvailableExoticArmor,
			},
		],
		65,
	],
	[
		'Base 2',
		[
			{
				dimLoadouts: dimLoadouts2 as Loadout[],
				armor: armor as unknown as Armor,
				allClassItemMetadata:
					allClassItemMetadata as unknown as DestinyClassToAllClassItemMetadataMapping,
				masterworkAssumption: EMasterworkAssumption.All,
				availableExoticArmor:
					availableExoticArmor as unknown as AvailableExoticArmor,
			},
		],
		22,
	],
];

// const nameOfTestToDebug = 'Base 2';
const nameOfTestToDebug = null;
describe('buildLoadouts', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(Object.keys(result.validLoadouts).length).toEqual(output);
	});
});
