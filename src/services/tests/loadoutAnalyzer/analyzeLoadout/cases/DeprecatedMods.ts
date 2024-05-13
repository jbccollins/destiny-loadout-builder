import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

// This test is a bit silly. Just test that the analyzer passed the optimization type through.
params.loadout.optimizationTypeList = [ELoadoutOptimizationTypeId.DeprecatedMods];

const testCase: TestCase = [
  'DeprecatedMods',
  [params],
  {
    ...getBaseOutput(),
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.DeprecatedMods, ELoadoutOptimizationTypeId.UnusedModSlots],
  },
]

export default testCase;