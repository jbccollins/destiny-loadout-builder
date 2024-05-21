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

params.loadout.armorSlotMods.Head[0] = EModId.ArtifactSolarStrandDualSiphon;
output.metadata.maxPossibleReservedArmorSlotEnergy[EArmorSlotId.Head] = 4;
output.metadata.unusedModSlots[EArmorSlotId.Head] = 4;

const testCase: TestCase = [
	'SeasonalMods',
	[params],
	{
		...output,
		canBeOptimized: true,
		optimizationTypeList: [
			ELoadoutOptimizationTypeId.UnusedModSlots,
			ELoadoutOptimizationTypeId.SeasonalMods,
		],
	},
];

export default testCase;
