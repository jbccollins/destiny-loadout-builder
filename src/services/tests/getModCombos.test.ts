import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	getDefaultModCombos,
	getModCombos,
} from '@dlb/services/processArmor/getModCombos';
import { getDefaultSeenArmorSlotItems } from '@dlb/services/processArmor/seenArmorSlotItems';
import {
	getDefaultAllClassItemMetadata,
	getDefaultArmorItem,
} from '@dlb/types/Armor';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
} from '@dlb/types/IdEnums';
import { getDefaultArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';
import { getDefaultStatList } from './utils';

const testFunction = getModCombos;

type TestCaseInput = Parameters<typeof testFunction>;
type TestCaseOutput = ReturnType<typeof testFunction>;

type TestCase = [name: string, input: TestCaseInput, output: TestCaseOutput];

const testCases: TestCase[] = [
	[
		'Simple',
		[
			{
				sumOfSeenStats: getDefaultStatList(),
				desiredArmorStats: getDefaultArmorStatMapping(),
				potentialRaidModArmorSlotPlacements: [],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				destinyClassId: EDestinyClassId.Warlock,
				specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
			},
		],
		getDefaultModCombos(),
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
				destinyClassId: EDestinyClassId.Warlock,
				specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				allClassItemMetadata: getDefaultAllClassItemMetadata(),
			},
		],
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
						armorStatModId: EModId.ResilienceMod,
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
					[EArmorSlotId.Leg]: {
						...getDefaultModCombos().lowestCostPlacement.placement[
							EArmorSlotId.Leg
						],
						armorStatModId: EModId.IntellectMod,
					},
				},
			},
		},
	],
	[
		'Lots of stats',
		[
			{
				sumOfSeenStats: [12, 45, 18, 60, 23, 41],
				desiredArmorStats: {
					...getDefaultArmorStatMapping(),
					[EArmorStatId.Mobility]: 30,
					[EArmorStatId.Resilience]: 30,
					[EArmorStatId.Recovery]: 20,
					[EArmorStatId.Discipline]: 80,
					[EArmorStatId.Intellect]: 10,
					[EArmorStatId.Strength]: 60,
				},
				potentialRaidModArmorSlotPlacements: [],
				armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
				raidMods: [],
				destinyClassId: EDestinyClassId.Warlock,
				specialSeenArmorSlotItems: {
					...getDefaultSeenArmorSlotItems(),
					[EArmorSlotId.Head]: {
						isArtifice: true,
						isMasterworked: false,
						raidAndNightmareModTypeId: null,
						intrinsicArmorPerkOrAttributeId: null,
					},
					[EArmorSlotId.Arm]: {
						isArtifice: true,
						isMasterworked: false,
						raidAndNightmareModTypeId: null,
						intrinsicArmorPerkOrAttributeId: null,
					},
					[EArmorSlotId.Chest]: {
						isArtifice: true,
						isMasterworked: false,
						raidAndNightmareModTypeId: null,
						intrinsicArmorPerkOrAttributeId: null,
					},
				},
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				allClassItemMetadata: {
					...getDefaultAllClassItemMetadata(),
					Artifice: {
						items: [
							{
								...getDefaultArmorItem(),
							},
						],
						hasMasterworkedVariant: true,
						exampleId: '1',
					},
				},
			},
		],
		{
			...getDefaultModCombos(),
			hasMasterworkedClassItem: true,
			lowestCostPlacement: {
				...getDefaultModCombos().lowestCostPlacement,
				artificeModIdList: [
					EModId.MobilityForged,
					EModId.MobilityForged,
					EModId.DisciplineForged,
					EModId.StrengthForged,
				],
				placement: {
					...getDefaultModCombos().lowestCostPlacement.placement,
					[EArmorSlotId.Head]: {
						...getDefaultModCombos().lowestCostPlacement.placement[
							EArmorSlotId.Head
						],
						armorStatModId: EModId.MobilityMod,
					},
					[EArmorSlotId.Arm]: {
						...getDefaultModCombos().lowestCostPlacement.placement[
							EArmorSlotId.Arm
						],
						armorStatModId: EModId.DisciplineMod,
					},
					[EArmorSlotId.Chest]: {
						...getDefaultModCombos().lowestCostPlacement.placement[
							EArmorSlotId.Chest
						],
						armorStatModId: EModId.MinorDisciplineMod,
					},
					[EArmorSlotId.Leg]: {
						...getDefaultModCombos().lowestCostPlacement.placement[
							EArmorSlotId.Leg
						],
						armorStatModId: EModId.StrengthMod,
					},
					[EArmorSlotId.ClassItem]: {
						...getDefaultModCombos().lowestCostPlacement.placement[
							EArmorSlotId.ClassItem
						],
						armorStatModId: EModId.MinorStrengthMod,
					},
				},
			},
		},
	],
];

// const nameOfTestToDebug = 'Lots of stats';
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
