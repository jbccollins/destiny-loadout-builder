import {
	processArmor,
	ProcessArmorOutput,
	ProcessArmorParams,
	shouldShortCircuit,
	ShouldShortCircuitParams
} from './armor-processing';
import { EArmorStatName } from './data';
import { describe, expect, test } from '@jest/globals';

type ProcessArmorTestCase = {
	name: string;
	input: ProcessArmorParams;
	output: ProcessArmorOutput;
};

const processArmorTestCases: ProcessArmorTestCase[] = [
	{
		name: 'It returns results with one item in each slot',
		input: {
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 0,
				[EArmorStatName.Resilience]: 60,
				[EArmorStatName.Recovery]: 60,
				[EArmorStatName.Discipline]: 0,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 0
			},
			armorItems: [
				[{ id: 0, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 1, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 2, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 3, stats: [2, 16, 16, 16, 16, 2] }]
			]
		},
		output: [[0, 1, 2, 3]]
	},
	{
		name: 'It returns no results with one item in each slot',
		input: {
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 0,
				[EArmorStatName.Resilience]: 100,
				[EArmorStatName.Recovery]: 100,
				[EArmorStatName.Discipline]: 0,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 0
			},
			armorItems: [
				[{ id: 0, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 1, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 2, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 3, stats: [2, 16, 16, 16, 16, 2] }]
			]
		},
		output: []
	},
	{
		name: 'It returns two results with two leg armor items',
		input: {
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 0,
				[EArmorStatName.Resilience]: 60,
				[EArmorStatName.Recovery]: 60,
				[EArmorStatName.Discipline]: 0,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 0
			},
			armorItems: [
				[{ id: 0, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 1, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 2, stats: [2, 16, 16, 16, 16, 2] }],
				[
					{ id: 3, stats: [2, 16, 16, 16, 16, 2] },
					{ id: 4, stats: [2, 16, 16, 16, 16, 2] }
				]
			]
		},
		output: [
			[0, 1, 2, 3],
			[0, 1, 2, 4]
		]
	},
	{
		name: 'It returns four results with two gauntlet items and two leg armor items',
		input: {
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 0,
				[EArmorStatName.Resilience]: 60,
				[EArmorStatName.Recovery]: 60,
				[EArmorStatName.Discipline]: 0,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 0
			},
			armorItems: [
				[{ id: 0, stats: [2, 16, 16, 16, 16, 2] }],
				[
					{ id: 1, stats: [2, 16, 16, 16, 16, 2] },
					{ id: 2, stats: [2, 16, 16, 16, 16, 2] }
				],
				[{ id: 3, stats: [2, 16, 16, 16, 16, 2] }],
				[
					{ id: 4, stats: [2, 16, 16, 16, 16, 2] },
					{ id: 5, stats: [2, 16, 16, 16, 16, 2] }
				]
			]
		},
		output: [
			[0, 1, 3, 4],
			[0, 1, 3, 5],
			[0, 2, 3, 4],
			[0, 2, 3, 5]
		]
	},
	{
		name: 'It returns one result with two gauntlet items and two leg armor items',
		input: {
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 100,
				[EArmorStatName.Resilience]: 0,
				[EArmorStatName.Recovery]: 100,
				[EArmorStatName.Discipline]: 0,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 0
			},
			armorItems: [
				[{ id: 0, stats: [2, 16, 16, 16, 16, 2] }],
				[
					{ id: 1, stats: [2, 16, 16, 16, 16, 2] },
					{ id: 2, stats: [2, 16, 16, 16, 16, 2] }
				],
				[{ id: 3, stats: [30, 2, 2, 16, 16, 2] }],
				[
					{ id: 4, stats: [30, 2, 2, 16, 16, 2] },
					{ id: 5, stats: [30, 2, 2, 16, 16, 2] }
				]
			]
		},
		output: []
	}
];

