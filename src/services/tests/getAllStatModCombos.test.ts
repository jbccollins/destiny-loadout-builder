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
		'Two major mods and one minor mod',
		[
			{
				desiredArmorStats: {
					...getDefaultDesiredArmorStats(),
					[EArmorStatId.Mobility]: 10,
					[EArmorStatId.Resilience]: 15,
				},
				stats: getDefaultStatList(),
				destinyClassId: getDefaultDestinyClassId(),
				numSeenArtificeArmorItems: 0,
			},
		],
		[
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
					EModId.ResilienceMod,
				],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 8,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 8,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorResilienceMod,
					EModId.MobilityMod,
					EModId.ResilienceMod,
				],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 9,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
					EModId.MobilityMod,
				],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 9,
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
	[
		'Two major mods, one minor mod, and four artifice pieces',
		[
			{
				desiredArmorStats: {
					...getDefaultDesiredArmorStats(),
					[EArmorStatId.Mobility]: 6,
					[EArmorStatId.Resilience]: 6,
					[EArmorStatId.Recovery]: 3,
				},
				stats: getDefaultStatList(),
				destinyClassId: getDefaultDestinyClassId(),
				numSeenArtificeArmorItems: 4,
			},
		],
		[
			{
				armorStatModIdList: [EModId.MinorMobilityMod],
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.ResilienceForged,
					EModId.ResilienceForged,
					EModId.RecoveryForged,
				],
				metadata: {
					totalArmorStatModCost: 1,
				},
			},
			{
				armorStatModIdList: [EModId.MinorResilienceMod],
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.MobilityForged,
					EModId.ResilienceForged,
					EModId.RecoveryForged,
				],
				metadata: {
					totalArmorStatModCost: 2,
				},
			},
			{
				armorStatModIdList: [EModId.MinorRecoveryMod],
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.MobilityForged,
					EModId.ResilienceForged,
					EModId.ResilienceForged,
				],
				metadata: {
					totalArmorStatModCost: 2,
				},
			},
			{
				armorStatModIdList: [EModId.MinorMobilityMod, EModId.MinorMobilityMod],
				artificeModIdList: [
					EModId.ResilienceForged,
					EModId.ResilienceForged,
					EModId.RecoveryForged,
				],
				metadata: {
					totalArmorStatModCost: 2,
				},
			},
			{
				armorStatModIdList: [EModId.MobilityMod],
				artificeModIdList: [
					EModId.ResilienceForged,
					EModId.ResilienceForged,
					EModId.RecoveryForged,
				],
				metadata: {
					totalArmorStatModCost: 3,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.ResilienceForged,
					EModId.RecoveryForged,
				],
				metadata: {
					totalArmorStatModCost: 3,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.ResilienceForged,
					EModId.RecoveryForged,
				],
				metadata: {
					totalArmorStatModCost: 3,
				},
			},
			{
				armorStatModIdList: [EModId.MinorMobilityMod, EModId.MinorRecoveryMod],
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.ResilienceForged,
					EModId.ResilienceForged,
				],
				metadata: {
					totalArmorStatModCost: 3,
				},
			},
			{
				armorStatModIdList: [EModId.ResilienceMod],
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.MobilityForged,
					EModId.RecoveryForged,
				],
				metadata: {
					totalArmorStatModCost: 4,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.MobilityForged,
					EModId.RecoveryForged,
				],
				metadata: {
					totalArmorStatModCost: 4,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.MobilityForged,
					EModId.ResilienceForged,
				],
				metadata: {
					totalArmorStatModCost: 4,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.ResilienceForged, EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 4,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.ResilienceForged, EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 4,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorRecoveryMod,
				],
				artificeModIdList: [EModId.ResilienceForged, EModId.ResilienceForged],
				metadata: {
					totalArmorStatModCost: 4,
				},
			},
			{
				armorStatModIdList: [EModId.MinorMobilityMod, EModId.ResilienceMod],
				artificeModIdList: [EModId.MobilityForged, EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 5,
				},
			},
			{
				armorStatModIdList: [EModId.MinorResilienceMod, EModId.MobilityMod],
				artificeModIdList: [EModId.ResilienceForged, EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 5,
				},
			},
			{
				armorStatModIdList: [EModId.MinorRecoveryMod, EModId.MobilityMod],
				artificeModIdList: [EModId.ResilienceForged, EModId.ResilienceForged],
				metadata: {
					totalArmorStatModCost: 5,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.MobilityForged, EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 5,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.MobilityForged, EModId.ResilienceForged],
				metadata: {
					totalArmorStatModCost: 5,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.MobilityForged, EModId.ResilienceForged],
				metadata: {
					totalArmorStatModCost: 5,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.MobilityForged, EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 5,
				},
			},
			{
				armorStatModIdList: [EModId.MinorRecoveryMod, EModId.ResilienceMod],
				artificeModIdList: [EModId.MobilityForged, EModId.MobilityForged],
				metadata: {
					totalArmorStatModCost: 6,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.ResilienceMod,
				],
				artificeModIdList: [EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 6,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.MobilityForged, EModId.MobilityForged],
				metadata: {
					totalArmorStatModCost: 6,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 6,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.ResilienceForged],
				metadata: {
					totalArmorStatModCost: 6,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 6,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.ResilienceForged],
				metadata: {
					totalArmorStatModCost: 6,
				},
			},
			{
				armorStatModIdList: [EModId.MobilityMod, EModId.ResilienceMod],
				artificeModIdList: [EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 7,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
					EModId.MobilityMod,
				],
				artificeModIdList: [EModId.RecoveryForged],
				metadata: {
					totalArmorStatModCost: 7,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorRecoveryMod,
					EModId.ResilienceMod,
				],
				artificeModIdList: [EModId.MobilityForged],
				metadata: {
					totalArmorStatModCost: 7,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
					EModId.MobilityMod,
				],
				artificeModIdList: [EModId.ResilienceForged],
				metadata: {
					totalArmorStatModCost: 7,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [EModId.MobilityForged],
				metadata: {
					totalArmorStatModCost: 7,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorRecoveryMod,
					EModId.ResilienceMod,
				],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 8,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorMobilityMod,
					EModId.MinorMobilityMod,
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
				],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 8,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorRecoveryMod,
					EModId.MobilityMod,
					EModId.ResilienceMod,
				],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 9,
				},
			},
			{
				armorStatModIdList: [
					EModId.MinorRecoveryMod,
					EModId.MinorResilienceMod,
					EModId.MinorResilienceMod,
					EModId.MobilityMod,
				],
				artificeModIdList: [],
				metadata: {
					totalArmorStatModCost: 9,
				},
			},
		],
	],
];

// const nameOfTestToDebug =
//	'Two major mods, one minor mod, and four artifice pieces';
const nameOfTestToDebug = null;
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
