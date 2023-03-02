import {
	shouldShortCircuit,
	ShouldShortCircuitOutput,
	ShouldShortCircuitParams,
} from '@dlb/services/armor-processing';
import { describe, expect, test } from '@jest/globals';
import {
	EArmorStatId,
	EArmorSlotId,
	EDestinyClassId,
} from '@dlb/types/IdEnums';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import {
	ArmorSlotIdToModIdListMapping,
	ValidCombatStyleModPlacements,
} from '@dlb/types/Mod';
import { EModId } from '@dlb/generated/mod/EModId';

const generateDefaultArmorSlotIdToModIDListMapping =
	(): ArmorSlotIdToModIdListMapping => {
		return ArmorSlotWithClassItemIdList.reduce((accumulator, currentValue) => {
			accumulator[currentValue] = [null, null, null];
			return accumulator;
		}, {}) as ArmorSlotIdToModIdListMapping;
	};

const generateDefaultValidCombatStyleModPlacements =
	(): ValidCombatStyleModPlacements => {
		return [
			ArmorSlotWithClassItemIdList.reduce((accumulator, currentValue) => {
				accumulator[currentValue] = null;
				return accumulator;
			}, {}),
		] as ValidCombatStyleModPlacements;
	};

type ShouldShortCircuitTestCase = {
	name: string;
	input: ShouldShortCircuitParams;
	output: ShouldShortCircuitOutput;
};

