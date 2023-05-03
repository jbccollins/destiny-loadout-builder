import { EArmorStatId } from '@dlb/types/IdEnums';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	getAllValidStatModCombos,
	getDefaultStatModCombo,
} from '@dlb/services/processArmor/getStatModCombosFromDesiredStats';

const testFunction = getAllValidStatModCombos;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const testCases: TestCase[] = [
	[
		'Base case',
		[
			{
				targetStatShortfalls: getDefaultArmorStatMapping(),
				numAvailableArtificePieces: 0,
			},
		],
		[],
	],
	[
		'Single stat',
		[
			{
				targetStatShortfalls: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Mobility]: 20,
				},
				numAvailableArtificePieces: 0,
			},
		],
		[
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 2,
					numMinorMods: 0,
					numArtificeMods: 0,
					exactStatPoints: 20,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 1,
					numMinorMods: 2,
					numArtificeMods: 0,
					exactStatPoints: 20,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 0,
					numMinorMods: 4,
					numArtificeMods: 0,
					exactStatPoints: 20,
				},
			},
		],
	],
	[
		'Single stat with artifice mods',
		[
			{
				targetStatShortfalls: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Mobility]: 20,
				},
				numAvailableArtificePieces: 4,
			},
		],
		[
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 2,
					numMinorMods: 0,
					numArtificeMods: 0,
					exactStatPoints: 20,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 1,
					numMinorMods: 2,
					numArtificeMods: 0,
					exactStatPoints: 20,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 0,
					numMinorMods: 4,
					numArtificeMods: 0,
					exactStatPoints: 20,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 1,
					numMinorMods: 0,
					numArtificeMods: 4,
					exactStatPoints: 22,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 0,
					numMinorMods: 2,
					numArtificeMods: 4,
					exactStatPoints: 22,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 1,
					numMinorMods: 1,
					numArtificeMods: 2,
					exactStatPoints: 21,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 0,
					numMinorMods: 3,
					numArtificeMods: 2,
					exactStatPoints: 21,
				},
			},
		],
	],
	[
		'Simple case with zero wasted stats',
		[
			{
				targetStatShortfalls: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Mobility]: 3,
				},
				numAvailableArtificePieces: 1,
				useZeroWastedStats: true,
			},
		],
		[
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 0,
					numMinorMods: 0,
					numArtificeMods: 1,
					exactStatPoints: 3,
				},
			},
		],
	],
	[
		'Zero wasted stats where a 10 is needed',
		[
			{
				targetStatShortfalls: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Mobility]: 4,
				},
				numAvailableArtificePieces: 4,
				useZeroWastedStats: true,
			},
		],
		[
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Mobility]: {
					numMajorMods: 0,
					numMinorMods: 1,
					numArtificeMods: 3,
					exactStatPoints: 14,
				},
			},
		],
	],
	[
		'Impossible target stats',
		[
			{
				targetStatShortfalls: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Mobility]: 100,
				},
				numAvailableArtificePieces: 0,
			},
		],
		null,
	],
	[
		'Less ridiculous, but still impossible target stats',
		[
			{
				targetStatShortfalls: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Resilience]: 50,
					[EArmorStatId.Strength]: 20,
				},
				numAvailableArtificePieces: 0,
			},
		],
		null,
	],
	[
		'Two stats with redundancy',
		[
			{
				targetStatShortfalls: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Discipline]: 10,
					[EArmorStatId.Strength]: 10,
				},
				numAvailableArtificePieces: 0,
			},
		],
		[
			// Note that two minor discipline and one major strength is redundant so it is not included in the results
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Discipline]: {
					numMajorMods: 1,
					numMinorMods: 0,
					numArtificeMods: 0,
					exactStatPoints: 10,
				},
				[EArmorStatId.Strength]: {
					numMajorMods: 1,
					numMinorMods: 0,
					numArtificeMods: 0,
					exactStatPoints: 10,
				},
			},
			{
				...getDefaultStatModCombo(),
				[EArmorStatId.Strength]: {
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
				[EArmorStatId.Discipline]: {
					numMajorMods: 0,
					numMinorMods: 2,
					numArtificeMods: 0,
					exactStatPoints: 10,
				},
				[EArmorStatId.Strength]: {
					numMajorMods: 0,
					numMinorMods: 2,
					numArtificeMods: 0,
					exactStatPoints: 10,
				},
			},
		],
	],
	[
		'Four stats with artifice mods and redundancy',
		[
			{
				targetStatShortfalls: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Recovery]: 15,
					[EArmorStatId.Discipline]: 10,
					[EArmorStatId.Strength]: 10,
					[EArmorStatId.Intellect]: 10,
				},
				numAvailableArtificePieces: 2,
			},
		],
		[
			{
				[EArmorStatId.Discipline]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Intellect]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Mobility]: null,
				[EArmorStatId.Recovery]: {
					exactStatPoints: 15,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 1,
				},
				[EArmorStatId.Resilience]: null,
				[EArmorStatId.Strength]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
			},
			{
				[EArmorStatId.Discipline]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Intellect]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Mobility]: null,
				[EArmorStatId.Recovery]: {
					exactStatPoints: 15,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 1,
				},
				[EArmorStatId.Resilience]: null,
				[EArmorStatId.Strength]: {
					exactStatPoints: 11,
					numArtificeMods: 2,
					numMajorMods: 0,
					numMinorMods: 1,
				},
			},
			{
				[EArmorStatId.Discipline]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Intellect]: {
					exactStatPoints: 11,
					numArtificeMods: 2,
					numMajorMods: 0,
					numMinorMods: 1,
				},
				[EArmorStatId.Mobility]: null,
				[EArmorStatId.Recovery]: {
					exactStatPoints: 15,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 1,
				},
				[EArmorStatId.Resilience]: null,
				[EArmorStatId.Strength]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
			},
			{
				[EArmorStatId.Discipline]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Intellect]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Mobility]: null,
				[EArmorStatId.Recovery]: {
					exactStatPoints: 16,
					numArtificeMods: 2,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Resilience]: null,
				[EArmorStatId.Strength]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
			},
			{
				[EArmorStatId.Discipline]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Intellect]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Mobility]: null,
				[EArmorStatId.Recovery]: {
					exactStatPoints: 16,
					numArtificeMods: 2,
					numMajorMods: 1,
					numMinorMods: 0,
				},
				[EArmorStatId.Resilience]: null,
				[EArmorStatId.Strength]: {
					exactStatPoints: 10,
					numArtificeMods: 0,
					numMajorMods: 0,
					numMinorMods: 2,
				},
			},
		],
	],
];

const nameOfTestToDebug = 'Four stats';
// const nameOfTestToDebug = null;
describe('getAllValidStatModCombos', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
