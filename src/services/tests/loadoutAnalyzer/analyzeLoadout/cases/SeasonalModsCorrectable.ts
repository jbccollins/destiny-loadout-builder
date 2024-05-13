import { EModId } from '@dlb/generated/mod/EModId';
import { TestCase } from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test';
import {
	getBaseOutput,
	getBaseParams,
} from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers';
import {
	ELoadoutOptimizationTypeId,
	ELoadoutType,
} from '@dlb/types/AnalyzableLoadout';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { cloneDeep } from 'lodash';

const params = cloneDeep(getBaseParams());
const output = cloneDeep(getBaseOutput());

params.loadout.loadoutType = ELoadoutType.InGame;
params.loadout.armorSlotMods.Head[0] = EModId.ArtifactArcLoader;
output.metadata.maxPossibleReservedArmorSlotEnergy[EArmorSlotId.Arm] = 4;
output.metadata.unusedModSlots[EArmorSlotId.Arm] = 4;

const testCase: TestCase = [
	'SeasonalModsCorrectable',
	[params],
	{
		...output,
		canBeOptimized: true,
		optimizationTypeList: [
			ELoadoutOptimizationTypeId.UnusedModSlots,
			ELoadoutOptimizationTypeId.SeasonalMods,
			ELoadoutOptimizationTypeId.SeasonalModsCorrectable,
		],
	},
];

export default testCase;
