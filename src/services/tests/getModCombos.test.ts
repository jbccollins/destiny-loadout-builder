import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
} from '@dlb/types/IdEnums';
import { getDefaultStatList } from './utils';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import { getDefaultArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';
import {
	getDefaultModCombos,
	getModCombos,
} from '@dlb/services/processArmor/getModCombos';
import { getDefaultSeenArmorSlotItems } from '@dlb/services/processArmor/seenArmorSlotItems';

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
				potentialRaidModArmorSlotPlacements: [],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				destinyClassId: EDestinyClassId.Warlock,
				specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			},
		],
		getDefaultModCombos(),
	],
	[
		'Two stats',
		[
			{
				sumOfSeenStats: getDefaultStatList(),
				desiredArmorStats: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Intellect]: 10,
					[EArmorStatId.Resilience]: 30,
				},
				potentialRaidModArmorSlotPlacements: [],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				destinyClassId: EDestinyClassId.Warlock,
				specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			},
		],
		getDefaultModCombos(),
	],
	[
		'Lots of stats',
		[
			{
				sumOfSeenStats: [12, 45, 18, 60, 23, 41],
				desiredArmorStats: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Mobility]: 30,
					[EArmorStatId.Resilience]: 30,
					[EArmorStatId.Recovery]: 20,
					[EArmorStatId.Discipline]: 80,
					[EArmorStatId.Intellect]: 10,
					[EArmorStatId.Strength]: 60,
				},
				potentialRaidModArmorSlotPlacements: [],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				destinyClassId: EDestinyClassId.Warlock,
				specialSeenArmorSlotItems: {
					...getDefaultSeenArmorSlotItems(),
					[EArmorSlotId.Head]: 'artifice',
					[EArmorSlotId.Arm]: 'artifice',
					[EArmorSlotId.Chest]: 'artifice',
					ClassItems: {
						...getDefaultSeenArmorSlotItems().ClassItems,
						artifice: true,
					},
				},
			},
		],
		getDefaultModCombos(),
	],
];

const nameOfTestToDebug = 'Lots of stats';
// const nameOfTestToDebug = null;
describe('getModCombos', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
