import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseArmorItem, getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { EArmorSlotId, EArmorStatId } from "@dlb/types/IdEnums";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

params.armor.Hunter.Arm.nonExotic["2"] = {
  ...params.armor.Hunter.Arm.nonExotic["2"],
  stats: [11, 10, 10, 10, 10, 10],
}

params.loadout.achievedStats = {
  ...params.loadout.achievedStats,
  [EArmorStatId.Mobility]: 101,
}

params.loadout.armor[1].stats = [11, 10, 10, 10, 10, 10]

params.armor.Hunter.Arm.nonExotic["6"] = {
  ...getBaseArmorItem(),
  name: 'Arms',
  id: '6',
  armorSlot: EArmorSlotId.Arm,
  hash: 6,
  stats: [10, 10, 10, 10, 10, 10],
}

const testCase: TestCase = [
  'FewerWastedStats',
  [params],
  {
    ...getBaseOutput(),
    metadata: {
      ...getBaseOutput().metadata,
      currentWastedStats: 1,
    },
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.FewerWastedStats],
  },
]

export default testCase;