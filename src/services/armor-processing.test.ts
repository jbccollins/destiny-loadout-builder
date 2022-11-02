import {
	processArmor,
	ProcessArmorOutput,
	ProcessArmorParams
} from './armor-processing';
import { EArmorStatName } from './data';
import { describe, expect, test } from '@jest/globals';

type ArmorProcessingTestCase = {
	name: string;
	input: ProcessArmorParams;
	output: ProcessArmorOutput;
};

const testCases: ArmorProcessingTestCase[] = [
	{
		name: 'It works with one item in each slot',
		input: {
			desiredArmorStats: {
				[EArmorStatName.Mobility]: 10,
				[EArmorStatName.Resilience]: 60,
				[EArmorStatName.Recovery]: 60,
				[EArmorStatName.Discipline]: 10,
				[EArmorStatName.Intellect]: 10,
				[EArmorStatName.Strength]: 10
			},
			armorItems: [
				[{ id: 0, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 1, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 2, stats: [2, 16, 16, 16, 16, 2] }],
				[{ id: 3, stats: [2, 16, 16, 16, 16, 2] }]
			]
		},
		output: [[0, 1, 2, 3]]
	}
];

describe('processArmor', () => {
	testCases.forEach(({ name, input, output }) => {
		test(name, () => {
			// TODO: This "as number[]" is janky. Figure out how to get jest
			// to properly compare types
			expect(processArmor(input) as number[][]).toEqual(output as number[][]);
		});
	});
});

test('1 === 1', () => {
	expect(1).toEqual(1);
});
