import { EModId } from "@dlb/generated/mod/EModId";
import { getDefaultArmorSlotEnergyMapping } from "@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice";
import { AnalyzeLoadoutParams, AnalyzeLoadoutResult } from "@dlb/services/loadoutAnalyzer/analyzeLoadout2";
import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from "@dlb/services/loadoutAnalyzer/loadoutAnalyzer";
import { getDefaultModPlacements } from "@dlb/services/processArmor/getModCombos";
import { AnalyzableLoadout, getDefaultAnalyzableLoadout } from "@dlb/types/AnalyzableLoadout";
import { Armor, ArmorGroup, ArmorItem, ArmorRaritySplit, AvailableExoticArmor, DestinyClassToAllClassItemMetadataMapping, StatList, generateAvailableExoticArmorGroup, getDefaultAllClassItemMetadata, getDefaultAvailableExoticArmorItem } from "@dlb/types/Armor";
import { ArmorSlotWithClassItemIdList } from "@dlb/types/ArmorSlot";
import { getDefaultArmorStatMapping } from "@dlb/types/ArmorStat";
import { DestinyClassIdList } from "@dlb/types/DestinyClass";
import { EArmorSlotId, EArmorStatId, EDestinyClassId, EGearTierId, EMasterworkAssumption } from "@dlb/types/IdEnums";
import { v4 } from "uuid";

export const getBaseArmorItem = (): ArmorItem => {
  return {
    name: '',
    icon: '',
    id: '',
    baseStatTotal: 60,
    power: 1800,
    stats: [10, 10, 10, 10, 10, 10] as StatList,
    armorSlot: EArmorSlotId.Head,
    hash: 0,
    destinyClassName: EDestinyClassId.Hunter,
    isMasterworked: true,
    gearTierId: EGearTierId.Legendary,
    isArtifice: false,
    socketableRaidAndNightmareModTypeId: null,
    intrinsicArmorPerkOrAttributeId: null,
    isCollectible: false,
    isLocked: false,
  }
}

const Head: ArmorItem = {
  ...getBaseArmorItem(),
  name: 'Wormhusk Crown',
  id: '1',
  armorSlot: EArmorSlotId.Head,
  hash: 3562696927,
  gearTierId: EGearTierId.Exotic,
}

const Arm: ArmorItem = {
  ...getBaseArmorItem(),
  name: 'Arms',
  id: '2',
  armorSlot: EArmorSlotId.Arm,
  hash: 2,
}

const Chest: ArmorItem = {
  ...getBaseArmorItem(),
  name: 'Chest',
  id: '3',
  armorSlot: EArmorSlotId.Chest,
  hash: 3,
}

const Leg: ArmorItem = {
  ...getBaseArmorItem(),
  name: 'Leg',
  id: '4',
  armorSlot: EArmorSlotId.Leg,
  hash: 4,
}

const ClassItem: ArmorItem = {
  ...getBaseArmorItem(),
  name: 'Class Item',
  id: '5',
  armorSlot: EArmorSlotId.ClassItem,
  hash: 5,
  stats: [0, 0, 0, 0, 0, 0] as StatList,
  baseStatTotal: 0,
}

const getBaseArmorItems = (): ArmorItem[] => {
  const armorItems: ArmorItem[] = [
    Head, Arm, Chest, Leg, ClassItem
  ];
  return armorItems;
}

const getBaseArmorRaritySplit = (): ArmorRaritySplit => {
  return (
    {
      exotic: {
      },
      nonExotic: {
      }
    }
  )
}

const getBaseArmorGroup = (): ArmorGroup => {
  const baseArmorGroup = ArmorSlotWithClassItemIdList.reduce((acc, slot) => {
    acc[slot] = getBaseArmorRaritySplit();
    return acc;
  }, {} as ArmorGroup);

  baseArmorGroup[EArmorSlotId.Head].exotic[Head.id] = Head;
  baseArmorGroup[EArmorSlotId.Arm].nonExotic[Arm.id] = Arm;
  baseArmorGroup[EArmorSlotId.Chest].nonExotic[Chest.id] = Chest;
  baseArmorGroup[EArmorSlotId.Leg].nonExotic[Leg.id] = Leg;

  return baseArmorGroup;
}

const getBaseArmor = (): Armor => {
  const armor = DestinyClassIdList.reduce((acc, classId) => {
    acc[classId] = getBaseArmorGroup();
    return acc;
  }, {} as Armor);

  return armor;
}

const getBaseAllClassItemMetadata = (): DestinyClassToAllClassItemMetadataMapping => {
  const allClassItemMetadata = DestinyClassIdList.reduce((acc, classId) => {
    acc[classId] = getDefaultAllClassItemMetadata();
    return acc;
  }, {} as DestinyClassToAllClassItemMetadataMapping);

  allClassItemMetadata[EDestinyClassId.Hunter].Legendary.hasMasterworkedVariant = true;
  allClassItemMetadata[EDestinyClassId.Hunter].Legendary.items = [ClassItem];

  return allClassItemMetadata;
}

