import {
	ResultsTableLoadout,
	getClassItemText,
} from '@dlb/components/ArmorResults/ArmorResultsTypes';
import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import { ARTIFICE } from '@dlb/services/processArmor/constants';
import { ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';

const testFunction = getClassItemText;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const getDefaultResultsTableLoadout = (): ResultsTableLoadout => ({
	id: 'id',
	sortableFields: null,
	armorItems: [],
	requiredArtificeModIdList: [],
	requiredStatModIdList: [],
	classItem: getDefaultProcessedArmorItemMetadataClassItem(),
});

const testCases: TestCase[] = [
	['Legendary', [getDefaultResultsTableLoadout()], 'Any Class Item'],
	[
		'Masterworked Legendary',
		[
			{
				...getDefaultResultsTableLoadout(),
				classItem: {
					...getDefaultProcessedArmorItemMetadataClassItem(),
					hasMasterworkedVariant: true,
				},
			},
		],
		'Any Masterworked Class Item',
	],
	[
		'Artifice',
		[
			{
				...getDefaultResultsTableLoadout(),
				requiredArtificeModIdList: [EModId.MobilityForged],
				classItem: {
					...getDefaultProcessedArmorItemMetadataClassItem(),
					requiredClassItemMetadataKey: ARTIFICE,
				},
			},
		],
		'Any Artifice Class Item',
	],
	[
		'Masterworked Artifice',
		[
			{
				...getDefaultResultsTableLoadout(),
				requiredArtificeModIdList: [EModId.MobilityForged],
				classItem: {
					...getDefaultProcessedArmorItemMetadataClassItem(),
					requiredClassItemMetadataKey: ARTIFICE,
					hasMasterworkedVariant: true,
				},
			},
		],
		'Any Masterworked Artifice Class Item',
	],
	[
		'Raid',
		[
			{
				...getDefaultResultsTableLoadout(),
				classItem: {
					...getDefaultProcessedArmorItemMetadataClassItem(),
					requiredClassItemMetadataKey:
						ERaidAndNightMareModTypeId.DeepStoneCrypt,
				},
			},
		],
		'Any DSC Class Item',
	],
	[
		'Masterworked Raid',
		[
			{
				...getDefaultResultsTableLoadout(),
				classItem: {
					...getDefaultProcessedArmorItemMetadataClassItem(),
					requiredClassItemMetadataKey:
						ERaidAndNightMareModTypeId.DeepStoneCrypt,
					hasMasterworkedVariant: true,
				},
			},
		],
		'Any Masterworked DSC Class Item',
	],
	// TODO: Add these tests in once we support intrinsic class armor filters
	// [
	// 	'Intrinsic',
	// 	[
	// 		{
	// 			...getDefaultResultsTableLoadout(),
	// 			classItem: {
	// 				...getDefaultProcessedArmorItemMetadataClassItem(),
	// 				requiredClassItemMetadataKey:
	// 					EIntrinsicArmorPerkOrAttributeId.PlunderersTrappings,
	// 			},
	// 		},
	// 	],
	// 	'Any PT Class Item',
	// ],
	// [
	// 	'Masterworked Intrinsic',
	// 	[
	// 		{
	// 			...getDefaultResultsTableLoadout(),
	// 			classItem: {
	// 				...getDefaultProcessedArmorItemMetadataClassItem(),
	// 				needsMasterworkedVariant: true,
	// 				requiredClassItemMetadataKey:
	// 					EIntrinsicArmorPerkOrAttributeId.PlunderersTrappings,
	// 			},
	// 		},
	// 	],
	// 	'Any Masterworked PT Class Item',
	// ],
];

// const nameOfTestToDebug =
// 	'With one raid mod and no matching seenArmorSlotItems it returns false';
const nameOfTestToDebug = null;
describe('getClassItemText', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
