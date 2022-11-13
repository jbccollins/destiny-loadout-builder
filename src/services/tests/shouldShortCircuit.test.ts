import {
	shouldShortCircuit,
	ShouldShortCircuitParams
} from '@dlb/services/armor-processing';
import { EArmorSlot, EArmorStat } from '@dlb/services/data';
import { describe, expect, test } from '@jest/globals';
import { enforceValidLegendaryArmorBaseStats as es } from '@dlb/services/test-utils';

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
			requiredArmorStatMods: [],
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
			requiredArmorStatMods: [],
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
			requiredArmorStatMods: [],
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
			requiredArmorStatMods: [],
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
			requiredArmorStatMods: [],
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
			requiredArmorStatMods: [],
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
