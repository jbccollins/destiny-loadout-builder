import { filterRedundantStatModCombos } from '@dlb/services/processArmor/filterRedundantModCombos';
import { getDefaultStatModCombo } from '@dlb/services/processArmor/getStatModCombosFromDesiredStats';
import { EArmorStatId } from '@dlb/types/IdEnums';

const testFunction = filterRedundantStatModCombos;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const testCases: TestCase[] = [
	['Base', [[]], []],
	[
		'Simple redundant mobility and disipline',
		[
			[
				{
					...getDefaultStatModCombo(),
					[EArmorStatId.Mobility]: {
						numMajorMods: 1,
						numMinorMods: 0,
						numArtificeMods: 0,
						exactStatPoints: 10,
					},
					[EArmorStatId.Discipline]: {
						numMajorMods: 1,
						numMinorMods: 0,
						numArtificeMods: 0,
						exactStatPoints: 10,
					},
				},
				{
					...getDefaultStatModCombo(),
					[EArmorStatId.Mobility]: {
						numMajorMods: 0,
						numMinorMods: 2,
						numArtificeMods: 0,
						exactStatPoints: 10,
					},
					[EArmorStatId.Discipline]: {
						numMajorMods: 1,
						numMinorMods: 0,
						numArtificeMods: 0,
						exactStatPoints: 10,
					},
				},
				{
					...getDefaultStatModCombo(),
					[EArmorStatId.Mobility]: {
						numMajorMods: 1,
						numMinorMods: 0,
						numArtificeMods: 0,
						exactStatPoints: 10,
					},
					[EArmorStatId.Discipline]: {
						numMajorMods: 0,
						numMinorMods: 2,
						numArtificeMods: 0,
						exactStatPoints: 10,
					},
				},
			],
		],
		[
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 1,
					numMinorMods: 0,
					numArtificeMods: 0,
					exactStatPoints: 10,
				},
				[EArmorStatId.Discipline]: {
					numMajorMods: 1,
					numMinorMods: 0,
					numArtificeMods: 0,
					exactStatPoints: 10,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 0,
					numMinorMods: 2,
					numArtificeMods: 0,
					exactStatPoints: 10,
				},
				[EArmorStatId.Discipline]: {
					numMajorMods: 1,
					numMinorMods: 0,
					numArtificeMods: 0,
					exactStatPoints: 10,
				},
			},
		],
	],
];

/// const nameOfTestToDebug = "Simple redundant mobility and disipline";
const nameOfTestToDebug = null;
describe('filterRedundantStatModCombos', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
