import {
	doProcessArmor,
	ProcessArmorOutput,
	DoProcessArmorParams,
	shouldShortCircuit,
	ShouldShortCircuitParams
} from './armor-processing';
import { EArmorSlot, EArmorStat } from './data';
import { describe, expect, test } from '@jest/globals';
import { enforceValidLegendaryArmorBaseStats as es } from '@dlb/services/test-utils';

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
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 60,
				[EArmorStat.Recovery]: 60,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			armorItems: [
				[
					{
						id: '0',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '1',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '2',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '3',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				]
			]
		},
		output: [['0', '1', '2', '3']]
	},
	{
		name: 'It returns no results with one item in each slot',
		input: {
			desiredArmorStats: {
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 100,
				[EArmorStat.Recovery]: 100,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			armorItems: [
				[
					{
						id: '0',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '1',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '2',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '3',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				]
			]
		},
		output: []
	},
	{
		name: 'It returns two results with two leg armor items',
		input: {
			desiredArmorStats: {
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 60,
				[EArmorStat.Recovery]: 60,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			armorItems: [
				[
					{
						id: '0',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '1',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '2',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '3',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					},
					{
						id: '4',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				]
			]
		},
		output: [
			['0', '1', '2', '3'],
			['0', '1', '2', '4']
		]
	},
	{
		name: 'It returns four results with two gauntlet items and two leg armor items',
		input: {
			desiredArmorStats: {
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 60,
				[EArmorStat.Recovery]: 60,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			armorItems: [
				[
					{
						id: '0',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '1',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					},
					{
						id: '2',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '3',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '4',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					},
					{
						id: '5',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				]
			]
		},
		output: [
			['0', '1', '3', '4'],
			['0', '1', '3', '5'],
			['0', '2', '3', '4'],
			['0', '2', '3', '5']
		]
	},
	{
		name: 'It returns no results with two gauntlet items and two leg armor items',
		input: {
			desiredArmorStats: {
				[EArmorStat.Mobility]: 100,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 100,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			armorItems: [
				[
					{
						id: '0',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '1',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					},
					{
						id: '2',
						stats: es([2, 16, 16, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '3',
						stats: es([30, 2, 2, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				],
				[
					{
						id: '4',
						stats: es([30, 2, 2, 16, 16, 2]),
						hash: -1,
						isExotic: false
					},
					{
						id: '5',
						stats: es([30, 2, 2, 16, 16, 2]),
						hash: -1,
						isExotic: false
					}
				]
			]
		},
		output: []
	}
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
	test(processArmorTestCases[2].name, () => {
		const { input, output } = processArmorTestCases[2];
		expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	});
	test(processArmorTestCases[3].name, () => {
		const { input, output } = processArmorTestCases[3];
		expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	});
	test(processArmorTestCases[4].name, () => {
		const { input, output } = processArmorTestCases[4];
		expect(doProcessArmor(input) as string[][]).toEqual(output as string[][]);
	});
});

type ShouldShortCircuitTestCase = {
	name: string;
	input: ShouldShortCircuitParams;
	output: [
		boolean,
		EArmorStat,
		EArmorSlot.Head | EArmorSlot.Arm | EArmorSlot.Chest | ''
	];
};

const shouldShortCircuitTestCases: ShouldShortCircuitTestCase[] = [
	{
		name: 'It returns true when helmet and gauntlets mobility are both 2',
		input: {
			sumOfSeenStats: [2, 16, 16, 16, 16, 2],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 100,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			armorStats: [2, 16, 16, 16, 16, 2],
			numRemainingArmorPieces: 2
		},
		output: [true, EArmorStat.Mobility, EArmorSlot.Arm]
	},
	{
		name: 'It returns true when helmet and gauntlets strength are both 2',
		input: {
			sumOfSeenStats: [2, 16, 16, 16, 16, 2],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 100
			},
			armorStats: [2, 16, 16, 16, 16, 2],
			numRemainingArmorPieces: 2
		},
		output: [true, EArmorStat.Strength, EArmorSlot.Arm]
	},
	{
		name: 'It returns true when helmet and gauntlets discipline and strength are both 2',
		input: {
			sumOfSeenStats: [2, 16, 16, 2, 30, 2],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 100,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 100
			},
			armorStats: [2, 16, 16, 16, 16, 2],
			numRemainingArmorPieces: 2
		},
		output: [true, EArmorStat.Discipline, EArmorSlot.Arm]
	},

	{
		name: 'It returns true immediatley when the stat requirements are impossibly high',
		input: {
			sumOfSeenStats: [2, 16, 16, 2, 30, 2],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 100,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 400
			},
			armorStats: [2, 16, 16, 16, 16, 2],
			numRemainingArmorPieces: 3
		},
		output: [true, EArmorStat.Strength, EArmorSlot.Head]
	},

	{
		name: 'It returns false when gauntlets mobility is 30',
		input: {
			sumOfSeenStats: [16, 2, 16, 16, 16, 2],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 100,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			armorStats: [30, 2, 2, 16, 16, 2],
			numRemainingArmorPieces: 2
		},
		output: [false, null, '']
	},
	{
		name: 'It returns false when helmet mobility is 30',
		input: {
			sumOfSeenStats: [30, 2, 2, 16, 16, 2],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 100,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			armorStats: [10, 2, 22, 16, 16, 2],
			numRemainingArmorPieces: 2
		},
		output: [false, null, '']
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
	test(shouldShortCircuitTestCases[4].name, () => {
		const { input, output } = shouldShortCircuitTestCases[4];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
});
