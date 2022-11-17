import {
	getRequiredArmorStatMods,
	GetRequiredArmorStatModsParams,
} from '@dlb/services/armor-processing';
import { ArmorStatMapping } from '@dlb/types/ArmorStat';
import { EArmorStatId, EArmorStatModId } from '@dlb/types/IdEnums';

import { describe, expect, test } from '@jest/globals';

type GetRequiredArmorStatModsTestCase = {
	name: string;
	input: GetRequiredArmorStatModsParams;
	output: [EArmorStatModId[], ArmorStatMapping];
};

const getRequiredArmorStatModsTestCases: GetRequiredArmorStatModsTestCase[] = [
	{
		name: 'It returns one major mobility mod when the only required stat is mobility',
		input: {
			stats: [0, 0, 0, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
		},
		output: [
			[EArmorStatModId.MajorMobility],
			{
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
		],
	},
	{
		name: 'It returns one major and one minor mobility mod when the only required stat is mobility',
		input: {
			stats: [5, 0, 0, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 20,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
		},
		output: [
			[EArmorStatModId.MajorMobility, EArmorStatModId.MinorMobility],
			{
				[EArmorStatId.Mobility]: 15,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
		],
	},
	{
		name: 'It returns a ton of stats with a bunch of variations',
		input: {
			stats: [18, 54, 20, 101, 35, 41],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 30,
				[EArmorStatId.Resilience]: 60,
				[EArmorStatId.Recovery]: 80,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 40,
				[EArmorStatId.Strength]: 60,
			},
			numRemainingArmorPieces: 0,
		},
		output: [
			[
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MinorMobility,
				EArmorStatModId.MajorResilience,
				EArmorStatModId.MajorRecovery,
				EArmorStatModId.MajorRecovery,
				EArmorStatModId.MajorRecovery,
				EArmorStatModId.MajorRecovery,
				EArmorStatModId.MajorRecovery,
				EArmorStatModId.MajorRecovery,
				EArmorStatModId.MinorIntellect,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MajorStrength,
			],
			{
				[EArmorStatId.Mobility]: 15,
				[EArmorStatId.Resilience]: 10,
				[EArmorStatId.Recovery]: 60,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 5,
				[EArmorStatId.Strength]: 20,
			},
		],
	},
	{
		name: 'With three remaining pieces, it returns one mod when the only required stat is 100 mobility',
		input: {
			stats: [0, 0, 0, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 3,
		},
		output: [
			[EArmorStatModId.MinorMobility],
			{
				[EArmorStatId.Mobility]: 5,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
		],
	},
	{
		name: 'With two remaining pieces',
		input: {
			stats: [8, 0, 21, 0, 0, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 90,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
		},
		output: [
			[
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MinorRecovery,
			],
			{
				[EArmorStatId.Mobility]: 30,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 5,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
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
