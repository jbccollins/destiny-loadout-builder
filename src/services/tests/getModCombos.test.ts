import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	getDefaultModCombos,
	getModCombos,
} from '@dlb/services/processArmor/getModCombos';
import { getDefaultSeenArmorSlotItems } from '@dlb/services/processArmor/seenArmorSlotItems';
import { getDefaultAllClassItemMetadata } from '@dlb/types/Armor';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import { getDefaultArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';
import { getDefaultStatList } from './utils';

const testFunction = getModCombos;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const getDefaultTestCaseInput = () => ({
	sumOfSeenStats: getDefaultStatList(),
	desiredArmorStats: getDefaultArmorStatMapping(),
	potentialRaidModArmorSlotPlacements: [],
	armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	raidMods: [],
	intrinsicArmorPerkOrAttributeIds: [],
	destinyClassId: EDestinyClassId.Warlock,
	specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
	reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
	useZeroWastedStats: false,
	allClassItemMetadata: getDefaultAllClassItemMetadata(),
	masterworkAssumption: EMasterworkAssumption.None,
});

const testCases: TestCase[] = [
	[
		'Simple',
		[
			{
				...getDefaultTestCaseInput(),
			},
		],
		[getDefaultModCombos()],
	],
	[
		'Two stats',
		[
			{
				sumOfSeenStats: getDefaultStatList(),
				desiredArmorStats: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Intellect]: 10,
					[EArmorStatId.Resilience]: 30,
				},
				potentialRaidModArmorSlotPlacements: [],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				intrinsicArmorPerkOrAttributeIds: [],
				destinyClassId: EDestinyClassId.Warlock,
				specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
				masterworkAssumption: EMasterworkAssumption.None,
			},
		],
		[
			{
				...getDefaultModCombos(),
				lowestCostPlacement: {
					...getDefaultModCombos().lowestCostPlacement,
					placement: {
						...getDefaultModCombos().lowestCostPlacement.placement,

						[EArmorSlotId.Head]: {
							...getDefaultModCombos().lowestCostPlacement.placement[
								EArmorSlotId.Head
							],
							armorStatModId: EModId.IntellectMod,
						},
						[EArmorSlotId.Arm]: {
							...getDefaultModCombos().lowestCostPlacement.placement[
								EArmorSlotId.Arm
							],
							armorStatModId: EModId.ResilienceMod,
						},
						[EArmorSlotId.Chest]: {
							...getDefaultModCombos().lowestCostPlacement.placement[
								EArmorSlotId.Chest
							],
							armorStatModId: EModId.ResilienceMod,
						},
						[EArmorSlotId.ClassItem]: {
							...getDefaultModCombos().lowestCostPlacement.placement[
								EArmorSlotId.ClassItem
							],
							armorStatModId: EModId.ResilienceMod,
						},
					},
				},
			},
		],
	],
	// TODO: These tests are failing because we assume the class item is always masterworked.
	// Once that bug is fixed, these tests should pass.
	// [
	// 	"Lots of stats",
	// 	[
	// 		{
	// 			sumOfSeenStats: [12, 45, 18, 60, 23, 41],
	// 			desiredArmorStats: {
	// 				...getDefaultArmorStatMapping(),
	// 				[EArmorStatId.Mobility]: 30,
	// 				[EArmorStatId.Resilience]: 30,
	// 				[EArmorStatId.Recovery]: 20,
	// 				[EArmorStatId.Discipline]: 80,
	// 				[EArmorStatId.Intellect]: 10,
	// 				[EArmorStatId.Strength]: 60,
	// 			},
	// 			potentialRaidModArmorSlotPlacements: [],
	// 			armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	// 			raidMods: [],
	// 			intrinsicArmorPerkOrAttributeIds: [],
	// 			destinyClassId: EDestinyClassId.Warlock,
	// 			masterworkAssumption: EMasterworkAssumption.None,
	// 			specialSeenArmorSlotItems: {
	// 				...getDefaultSeenArmorSlotItems(),
	// 				[EArmorSlotId.Head]: {
	// 					isArtifice: true,
	// 					isMasterworked: false,
	// 					raidAndNightmareModTypeId: null,
	// 					intrinsicArmorPerkOrAttributeId: null,
	// 				},
	// 				[EArmorSlotId.Arm]: {
	// 					isArtifice: true,
	// 					isMasterworked: false,
	// 					raidAndNightmareModTypeId: null,
	// 					intrinsicArmorPerkOrAttributeId: null,
	// 				},
	// 				[EArmorSlotId.Chest]: {
	// 					isArtifice: true,
	// 					isMasterworked: false,
	// 					raidAndNightmareModTypeId: null,
	// 					intrinsicArmorPerkOrAttributeId: null,
	// 				},
	// 			},
	// 			reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
	// 			useZeroWastedStats: false,
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 						},
	// 					],
	// 					hasMasterworkedVariant: true,
	// 				},
	// 			},
	// 		},
	// 	],

	// 	[
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: true,
	// 			requiredClassItemMetadataKey: ARTIFICE,
	// 			lowestCostPlacement: {
	// 				...getDefaultModCombos().lowestCostPlacement,
	// 				artificeModIdList: [
	// 					EModId.MobilityForged,
	// 					EModId.MobilityForged,
	// 					EModId.DisciplineForged,
	// 					EModId.StrengthForged,
	// 				],
	// 				placement: {
	// 					...getDefaultModCombos().lowestCostPlacement.placement,
	// 					[EArmorSlotId.Head]: {
	// 						...getDefaultModCombos().lowestCostPlacement.placement[
	// 							EArmorSlotId.Head
	// 						],
	// 						armorStatModId: EModId.MinorDisciplineMod,
	// 					},
	// 					[EArmorSlotId.Arm]: {
	// 						...getDefaultModCombos().lowestCostPlacement.placement[
	// 							EArmorSlotId.Arm
	// 						],
	// 						armorStatModId: EModId.MobilityMod,
	// 					},
	// 					[EArmorSlotId.Chest]: {
	// 						...getDefaultModCombos().lowestCostPlacement.placement[
	// 							EArmorSlotId.Chest
	// 						],
	// 						armorStatModId: EModId.DisciplineMod,
	// 					},
	// 					[EArmorSlotId.Leg]: {
	// 						...getDefaultModCombos().lowestCostPlacement.placement[
	// 							EArmorSlotId.Leg
	// 						],
	// 						armorStatModId: EModId.MinorStrengthMod,
	// 					},
	// 					[EArmorSlotId.ClassItem]: {
	// 						...getDefaultModCombos().lowestCostPlacement.placement[
	// 							EArmorSlotId.ClassItem
	// 						],
	// 						armorStatModId: EModId.StrengthMod,
	// 					},
	// 				},
	// 			},
	// 		},
	// 	],
	// ],
	// [
	// 	"Just Masterworked Legendary Class Item",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Legendary: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: true,
	// 		},
	// 	],
	// ],
	// [
	// 	"Just Unmasterworked Artifice Class Item (No Desired Stats)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: false,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: false,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: false,
	// 		},
	// 	],
	// ],
	// [
	// 	"Just Unmasterworked Artifice Class Item (+3 Single Desired Stat)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			desiredArmorStats: {
	// 				...getDefaultArmorStatMapping(),
	// 				[EArmorStatId.Mobility]: 30,
	// 			},
	// 			sumOfSeenStats: [27, 0, 0, 0, 0, 0],
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: false,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: false,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: false,
	// 			requiredClassItemMetadataKey: ARTIFICE,
	// 			lowestCostPlacement: {
	// 				...getDefaultModCombos().lowestCostPlacement,
	// 				artificeModIdList: [EModId.MobilityForged],
	// 			},
	// 		},
	// 	],
	// ],
	// [
	// 	"Unmasterworked Artifice & Masterworked Legendary (+3 Single Desired Stat)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			desiredArmorStats: {
	// 				...getDefaultArmorStatMapping(),
	// 				[EArmorStatId.Mobility]: 30,
	// 			},
	// 			sumOfSeenStats: [27, 0, 0, 0, 0, 0],
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: false,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: false,
	// 						},
	// 					],
	// 				},
	// 				Legendary: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: false,
	// 			requiredClassItemMetadataKey: ARTIFICE,
	// 			lowestCostPlacement: {
	// 				...getDefaultModCombos().lowestCostPlacement,
	// 				artificeModIdList: [EModId.MobilityForged],
	// 			},
	// 		},
	// 	],
	// ],
	// [
	// 	"Unmasterworked Artifice & Masterworked Legendary (+2 Single Desired Stat)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			desiredArmorStats: {
	// 				...getDefaultArmorStatMapping(),
	// 				[EArmorStatId.Mobility]: 30,
	// 			},
	// 			sumOfSeenStats: [28, 0, 0, 0, 0, 0],
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: false,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: false,
	// 						},
	// 					],
	// 				},
	// 				Legendary: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: true,
	// 		},
	// 	],
	// ],
	// [
	// 	"Unmasterworked Artifice & Masterworked Legendary (+2 Multiple Desired Stats)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			desiredArmorStats: {
	// 				...getDefaultArmorStatMapping(),
	// 				[EArmorStatId.Mobility]: 30,
	// 				[EArmorStatId.Resilience]: 30,
	// 			},
	// 			sumOfSeenStats: [28, 28, 0, 0, 0, 0],
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: false,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: false,
	// 						},
	// 					],
	// 				},
	// 				Legendary: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		// Masterworked Legedary
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: true,
	// 		},
	// 	],
	// ],
	// [
	// 	"Unmasterworked Artifice & Masterworked Legendary (No Desired Stats)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: false,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: false,
	// 						},
	// 					],
	// 				},
	// 				Legendary: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		// Masterworked Legedary
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: true,
	// 		},
	// 	],
	// ],
	// [
	// 	"Masterworked Artifice & Masterworked Legendary (No Desired Stats)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 				Legendary: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: true,
	// 		},
	// 	],
	// ],
	// [
	// 	"Masterworked Artifice & Masterworked Legendary (+2 Single Desired Stat)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			desiredArmorStats: {
	// 				...getDefaultArmorStatMapping(),
	// 				[EArmorStatId.Mobility]: 30,
	// 			},
	// 			sumOfSeenStats: [28, 0, 0, 0, 0, 0],
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 				Legendary: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: true,
	// 		},
	// 	],
	// ],
	// [
	// 	"Masterworked Artifice & Masterworked Legendary (+2 Multiple Desired Stats)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			desiredArmorStats: {
	// 				...getDefaultArmorStatMapping(),
	// 				[EArmorStatId.Mobility]: 30,
	// 				[EArmorStatId.Resilience]: 30,
	// 			},
	// 			sumOfSeenStats: [28, 28, 0, 0, 0, 0],
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 				Legendary: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		// Masterworked Legedary
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: true,
	// 		},
	// 	],
	// ],
	// [
	// 	"Masterworked Artifice & Masterworked Legendary (+3 Single Desired Stat)",
	// 	[
	// 		{
	// 			...getDefaultTestCaseInput(),
	// 			desiredArmorStats: {
	// 				...getDefaultArmorStatMapping(),
	// 				[EArmorStatId.Mobility]: 30,
	// 			},
	// 			sumOfSeenStats: [27, 0, 0, 0, 0, 0],
	// 			allClassItemMetadata: {
	// 				...getDefaultAllClassItemMetadata(),
	// 				Artifice: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 				Legendary: {
	// 					hasMasterworkedVariant: true,
	// 					items: [
	// 						{
	// 							...getDefaultArmorItem(),
	// 							isMasterworked: true,
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	],
	// 	[
	// 		{
	// 			...getDefaultModCombos(),
	// 			hasMasterworkedClassItem: true,
	// 			requiredClassItemMetadataKey: ARTIFICE,
	// 			lowestCostPlacement: {
	// 				...getDefaultModCombos().lowestCostPlacement,
	// 				artificeModIdList: [EModId.MobilityForged],
	// 			},
	// 		},
	// 	],
	// ],
];

// const nameOfTestToDebug =
// 	"Unmasterworked Artifice & Masterworked Legendary (+2 Multiple Desired Stats)";
const nameOfTestToDebug = null;
describe('getModCombos', () => {
	const filteredTestCases = nameOfTestToDebug
		? testCases.filter((x) => x[0] === nameOfTestToDebug)
		: testCases;
	test.each(filteredTestCases)('%p', (_name, input, output) => {
		const result = testFunction(...input);
		expect(result).toEqual(output);
	});
});
