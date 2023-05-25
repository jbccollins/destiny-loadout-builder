import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultSeenArmorSlotItems } from '@dlb/services/processArmor/seenArmorSlotItems';
import {
	FilterValidRaidModArmorSlotPlacementsParams,
	filterRaidModArmorSlotPlacements,
} from '@dlb/services/processArmor/utils';
import { EArmorSlotId, ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';
import { getDefaultValidRaidModArmorSlotPlacement } from '@dlb/types/Mod';

type hasValidSeenItemCountsTestCase = {
	name: string;
	input: FilterValidRaidModArmorSlotPlacementsParams;
	output: ReturnType<typeof filterRaidModArmorSlotPlacements>;
};

const filterValidRaidModArmorSlotPlacementsTestCases: hasValidSeenItemCountsTestCase[] =
	[
		// 0
		{
			name: 'With no raid mods it returns nothing',
			input: {
				seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				requiredClassItemRaidAndNightmareModTypeId: null,
				validRaidModArmorSlotPlacements: [
					getDefaultValidRaidModArmorSlotPlacement(),
				],
			},
			output: [getDefaultValidRaidModArmorSlotPlacement()],
		},
		// 1
		{
			name: 'With a correct raid class mod it returns one placement',
			input: {
				seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				requiredClassItemRaidAndNightmareModTypeId:
					ERaidAndNightMareModTypeId.DeepStoneCrypt,
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
			output: [
				{
					...getDefaultValidRaidModArmorSlotPlacement(),
					[EArmorSlotId.ClassItem]: EModId.EnhancedOperatorAugment,
				},
			],
		},

		// 2
		{
			name: 'With complex raid mods it returns multiple placements',
			input: {
				seenArmorSlotItems: {
					...getDefaultSeenArmorSlotItems(),
					[EArmorSlotId.Head]: ERaidAndNightMareModTypeId.GardenOfSalvation,
					[EArmorSlotId.Arm]: ERaidAndNightMareModTypeId.GardenOfSalvation,
				},
				requiredClassItemRaidAndNightmareModTypeId:
					ERaidAndNightMareModTypeId.DeepStoneCrypt,
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
						[EArmorSlotId.Head]: EModId.EnhancedResistantTether,
						[EArmorSlotId.Arm]: EModId.ResistantTether,
						[EArmorSlotId.Chest]: EModId.EnhancedOperatorAugment,
					},
					{
						...getDefaultValidRaidModArmorSlotPlacement(),
						[EArmorSlotId.Head]: EModId.EnhancedOperatorAugment,
						[EArmorSlotId.Arm]: EModId.ResistantTether,
						[EArmorSlotId.Chest]: EModId.EnhancedResistantTether,
					},
				],
			},
			output: [
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
		},
	];

describe('filterValidRaidModArmorSlotPlacements', () => {
	test(filterValidRaidModArmorSlotPlacementsTestCases[0].name, () => {
		const { input, output } = filterValidRaidModArmorSlotPlacementsTestCases[0];
		expect(filterRaidModArmorSlotPlacements(input)).toEqual(output);
	});
	test(filterValidRaidModArmorSlotPlacementsTestCases[1].name, () => {
		const { input, output } = filterValidRaidModArmorSlotPlacementsTestCases[1];
		expect(filterRaidModArmorSlotPlacements(input)).toEqual(output);
	});
	test(filterValidRaidModArmorSlotPlacementsTestCases[2].name, () => {
		const { input, output } = filterValidRaidModArmorSlotPlacementsTestCases[2];
		expect(filterRaidModArmorSlotPlacements(input)).toEqual(output);
	});
});
