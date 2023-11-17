import { EModId } from '@dlb/generated/mod/EModId';
import { filterRaidModArmorSlotPlacements } from '@dlb/services/processArmor/filterPotentialRaidModArmorSlotPlacements';
import { getDefaultSeenArmorSlotItems } from '@dlb/services/processArmor/seenArmorSlotItems';
import {
	getDefaultAllClassItemMetadata,
	getDefaultArmorItem,
} from '@dlb/types/Armor';
import { EArmorSlotId, ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';
import { getDefaultPotentialRaidModArmorSlotPlacement } from '@dlb/types/Mod';

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
				potentialRaidModArmorSlotPlacements: [
					getDefaultPotentialRaidModArmorSlotPlacement(),
				],
				raidModIdList: [],
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
			},
		],
		[getDefaultPotentialRaidModArmorSlotPlacement()],
	],
	// 1
	[
		'With a correct raid class mod it returns one placement',
		[
			{
				seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				requiredClassItemMetadataKey: ERaidAndNightMareModTypeId.DeepStoneCrypt,
				potentialRaidModArmorSlotPlacements: [
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.EnhancedOperatorAugment,
					},
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
					},
				],
				raidModIdList: [EModId.EnhancedOperatorAugment],
				allClassItemMetadata: {
					...getDefaultAllClassItemMetadata(),
					[ERaidAndNightMareModTypeId.DeepStoneCrypt]: {
						items: [
							{
								...getDefaultArmorItem(),
								socketableRaidAndNightmareModTypeId:
									ERaidAndNightMareModTypeId.DeepStoneCrypt,
							},
						],
						hasMasterworkedVariant: false,
					},
				},
			},
		],
		[
			{
				...getDefaultPotentialRaidModArmorSlotPlacement(),
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
				potentialRaidModArmorSlotPlacements: [
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.ResistantTether,
						[EArmorSlotId.Arm]: EModId.EnhancedResistantTether,
						[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
					},
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.EnhancedResistantTether,
						[EArmorSlotId.Arm]: EModId.ResistantTether,
						[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
					},
					{
						...getDefaultPotentialRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.EnhancedOperatorAugment,
						[EArmorSlotId.Arm]: EModId.ResistantTether,
						[EArmorSlotId.Chest]: EModId.EnhancedResistantTether,
					},
				],
				raidModIdList: [
					EModId.EnhancedOperatorAugment,
					EModId.ResistantTether,
					EModId.EnhancedResistantTether,
				],
				allClassItemMetadata: {
					...getDefaultAllClassItemMetadata(),
					[ERaidAndNightMareModTypeId.DeepStoneCrypt]: {
						items: [
							{
								...getDefaultArmorItem(),
								socketableRaidAndNightmareModTypeId:
									ERaidAndNightMareModTypeId.DeepStoneCrypt,
							},
						],
						hasMasterworkedVariant: false,
					},
					[ERaidAndNightMareModTypeId.GardenOfSalvation]: {
						items: [
							{
								...getDefaultArmorItem(),
								socketableRaidAndNightmareModTypeId:
									ERaidAndNightMareModTypeId.GardenOfSalvation,
							},
						],
						hasMasterworkedVariant: false,
					},
				},
			},
		],
		[
			{
				...getDefaultPotentialRaidModArmorSlotPlacement(),
				[EArmorSlotId.Head]: EModId.ResistantTether,
				[EArmorSlotId.Arm]: EModId.EnhancedResistantTether,
				[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
			},
			{
				...getDefaultPotentialRaidModArmorSlotPlacement(),
				[EArmorSlotId.Head]: EModId.EnhancedResistantTether,
				[EArmorSlotId.Arm]: EModId.ResistantTether,
				[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
			},
		],
	],
];

// const nameOfTestToDebug =
// 	"With complex raid mods it returns multiple placements";
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
