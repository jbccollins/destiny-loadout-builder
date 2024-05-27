import { EModId } from '@dlb/generated/mod/EModId';
import { TestCase } from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test';
import {
	getBaseOutput,
	getBaseParams,
} from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers';
import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import { EArmorSlotId, EArmorStatId } from '@dlb/types/IdEnums';
import { cloneDeep } from 'lodash';

const params = cloneDeep(getBaseParams());

params.loadout.armorStatMods = [
	EModId.MinorMobilityMod,
	EModId.MinorMobilityMod,
	EModId.MobilityMod,
	EModId.MobilityMod,
	EModId.MobilityMod,
];

params.loadout.achievedStats = {
	[EArmorStatId.Mobility]: 90,
	[EArmorStatId.Resilience]: 50,
	[EArmorStatId.Recovery]: 50,
	[EArmorStatId.Discipline]: 50,
	[EArmorStatId.Intellect]: 50,
	[EArmorStatId.Strength]: 50,
};

params.loadout.achievedStatTiers = {
	...params.loadout.achievedStats,
};

params.loadout.desiredStatTiers = {
	...params.loadout.achievedStats,
};

const baseOutput = cloneDeep(getBaseOutput());
baseOutput.canBeOptimized = true;
baseOutput.optimizationTypeList = [
	ELoadoutOptimizationTypeId.UnusedModSlots,
	ELoadoutOptimizationTypeId.HigherStatTiers,
];
baseOutput.metadata.currentCost = 11;
baseOutput.metadata.lowestCost = 11;
baseOutput.metadata.maxPossibleDesiredStatTiers = {
	[EArmorStatId.Mobility]: 100,
	[EArmorStatId.Resilience]: 60,
	[EArmorStatId.Recovery]: 60,
	[EArmorStatId.Discipline]: 60,
	[EArmorStatId.Intellect]: 60,
	[EArmorStatId.Strength]: 60,
};
baseOutput.metadata.maxPossibleReservedArmorSlotEnergy = {
	[EArmorSlotId.Head]: 10,
	[EArmorSlotId.Arm]: 10,
	[EArmorSlotId.Chest]: 10,
	[EArmorSlotId.Leg]: 10,
	[EArmorSlotId.ClassItem]: 10,
};
baseOutput.metadata.modPlacement[EArmorSlotId.Head].armorStatModId =
	EModId.MinorMobilityMod;
baseOutput.metadata.modPlacement[EArmorSlotId.Leg].armorStatModId =
	EModId.MinorMobilityMod;
baseOutput.metadata.unusedModSlots = {
	[EArmorSlotId.Head]: 10,
	[EArmorSlotId.Arm]: 10,
	[EArmorSlotId.Chest]: 10,
	[EArmorSlotId.Leg]: 10,
	[EArmorSlotId.ClassItem]: 10,
};
baseOutput.metadata.maxPossibleExoticArtificeDesiredStatTiers = {
	[EArmorStatId.Mobility]: 100,
	[EArmorStatId.Resilience]: 60,
	[EArmorStatId.Recovery]: 60,
	[EArmorStatId.Discipline]: 60,
	[EArmorStatId.Intellect]: 60,
	[EArmorStatId.Strength]: 60,
};

const testCase: TestCase = ['HigherStatTiers', [params], baseOutput];

export default testCase;
