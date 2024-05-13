import { EModId } from "@dlb/generated/mod/EModId";
import { AnalyzeLoadoutResult } from "@dlb/services/loadoutAnalyzer/helpers/types";
import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { EArmorSlotId, EArmorStatId } from "@dlb/types/IdEnums";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

params.loadout.armorStatMods = [
  EModId.MinorMobilityMod,
  EModId.MinorMobilityMod,
  EModId.MobilityMod,
  EModId.MobilityMod,
  EModId.MobilityMod,
]

params.loadout.achievedStats = {
  [EArmorStatId.Mobility]: 90,
  [EArmorStatId.Resilience]: 50,
  [EArmorStatId.Recovery]: 50,
  [EArmorStatId.Discipline]: 50,
  [EArmorStatId.Intellect]: 50,
  [EArmorStatId.Strength]: 50,
}

params.loadout.achievedStatTiers = {
  ...params.loadout.achievedStats,
}

params.loadout.desiredStatTiers = {
  ...params.loadout.achievedStats,
}

const output: AnalyzeLoadoutResult = {
  ...getBaseOutput(),
  metadata: {
    ...getBaseOutput().metadata,
    currentCost: 11,
    lowestCost: 11,
    maxPossibleDesiredStatTiers: {
      [EArmorStatId.Mobility]: 100,
      [EArmorStatId.Resilience]: 60,
      [EArmorStatId.Recovery]: 60,
      [EArmorStatId.Discipline]: 60,
      [EArmorStatId.Intellect]: 60,
      [EArmorStatId.Strength]: 60,
    },
    maxPossibleReservedArmorSlotEnergy: {
      [EArmorSlotId.Head]: 10,
      [EArmorSlotId.Arm]: 10,
      [EArmorSlotId.Chest]: 10,
      [EArmorSlotId.Leg]: 10,
      [EArmorSlotId.ClassItem]: 10,
    },
    modPlacement: {
      ...getBaseOutput().metadata.modPlacement,
      [EArmorSlotId.Head]: {
        ...getBaseOutput().metadata.modPlacement[EArmorSlotId.Head],
        armorStatModId: EModId.MinorMobilityMod,
      },
      [EArmorSlotId.Leg]: {
        ...getBaseOutput().metadata.modPlacement[EArmorSlotId.Arm],
        armorStatModId: EModId.MinorMobilityMod,
      },
    },
    unusedModSlots: {
      [EArmorSlotId.Head]: 10,
      [EArmorSlotId.Arm]: 10,
      [EArmorSlotId.Chest]: 10,
      [EArmorSlotId.Leg]: 10,
      [EArmorSlotId.ClassItem]: 10,
    },
  },
}



const testCase: TestCase = [
  'HigherStatTier',
  [params],
  {
    ...output,
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.UnusedModSlots, ELoadoutOptimizationTypeId.HigherStatTiers],
  },
]

export default testCase;