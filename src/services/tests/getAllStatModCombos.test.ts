import { getAllStatModCombos } from '@dlb/services/armor-processing';
import { EArmorStatId } from '@dlb/types/IdEnums';
import {
	getDefaultDesiredArmorStats,
	getDefaultDestinyClassId,
	getDefaultStatList,
} from './utils';
import { EModId } from '@dlb/generated/mod/EModId';

export const sortModsIdsAlphabetically = (arr: EModId[]) =>
	arr.sort((a, b) => a.localeCompare(b));

const testFunction = getAllStatModCombos;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const testCases: TestCase[] = [
	[
		'Single minor mod',
		[
			{
				desiredArmorStats: {
					...getDefaultDesiredArmorStats(),
					[EArmorStatId.Mobility]: 5,
				},
				stats: getDefaultStatList(),
				destinyClassId: getDefaultDestinyClassId(),
				numSeenArtificeArmorItems: 0,
			},
		],
		[
			{
				armorStatModIdList: [EModId.MinorMobilityMod],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 1,
				},
			},
		],
	],
	[
		'Single minor mod with one artifice piece',
		[
			{
				desiredArmorStats: {
					...getDefaultDesiredArmorStats(),
					[EArmorStatId.Mobility]: 5,
				},
				stats: getDefaultStatList(),
				destinyClassId: getDefaultDestinyClassId(),
				numSeenArtificeArmorItems: 1,
			},
		],
		[
			{
				armorStatModIdList: [EModId.MinorMobilityMod],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 1,
				},
			},
		],
	],
	[
		'Single major mod',
		[
			{
				desiredArmorStats: {
					...getDefaultDesiredArmorStats(),
					[EArmorStatId.Mobility]: 10,
				},
				stats: getDefaultStatList(),
				destinyClassId: getDefaultDestinyClassId(),
				numSeenArtificeArmorItems: 0,
			},
		],
		[
			{
				armorStatModIdList: [EModId.MinorMobilityMod, EModId.MinorMobilityMod],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 2,
				},
			},
			{
				armorStatModIdList: [EModId.MobilityMod],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 3,
				},
			},
		],
	],
	[
		'Two major mods',
		[
			{
				desiredArmorStats: {
					...getDefaultDesiredArmorStats(),
					[EArmorStatId.Mobility]: 10,
					[EArmorStatId.Resilience]: 10,
				},
				stats: getDefaultStatList(),
				destinyClassId: getDefaultDestinyClassId(),
				numSeenArtificeArmorItems: 0,
			},
		],
		[
			{
				armorStatModIdList: sortModsIdsAlphabetically([
					EModId.ResilienceMod,
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
				]),
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 6,
				},
			},
			{
				armorStatModIdList: sortModsIdsAlphabetically([
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				]),
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 6,
				},
			},
			{
				armorStatModIdList: sortModsIdsAlphabetically([
					EModId.MobilityMod,
					EModId.ResilienceMod,
				]),
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 7,
				},
			},
			{
				armorStatModIdList: sortModsIdsAlphabetically([
					EModId.MobilityMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				]),
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 7,
				},
			},
		],
	],
	[
		'One major mod with two artifice pieces',
		[
			{
				desiredArmorStats: {
					...getDefaultDesiredArmorStats(),
					[EArmorStatId.Mobility]: 6,
				},
				stats: getDefaultStatList(),
				destinyClassId: getDefaultDestinyClassId(),
				numSeenArtificeArmorItems: 2,
			},
		],
		[
			{
				armorStatModIdList: [],
				artificeModIdList: [EModId.MobilityForged, EModId.MobilityForged],
				metadata: {
					totalArmorStatModCost: 0,
				},
			},
			{
				armorStatModIdList: [EModId.MinorMobilityMod],
				artificeModIdList: [EModId.MobilityForged],
				metadata: {
					totalArmorStatModCost: 1,
				},
			},
			{
				armorStatModIdList: [EModId.MinorMobilityMod, EModId.MinorMobilityMod],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 2,
				},
			},
			{
				armorStatModIdList: [EModId.MobilityMod],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 3,
				},
			},
		],
	],
];

const nameOfTestToDebug = null; // 'Two major mods';
describe('getAllStatModCombos', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		// Sort the output so that it doesn't matter what we write in the test
		// so long as the arrays contain the same values.
		const _result: TestCaseOutput = [];
		result.forEach((x) => {
			_result.push({
				...x,
				armorStatModIdList: sortModsIdsAlphabetically(x.armorStatModIdList),
			});
		});
		expect(_result).toEqual(output);
	});
});
