import { EModId } from '@dlb/generated/mod/EModId';
import { AnalyzeLoadoutResult } from '@dlb/services/loadoutAnalyzer/helpers/types';
import { TestCase } from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test';
import {
	getBaseOutput,
	getBaseParams,
} from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers';
import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import { EArmorSlotId, EArmorStatId } from '@dlb/types/IdEnums';
import { cloneDeep } from 'lodash';

const params = cloneDeep(getBaseParams());

params.loadout.armor[1].stats = [20, 10, 10, 10, 10, 10];

params.loadout.achievedStatTiers = {
	...params.loadout.achievedStats,
	[EArmorStatId.Mobility]: 110,
};

const output: AnalyzeLoadoutResult = {
	...getBaseOutput(),
	metadata: {
		...getBaseOutput().metadata,
		lowestCost: 11,
		maxPossibleDesiredStatTiers: {
			[EArmorStatId.Mobility]: 100,
			[EArmorStatId.Resilience]: 60,
			[EArmorStatId.Recovery]: 60,
			[EArmorStatId.Discipline]: 60,
			[EArmorStatId.Intellect]: 60,
			[EArmorStatId.Strength]: 60,
		},
		maxPossibleReservedArmorSlotEnergy: {
			[EArmorSlotId.Head]: 10,
			[EArmorSlotId.Arm]: 10,
			[EArmorSlotId.Chest]: 10,
			[EArmorSlotId.Leg]: 10,
			[EArmorSlotId.ClassItem]: 10,
		},
		modPlacement: {
			...getBaseOutput().metadata.modPlacement,
			[EArmorSlotId.Head]: {
				...getBaseOutput().metadata.modPlacement[EArmorSlotId.Head],
				armorStatModId: EModId.MinorMobilityMod,
			},
			[EArmorSlotId.Leg]: {
				...getBaseOutput().metadata.modPlacement[EArmorSlotId.Leg],
				armorStatModId: EModId.MinorMobilityMod,
			},
		},
		unusedModSlots: {
			[EArmorSlotId.Head]: 10,
			[EArmorSlotId.Arm]: 10,
			[EArmorSlotId.Chest]: 10,
			[EArmorSlotId.Leg]: 10,
			[EArmorSlotId.ClassItem]: 10,
		},
	},
};

const testCase: TestCase = [
	'WastedStatTiers',
	[params],
	{
		...output,
		canBeOptimized: true,
		// TODO: Build a test that ONLY checks for WastedStatTiers
		optimizationTypeList: [
			ELoadoutOptimizationTypeId.WastedStatTiers,
			ELoadoutOptimizationTypeId.UnusedModSlots,
			ELoadoutOptimizationTypeId.HigherStatTiers,
			ELoadoutOptimizationTypeId.LowerCost,
		],
	},
];

export default testCase;
