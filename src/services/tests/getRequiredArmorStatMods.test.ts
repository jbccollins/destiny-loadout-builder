import {
	getRequiredArmorStatMods,
	GetRequiredArmorStatModsParams,
} from '@dlb/services/armor-processing';
import {
	ArmorStatMapping,
	EArmorStat,
	EStatModifier,
} from '@dlb/services/data';
import { describe, expect, test } from '@jest/globals';

type GetRequiredArmorStatModsTestCase = {
	name: string;
	input: GetRequiredArmorStatModsParams;
	output: [EStatModifier[], ArmorStatMapping];
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
				[EArmorStat.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
		},
		output: [
			[EStatModifier.MajorMobility],
			{
				[EArmorStat.Mobility]: 10,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
		],
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
				[EArmorStat.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
		},
		output: [
			[EStatModifier.MajorMobility, EStatModifier.MinorMobility],
			{
				[EArmorStat.Mobility]: 15,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
		],
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
				[EArmorStat.Strength]: 60,
			},
			numRemainingArmorPieces: 0,
		},
		output: [
			[
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
				EStatModifier.MajorStrength,
			],
			{
				[EArmorStat.Mobility]: 15,
				[EArmorStat.Resilience]: 10,
				[EArmorStat.Recovery]: 60,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 5,
				[EArmorStat.Strength]: 20,
			},
		],
	},
	{
		name: 'With three remaining pieces, it returns one mod when the only required stat is 100 mobility',
		input: {
			stats: [0, 0, 0, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 100,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
			numRemainingArmorPieces: 3,
		},
		output: [
			[EStatModifier.MinorMobility],
			{
				[EArmorStat.Mobility]: 5,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 0,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
		],
	},
	{
		name: 'With two remaining pieces',
		input: {
			stats: [8, 0, 21, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStat.Mobility]: 100,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 90,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
		},
		output: [
			[
				EStatModifier.MajorMobility,
				EStatModifier.MajorMobility,
				EStatModifier.MajorMobility,
				EStatModifier.MinorRecovery,
			],
			{
				[EArmorStat.Mobility]: 30,
				[EArmorStat.Resilience]: 0,
				[EArmorStat.Recovery]: 5,
				[EArmorStat.Discipline]: 0,
				[EArmorStat.Intellect]: 0,
				[EArmorStat.Strength]: 0,
			},
		],
	},
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
	test(getRequiredArmorStatModsTestCases[3].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[3];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
	test(getRequiredArmorStatModsTestCases[4].name, () => {
		const { input, output } = getRequiredArmorStatModsTestCases[4];
		expect(getRequiredArmorStatMods(input)).toEqual(output);
	});
});