const getBaseAvailableExoticArmor = (): AvailableExoticArmor => {
  const availableExoticArmor = DestinyClassIdList.reduce((acc, classId) => {
    acc[classId] = generateAvailableExoticArmorGroup();
    return acc;
  }, {} as AvailableExoticArmor);


  const wormhusk = getDefaultAvailableExoticArmorItem();
  wormhusk.armorSlot = EArmorSlotId.Head;
  wormhusk.hash = 3562696927;
  wormhusk.count = 1;
  wormhusk.name = 'Wormhusk Crown';
  wormhusk.icon = v4();
  wormhusk.destinyClassName = EDestinyClassId.Hunter;

  availableExoticArmor[EDestinyClassId.Hunter][EArmorSlotId.Head].push(wormhusk);
  return availableExoticArmor;
}

const getBaseAnalyzeableLoadout = (): AnalyzableLoadout => {
  const loadout = getDefaultAnalyzableLoadout();
  loadout.armor = getBaseArmorItems();
  loadout.exoticHash = Head.hash;
  loadout.destinyClassId = EDestinyClassId.Hunter;
  loadout.armorStatMods = [
    EModId.MobilityMod,
    EModId.MobilityMod,
    EModId.MobilityMod,
    EModId.MobilityMod,
    EModId.MobilityMod,
  ];
  loadout.achievedStats = {
    [EArmorStatId.Mobility]: 100,
    [EArmorStatId.Resilience]: 50,
    [EArmorStatId.Recovery]: 50,
    [EArmorStatId.Discipline]: 50,
    [EArmorStatId.Intellect]: 50,
    [EArmorStatId.Strength]: 50,
  };
  loadout.achievedStatTiers = {
    ...loadout.achievedStats,
  };
  loadout.desiredStatTiers = {
    ...loadout.achievedStats,
  };
  return loadout;
}

export const getBaseParams = (): AnalyzeLoadoutParams => {
  return {
    armor: getBaseArmor(),
    masterworkAssumption: EMasterworkAssumption.All,
    allClassItemMetadata: getBaseAllClassItemMetadata(),
    availableExoticArmor: getBaseAvailableExoticArmor(),
    buggedAlternateSeasonModIdList: [],
    loadout: getBaseAnalyzeableLoadout(),
  }
}


const getBaseGetLoadoutsThatCanBeOptimizedProgressMetadata = (): GetLoadoutsThatCanBeOptimizedProgressMetadata => {
  return ({
    maxPossibleDesiredStatTiers: {
      [EArmorStatId.Mobility]: 100,
      [EArmorStatId.Resilience]: 50,
      [EArmorStatId.Recovery]: 50,
      [EArmorStatId.Discipline]: 50,
      [EArmorStatId.Intellect]: 50,
      [EArmorStatId.Strength]: 50,
    },
    maxPossibleReservedArmorSlotEnergy: {
      [EArmorSlotId.Head]: 7,
      [EArmorSlotId.Arm]: 7,
      [EArmorSlotId.Chest]: 7,
      [EArmorSlotId.Leg]: 7,
      [EArmorSlotId.ClassItem]: 7,
    },
    lowestCost: 15,
    currentCost: 15,
    lowestWastedStats: 0,
    currentWastedStats: 0,
    mutuallyExclusiveModGroups: [],
    unstackableModIdList: [],
    modPlacement: {
      [EArmorSlotId.Head]: {
        ...getDefaultModPlacements().placement.Head,
        armorStatModId: EModId.MobilityMod,
      },
      [EArmorSlotId.Arm]: {
        ...getDefaultModPlacements().placement.Arm,
        armorStatModId: EModId.MobilityMod,
      },
      [EArmorSlotId.Chest]: {
        ...getDefaultModPlacements().placement.Chest,
        armorStatModId: EModId.MobilityMod,
      },
      [EArmorSlotId.Leg]: {
        ...getDefaultModPlacements().placement.Leg,
        armorStatModId: EModId.MobilityMod,
      },
      [EArmorSlotId.ClassItem]: {
        ...getDefaultModPlacements().placement.ClassItem,
        armorStatModId: EModId.MobilityMod,
      },
    },
    unusedModSlots: {},
  })
}

export const getBaseOutput = (): AnalyzeLoadoutResult => {
  return {
    optimizationTypeList: [],
    metadata: getBaseGetLoadoutsThatCanBeOptimizedProgressMetadata(),
    canBeOptimized: false,
  }
}

export const getUnprocessableBaseOutput = (): AnalyzeLoadoutResult => {
  const baseOutput = getBaseOutput();
  return {
    ...baseOutput,
    metadata: {
      ...baseOutput.metadata,
      modPlacement: getDefaultModPlacements().placement,
      maxPossibleDesiredStatTiers: getDefaultArmorStatMapping(),
      maxPossibleReservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
      currentCost: 15,
      currentWastedStats: 0,
      lowestCost: Infinity,
      lowestWastedStats: Infinity,
    }
  }
}



