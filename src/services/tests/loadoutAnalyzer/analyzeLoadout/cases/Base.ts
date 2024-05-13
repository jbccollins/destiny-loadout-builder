import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { cloneDeep } from "lodash";

const baseOutput = cloneDeep(getBaseOutput());

const testCase: TestCase = [
  'Base',
  [getBaseParams()],
  {
    ...baseOutput,
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.UnusedModSlots],
  }
];

export default testCase;