const shouldShortCircuitTestCases: ShouldShortCircuitTestCase[] = [
	// 0
	{
		name: 'It returns true when helmet, gauntlets, and chest mobility are all 2',
		input: {
			sumOfSeenStats: [6, 48, 48, 48, 48, 6],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 1,
			validCombatStyleModArmorSlotPlacements:
				generateDefaultValidCombatStyleModPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			true,
			[
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MinorMobilityMod,
			],
			[],
			{
				[EArmorStatId.Mobility]: 65,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			null,
			EArmorSlotId.Chest,
		],
	},
	// 1
	{
		name: 'It returns false when helmet and gauntlets strength are both 2',
		input: {
			sumOfSeenStats: [4, 32, 32, 32, 32, 4],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 100,
			},
			numRemainingArmorPieces: 2,
			validCombatStyleModArmorSlotPlacements:
				generateDefaultValidCombatStyleModPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			false,
			[
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.MinorStrengthMod,
			],
			[],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 35,
			},
			null,
			null,
		],
	},
	// 2
	{
		name: 'It returns true when helmet and gauntlets strength are both 2, helmet discipline is 2 and gauntlets discipline is 16',
		input: {
			sumOfSeenStats: [4, 32, 32, 18, 46, 4],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 100,
			},
			numRemainingArmorPieces: 2,
			validCombatStyleModArmorSlotPlacements:
				generateDefaultValidCombatStyleModPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			true,
			[
				EModId.DisciplineMod,
				EModId.DisciplineMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.MinorStrengthMod,
			],
			[],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 20,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 35,
			},
			null,
			EArmorSlotId.Arm,
		],
	},
	// 3
	{
		name: 'It returns true immediately when the stat requirements are impossibly high',
		input: {
			sumOfSeenStats: [2, 16, 16, 2, 30, 2],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 150,
			},
			numRemainingArmorPieces: 3,
			validCombatStyleModArmorSlotPlacements:
				generateDefaultValidCombatStyleModPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			true,
			[
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.MinorDisciplineMod,
				EModId.MinorStrengthMod,
			],
			[],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 5,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 55,
			},
			null,
			EArmorSlotId.Head,
		],
	},
	// 4
	{
		name: 'It returns false when gauntlets mobility is 46',
		input: {
			sumOfSeenStats: [46, 4, 18, 32, 32, 4],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
			validCombatStyleModArmorSlotPlacements:
				generateDefaultValidCombatStyleModPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			false,
			[],
			[],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			null,
			null,
		],
	},
	// 5
	{
		name: 'It returns false when helmet mobility is 40',
		input: {
			sumOfSeenStats: [40, 4, 24, 32, 32, 4],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
			validCombatStyleModArmorSlotPlacements:
				generateDefaultValidCombatStyleModPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			false,
			[],
			[],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			null,
			null,
		],
	},
	// 6
	{
		name: 'It returns true when there is nowhere to put the required armor stat mods due to the cost of combat style mods',
		input: {
			sumOfSeenStats: [0, 0, 0, 0, 50, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 100,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			validCombatStyleModArmorSlotPlacements: [
				{
					[EArmorSlotId.Head]: EModId.HeavyHanded,
					[EArmorSlotId.Arm]: null,
					[EArmorSlotId.Chest]: null,
					[EArmorSlotId.Leg]: null,
					[EArmorSlotId.ClassItem]: null,
				},
			],
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			true,
			[
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
			],
			[],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 50,
				[EArmorStatId.Strength]: 0,
			},
			null,
			null,
		],
	},
	// 7
	{
		name: 'It returns true when there is nowhere to put the required armor stat mods due to the cost of armor slot mods',
		input: {
			sumOfSeenStats: [0, 0, 0, 0, 60, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 100,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			validCombatStyleModArmorSlotPlacements:
				generateDefaultValidCombatStyleModPlacements(),
			armorSlotMods: {
				...generateDefaultArmorSlotIdToModIDListMapping(),
				[EArmorSlotId.Chest]: [
					EModId.UnflinchingSniperAim,
					EModId.UnflinchingAutoRifleAim,
				],
				[EArmorSlotId.ClassItem]: [EModId.Bomber, EModId.Bomber],
			},
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			true,
			[
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.RecoveryMod,
			],
			[],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 40,
				[EArmorStatId.Strength]: 0,
			},
			null,
			null,
		],
	},
	// 8
	{
		name: 'It returns true when there is nowhere to put the required armor stat mods due to the combined cost of armor slot mods and combat style mods',
		input: {
			sumOfSeenStats: [0, 0, 0, 0, 95, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 100,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			validCombatStyleModArmorSlotPlacements: [
				{
					[EArmorSlotId.Head]: EModId.HeavyHanded,
					[EArmorSlotId.Arm]: EModId.BountifulWells,
					[EArmorSlotId.Chest]: EModId.TakingCharge,
					[EArmorSlotId.Leg]: EModId.PowerfulFriends,
					[EArmorSlotId.ClassItem]: EModId.ArgentOrdnance,
				},
			],
			armorSlotMods: {
				[EArmorSlotId.Head]: [null, EModId.BowAmmoFinder], // Capacity: Full
				[EArmorSlotId.Arm]: [EModId.HandCannonLoader, null], // Capacity: 4
				[EArmorSlotId.Chest]: [
					EModId.UnflinchingSniperAim,
					EModId.UnflinchingAutoRifleAim,
				], // Capacity: Full
				[EArmorSlotId.Leg]: [null, EModId.Absolution], // Capacity: 3
				[EArmorSlotId.ClassItem]: [EModId.Bomber, EModId.Bomber], // Capacity: 1
			},
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			true,
			[EModId.RecoveryMod, EModId.MobilityMod, EModId.MinorIntellectMod],
			[],
			{
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 5,
				[EArmorStatId.Strength]: 0,
			},
			null,
			null,
		],
	},
	// 9
	{
		name: 'It returns false when there is space to put the required armor stat mods even with the combined cost of armor slot mods and combat style mods',
		input: {
			sumOfSeenStats: [0, 0, 0, 0, 100, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 100,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			validCombatStyleModArmorSlotPlacements: [
				{
					[EArmorSlotId.Head]: EModId.HeavyHanded,
					[EArmorSlotId.Arm]: EModId.BountifulWells,
					[EArmorSlotId.Chest]: EModId.TakingCharge,
					[EArmorSlotId.Leg]: EModId.PowerfulFriends,
					[EArmorSlotId.ClassItem]: EModId.ArgentOrdnance,
				},
			],
			armorSlotMods: {
				[EArmorSlotId.Head]: [null, EModId.BowAmmoFinder], // Capacity: Full
				[EArmorSlotId.Arm]: [EModId.HandCannonLoader, null], // Capacity: 4
				[EArmorSlotId.Chest]: [
					EModId.UnflinchingSniperAim,
					EModId.UnflinchingAutoRifleAim,
				], // Capacity: Full
				[EArmorSlotId.Leg]: [null, EModId.Absolution], // Capacity: 3
				[EArmorSlotId.ClassItem]: [EModId.Bomber, EModId.Bomber], // Capacity: 1
			},
			destinyClassId: EDestinyClassId.Hunter,
			numSeenArtificeArmorItems: 0,
		},
		output: [
			false,
			[EModId.RecoveryMod, EModId.MobilityMod],
			[],
			{
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
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
	test(shouldShortCircuitTestCases[6].name, () => {
		const { input, output } = shouldShortCircuitTestCases[6];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[7].name, () => {
		const { input, output } = shouldShortCircuitTestCases[7];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[8].name, () => {
		const { input, output } = shouldShortCircuitTestCases[8];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[9].name, () => {
		const { input, output } = shouldShortCircuitTestCases[9];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
});
