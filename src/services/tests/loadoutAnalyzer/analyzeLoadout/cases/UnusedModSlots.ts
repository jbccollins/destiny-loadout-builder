import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

const testCase: TestCase = [
  'UnusedModSlots',
  [params],
  {
    ...getBaseOutput(),
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.UnusedModSlots],
  },
]

export default testCase;