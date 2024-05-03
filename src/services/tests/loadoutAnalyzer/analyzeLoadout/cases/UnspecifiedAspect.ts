import { EAspectId } from "@dlb/generated/aspect/EAspectId";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { TestCase } from "../analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "../fixtureHelpers";

const params = getBaseParams();

params.loadout.aspectIdList = [EAspectId.GunpowderGamble]

const testCase: TestCase = [
  'UnspecifiedAspect',
  [params],
  {
    ...getBaseOutput(),
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.UnspecifiedAspect],
  },
]

export default testCase;