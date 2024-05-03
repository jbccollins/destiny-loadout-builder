import { ELoadoutOptimizationTypeId, ELoadoutType } from "@dlb/types/AnalyzableLoadout";
import { getDefaultArmorStatMapping } from "@dlb/types/ArmorStat";
import { EArmorStatId } from "@dlb/types/IdEnums";
import { TestCase } from "../analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "../fixtureHelpers";

const params = getBaseParams();

params.loadout.loadoutType = ELoadoutType.DIM;
params.loadout.dimStatTierConstraints = {
  ...getDefaultArmorStatMapping(),
  [EArmorStatId.Mobility]: 100,
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