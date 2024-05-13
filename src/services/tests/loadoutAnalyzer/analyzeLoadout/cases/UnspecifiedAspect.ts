import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { TestCase } from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test';
import {
	getBaseOutput,
	getBaseParams,
} from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers';
import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import { cloneDeep } from 'lodash';

const params = cloneDeep(getBaseParams());

params.loadout.aspectIdList = [EAspectId.GunpowderGamble];
params.loadout.fragmentIdList = [
	EFragmentId.EmberOfAshes,
	EFragmentId.EmberOfSolace,
];

const testCase: TestCase = [
	'UnspecifiedAspect',
	[params],
	{
		...getBaseOutput(),
		canBeOptimized: true,
		optimizationTypeList: [
			ELoadoutOptimizationTypeId.UnspecifiedAspect,
			ELoadoutOptimizationTypeId.UnusedModSlots,
		],
	},
];

export default testCase;
