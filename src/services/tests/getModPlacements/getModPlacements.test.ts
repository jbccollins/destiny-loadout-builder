import { EModId } from '@dlb/generated/mod/EModId';
import {
	getDefaultArmorSlotCapacityRangeMapping,
	getModPlacements,
} from '@dlb/services/processArmor/getModPlacements';
import { getDefaultArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';
import { getDefaultStatModCombo } from '@dlb/services/processArmor/getStatModCombosFromDesiredStats';
import { EArmorSlotId, EArmorStatId } from '@dlb/types/IdEnums';
import { ModPlacement } from '@dlb/services/processArmor/getModCombos';
import {
	complexNonRedundantModComboOutput,
	complexNonRedundantModComboOutputWithRaidAndArtificeAndArmorSlotModsOutput,
	nonRedundantModComboOutput,
	redundantModComboOutput,
	singleStatModComboOutput,
	singleStatModComboWithRaidModOutput,
	twoStatModComboOutput,
} from './outputs';

const testFunction = getModPlacements;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const getDefaultModPlacements = (): ModPlacement => ({
	artificeModIdList: [],
	placement: {
		[EArmorSlotId.Head]: {
			armorStatModId: null,
			raidModId: null,
		},
		[EArmorSlotId.Arm]: {
			armorStatModId: null,
			raidModId: null,
		},
		[EArmorSlotId.Chest]: {
			armorStatModId: null,
			raidModId: null,
		},
		[EArmorSlotId.Leg]: {
			armorStatModId: null,
			raidModId: null,
		},
		[EArmorSlotId.ClassItem]: {
			armorStatModId: null,
			raidModId: null,
		},
	},
});

const testCases: TestCase[] = [
	[
		'Base',
		[
			{
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				statModCombos: [],
				potentialRaidModArmorSlotPlacements: null,
			},
		],
		{
			placements: [],
			armorSlotCapacityRangeMapping: getDefaultArmorSlotCapacityRangeMapping(),
		},
	],
	[
		'Invalid placements',
		[
			{
				armorSlotMods: {
					...getDefaultArmorSlotIdToModIdListMapping(),
					[EArmorSlotId.Head]: [
						EModId.HeavyAmmoFinder,
						EModId.HeavyAmmoFinder,
						EModId.HeavyAmmoFinder,
					],
				},
				statModCombos: [
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 5,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 50,
						},
					},
				],
				potentialRaidModArmorSlotPlacements: null,
			},
		],
		null,
	],
	[
		'Single stat mod combo',
		[
			{
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				statModCombos: [
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 2,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 20,
						},
					},
				],
				potentialRaidModArmorSlotPlacements: null,
			},
		],
		{
			placements: singleStatModComboOutput,
			armorSlotCapacityRangeMapping: {
				[EArmorSlotId.Head]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Arm]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Chest]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Leg]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.ClassItem]: {
					min: 7,
					max: 10,
				},
			},
		},
	],
	[
		'Two stat mod combos',
		[
			{
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				statModCombos: [
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 1,
							numMinorMods: 1,
							numArtificeMods: 0,
							exactStatPoints: 15,
						},
					},
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 0,
							numMinorMods: 3,
							numArtificeMods: 0,
							exactStatPoints: 15,
						},
					},
				],
				potentialRaidModArmorSlotPlacements: null,
			},
		],
		{
			placements: twoStatModComboOutput,
			armorSlotCapacityRangeMapping: {
				[EArmorSlotId.Head]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Arm]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Chest]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Leg]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.ClassItem]: {
					min: 7,
					max: 10,
				},
			},
		},
	],
	// // Discipline and Mobility mods cost the same
	// // so their placements are interchangeable.
	// // Placing a Mob Mod in the Head slot and a Disc Mod in the Arm slot
	// // is the same as placing a Disc Mod in the Head slot and a Mob Mod
	// // in the Arm slot.
	[
		'Redundant mod combo',
		[
			{
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				statModCombos: [
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 10,
						},
						[EArmorStatId.Discipline]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 10,
						},
					},
				],
				potentialRaidModArmorSlotPlacements: null,
			},
		],
		{
			placements: redundantModComboOutput,
			armorSlotCapacityRangeMapping: {
				[EArmorSlotId.Head]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Arm]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Chest]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Leg]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.ClassItem]: {
					min: 7,
					max: 10,
				},
			},
		},
	],
	[
		'Non-Redundant mod combo',
		[
			{
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				statModCombos: [
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 10,
						},
						[EArmorStatId.Resilience]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 10,
						},
					},
				],
				potentialRaidModArmorSlotPlacements: null,
			},
		],
		{
			placements: nonRedundantModComboOutput,
			armorSlotCapacityRangeMapping: {
				[EArmorSlotId.Head]: {
					min: 6,
					max: 10,
				},
				[EArmorSlotId.Arm]: {
					min: 6,
					max: 10,
				},
				[EArmorSlotId.Chest]: {
					min: 6,
					max: 10,
				},
				[EArmorSlotId.Leg]: {
					min: 6,
					max: 10,
				},
				[EArmorSlotId.ClassItem]: {
					min: 6,
					max: 10,
				},
			},
		},
	],
	[
		'Most redundant mod combo',
		[
			{
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				statModCombos: [
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 5,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 50,
						},
					},
				],
				potentialRaidModArmorSlotPlacements: null,
			},
		],
		{
			placements: [
				{
					...getDefaultModPlacements(),
					placement: {
						[EArmorSlotId.Head]: {
							armorStatModId: EModId.MobilityMod,
							raidModId: null,
						},
						[EArmorSlotId.Arm]: {
							armorStatModId: EModId.MobilityMod,
							raidModId: null,
						},
						[EArmorSlotId.Chest]: {
							armorStatModId: EModId.MobilityMod,
							raidModId: null,
						},
						[EArmorSlotId.Leg]: {
							armorStatModId: EModId.MobilityMod,
							raidModId: null,
						},
						[EArmorSlotId.ClassItem]: {
							armorStatModId: EModId.MobilityMod,
							raidModId: null,
						},
					},
				},
			],
			armorSlotCapacityRangeMapping: {
				[EArmorSlotId.Head]: {
					min: 7,
					max: 7,
				},
				[EArmorSlotId.Arm]: {
					min: 7,
					max: 7,
				},
				[EArmorSlotId.Chest]: {
					min: 7,
					max: 7,
				},
				[EArmorSlotId.Leg]: {
					min: 7,
					max: 7,
				},
				[EArmorSlotId.ClassItem]: {
					min: 7,
					max: 7,
				},
			},
		},
	],
	[
		'Complex Non-Redundant mod combo',
		[
			{
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				statModCombos: [
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 10,
						},
						[EArmorStatId.Resilience]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 10,
						},
						[EArmorStatId.Recovery]: {
							numMajorMods: 0,
							numMinorMods: 1,
							numArtificeMods: 0,
							exactStatPoints: 5,
						},
						[EArmorStatId.Discipline]: {
							numMajorMods: 0,
							numMinorMods: 1,
							numArtificeMods: 0,
							exactStatPoints: 5,
						},
						[EArmorStatId.Intellect]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 10,
						},
					},
				],
				potentialRaidModArmorSlotPlacements: null,
			},
		],
		{
			placements: complexNonRedundantModComboOutput,
			armorSlotCapacityRangeMapping: {
				[EArmorSlotId.Head]: {
					min: 6,
					max: 9,
				},
				[EArmorSlotId.Arm]: {
					min: 6,
					max: 9,
				},
				[EArmorSlotId.Chest]: {
					min: 6,
					max: 9,
				},
				[EArmorSlotId.Leg]: {
					min: 6,
					max: 9,
				},
				[EArmorSlotId.ClassItem]: {
					min: 6,
					max: 9,
				},
			},
		},
	],
	[
		'Single stat mod combo with single raid mod',
		[
			{
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				statModCombos: [
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 2,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 20,
						},
					},
				],
				potentialRaidModArmorSlotPlacements: [
					{
						[EArmorSlotId.Head]: EModId.ReleaseRecover,
					},
				],
			},
		],
		{
			placements: singleStatModComboWithRaidModOutput,
			armorSlotCapacityRangeMapping: {
				[EArmorSlotId.Head]: {
					min: 6,
					max: 10,
				},
				[EArmorSlotId.Arm]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Chest]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.Leg]: {
					min: 7,
					max: 10,
				},
				[EArmorSlotId.ClassItem]: {
					min: 7,
					max: 10,
				},
			},
		},
	],
	[
		'Complex Non-Redundant mod combo with raid mods, artifice mods and armor slot mods',
		[
			{
				armorSlotMods: {
					...getDefaultArmorSlotIdToModIdListMapping(),
					[EArmorSlotId.Head]: [EModId.ArcTargeting, null, null],
					[EArmorSlotId.Arm]: [EModId.ArcDexterity, EModId.ArcLoader, null],
					[EArmorSlotId.Chest]: [EModId.ArcReserves, EModId.ArcReserves, null],
					[EArmorSlotId.Leg]: [EModId.ArcScavenger, null, null],
					[EArmorSlotId.ClassItem]: [EModId.Bomber, null, null],
				},
				statModCombos: [
					{
						...getDefaultStatModCombo(),
						[EArmorStatId.Mobility]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 2,
							exactStatPoints: 16,
						},
						[EArmorStatId.Resilience]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 0,
							exactStatPoints: 10,
						},
						[EArmorStatId.Recovery]: {
							numMajorMods: 0,
							numMinorMods: 1,
							numArtificeMods: 1,
							exactStatPoints: 8,
						},
						[EArmorStatId.Discipline]: {
							numMajorMods: 0,
							numMinorMods: 1,
							numArtificeMods: 0,
							exactStatPoints: 5,
						},
						[EArmorStatId.Intellect]: {
							numMajorMods: 1,
							numMinorMods: 0,
							numArtificeMods: 1,
							exactStatPoints: 13,
						},
					},
				],
				potentialRaidModArmorSlotPlacements: [
					{
						[EArmorSlotId.Head]: EModId.ReleaseRecover,
						[EArmorSlotId.ClassItem]: EModId.HerdThinner,
					},
					{
						[EArmorSlotId.Head]: EModId.HerdThinner,
						[EArmorSlotId.ClassItem]: EModId.ReleaseRecover,
					},
				],
			},
		],
		{
			placements:
				complexNonRedundantModComboOutputWithRaidAndArtificeAndArmorSlotModsOutput,
			armorSlotCapacityRangeMapping: {
				[EArmorSlotId.Head]: {
					min: 1,
					max: 5,
				},
				[EArmorSlotId.Arm]: {
					min: 0,
					max: 3,
				},
				[EArmorSlotId.Chest]: {
					min: 0,
					max: 3,
				},
				[EArmorSlotId.Leg]: {
					min: 3,
					max: 6,
				},
				[EArmorSlotId.ClassItem]: {
					min: 3,
					max: 7,
				},
			},
		},
	],
];

// const nameOfTestToDebug =
('Complex Non-Redundant mod combo with raid mods, artifice mods and armor slot mods');
const nameOfTestToDebug = null;
describe('getModPlacements', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
