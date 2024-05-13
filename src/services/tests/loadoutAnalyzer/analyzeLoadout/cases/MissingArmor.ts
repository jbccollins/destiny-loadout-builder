import { AnalyzeLoadoutResult } from "@dlb/services/loadoutAnalyzer/analyzeLoadout";
import { getDefaultModPlacements } from "@dlb/services/processArmor/getModCombos";
import { TestCase } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { cloneDeep } from "lodash";

const params = cloneDeep(getBaseParams());

params.loadout.armor.splice(1, 1);

const baseOutput = getBaseOutput();

const output: AnalyzeLoadoutResult = {
  ...baseOutput,
  metadata: {
    ...baseOutput.metadata,
    modPlacement: getDefaultModPlacements().placement,
  }
}

const testCase: TestCase = [
  'MissingArmor',
  [params],
  {
    ...output,
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.MissingArmor, ELoadoutOptimizationTypeId.UnusedModSlots],
  },
]

export default testCase;