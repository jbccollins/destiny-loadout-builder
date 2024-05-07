import { EAspectId } from "@dlb/generated/aspect/EAspectId";
import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

params.loadout.aspectIdList = [EAspectId.GunpowderGamble, EAspectId.KnockEmDown]

const testCase: TestCase = [
  'UnusedFragmentSlots',
  [params],
  {
    ...getBaseOutput(),
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.UnusedFragmentSlots],
  },
]

export default testCase;