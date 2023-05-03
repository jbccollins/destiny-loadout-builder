import { getValidArmorSlotModComboPlacements } from '@dlb/services/processArmor/getValidArmorSlotModComboPlacements';
import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { getDefaultArmorSlotModComboPlacementWithArtificeMods } from '@dlb/services/processArmor/getModCombos';

const testFunction = getValidArmorSlotModComboPlacements;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const defaultPlacement = getDefaultArmorSlotModComboPlacementWithArtificeMods();

const testCases: TestCase[] = [
	[
		'Default with nothing',
		[
			{
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				statModCombos: [],
				validRaidModArmorSlotPlacements: [],
			},
		],
		[],
	],
	[
		'Single armor slot mod, single armor stat mod',
		[
			{
				armorSlotMods: {
					...getDefaultArmorSlotIdToModIdListMapping(),
					[EArmorSlotId.Head]: [EModId.ArcTargeting, null, null],
				},
				statModCombos: [
					{
						armorStatModIdList: [EModId.MinorMobilityMod],
						artificeModIdList: [],
						metadata: null,
					},
				],
				validRaidModArmorSlotPlacements: [],
			},
		],
		[
			{
				...defaultPlacement,
				placement: {
					...defaultPlacement.placement,
					[EArmorSlotId.Arm]: {
						armorStatModId: EModId.MinorMobilityMod,
						raidModId: null,
					},
				},
			},
		],
	],
	[
		'Single armor slot mod, single armor stat mod, with artifice mods',
		[
			{
				armorSlotMods: {
					...getDefaultArmorSlotIdToModIdListMapping(),
					[EArmorSlotId.Head]: [EModId.ArcTargeting, null, null],
				},
				statModCombos: [
					{
						armorStatModIdList: [EModId.MinorMobilityMod],
						artificeModIdList: [EModId.RecoveryForged, EModId.ResilienceForged],
						metadata: null,
					},
				],
				validRaidModArmorSlotPlacements: [],
			},
		],
		[
			{
				...defaultPlacement,
				artificeModIdList: [EModId.RecoveryForged, EModId.ResilienceForged],
				placement: {
					...defaultPlacement.placement,
					[EArmorSlotId.Arm]: {
						armorStatModId: EModId.MinorMobilityMod,
						raidModId: null,
					},
				},
			},
		],
	],
	[
		'Single armor slot mod, multiple armor stat mods',
		[
			{
				armorSlotMods: {
					...getDefaultArmorSlotIdToModIdListMapping(),
					[EArmorSlotId.Head]: [EModId.ArcTargeting, null, null],
				},
				statModCombos: [
					{
						armorStatModIdList: [EModId.MobilityMod],
						artificeModIdList: [],
						metadata: null,
					},
					{
						armorStatModIdList: [
							EModId.MinorMobilityMod,
							EModId.MinorMobilityMod,
						],
						artificeModIdList: [],
						metadata: null,
					},
				],
				validRaidModArmorSlotPlacements: [],
			},
		],
		[
			{
				...defaultPlacement,
				placement: {
					...defaultPlacement.placement,
					[EArmorSlotId.Arm]: {
						armorStatModId: EModId.MobilityMod,
						raidModId: null,
					},
				},
			},
			{
				...defaultPlacement,
				placement: {
					...defaultPlacement.placement,
					[EArmorSlotId.Arm]: {
						armorStatModId: EModId.MinorMobilityMod,
						raidModId: null,
					},
					[EArmorSlotId.Chest]: {
						armorStatModId: EModId.MinorMobilityMod,
						raidModId: null,
					},
				},
			},
		],
	],
	[
		'Single armor slot mod, single armor stat mod, single raid mod',
		[
			{
				armorSlotMods: {
					...getDefaultArmorSlotIdToModIdListMapping(),
					[EArmorSlotId.Head]: [EModId.ArcTargeting, null, null],
				},
				statModCombos: [
					{
						armorStatModIdList: [EModId.MinorMobilityMod],
						artificeModIdList: [],
						metadata: null,
					},
				],
				validRaidModArmorSlotPlacements: [
					{
						[EArmorSlotId.Arm]: EModId.ReleaseRecover,
					},
				],
			},
		],
		[
			{
				...defaultPlacement,
				placement: {
					...defaultPlacement.placement,
					[EArmorSlotId.Arm]: {
						armorStatModId: null,
						raidModId: EModId.ReleaseRecover,
					},
					[EArmorSlotId.Chest]: {
						armorStatModId: EModId.MinorMobilityMod,
						raidModId: null,
					},
				},
			},
		],
	],
	[
		'Multiple armor slot mods, multiple armor stat mods, multiple raid mods',
		[
			{
				armorSlotMods: {
					...getDefaultArmorSlotIdToModIdListMapping(),
					[EArmorSlotId.Head]: [EModId.ArcTargeting, null, null],
					[EArmorSlotId.Arm]: [EModId.ArcLoader, null, null],
				},
				statModCombos: [
					{
						armorStatModIdList: [
							EModId.MinorMobilityMod,
							EModId.MinorMobilityMod,
						],
						artificeModIdList: [],
						metadata: null,
					},
					{
						armorStatModIdList: [EModId.MobilityMod],
						artificeModIdList: [],
						metadata: null,
					},
				],
				validRaidModArmorSlotPlacements: [
					{
						[EArmorSlotId.Arm]: EModId.ReleaseRecover,
						[EArmorSlotId.Leg]: EModId.PreciseJolts,
					},
					{
						[EArmorSlotId.Arm]: EModId.PreciseJolts,
						[EArmorSlotId.Leg]: EModId.ReleaseRecover,
					},
				],
			},
		],
		[
			{
				artificeModIdList: [],
				placement: {
					[EArmorSlotId.Arm]: {
						armorStatModId: null,
						raidModId: EModId.ReleaseRecover,
					},
					[EArmorSlotId.Chest]: {
						armorStatModId: EModId.MinorMobilityMod,
						raidModId: null,
					},
					[EArmorSlotId.ClassItem]: {
						armorStatModId: EModId.MinorMobilityMod,
						raidModId: null,
					},
					[EArmorSlotId.Head]: {
						armorStatModId: null,
						raidModId: null,
					},
					[EArmorSlotId.Leg]: {
						armorStatModId: null,
						raidModId: EModId.PreciseJolts,
					},
				},
			},
			{
				artificeModIdList: [],
				placement: {
					[EArmorSlotId.Arm]: {
						armorStatModId: null,
						raidModId: EModId.PreciseJolts,
					},
					[EArmorSlotId.Chest]: {
						armorStatModId: EModId.MinorMobilityMod,
						raidModId: null,
					},
					[EArmorSlotId.ClassItem]: {
						armorStatModId: EModId.MinorMobilityMod,
						raidModId: null,
					},
					[EArmorSlotId.Head]: {
						armorStatModId: null,
						raidModId: null,
					},
					[EArmorSlotId.Leg]: {
						armorStatModId: null,
						raidModId: EModId.ReleaseRecover,
					},
				},
			},
			{
				artificeModIdList: [],
				placement: {
					[EArmorSlotId.Arm]: {
						armorStatModId: null,
						raidModId: EModId.ReleaseRecover,
					},
					[EArmorSlotId.Chest]: {
						armorStatModId: EModId.MobilityMod,
						raidModId: null,
					},
					[EArmorSlotId.ClassItem]: {
						armorStatModId: null,
						raidModId: null,
					},
					[EArmorSlotId.Head]: {
						armorStatModId: null,
						raidModId: null,
					},
					[EArmorSlotId.Leg]: {
						armorStatModId: null,
						raidModId: EModId.PreciseJolts,
					},
				},
			},
			{
				artificeModIdList: [],
				placement: {
					[EArmorSlotId.Arm]: {
						armorStatModId: null,
						raidModId: EModId.PreciseJolts,
					},
					[EArmorSlotId.Chest]: {
						armorStatModId: EModId.MobilityMod,
						raidModId: null,
					},
					[EArmorSlotId.ClassItem]: {
						armorStatModId: null,
						raidModId: null,
					},
					[EArmorSlotId.Head]: {
						armorStatModId: null,
						raidModId: null,
					},
					[EArmorSlotId.Leg]: {
						armorStatModId: null,
						raidModId: EModId.ReleaseRecover,
					},
				},
			},
		],
	],
];

// const nameOfTestToDebug =
// 	'Multiple armor slot mods, multiple armor stat mods, multiple raid mods';
const nameOfTestToDebug = null;
describe('getValidArmorSlotModComboPlacements', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
