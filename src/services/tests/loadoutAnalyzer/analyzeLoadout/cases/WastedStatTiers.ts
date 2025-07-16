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

params.loadout.armor[1].stats = [20, 10, 10, 10, 10, 10];

params.loadout.achievedStatTiers = {
	...params.loadout.achievedStats,
	[EArmorStatId.Weapons]: 110,
};

const baseOutput = cloneDeep(getBaseOutput());
baseOutput.canBeOptimized = true;
baseOutput.optimizationTypeList = [
	ELoadoutOptimizationTypeId.WastedStatTiers,
	ELoadoutOptimizationTypeId.UnusedModSlots,
	ELoadoutOptimizationTypeId.HigherStatTiers,
	ELoadoutOptimizationTypeId.LowerCost,
];
baseOutput.metadata.lowestCost = 11;
baseOutput.metadata.lowestExoticArtificeCost = 11;
baseOutput.metadata.maxPossibleDesiredStatTiers = {
	[EArmorStatId.Weapons]: 100,
	[EArmorStatId.Health]: 60,
	[EArmorStatId.Class]: 60,
	[EArmorStatId.Grenade]: 60,
	[EArmorStatId.Super]: 60,
	[EArmorStatId.Melee]: 60,
};
baseOutput.metadata.maxPossibleReservedArmorSlotEnergy = {
	[EArmorSlotId.Head]: 10,
	[EArmorSlotId.Arm]: 10,
	[EArmorSlotId.Chest]: 10,
	[EArmorSlotId.Leg]: 10,
	[EArmorSlotId.ClassItem]: 10,
};
baseOutput.metadata.modPlacement[EArmorSlotId.Head].armorStatModId =
	EModId.MinorWeaponsMod;
baseOutput.metadata.modPlacement[EArmorSlotId.Leg].armorStatModId =
	EModId.MinorWeaponsMod;
baseOutput.metadata.unusedModSlots = {
	[EArmorSlotId.Head]: 10,
	[EArmorSlotId.Arm]: 10,
	[EArmorSlotId.Chest]: 10,
	[EArmorSlotId.Leg]: 10,
	[EArmorSlotId.ClassItem]: 10,
};
baseOutput.metadata.maxPossibleExoticArtificeDesiredStatTiers = {
	[EArmorStatId.Weapons]: 100,
	[EArmorStatId.Health]: 60,
	[EArmorStatId.Class]: 60,
	[EArmorStatId.Grenade]: 60,
	[EArmorStatId.Super]: 60,
	[EArmorStatId.Melee]: 60,
};

const testCase: TestCase = ['WastedStatTiers', [params], baseOutput];

export default testCase;
