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

params.buggedAlternateSeasonModIdList = [EModId.ArtifactHarmonicScavenger];
params.loadout.armorSlotMods[EArmorSlotId.Leg] = [
	EModId.ArtifactHarmonicScavenger,
];

const baseOutput = cloneDeep(getBaseOutput());
baseOutput.metadata.maxPossibleReservedArmorSlotEnergy[EArmorSlotId.Leg] = 6;
baseOutput.metadata.unusedModSlots[EArmorSlotId.Leg] = 6;

params.loadout.loadoutType = ELoadoutType.DIM;

const testCase: TestCase = [
	'BuggedAlternateSeasonModsCorrectable',
	[params],
	{
		...baseOutput,
		canBeOptimized: true,
		optimizationTypeList: [
			ELoadoutOptimizationTypeId.UnusedModSlots,
			ELoadoutOptimizationTypeId.BuggedAlternateSeasonModsCorrectable,
		],
	},
];

export default testCase;
