import { TestCase } from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/analyzeLoadout.test';
import {
  getBaseArmorItem,
  getBaseOutput,
  getBaseParams,
} from '@dlb/services/tests/loadoutAnalyzer/analyzeLoadout/fixtureHelpers';
import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import { EArmorSlotId, EDestinyClassId } from '@dlb/types/IdEnums';
import { cloneDeep } from 'lodash';

const params = cloneDeep(getBaseParams());
params.armor[EDestinyClassId.Hunter][EArmorSlotId.Arm].nonExotic['6'] = {
  ...getBaseArmorItem(),
  name: 'Arms',
  id: '6',
  armorSlot: EArmorSlotId.Arm,
  hash: 6,
  stats: [12, 10, 10, 10, 10, 10],
};

const baseOutput = cloneDeep(getBaseOutput());
baseOutput.canBeOptimized = true;
baseOutput.optimizationTypeList = [
  ELoadoutOptimizationTypeId.UnusedModSlots,
  ELoadoutOptimizationTypeId.ExoticArtificeLowerCost,
];
baseOutput.metadata.lowestExoticArtificeCost = 13;

const testCase: TestCase = [
  'ExoticArtificeLowerCost',
  [params],
  baseOutput
];

export default testCase;
