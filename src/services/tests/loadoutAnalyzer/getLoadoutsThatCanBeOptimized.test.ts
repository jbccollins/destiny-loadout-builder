import {
	getLoadoutsThatCanBeOptimized,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import allClassItemMetadata from '@dlb/services/tests/fixtures/all-class-item-metadata.json';
import armor from '@dlb/services/tests/fixtures/armor.json';
import availableExoticArmor from '@dlb/services/tests/fixtures/available-exotic-armor.json';
import characters from '@dlb/services/tests/fixtures/characters.json';
import dimLoadouts from '@dlb/services/tests/fixtures/dim-loadouts.json';
import inGameLoadoutsDefinitions from '@dlb/services/tests/fixtures/in-game-loadouts-definitions.json';
import inGameLoadoutsItems from '@dlb/services/tests/fixtures/in-game-loadouts-items.json';

import { DimLoadoutWithId } from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import {
	InGameLoadoutsDefinitions,
	InGameLoadoutsWithIdMapping,
} from '@dlb/redux/features/inGameLoadouts/inGameLoadoutsSlice';
import { buildAnalyzableLoadoutsBreakdown } from '@dlb/services/loadoutAnalyzer/buildAnalyzableLoadoutsBreakdown';
import {
	Armor,
	AvailableExoticArmor,
	DestinyClassToAllClassItemMetadataMapping,
} from '@dlb/types/Armor';
import { Characters } from '@dlb/types/Character';
import { EMasterworkAssumption } from '@dlb/types/IdEnums';
const testFunction = getLoadoutsThatCanBeOptimized;

type TestCaseInput = Parameters<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: number];
const loadouts = buildAnalyzableLoadoutsBreakdown({
	dimLoadouts: dimLoadouts as DimLoadoutWithId[],
	armor: armor as unknown as Armor,
	allClassItemMetadata:
		allClassItemMetadata as unknown as DestinyClassToAllClassItemMetadataMapping,
	masterworkAssumption: EMasterworkAssumption.All,
	availableExoticArmor: availableExoticArmor as unknown as AvailableExoticArmor,
	inGameLoadoutsDefinitions:
		inGameLoadoutsDefinitions as unknown as InGameLoadoutsDefinitions,
	characters: characters as unknown as Characters,
	inGameLoadoutsWithId:
		inGameLoadoutsItems as unknown as InGameLoadoutsWithIdMapping,
});

// TODO: This test takes way too long to run. Find a better way to test this.
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
				buggedAlternateSeasonModIdList: [],
			},
		],
		83,
	],
];

// const nameOfTestToDebug = 'Base';
const nameOfTestToDebug = null;
describe.skip('getLoadoutsThatCanBeOptimized', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result.length).toEqual(output);
	});
});
