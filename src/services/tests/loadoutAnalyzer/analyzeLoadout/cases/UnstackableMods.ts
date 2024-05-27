import { EModId } from '@dlb/generated/mod/EModId';
import { TestCase } from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test';
import {
	getBaseOutput,
	getBaseParams,
} from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers';
import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { cloneDeep } from 'lodash';

const params = cloneDeep(getBaseParams());
const output = cloneDeep(getBaseOutput());

params.loadout.armorSlotMods.Leg[0] = EModId.SolarScavenger;
params.loadout.armorSlotMods.Leg[1] = EModId.SolarScavenger;
output.metadata.maxPossibleReservedArmorSlotEnergy[EArmorSlotId.Leg] = 1;
output.metadata.unusedModSlots[EArmorSlotId.Leg] = 1;
output.metadata.unstackableModIdList = [EModId.SolarScavenger];

const testCase: TestCase = [
	'UnstackableMods',
	[params],
	{
		...output,
		canBeOptimized: true,
		optimizationTypeList: [
			ELoadoutOptimizationTypeId.UnstackableMods,
			ELoadoutOptimizationTypeId.UnusedModSlots,
		],
	},
];

export default testCase;
