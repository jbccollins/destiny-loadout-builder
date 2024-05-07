import { EModId } from "@dlb/generated/mod/EModId";
import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

params.loadout.armorSlotMods.ClassItem[0] = EModId.EmpoweredFinish;
params.loadout.armorSlotMods.ClassItem[1] = EModId.UtilityFinisher;

const testCase: TestCase = [
  'MutuallyExclusiveMods',
  [params],
  {
    ...getBaseOutput(),
    metadata: {
      ...getBaseOutput().metadata,
      maxPossibleReservedArmorSlotEnergy: {
        ...getBaseOutput().metadata.maxPossibleReservedArmorSlotEnergy,
        ClassItem: 5,
      },
      mutuallyExclusiveModGroups: ["finisher"]
    },
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.MutuallyExclusiveMods],
  },
]

export default testCase;