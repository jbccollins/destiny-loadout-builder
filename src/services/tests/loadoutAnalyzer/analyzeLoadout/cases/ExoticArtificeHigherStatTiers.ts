import { TestCase } from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test';
import {
	getBaseOutput,
	getBaseParams,
} from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers';
import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import { EArmorStatId, EDestinyClassId } from '@dlb/types/IdEnums';
import { cloneDeep } from 'lodash';

const params = cloneDeep(getBaseParams());
params.armor[EDestinyClassId.Hunter].Arm.nonExotic[2].stats = [
	10, 17, 10, 10, 10, 10,
];

params.loadout.achievedStats = {
	[EArmorStatId.Mobility]: 100,
	[EArmorStatId.Resilience]: 57,
	[EArmorStatId.Recovery]: 50,
	[EArmorStatId.Discipline]: 50,
	[EArmorStatId.Intellect]: 50,
	[EArmorStatId.Strength]: 50,
};

const baseOutput = cloneDeep(getBaseOutput());
baseOutput.canBeOptimized = true;
baseOutput.optimizationTypeList = [
	ELoadoutOptimizationTypeId.UnusedModSlots,
	ELoadoutOptimizationTypeId.ExoticArtificeHigherStatTiers,
];
baseOutput.metadata.lowestWastedStats = 7;
baseOutput.metadata.currentWastedStats = 7;
baseOutput.metadata.maxPossibleExoticArtificeDesiredStatTiers = {
	[EArmorStatId.Mobility]: 100,
	[EArmorStatId.Resilience]: 60,
	[EArmorStatId.Recovery]: 50,
	[EArmorStatId.Discipline]: 50,
	[EArmorStatId.Intellect]: 50,
	[EArmorStatId.Strength]: 50,
};

const testCase: TestCase = [
	'ExoticArtificeHigherStatTiers',
	[params],
	baseOutput,
];

export default testCase;
