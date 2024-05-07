import { EModId } from "@dlb/generated/mod/EModId";
import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

params.loadout.armorSlotMods.Head[0] = EModId.ArtifactVoidStrandDualSiphon

const testCase: TestCase = [
  'UnusableMods',
  [params],
  {
    ...getBaseOutput(),
    metadata: {
      ...getBaseOutput().metadata,
      maxPossibleReservedArmorSlotEnergy: {
        ...getBaseOutput().metadata.maxPossibleReservedArmorSlotEnergy,
        Head: 4,
      }
    },
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.UnusableMods],
  },
]

export default testCase;