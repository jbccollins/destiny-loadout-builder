import { EModId } from '@dlb/generated/mod/EModId';
import {
	getDefaultSeenArmorSlotItems,
	hasValidSeenArmorSlotItems,
	SeenArmorSlotItems,
} from '@dlb/services/armor-processing';
import { EExtraSocketModCategoryId } from '@dlb/types/IdEnums';

type HasValidSeenArmorSlotItemsTestCase = {
	name: string;
	input: {
		seenArmorSlotItems: SeenArmorSlotItems;
		raidModIdList: EModId[];
	};
	output: boolean;
};

const hasValidSeenArmorSlotItemsTestCases: HasValidSeenArmorSlotItemsTestCase[] =
	[
		// 0
		{
			name: 'With no raid mods it returns true',
			input: {
				seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				raidModIdList: [],
			},
			output: true,
		},
		// 1
		{
			name: 'With one raid mod and no matching seenArmorSlotItems it returns false',
			input: {
				seenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				raidModIdList: [EModId.ReleaseRecover],
			},
			output: false,
		},
		// 2
		{
			name: 'With one raid mod and a matching seenArmorSlotItem class item it returns true',
			input: {
				seenArmorSlotItems: (() => {
					const items = getDefaultSeenArmorSlotItems();
					items.ClassItems[EExtraSocketModCategoryId.RootOfNightmares] = true;
					return items;
				})(),
				raidModIdList: [EModId.ReleaseRecover],
			},
			output: true,
		},
		// 3
		{
			name: 'With one raid mod and a matching seenArmorSlotItem chest it returns true',
			input: {
				seenArmorSlotItems: (() => {
					const items = getDefaultSeenArmorSlotItems();
					items.Chest = EExtraSocketModCategoryId.RootOfNightmares;
					return items;
				})(),
				raidModIdList: [EModId.ReleaseRecover],
			},
			output: true,
		},
		// 4
		{
			name: 'With a complex set of raid mods it returns true',
			input: {
				seenArmorSlotItems: (() => {
					const items = getDefaultSeenArmorSlotItems();
					items.Head = EExtraSocketModCategoryId.DeepStoneCrypt;
					items.Chest = EExtraSocketModCategoryId.RootOfNightmares;
					items.Leg = EExtraSocketModCategoryId.LastWish;
					return items;
				})(),
				raidModIdList: [
					EModId.ReleaseRecover,
					EModId.EnhancedOperatorAugment,
					EModId.TakenArmaments,
				],
			},
			output: true,
		},
		// 5
		{
			name: 'With a complex set of raid mods it returns false',
			input: {
				seenArmorSlotItems: (() => {
					const items = getDefaultSeenArmorSlotItems();
					items.Head = EExtraSocketModCategoryId.VaultOfGlass;
					items.Chest = EExtraSocketModCategoryId.RootOfNightmares;
					items.Leg = EExtraSocketModCategoryId.LastWish;
					return items;
				})(),
				raidModIdList: [
					EModId.ReleaseRecover,
					EModId.EnhancedOperatorAugment,
					EModId.TakenArmaments,
				],
			},
			output: false,
		},
	];

describe('hasValidSeenArmorSlotItems', () => {
	test(hasValidSeenArmorSlotItemsTestCases[0].name, () => {
		const { input, output } = hasValidSeenArmorSlotItemsTestCases[0];
		expect(
			hasValidSeenArmorSlotItems(input.seenArmorSlotItems, input.raidModIdList)
		).toEqual(output);
	});
	test(hasValidSeenArmorSlotItemsTestCases[1].name, () => {
		const { input, output } = hasValidSeenArmorSlotItemsTestCases[1];
		expect(
			hasValidSeenArmorSlotItems(input.seenArmorSlotItems, input.raidModIdList)
		).toEqual(output);
	});
	test(hasValidSeenArmorSlotItemsTestCases[2].name, () => {
		const { input, output } = hasValidSeenArmorSlotItemsTestCases[2];
		expect(
			hasValidSeenArmorSlotItems(input.seenArmorSlotItems, input.raidModIdList)
		).toEqual(output);
	});
	test(hasValidSeenArmorSlotItemsTestCases[3].name, () => {
		const { input, output } = hasValidSeenArmorSlotItemsTestCases[3];
		expect(
			hasValidSeenArmorSlotItems(input.seenArmorSlotItems, input.raidModIdList)
		).toEqual(output);
	});
	test(hasValidSeenArmorSlotItemsTestCases[4].name, () => {
		const { input, output } = hasValidSeenArmorSlotItemsTestCases[4];
		expect(
			hasValidSeenArmorSlotItems(input.seenArmorSlotItems, input.raidModIdList)
		).toEqual(output);
	});
	test(hasValidSeenArmorSlotItemsTestCases[5].name, () => {
		const { input, output } = hasValidSeenArmorSlotItemsTestCases[5];
		expect(
			hasValidSeenArmorSlotItems(input.seenArmorSlotItems, input.raidModIdList)
		).toEqual(output);
	});
});
