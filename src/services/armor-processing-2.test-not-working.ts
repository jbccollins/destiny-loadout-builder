import {
	processArmor,
	ProcessArmorOutput,
	ProcessArmorParams
} from './armor-processing';
import { EArmorStatName } from './data';
import { describe, expect, test } from '@jest/globals';

type ArmorProcessingTestCase = {
	input: ProcessArmorParams;
	output: ProcessArmorOutput;
};

const testCases: [string, ArmorProcessingTestCase][] = [
	[
		'It returns results with one item in each slot',
		{
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
		}
	],
	[
		'It returns no results with one item in each slot',
		{
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
		}
	],
	[
		'It returns two results with two leg armor items',
		{
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
		}
	]
];

describe('processArmor', () => {
	test.each(testCases)(`%p`, (name, { input, output }) => {
		const result = processArmor(input) as number[][];
		expect(result).toEqual(output as number[][]);
	});
});
