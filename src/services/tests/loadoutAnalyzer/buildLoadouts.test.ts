import { DimLoadoutWithId } from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import {
	InGameLoadoutsDefinitions,
	InGameLoadoutsWithIdMapping,
} from '@dlb/redux/features/inGameLoadouts/inGameLoadoutsSlice';
import { buildAnalyzableLoadoutsBreakdown } from '@dlb/services/loadoutAnalyzer/helpers/buildAnalyzableLoadoutsBreakdown';
import allClassItemMetadata from '@dlb/services/tests/fixtures/all-class-item-metadata.json';
import armor from '@dlb/services/tests/fixtures/armor.json';
import availableExoticArmor from '@dlb/services/tests/fixtures/available-exotic-armor.json';
import characters from '@dlb/services/tests/fixtures/characters.json';
import dimLoadouts from '@dlb/services/tests/fixtures/dim-loadouts.json';
import inGameLoadoutsDefinitions from '@dlb/services/tests/fixtures/in-game-loadouts-definitions.json';
import inGameLoadoutsItems from '@dlb/services/tests/fixtures/in-game-loadouts-items.json';

import {
	Armor,
	AvailableExoticArmor,
	DestinyClassToAllClassItemMetadataMapping,
} from '@dlb/types/Armor';
import { Characters } from '@dlb/types/Character';
import { EMasterworkAssumption } from '@dlb/types/IdEnums';

const testFunction = buildAnalyzableLoadoutsBreakdown;

type TestCaseInput = Parameters<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: number];

const testCases: TestCase[] = [
	[
		'Base',
		[
			{
				dimLoadouts: dimLoadouts as DimLoadoutWithId[],
				armor: armor as unknown as Armor,
				allClassItemMetadata:
					allClassItemMetadata as unknown as DestinyClassToAllClassItemMetadataMapping,
				masterworkAssumption: EMasterworkAssumption.All,
				availableExoticArmor:
					availableExoticArmor as unknown as AvailableExoticArmor,
				inGameLoadoutsDefinitions:
					inGameLoadoutsDefinitions as unknown as InGameLoadoutsDefinitions,
				characters: characters as unknown as Characters,
				inGameLoadoutsWithId:
					inGameLoadoutsItems as unknown as InGameLoadoutsWithIdMapping,
				buggedAlternateSeasonModIdList: [],
			},
		],
		50,
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
