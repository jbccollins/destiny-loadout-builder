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
	[EArmorStatId.Weapons]: 100,
	[EArmorStatId.Health]: 57,
	[EArmorStatId.Class]: 50,
	[EArmorStatId.Grenade]: 50,
	[EArmorStatId.Super]: 50,
	[EArmorStatId.Melee]: 50,
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
	[EArmorStatId.Weapons]: 100,
	[EArmorStatId.Health]: 60,
	[EArmorStatId.Class]: 50,
	[EArmorStatId.Grenade]: 50,
	[EArmorStatId.Super]: 50,
	[EArmorStatId.Melee]: 50,
};

const testCase: TestCase = [
	'ExoticArtificeHigherStatTiers',
	[params],
	baseOutput,
];

export default testCase;