// TODO: It would be nice to just loop over all these without the verbose
// test() function boilerplate but I can't figure out how to run an individual
// test case that way :(
describe('processArmor', () => {
	test(processArmorTestCases[0].name, () => {
		const { input, output } = processArmorTestCases[0];
		expect(processArmor(input) as number[][]).toEqual(output as number[][]);
	});
	test(processArmorTestCases[1].name, () => {
		const { input, output } = processArmorTestCases[1];
		expect(processArmor(input) as number[][]).toEqual(output as number[][]);
	});
	test(processArmorTestCases[2].name, () => {
		const { input, output } = processArmorTestCases[2];
		expect(processArmor(input) as number[][]).toEqual(output as number[][]);
	});
	test(processArmorTestCases[3].name, () => {
		const { input, output } = processArmorTestCases[3];
		expect(processArmor(input) as number[][]).toEqual(output as number[][]);
	});

	test(processArmorTestCases[4].name, () => {
		const { input, output } = processArmorTestCases[4];
		expect(processArmor(input) as number[][]).toEqual(output as number[][]);
	});
});

type ShouldShortCircuitTestCase = {
	name: string;
	input: ShouldShortCircuitParams;
	output: [boolean, EArmorStatName];
};

const shouldShortCircuitTestCases: ShouldShortCircuitTestCase[] = [
	{
		name: 'It returns true when helmet and gauntlets mobility are both 2',
		input: {
			sumOfSeenStats: [2, 16, 16, 16, 16, 2],
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 100,
				[EArmorStatName.Resilience]: 0,
				[EArmorStatName.Recovery]: 0,
				[EArmorStatName.Discipline]: 0,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 0
			},
			armorStats: [2, 16, 16, 16, 16, 2],
			numRemaingArmorPieces: 2
		},
		output: [true, EArmorStatName.Mobility]
	},
	{
		name: 'It returns true when helmet and gauntlets strength are both 2',
		input: {
			sumOfSeenStats: [2, 16, 16, 16, 16, 2],
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 0,
				[EArmorStatName.Resilience]: 0,
				[EArmorStatName.Recovery]: 0,
				[EArmorStatName.Discipline]: 0,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 100
			},
			armorStats: [2, 16, 16, 16, 16, 2],
			numRemaingArmorPieces: 2
		},
		output: [true, EArmorStatName.Strength]
	},
	{
		name: 'It returns true when helmet and gauntlets discipline and strength are both 2',
		input: {
			sumOfSeenStats: [2, 16, 16, 2, 30, 2],
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 0,
				[EArmorStatName.Resilience]: 0,
				[EArmorStatName.Recovery]: 0,
				[EArmorStatName.Discipline]: 100,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 100
			},
			armorStats: [2, 16, 16, 16, 16, 2],
			numRemaingArmorPieces: 2
		},
		output: [true, EArmorStatName.Discipline]
	},

	{
		name: 'It returns false when gauntlets mobility is 30',
		input: {
			sumOfSeenStats: [16, 2, 16, 16, 16, 2],
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 100,
				[EArmorStatName.Resilience]: 0,
				[EArmorStatName.Recovery]: 0,
				[EArmorStatName.Discipline]: 0,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 0
			},
			armorStats: [30, 2, 2, 16, 16, 2],
			numRemaingArmorPieces: 2
		},
		output: [false, null]
	},
	{
		name: 'It returns false when helmet mobility is 30',
		input: {
			sumOfSeenStats: [30, 2, 2, 16, 16, 2],
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 100,
				[EArmorStatName.Resilience]: 0,
				[EArmorStatName.Recovery]: 0,
				[EArmorStatName.Discipline]: 0,
				[EArmorStatName.Intellect]: 0,
				[EArmorStatName.Strength]: 0
			},
			armorStats: [10, 2, 22, 16, 16, 2],
			numRemaingArmorPieces: 2
		},
		output: [false, null]
	}
];

describe('shouldShortCircuit', () => {
	test(shouldShortCircuitTestCases[0].name, () => {
		const { input, output } = shouldShortCircuitTestCases[0];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[1].name, () => {
		const { input, output } = shouldShortCircuitTestCases[1];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[2].name, () => {
		const { input, output } = shouldShortCircuitTestCases[2];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[3].name, () => {
		const { input, output } = shouldShortCircuitTestCases[3];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
});
