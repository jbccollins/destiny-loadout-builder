import { EModId } from "@dlb/generated/mod/EModId";
import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { EArmorSlotId } from "@dlb/types/IdEnums";
import { cloneDeep } from "lodash";

const params = getBaseParams();

params.buggedAlternateSeasonModIdList = [EModId.ArtifactHarmonicScavenger];
params.loadout.armorSlotMods[EArmorSlotId.Leg][0] = EModId.ArtifactHarmonicScavenger;

const baseOutput = cloneDeep(getBaseOutput());

const testCase: TestCase = [
  'BuggedAlternateSeasonMod',
  [params],
  {
    ...baseOutput,
    metadata: {
      ...baseOutput.metadata,
      maxPossibleReservedArmorSlotEnergy: {
        ...baseOutput.metadata.maxPossibleReservedArmorSlotEnergy,
        [EArmorSlotId.Leg]: 6,
      },
      unusedModSlots: {
        ...baseOutput.metadata.unusedModSlots,
        [EArmorSlotId.Leg]: 6,
      },
    },
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.BuggedAlternateSeasonMods, ELoadoutOptimizationTypeId.UnusedModSlots],
  },
]

export default testCase;