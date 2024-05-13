import { EModId } from "@dlb/generated/mod/EModId";
import { ArmorSlotEnergyMapping } from "@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice";
import { ArmorStatAndRaidModComboPlacement } from "@dlb/services/processArmor/getModCombos";
import { AnalyzableLoadout, ELoadoutOptimizationTypeId, ELoadoutType } from "@dlb/types/AnalyzableLoadout";
import { Armor, AvailableExoticArmor, DestinyClassToAllClassItemMetadataMapping } from "@dlb/types/Armor";
import { ArmorStatMapping } from "@dlb/types/ArmorStat";
import { EArmorSlotId, EMasterworkAssumption } from "@dlb/types/IdEnums";

export enum EGetLoadoutsThatCanBeOptimizedProgressType {
  Progress = 'progress',
  Error = 'error',
}
export type GetLoadoutsThatCanBeOptimizedProgressMetadata = {
  maxPossibleDesiredStatTiers: ArmorStatMapping;
  maxPossibleReservedArmorSlotEnergy: ArmorSlotEnergyMapping;
  // maxStatTierDiff: number;
  lowestCost: number;
  currentCost: number;
  lowestWastedStats: number;
  currentWastedStats: number;
  mutuallyExclusiveModGroups: string[]; // TODO: Rework this to contain the actual mod ids
  unstackableModIdList: EModId[];
  modPlacement: ArmorStatAndRaidModComboPlacement;
  unusedModSlots: Partial<Record<EArmorSlotId, number>>;
};
export type GetLoadoutsThatCanBeOptimizedProgress = {
  type: EGetLoadoutsThatCanBeOptimizedProgressType;
  canBeOptimized?: boolean;
  loadoutId: string;
  optimizationTypeList: ELoadoutOptimizationTypeId[];
  metadata?: GetLoadoutsThatCanBeOptimizedProgressMetadata;
};

export type GetLoadoutsThatCanBeOptimizedParams = {
  loadouts: Record<string, AnalyzableLoadout>;
  armor: Armor;
  masterworkAssumption: EMasterworkAssumption;
  allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
  progressCallback: (
    progress: GetLoadoutsThatCanBeOptimizedProgress
  ) => unknown;
  availableExoticArmor: AvailableExoticArmor;
  buggedAlternateSeasonModIdList: EModId[];
};
export type GetLoadoutsThatCanBeOptimizedOutputItem = {
  optimizationTypeList: ELoadoutOptimizationTypeId[];
  loadoutId: string;
};


export enum EModVariantCheckType {
  Base = 'Base',
  Seasonal = 'Seasonal',
}

export type ModVariantCheckSplit = {
  beforeProcessing: ELoadoutOptimizationTypeId[];
  afterProcessing: ELoadoutOptimizationTypeId[];
}

export type ModVariants = {
  modIdList: EModId[];
  modVariantCheckType: EModVariantCheckType;
}[];

export type ModReplacer = (
  modIdList: EModId[]
) => EModId[];

export type AnalyzeLoadoutParams = {
  armor: Armor;
  masterworkAssumption: EMasterworkAssumption;
  allClassItemMetadata: DestinyClassToAllClassItemMetadataMapping;
  availableExoticArmor: AvailableExoticArmor;
  buggedAlternateSeasonModIdList: EModId[];
  loadout: AnalyzableLoadout;
}

export type AnalyzeLoadoutResult = {
  optimizationTypeList: ELoadoutOptimizationTypeId[];
  metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata;
  canBeOptimized: boolean;
}


// Worker types
export enum EMessageType {
  Progress = 'progress',
  Results = 'results',
  Error = 'error',
}

export type Message = {
  type: EMessageType;
  payload:
  | GetLoadoutsThatCanBeOptimizedProgress
  | GetLoadoutsThatCanBeOptimizedOutputItem[]
  | Error;
};

export type Progress = {
  loadoutType: ELoadoutType;
};

export type PostMessageParams = Omit<
  GetLoadoutsThatCanBeOptimizedParams,
  'progressCallback'
>;

export interface GetLoadoutsThatCanBeOptimizedWorker
  extends Omit<Worker, 'postMessage'> {
  postMessage(data: PostMessageParams): void;
}

