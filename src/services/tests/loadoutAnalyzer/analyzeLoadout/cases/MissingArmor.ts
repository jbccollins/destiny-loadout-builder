import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { TestCase } from "../analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "../fixtureHelpers";

const params = getBaseParams();
params.loadout.armor.splice(1, 1);

const testCase: TestCase = [
  'MissingArmor',
  [params],
  {
    ...getBaseOutput(),
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.MissingArmor],
  },
]

export default testCase;