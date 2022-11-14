import {
	shouldShortCircuit,
	ShouldShortCircuitOutput,
	ShouldShortCircuitParams,
} from '@dlb/services/armor-processing';
import {
	ArmorStatMapping,
	EArmorSlot,
	EArmorStat,
	EStatModifier,
} from '@dlb/services/data';
import { describe, expect, test } from '@jest/globals';
import { enforceValidLegendaryArmorBaseStats as es } from '@dlb/services/test-utils';

type ShouldShortCircuitTestCase = {
	name: string;
	input: ShouldShortCircuitParams;
	output: ShouldShortCircuitOutput;
};

const shouldShortCircuitTestCases: ShouldShortCircuitTestCase[] = [
	{
		name: 'It returns true when helmet, gauntlets, and chest mobility are all 2',
		input: {
			sumOfSeenStats: [6, 48, 48, 48, 48, 6],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 100,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
			numRemainingArmorPieces: 1,
		},
		output: [
			true,
			[
				EStatModifier.MajorMobility,
				EStatModifier.MajorMobility,
				EStatModifier.MajorMobility,
				EStatModifier.MajorMobility,
				EStatModifier.MajorMobility,
				EStatModifier.MajorMobility,
				EStatModifier.MinorMobility,
			],
			{
				[EArmorStat.Mobility]: 65,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
			null,
			EArmorSlot.Chest,
		],
	},
	{
		name: 'It returns false when helmet and gauntlets strength are both 2',
		input: {
			sumOfSeenStats: [4, 32, 32, 32, 32, 4],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 100,
			},
			numRemainingArmorPieces: 2,
		},
		output: [
			false,
			[
				EStatModifier.MajorStrength,
				EStatModifier.MajorStrength,
				EStatModifier.MajorStrength,
				EStatModifier.MinorStrength,
			],
			{
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 35,
			},
			null,
			null,
		],
	},
	{
		name: 'It returns true when helmet and gauntlets strength are both 2, helmet discipline is 2 and gauntlets discipline is 16',
		input: {
			sumOfSeenStats: [4, 32, 32, 18, 46, 4],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 100,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 100,
			},
			numRemainingArmorPieces: 2,
		},
		output: [
			true,
			[
				EStatModifier.MajorDiscipline,
				EStatModifier.MajorDiscipline,
				EStatModifier.MajorStrength,
				EStatModifier.MajorStrength,
				EStatModifier.MajorStrength,
				EStatModifier.MinorStrength,
			],
			{
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 20,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 35,
			},
			null,
			EArmorSlot.Arm,
		],
	},
	{
		name: 'It returns true immediately when the stat requirements are impossibly high',
		input: {
			sumOfSeenStats: [2, 16, 16, 2, 30, 2],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 100,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 150,
			},
			numRemainingArmorPieces: 3,
		},
		output: [
			true,
			[
				EStatModifier.MinorDiscipline,
				EStatModifier.MajorStrength,
				EStatModifier.MajorStrength,
				EStatModifier.MajorStrength,
				EStatModifier.MajorStrength,
				EStatModifier.MajorStrength,
				EStatModifier.MinorStrength,
			],
			{
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 5,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 55,
			},
			null,
			EArmorSlot.Head,
		],
	},
	{
		name: 'It returns false when gauntlets mobility is 46',
		input: {
			sumOfSeenStats: [46, 4, 18, 32, 32, 4],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 100,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
		},
		output: [
			false,
			[],
			{
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
			null,
			null,
		],
	},
	{
		name: 'It returns false when helmet mobility is 40',
		input: {
			sumOfSeenStats: [40, 4, 24, 32, 32, 4],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 100,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
		},
		output: [
			false,
			[],
			{
				[EArmorStat.Mobility]: 0,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
			null,
			null,
		],
	},
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
	test(shouldShortCircuitTestCases[5].name, () => {
		const { input, output } = shouldShortCircuitTestCases[5];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
});
