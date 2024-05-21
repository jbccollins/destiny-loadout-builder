import { TestCase } from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test';
import {
	getBaseParams,
	getUnprocessableBaseOutput,
} from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers';
import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import { EGearTierId } from '@dlb/types/IdEnums';
import { cloneDeep } from 'lodash';

const params = cloneDeep(getBaseParams());

params.loadout.exoticHash = null;
params.loadout.armor[0].gearTierId = EGearTierId.Legendary;
params.loadout.armor[0].name = 'Not Wormhusk Crown';

const testCase: TestCase = [
	'NoExoticArmor',
	[params],
	{
		...getUnprocessableBaseOutput(),
		canBeOptimized: true,
		optimizationTypeList: [ELoadoutOptimizationTypeId.NoExoticArmor],
	},
];

export default testCase;
