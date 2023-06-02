import { EModId } from '@dlb/generated/mod/EModId';
import {
	getExtraSocketModCategoryIdCountsFromRaidModIdList,
	hasValidSeenItemCounts,
} from '@dlb/services/processArmor/utils';
import {
	getDefaultAllClassItemMetadata,
	getDefaultArmorItem,
	getDefaultItemCounts,
} from '@dlb/types/Armor';
import { ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';

const testFunction = hasValidSeenItemCounts;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const testCases: TestCase[] = [
	[
		'With no raid mods it returns true',
		[
			{
				seenItemCounts: getDefaultItemCounts(),
				raidModExtraSocketModCategoryIdCounts:
					getExtraSocketModCategoryIdCountsFromRaidModIdList([]),
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
			},
		],
		{ isValid: true, requiredClassItemMetadataKey: null },
	],
	[
		'With one raid mod and no matching seenArmorSlotItems it returns false',
		[
			{
				seenItemCounts: getDefaultItemCounts(),
				raidModExtraSocketModCategoryIdCounts:
					getExtraSocketModCategoryIdCountsFromRaidModIdList([
						EModId.ReleaseRecover,
					]),
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
			},
		],
		{
			isValid: false,
			requiredClassItemMetadataKey: null,
		},
	],
	[
		'With one raid mod and a matching non-class item it returns true',
		[
			{
				seenItemCounts: (() => {
					const items = getDefaultItemCounts();
					items[ERaidAndNightMareModTypeId.RootOfNightmares] = 1;
					return items;
				})(),
				raidModExtraSocketModCategoryIdCounts:
					getExtraSocketModCategoryIdCountsFromRaidModIdList([
						EModId.ReleaseRecover,
					]),
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
			},
		],
		{
			isValid: true,
			requiredClassItemMetadataKey: null,
		},
	],
	[
		'With a complex set of raid mods it returns true',
		[
			{
				seenItemCounts: (() => {
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
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
			},
		],
		{
			isValid: true,
			requiredClassItemMetadataKey: null,
		},
	],
	[
		'With a complex set of raid mods it returns false',
		[
			{
				seenItemCounts: (() => {
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
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
			},
		],
		{
			isValid: false,
			requiredClassItemMetadataKey: null,
		},
	],
	[
		'With a single class item required it returns true',
		[
			{
				seenItemCounts: getDefaultItemCounts(),
				raidModExtraSocketModCategoryIdCounts:
					getExtraSocketModCategoryIdCountsFromRaidModIdList([
						EModId.ReleaseRecover,
					]),
				allClassItemMetadata: {
					...getDefaultAllClassItemMetadata(),
					[ERaidAndNightMareModTypeId.RootOfNightmares]: {
						hasMasterworkedVariant: false,
						exampleId: '0',
						items: [
							{
								...getDefaultArmorItem(),
								socketableRaidAndNightmareModTypeId:
									ERaidAndNightMareModTypeId.RootOfNightmares,
							},
						],
					},
				},
			},
		],
		{
			isValid: true,
			requiredClassItemMetadataKey: ERaidAndNightMareModTypeId.RootOfNightmares,
		},
	],
	[
		'With a multiple class item required it returns false',
		[
			{
				seenItemCounts: getDefaultItemCounts(),
				raidModExtraSocketModCategoryIdCounts:
					getExtraSocketModCategoryIdCountsFromRaidModIdList([
						EModId.ReleaseRecover,
						EModId.EnhancedOperatorAugment,
					]),
				allClassItemMetadata: {
					...getDefaultAllClassItemMetadata(),
					[ERaidAndNightMareModTypeId.RootOfNightmares]: {
						items: [
							{
								...getDefaultArmorItem(),
								socketableRaidAndNightmareModTypeId:
									ERaidAndNightMareModTypeId.RootOfNightmares,
							},
						],
						hasMasterworkedVariant: false,
						exampleId: '0',
					},
					[ERaidAndNightMareModTypeId.DeepStoneCrypt]: {
						items: [
							{
								...getDefaultArmorItem(),
								socketableRaidAndNightmareModTypeId:
									ERaidAndNightMareModTypeId.DeepStoneCrypt,
							},
						],
						hasMasterworkedVariant: false,
						exampleId: '1',
					},
				},
			},
		],
		{
			isValid: false,
			requiredClassItemMetadataKey: null,
		},
	],
	[
		'With a mixture of class item and other armor required it returns false',
		[
			{
				seenItemCounts: (() => {
					const items = getDefaultItemCounts();
					items[ERaidAndNightMareModTypeId.VaultOfGlass] = 1;
					items[ERaidAndNightMareModTypeId.LastWish] = 1;
					return items;
				})(),
				raidModExtraSocketModCategoryIdCounts:
					getExtraSocketModCategoryIdCountsFromRaidModIdList([
						EModId.ReleaseRecover,
						EModId.EnhancedOperatorAugment,
						EModId.TakenArmaments,
					]),
				allClassItemMetadata: {
					...getDefaultAllClassItemMetadata(),
					[ERaidAndNightMareModTypeId.RootOfNightmares]: {
						items: [
							{
								...getDefaultArmorItem(),
								socketableRaidAndNightmareModTypeId:
									ERaidAndNightMareModTypeId.RootOfNightmares,
							},
						],
						hasMasterworkedVariant: false,
						exampleId: '0',
					},
				},
			},
		],
		{
			isValid: false,
			requiredClassItemMetadataKey: null,
		},
	],
	[
		'With a mixture of class item and other armor required it returns true',
		[
			{
				seenItemCounts: (() => {
					const items = getDefaultItemCounts();
					items[ERaidAndNightMareModTypeId.DeepStoneCrypt] = 1;
					items[ERaidAndNightMareModTypeId.LastWish] = 1;
					return items;
				})(),
				raidModExtraSocketModCategoryIdCounts:
					getExtraSocketModCategoryIdCountsFromRaidModIdList([
						EModId.ReleaseRecover,
						EModId.EnhancedOperatorAugment,
						EModId.TakenArmaments,
					]),
				allClassItemMetadata: {
					...getDefaultAllClassItemMetadata(),
					[ERaidAndNightMareModTypeId.RootOfNightmares]: {
						items: [
							{
								...getDefaultArmorItem(),
								socketableRaidAndNightmareModTypeId:
									ERaidAndNightMareModTypeId.RootOfNightmares,
							},
						],
						hasMasterworkedVariant: false,
						exampleId: '0',
					},
				},
			},
		],
		{
			isValid: true,
			requiredClassItemMetadataKey: ERaidAndNightMareModTypeId.RootOfNightmares,
		},
	],
];

// const nameOfTestToDebug =
// 	'With one raid mod and no matching seenArmorSlotItems it returns false';
const nameOfTestToDebug = null;
describe('hasValidSeenItemCounts', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
