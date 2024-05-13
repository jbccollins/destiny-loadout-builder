import { EModId } from "@dlb/generated/mod/EModId";
import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseParams, getUnprocessableBaseOutput } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

// This test is a bit silly. Just test that the analyzer passed the optimization type through.
params.loadout.armorSlotMods.Arm = [EModId.ArcLoader, EModId.ArcLoader, EModId.ArcLoader];

const testCase: TestCase = [
  'InvalidLoadoutConfiguration',
  [params],
  {

    ...getUnprocessableBaseOutput(),
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration],
  },
]

export default testCase;