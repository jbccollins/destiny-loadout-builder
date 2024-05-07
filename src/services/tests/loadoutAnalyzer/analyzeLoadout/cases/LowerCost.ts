import { AnalyzeLoadoutResult } from "@dlb/services/loadoutAnalyzer/analyzeLoadout2";
import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseArmorItem, getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { EArmorSlotId } from "@dlb/types/IdEnums";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

params.armor.Hunter.Arm.nonExotic["6"] = {
  ...getBaseArmorItem(),
  name: 'Arms',
  id: '6',
  armorSlot: EArmorSlotId.Arm,
  hash: 6,
  stats: [15, 10, 10, 10, 10, 10],
}

const output: AnalyzeLoadoutResult = {
  ...getBaseOutput(),
  metadata: {
    ...getBaseOutput().metadata,
    lowestCost: 13,
    maxPossibleReservedArmorSlotEnergy: {
      [EArmorSlotId.Head]: 9,
      [EArmorSlotId.Arm]: 9,
      [EArmorSlotId.Chest]: 9,
      [EArmorSlotId.Leg]: 9,
      [EArmorSlotId.ClassItem]: 9,
    }
  },
}



const testCase: TestCase = [
  'LowerCost',
  [params],
  {
    ...output,
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.LowerCost],
  },
]

export default testCase;