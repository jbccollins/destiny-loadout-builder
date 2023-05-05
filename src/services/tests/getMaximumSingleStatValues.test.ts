import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
} from '@dlb/types/IdEnums';
import { getDefaultStatList } from './utils';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import { getDefaultArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';
import { getDefaultSeenArmorSlotItems } from '@dlb/services/processArmor/seenArmorSlotItems';
import { getMaximumSingleStatValues } from '@dlb/services/processArmor/getMaximumSingleStatValues';
import {
	ModPlacement,
	getDefaultModPlacements,
} from '@dlb/services/processArmor/getModCombos';
import { EModId } from '@dlb/generated/mod/EModId';

const testFunction = getMaximumSingleStatValues;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const getDefaultOutput = (): Record<EArmorStatId, number> => ({
	[EArmorStatId.Mobility]: 0,
	[EArmorStatId.Resilience]: 0,
	[EArmorStatId.Recovery]: 0,
	[EArmorStatId.Discipline]: 0,
	[EArmorStatId.Intellect]: 0,
	[EArmorStatId.Strength]: 0,
});

const testCases: TestCase[] = [
	[
		'Base',
		[
			{
				placements: [],
				numArtificeItems: 0,
				sumOfSeenStats: [0, 0, 0, 0, 0, 0],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			},
		],
		getDefaultOutput(),
	],
	[
		'Simple',
		[
			{
				placements: [
					{
						...getDefaultModPlacements(),
					},
				],
				numArtificeItems: 0,
				sumOfSeenStats: [0, 0, 0, 0, 0, 0],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			},
		],
		{
			[EArmorStatId.Mobility]: 50,
			[EArmorStatId.Resilience]: 50,
			[EArmorStatId.Recovery]: 50,
			[EArmorStatId.Discipline]: 50,
			[EArmorStatId.Intellect]: 50,
			[EArmorStatId.Strength]: 50,
		},
	],
	[
		'Simple with unused artifice mods',
		[
			{
				placements: [
					{
						...getDefaultModPlacements(),
					},
				],
				numArtificeItems: 3,
				sumOfSeenStats: [0, 0, 0, 0, 0, 0],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			},
		],
		{
			[EArmorStatId.Mobility]: 59,
			[EArmorStatId.Resilience]: 59,
			[EArmorStatId.Recovery]: 59,
			[EArmorStatId.Discipline]: 59,
			[EArmorStatId.Intellect]: 59,
			[EArmorStatId.Strength]: 59,
		},
	],
	[
		'Single stat mod',
		[
			{
				placements: [
					{
						...getDefaultModPlacements(),
						placement: {
							...getDefaultModPlacements().placement,
							[EArmorSlotId.Head]: {
								armorStatModId: EModId.MobilityMod,
								raidModId: null,
							},
						},
					},
				],
				numArtificeItems: 0,
				sumOfSeenStats: [0, 0, 0, 0, 0, 0],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			},
		],
		{
			[EArmorStatId.Mobility]: 50,
			[EArmorStatId.Resilience]: 40,
			[EArmorStatId.Recovery]: 40,
			[EArmorStatId.Discipline]: 40,
			[EArmorStatId.Intellect]: 40,
			[EArmorStatId.Strength]: 40,
		},
	],
	[
		'Simple with used artifice mod',
		[
			{
				placements: [
					{
						placement: {
							...getDefaultModPlacements().placement,
							[EArmorSlotId.Head]: {
								armorStatModId: EModId.MobilityMod,
								raidModId: null,
							},
						},
						artificeModIdList: [EModId.MobilityForged],
					},
				],
				numArtificeItems: 1,
				sumOfSeenStats: [0, 0, 0, 0, 0, 0],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			},
		],
		{
			[EArmorStatId.Mobility]: 53,
			[EArmorStatId.Resilience]: 40,
			[EArmorStatId.Recovery]: 40,
			[EArmorStatId.Discipline]: 40,
			[EArmorStatId.Intellect]: 40,
			[EArmorStatId.Strength]: 40,
		},
	],
	[
		'Two placements',
		[
			{
				placements: [
					{
						placement: {
							...getDefaultModPlacements().placement,
							[EArmorSlotId.Head]: {
								armorStatModId: EModId.MobilityMod,
								raidModId: null,
							},
						},
						artificeModIdList: [],
					},
					{
						placement: {
							...getDefaultModPlacements().placement,
							[EArmorSlotId.Head]: {
								armorStatModId: EModId.MinorMobilityMod,
								raidModId: null,
							},
						},
						artificeModIdList: [EModId.MobilityForged],
					},
				],
				numArtificeItems: 1,
				sumOfSeenStats: [2, 0, 0, 0, 0, 0],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			},
		],
		{
			[EArmorStatId.Mobility]: 55,
			[EArmorStatId.Resilience]: 43,
			[EArmorStatId.Recovery]: 43,
			[EArmorStatId.Discipline]: 43,
			[EArmorStatId.Intellect]: 43,
			[EArmorStatId.Strength]: 43,
		},
	],
	[
		'Complex placements',
		[
			{
				placements: [
					{
						placement: {
							...getDefaultModPlacements().placement,
							[EArmorSlotId.Head]: {
								armorStatModId: EModId.MobilityMod,
								raidModId: null,
							},
						},
						artificeModIdList: [],
					},
					{
						placement: {
							...getDefaultModPlacements().placement,
							[EArmorSlotId.Head]: {
								armorStatModId: EModId.MinorMobilityMod,
								raidModId: null,
							},
						},
						artificeModIdList: [EModId.MobilityForged],
					},
					{
						placement: {
							...getDefaultModPlacements().placement,
							[EArmorSlotId.Head]: {
								armorStatModId: EModId.MinorMobilityMod,
								raidModId: null,
							},
						},
						artificeModIdList: [EModId.MobilityForged],
					},
				],
				numArtificeItems: 3,
				sumOfSeenStats: [2, 10, 15, 17, 40, 50],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
			},
		],
		{
			[EArmorStatId.Mobility]: 61,
			[EArmorStatId.Resilience]: 59,
			[EArmorStatId.Recovery]: 64,
			[EArmorStatId.Discipline]: 66,
			[EArmorStatId.Intellect]: 89,
			[EArmorStatId.Strength]: 99,
		},
	],
];

// const nameOfTestToDebug = 'Single stat mod';
const nameOfTestToDebug = null;
describe('getMaximumSingleStatValues', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
