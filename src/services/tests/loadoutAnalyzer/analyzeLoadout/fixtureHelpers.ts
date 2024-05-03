import { AnalyzeLoadoutParams, AnalyzeLoadoutResult } from "@dlb/services/loadoutAnalyzer/analyzeLoadout2";
import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from "@dlb/services/loadoutAnalyzer/loadoutAnalyzer";
import { getDefaultModPlacements } from "@dlb/services/processArmor/getModCombos";
import { AnalyzableLoadout, getDefaultAnalyzableLoadout } from "@dlb/types/AnalyzableLoadout";
import { Armor, ArmorGroup, ArmorItem, ArmorRaritySplit, AvailableExoticArmor, DestinyClassToAllClassItemMetadataMapping, StatList, generateAvailableExoticArmorGroup, getDefaultAllClassItemMetadata, getDefaultAvailableExoticArmorItem } from "@dlb/types/Armor";
import { ArmorSlotWithClassItemIdList } from "@dlb/types/ArmorSlot";
import { DestinyClassIdList } from "@dlb/types/DestinyClass";
import { EArmorSlotId, EArmorStatId, EDestinyClassId, EGearTierId, EMasterworkAssumption } from "@dlb/types/IdEnums";
import { v4 } from "uuid";

const getBaseArmorItem = (): ArmorItem => {
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
      [EArmorStatId.Resilience]: 100,
      [EArmorStatId.Recovery]: 100,
      [EArmorStatId.Discipline]: 100,
      [EArmorStatId.Intellect]: 100,
      [EArmorStatId.Strength]: 100,
    },
    maxPossibleReservedArmorSlotEnergy: {
      [EArmorSlotId.Head]: 10,
      [EArmorSlotId.Arm]: 10,
      [EArmorSlotId.Chest]: 10,
      [EArmorSlotId.Leg]: 10,
      [EArmorSlotId.ClassItem]: 10,
    },
    lowestCost: 0,
    currentCost: Infinity,
    lowestWastedStats: 0,
    currentWastedStats: Infinity,
    mutuallyExclusiveModGroups: [],
    unstackableModIdList: [],
    modPlacement: getDefaultModPlacements().placement,
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



