import { EModId } from "@dlb/generated/mod/EModId";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { EArmorSlotId } from "@dlb/types/IdEnums";
import { TestCase } from "../analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "../fixtureHelpers";

const params = getBaseParams();

params.buggedAlternateSeasonModIdList = [EModId.ArtifactHarmonicScavenger];
params.loadout.armorSlotMods[EArmorSlotId.Leg][0] = EModId.ArtifactHarmonicScavenger;

const baseOutput = getBaseOutput();

const testCase: TestCase = [
  'BuggedAlternateSeasonMod',
  [params],
  {
    ...baseOutput,
    metadata: {
      ...baseOutput.metadata,
      maxPossibleReservedArmorSlotEnergy: {
        ...baseOutput.metadata.maxPossibleReservedArmorSlotEnergy,
        [EArmorSlotId.Leg]: 9,
      }
    },
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.BuggedAlternateSeasonMod],
  },
]

export default testCase;