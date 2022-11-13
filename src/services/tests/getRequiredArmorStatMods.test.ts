import {
	getRequiredArmorStatMods,
	GetRequiredArmorStatModsParams
} from '@dlb/services/armor-processing';
import { EArmorStat, EStatModifier } from '@dlb/services/data';
import { describe, expect, test } from '@jest/globals';

type GetRequiredArmorStatModsTestCase = {
	name: string;
	input: GetRequiredArmorStatModsParams;
	output: EStatModifier[];
};

const getRequiredArmorStatModsTestCases: GetRequiredArmorStatModsTestCase[] = [
	{
		name: 'It returns one major mobility mod when the only required stat is mobility',
		input: {
			stats: [0, 0, 0, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 10,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			numRemainingArmorPieces: 0
		},
		output: [EStatModifier.MajorMobility]
	},
	{
		name: 'It returns one major and one minor mobility mod when the only required stat is mobility',
		input: {
			stats: [5, 0, 0, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 20,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0
			},
			numRemainingArmorPieces: 0
		},
		output: [EStatModifier.MajorMobility, EStatModifier.MinorMobility]
	},
	{
		name: 'It returns a ton of stats with a bunch of variations',
		input: {
			stats: [18, 54, 20, 101, 35, 41],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 30,
				[EArmorStat.Resilience]: 60,
				[EArmorStat.Recovery]: 80,
				[EArmorStat.Discipline]: 100,
				[EArmorStat.Intellect]: 40,
				[EArmorStat.Strength]: 60
			},
			numRemainingArmorPieces: 0
		},
		output: [
			EStatModifier.MajorMobility,
			EStatModifier.MinorMobility,
			EStatModifier.MajorResilience,
			EStatModifier.MajorRecovery,
			EStatModifier.MajorRecovery,
			EStatModifier.MajorRecovery,
			EStatModifier.MajorRecovery,
			EStatModifier.MajorRecovery,
			EStatModifier.MajorRecovery,
			EStatModifier.MinorIntellect,
			EStatModifier.MajorStrength,
			EStatModifier.MajorStrength
		]
	}
];

describe('getRequiredArmorStatMods', () => {
	test(getRequiredArmorStatModsTestCases[0].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[0];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[1].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[1];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[2].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[2];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
});
