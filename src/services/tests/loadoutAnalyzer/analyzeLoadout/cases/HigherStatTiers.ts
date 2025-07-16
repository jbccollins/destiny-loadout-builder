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
	EModId.MinorWeaponsMod,
	EModId.MinorWeaponsMod,
	EModId.WeaponsMod,
	EModId.WeaponsMod,
	EModId.WeaponsMod,
];

params.loadout.achievedStats = {
	[EArmorStatId.Weapons]: 90,
	[EArmorStatId.Health]: 50,
	[EArmorStatId.Class]: 50,
	[EArmorStatId.Grenade]: 50,
	[EArmorStatId.Super]: 50,
	[EArmorStatId.Melee]: 50,
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

const testCase: TestCase = ['HigherStatTiers', [params], baseOutput];

export default testCase;
