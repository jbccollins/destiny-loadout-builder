import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultSeenArmorSlotItems } from '@dlb/services/processArmor/seenArmorSlotItems';
import { filterRaidModArmorSlotPlacements } from '@dlb/services/processArmor/utils';
import { EArmorSlotId, ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';
import { getDefaultValidRaidModArmorSlotPlacement } from '@dlb/types/Mod';

const testFunction = filterRaidModArmorSlotPlacements;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const testCases: TestCase[] = [
	// 0
	[
		'With no raid mods it returns nothing',
		[
			{
				seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				requiredClassItemMetadataKey: null,
				validRaidModArmorSlotPlacements: [
					getDefaultValidRaidModArmorSlotPlacement(),
				],
			},
		],
		[getDefaultValidRaidModArmorSlotPlacement()],
	],
	// 1
	[
		'With a correct raid class mod it returns one placement',
		[
			{
				seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				requiredClassItemMetadataKey: ERaidAndNightMareModTypeId.DeepStoneCrypt,
				validRaidModArmorSlotPlacements: [
					{
						...getDefaultValidRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.EnhancedOperatorAugment,
					},
					{
						...getDefaultValidRaidModArmorSlotPlacement(),
						[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
					},
				],
			},
		],
		[
			{
				...getDefaultValidRaidModArmorSlotPlacement(),
				[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
			},
		],
	],

	// 2
	[
		'With complex raid mods it returns multiple placements',
		[
			{
				seenArmorSlotItems: {
					...getDefaultSeenArmorSlotItems(),
					[EArmorSlotId.Head]: {
						isArtifice: false,
						raidAndNightmareModTypeId:
							ERaidAndNightMareModTypeId.GardenOfSalvation,
						intrinsicArmorPerkOrAttributeId: null,
						isMasterworked: false,
					},
					[EArmorSlotId.Arm]: {
						isArtifice: false,
						raidAndNightmareModTypeId:
							ERaidAndNightMareModTypeId.GardenOfSalvation,
						intrinsicArmorPerkOrAttributeId: null,
						isMasterworked: false,
					},
				},
				requiredClassItemMetadataKey: ERaidAndNightMareModTypeId.DeepStoneCrypt,
				validRaidModArmorSlotPlacements: [
					{
						...getDefaultValidRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.ResistantTether,
						[EArmorSlotId.Arm]: EModId.EnhancedResistantTether,
						[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
					},
					{
						...getDefaultValidRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.EnhancedResistantTether,
						[EArmorSlotId.Arm]: EModId.ResistantTether,
						[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
					},
					{
						...getDefaultValidRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.EnhancedOperatorAugment,
						[EArmorSlotId.Arm]: EModId.ResistantTether,
						[EArmorSlotId.Chest]: EModId.EnhancedResistantTether,
					},
				],
			},
		],
		[
			{
				...getDefaultValidRaidModArmorSlotPlacement(),
				[EArmorSlotId.Head]: EModId.ResistantTether,
				[EArmorSlotId.Arm]: EModId.EnhancedResistantTether,
				[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
			},
			{
				...getDefaultValidRaidModArmorSlotPlacement(),
				[EArmorSlotId.Head]: EModId.EnhancedResistantTether,
				[EArmorSlotId.Arm]: EModId.ResistantTether,
				[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
			},
		],
	],
];

// const nameOfTestToDebug =
// 	'With complex raid mods it returns multiple placements';
const nameOfTestToDebug = null;
describe('filterValidRaidModArmorSlotPlacements', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
