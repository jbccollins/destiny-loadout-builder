import {
	getDefaultModCombos,
	getDefaultSeenArmorSlotItems,
	getModCombos,
} from '@dlb/services/armor-processing';
import { EArmorStatId, EDestinyClassId } from '@dlb/types/IdEnums';
import {
	getDefaultDesiredArmorStats,
	getDefaultDestinyClassId,
	getDefaultStatList,
} from './utils';
import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import { getDefaultArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';

export const sortModsIdsAlphabetically = (arr: EModId[]) =>
	arr.sort((a, b) => a.localeCompare(b));

const testFunction = getModCombos;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const testCases: TestCase[] = [
	[
		'Simple',
		[
			{
				sumOfSeenStats: getDefaultStatList(),
				desiredArmorStats: getDefaultArmorStatMapping(),
				validRaidModArmorSlotPlacements: [],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				destinyClassId: EDestinyClassId.Warlock,
				specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			},
		],
		getDefaultModCombos(),
	],
];

// const nameOfTestToDebug =
//	'Two major mods, one minor mod, and four artifice pieces';
const nameOfTestToDebug = null;
describe('getModCombos', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
