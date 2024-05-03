import { getDefaultArmorSlotEnergyMapping } from "@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice";
import { ELoadoutOptimizationTypeId } from "@dlb/types/AnalyzableLoadout";
import { getDefaultArmorStatMapping } from "@dlb/types/ArmorStat";
import { EGearTierId } from "@dlb/types/IdEnums";
import { TestCase } from "../analyzeLoadout.test";
import { getBaseOutput, getBaseParams } from "../fixtureHelpers";

const params = getBaseParams();

params.loadout.exoticHash = null;
params.loadout.armor[0].gearTierId = EGearTierId.Legendary;
params.loadout.armor[0].name = 'Not Wormhusk Crown';

const baseOutput = getBaseOutput();

const testCase: TestCase = [
  'NoExoticArmor',
  [params],
  {
    ...baseOutput,
    canBeOptimized: true,
    optimizationTypeList: [ELoadoutOptimizationTypeId.NoExoticArmor],
    metadata: {
      ...baseOutput.metadata,
      maxPossibleDesiredStatTiers: getDefaultArmorStatMapping(),
      maxPossibleReservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
      lowestCost: Infinity,
      lowestWastedStats: Infinity,
    }
  }
]

export default testCase;