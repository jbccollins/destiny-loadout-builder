import { EModId } from '@dlb/generated/mod/EModId';
import {
	SeenArmorSlotClassItems,
	getDefaultSeenArmorSlotItems,
} from '@dlb/services/processArmor/seenArmorSlotItems';
import {
	getExtraSocketModCategoryIdCountsFromRaidModIdList,
	hasValidSeenItemCounts,
} from '@dlb/services/processArmor/utils';
import { ItemCounts, getDefaultItemCounts } from '@dlb/types/Armor';
import { ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';

type hasValidSeenItemCountsTestCase = {
	name: string;
	input: {
		seenArmorSlotItems: ItemCounts;
		raidModExtraSocketModCategoryIdCounts: Partial<
			Record<ERaidAndNightMareModTypeId, number>
		>;
		seenArmorSlotClassItems: SeenArmorSlotClassItems;
	};
	output: ReturnType<typeof hasValidSeenItemCounts>;
};

const hasValidSeenItemCountsTestCases: hasValidSeenItemCountsTestCase[] = [
	// 0
	{
		name: 'With no raid mods it returns true',
		input: {
			seenArmorSlotItems: getDefaultItemCounts(),
			raidModExtraSocketModCategoryIdCounts:
				getExtraSocketModCategoryIdCountsFromRaidModIdList([]),
			seenArmorSlotClassItems: getDefaultSeenArmorSlotItems().ClassItems,
		},
		output: { isValid: true, requiredClassItemExtraModSocketCategoryId: null },
	},
	// 1
	{
		name: 'With one raid mod and no matching seenArmorSlotItems it returns false',
		input: {
			seenArmorSlotItems: getDefaultItemCounts(),
			raidModExtraSocketModCategoryIdCounts:
				getExtraSocketModCategoryIdCountsFromRaidModIdList([
					EModId.ReleaseRecover,
				]),
			seenArmorSlotClassItems: getDefaultSeenArmorSlotItems().ClassItems,
		},
		output: { isValid: false, requiredClassItemExtraModSocketCategoryId: null },
	},
	// 2
	{
		name: 'With one raid mod and a matching non-class item it returns true',
		input: {
			seenArmorSlotItems: (() => {
				const items = getDefaultItemCounts();
				items[ERaidAndNightMareModTypeId.RootOfNightmares] = 1;
				return items;
			})(),
			raidModExtraSocketModCategoryIdCounts:
				getExtraSocketModCategoryIdCountsFromRaidModIdList([
					EModId.ReleaseRecover,
				]),
			seenArmorSlotClassItems: getDefaultSeenArmorSlotItems().ClassItems,
		},
		output: { isValid: true, requiredClassItemExtraModSocketCategoryId: null },
	},
	// 3
	{
		name: 'With a complex set of raid mods it returns true',
		input: {
			seenArmorSlotItems: (() => {
				const items = getDefaultItemCounts();
				items[ERaidAndNightMareModTypeId.DeepStoneCrypt] = 1;
				items[ERaidAndNightMareModTypeId.RootOfNightmares] = 1;
				items[ERaidAndNightMareModTypeId.LastWish] = 1;

				return items;
			})(),
			raidModExtraSocketModCategoryIdCounts:
				getExtraSocketModCategoryIdCountsFromRaidModIdList([
					EModId.ReleaseRecover,
					EModId.EnhancedOperatorAugment,
					EModId.TakenArmaments,
				]),
			seenArmorSlotClassItems: getDefaultSeenArmorSlotItems().ClassItems,
		},
		output: { isValid: true, requiredClassItemExtraModSocketCategoryId: null },
	},
	// 4
	{
		name: 'With a complex set of raid mods it returns false',
		input: {
			seenArmorSlotItems: (() => {
				const items = getDefaultItemCounts();
				items[ERaidAndNightMareModTypeId.VaultOfGlass] = 1;
				items[ERaidAndNightMareModTypeId.RootOfNightmares] = 1;
				items[ERaidAndNightMareModTypeId.LastWish] = 1;
				return items;
			})(),
			raidModExtraSocketModCategoryIdCounts:
				getExtraSocketModCategoryIdCountsFromRaidModIdList([
					EModId.ReleaseRecover,
					EModId.EnhancedOperatorAugment,
					EModId.TakenArmaments,
				]),
			seenArmorSlotClassItems: getDefaultSeenArmorSlotItems().ClassItems,
		},
		output: { isValid: false, requiredClassItemExtraModSocketCategoryId: null },
	},
	// 5
	{
		name: 'With a single class item required it returns true',
		input: {
			seenArmorSlotItems: getDefaultItemCounts(),
			raidModExtraSocketModCategoryIdCounts:
				getExtraSocketModCategoryIdCountsFromRaidModIdList([
					EModId.ReleaseRecover,
				]),
			seenArmorSlotClassItems: {
				...getDefaultSeenArmorSlotItems().ClassItems,
				[ERaidAndNightMareModTypeId.RootOfNightmares]: true,
			},
		},
		output: {
			isValid: true,
			requiredClassItemExtraModSocketCategoryId:
				ERaidAndNightMareModTypeId.RootOfNightmares,
		},
	},
	// 6
	{
		name: 'With a multiple class item required it returns false',
		input: {
			seenArmorSlotItems: getDefaultItemCounts(),
			raidModExtraSocketModCategoryIdCounts:
				getExtraSocketModCategoryIdCountsFromRaidModIdList([
					EModId.ReleaseRecover,
					EModId.EnhancedOperatorAugment,
				]),
			seenArmorSlotClassItems: {
				...getDefaultSeenArmorSlotItems().ClassItems,
				[ERaidAndNightMareModTypeId.RootOfNightmares]: true,
				[ERaidAndNightMareModTypeId.DeepStoneCrypt]: true,
			},
		},
		output: {
			isValid: false,
			requiredClassItemExtraModSocketCategoryId: null,
		},
	},
];

describe('hasValidSeenItemCounts', () => {
	test(hasValidSeenItemCountsTestCases[0].name, () => {
		const { input, output } = hasValidSeenItemCountsTestCases[0];
		expect(
			hasValidSeenItemCounts(
				input.seenArmorSlotItems,
				input.raidModExtraSocketModCategoryIdCounts,
				input.seenArmorSlotClassItems
			)
		).toEqual(output);
	});
	test(hasValidSeenItemCountsTestCases[1].name, () => {
		const { input, output } = hasValidSeenItemCountsTestCases[1];
		expect(
			hasValidSeenItemCounts(
				input.seenArmorSlotItems,
				input.raidModExtraSocketModCategoryIdCounts,
				input.seenArmorSlotClassItems
			)
		).toEqual(output);
	});
	test(hasValidSeenItemCountsTestCases[2].name, () => {
		const { input, output } = hasValidSeenItemCountsTestCases[2];
		expect(
			hasValidSeenItemCounts(
				input.seenArmorSlotItems,
				input.raidModExtraSocketModCategoryIdCounts,
				input.seenArmorSlotClassItems
			)
		).toEqual(output);
	});
	test(hasValidSeenItemCountsTestCases[3].name, () => {
		const { input, output } = hasValidSeenItemCountsTestCases[3];
		expect(
			hasValidSeenItemCounts(
				input.seenArmorSlotItems,
				input.raidModExtraSocketModCategoryIdCounts,
				input.seenArmorSlotClassItems
			)
		).toEqual(output);
	});
	test(hasValidSeenItemCountsTestCases[4].name, () => {
		const { input, output } = hasValidSeenItemCountsTestCases[4];
		expect(
			hasValidSeenItemCounts(
				input.seenArmorSlotItems,
				input.raidModExtraSocketModCategoryIdCounts,
				input.seenArmorSlotClassItems
			)
		).toEqual(output);
	});
	test(hasValidSeenItemCountsTestCases[5].name, () => {
		const { input, output } = hasValidSeenItemCountsTestCases[5];
		expect(
			hasValidSeenItemCounts(
				input.seenArmorSlotItems,
				input.raidModExtraSocketModCategoryIdCounts,
				input.seenArmorSlotClassItems
			)
		).toEqual(output);
	});
	test(hasValidSeenItemCountsTestCases[6].name, () => {
		const { input, output } = hasValidSeenItemCountsTestCases[6];
		expect(
			hasValidSeenItemCounts(
				input.seenArmorSlotItems,
				input.raidModExtraSocketModCategoryIdCounts,
				input.seenArmorSlotClassItems
			)
		).toEqual(output);
	});
});
