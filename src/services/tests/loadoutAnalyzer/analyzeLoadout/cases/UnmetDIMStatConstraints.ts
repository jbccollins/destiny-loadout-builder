import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId, ELoadoutType } from "@dlb/types/AnalyzableLoadout";
import { getDefaultArmorStatMapping } from "@dlb/types/ArmorStat";
import { EArmorStatId } from "@dlb/types/IdEnums";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

params.loadout.loadoutType = ELoadoutType.DIM;
params.loadout.dimStatTierConstraints = {
  ...getDefaultArmorStatMapping(),
  [EArmorStatId.Resilience]: 60,
}

const testCase: TestCase = [
  'UnmetDIMStatConstraints',
  [params],
  {
    ...getBaseOutput(),
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.UnmetDIMStatConstraints],
  },
]

export default testCase;