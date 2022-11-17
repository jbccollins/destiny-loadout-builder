import {
	doProcessArmor,
	ProcessArmorOutput,
	DoProcessArmorParams,
} from '@dlb/services/armor-processing';
import { describe, expect, test } from '@jest/globals';
import { enforceValidLegendaryArmorBaseStats as es } from '@dlb/services/test-utils';
import { EArmorStatId, EArmorStatModId } from '@dlb/types/IdEnums';

type ProcessArmorTestCase = {
	name: string;
	input: DoProcessArmorParams;
	output: ProcessArmorOutput;
};

const processArmorTestCases: ProcessArmorTestCase[] = [
	{
		name: 'It returns results with one item in each slot',
		input: {
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 60,
				[EArmorStatId.Recovery]: 60,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			armorItems: [
				[
					{
						id: '0',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false,
						isMasterworked: false,
					},
				],
				[
					{
						id: '1',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false,
						isMasterworked: false,
					},
				],
				[
					{
						id: '2',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false,
						isMasterworked: false,
					},
				],
				[
					{
						id: '3',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false,
						isMasterworked: false,
					},
				],
			],
		},
		output: [['0', '1', '2', '3', []]],
	},

	{
		name: 'temp',
		input: {
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			armorItems: [
				[
					{
						id: '0',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false,
						isMasterworked: false,
					},
				],
				[
					{
						id: '1',
						stats: es([16, 2, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false,
						isMasterworked: false,
					},
				],
				[
					{
						id: '2',
						stats: es([16, 2, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false,
						isMasterworked: false,
					},
				],
				[
					{
						id: '3',
						stats: es([16, 2, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false,
						isMasterworked: false,
					},
				],
			],
		},
		output: [
			[
				'0',
				'1',
				'2',
				'3',
				[
					EArmorStatModId.MajorMobility,
					EArmorStatModId.MajorMobility,
					EArmorStatModId.MajorMobility,
					EArmorStatModId.MajorMobility,
					EArmorStatModId.MajorMobility,
				],
			],
		],
	},

	// {
	// 	name: 'It returns no results with one item in each slot',
	// 	input: {
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 0,
	// 			[EArmorStatId.Resilience]: 100,
	// 			[EArmorStatId.Recovery]: 100,
	// 			[EArmorStatId.Discipline]: 0,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		armorItems: [
	// 			[
	// 				{
	// 					id: '0',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '1',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '2',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '3',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 		],
	// 	},
	// 	output: [],
	// },
	// {
	// 	name: 'It returns two results with two leg armor items',
	// 	input: {
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 0,
	// 			[EArmorStatId.Resilience]: 60,
	// 			[EArmorStatId.Recovery]: 60,
	// 			[EArmorStatId.Discipline]: 0,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		armorItems: [
	// 			[
	// 				{
	// 					id: '0',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '1',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '2',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '3',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 				{
	// 					id: '4',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 		],
	// 	},
	// 	output: [
	// 		['0', '1', '2', '3'],
	// 		['0', '1', '2', '4'],
	// 	],
	// },
	// {
	// 	name: 'It returns four results with two gauntlet items and two leg armor items',
	// 	input: {
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 0,
	// 			[EArmorStatId.Resilience]: 60,
	// 			[EArmorStatId.Recovery]: 60,
	// 			[EArmorStatId.Discipline]: 0,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		armorItems: [
	// 			[
	// 				{
	// 					id: '0',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '1',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 				{
	// 					id: '2',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '3',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '4',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 				{
	// 					id: '5',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 		],
	// 	},
	// 	output: [
	// 		['0', '1', '3', '4'],
	// 		['0', '1', '3', '5'],
	// 		['0', '2', '3', '4'],
	// 		['0', '2', '3', '5'],
	// 	],
	// },
	// {
	// 	name: 'It returns no results with two gauntlet items and two leg armor items',
	// 	input: {
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 100,
	// 			[EArmorStatId.Resilience]: 0,
	// 			[EArmorStatId.Recovery]: 100,
	// 			[EArmorStatId.Discipline]: 0,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		armorItems: [
	// 			[
	// 				{
	// 					id: '0',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '1',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 				{
	// 					id: '2',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '3',
	// 					stats: es([30, 2, 2, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '4',
	// 					stats: es([30, 2, 2, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 				{
	// 					id: '5',
	// 					stats: es([30, 2, 2, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: false,
	// 				},
	// 			],
	// 		],
	// 	},
	// 	output: [],
	// },
	// {
	// 	name: 'It returns results with one item in each slot where each item is masterworked',
	// 	input: {
	// 		desiredArmorStats: {
	// 			[EArmorStatId.Mobility]: 0,
	// 			[EArmorStatId.Resilience]: 70,
	// 			[EArmorStatId.Recovery]: 70,
	// 			[EArmorStatId.Discipline]: 0,
	// 			[EArmorStatId.Intellect]: 0,
	// 			[EArmorStatId.Strength]: 0,
	// 		},
	// 		armorItems: [
	// 			[
	// 				{
	// 					id: '0',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '1',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '2',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: true,
	// 				},
	// 			],
	// 			[
	// 				{
	// 					id: '3',
	// 					stats: es([2, 16, 16, 16, 16, 2]),
	// 					hash: -1,
	// 					isExotic: false,
	// 					isMasterworked: true,
	// 				},
	// 			],
	// 		],
	// 	},
	// 	output: [['0', '1', '2', '3']],
	// },
];

// TODO: It would be nice to just loop over all these without the verbose
// test() function boilerplate but I can't figure out how to run an individual
// test case that way :(

// TODO: Figure out how to avoid casting as string[][]
describe('processArmor', () => {
	test(processArmorTestCases[0].name, () => {
		const { input, output } = processArmorTestCases[0];
		expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	});
	test(processArmorTestCases[1].name, () => {
		const { input, output } = processArmorTestCases[1];
		expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	});
	// test(processArmorTestCases[2].name, () => {
	// 	const { input, output } = processArmorTestCases[2];
	// 	expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	// });
	// test(processArmorTestCases[3].name, () => {
	// 	const { input, output } = processArmorTestCases[3];
	// 	expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	// });
	// test(processArmorTestCases[4].name, () => {
	// 	const { input, output } = processArmorTestCases[4];
	// 	expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	// });
	// test(processArmorTestCases[5].name, () => {
	// 	const { input, output } = processArmorTestCases[5];
	// 	expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	// });
});
