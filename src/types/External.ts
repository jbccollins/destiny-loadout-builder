import { BucketHashes, StatHashes } from '@dlb/dim/data/d2/generated-enums';
import {
	DestinyClass,
	DestinyEnergyType,
	TierType,
} from 'bungie-api-ts-no-const-enum/destiny2';
import {
	EDestinyClassId,
	EArmorSlotId,
	EArmorStatId,
	EElementId,
	EGearTierId,
} from './IdEnums';
import { ItemTierName } from '@dlb/dim/search/d2-known-values';

/********* Mapping manifest hashes to our own enums *********/
// TODO these kinds of mappings don't seem to be type safe.
// Convert these to getter functions
export const DestinyClassHashToDestinyClass = {
	[DestinyClass.Titan]: EDestinyClassId.Titan,
	[DestinyClass.Hunter]: EDestinyClassId.Hunter,
	[DestinyClass.Warlock]: EDestinyClassId.Warlock,
};

export const BucketHashToArmorSlot = {
	[BucketHashes.Helmet]: EArmorSlotId.Head,
	[BucketHashes.Gauntlets]: EArmorSlotId.Arm,
	[BucketHashes.ChestArmor]: EArmorSlotId.Chest,
	[BucketHashes.LegArmor]: EArmorSlotId.Leg,
	[BucketHashes.ClassArmor]: EArmorSlotId.ClassItem,
};

// Get the english name for an armor stat
export const StatHashToArmorStat = {
	[StatHashes.Mobility]: EArmorStatId.Mobility,
	[StatHashes.Resilience]: EArmorStatId.Resilience,
	[StatHashes.Recovery]: EArmorStatId.Recovery,
	[StatHashes.Discipline]: EArmorStatId.Discipline,
	[StatHashes.Intellect]: EArmorStatId.Intellect,
	[StatHashes.Strength]: EArmorStatId.Strength,
};

export const DestinyEnergyTypeToArmorElementalAffinity = {
	[DestinyEnergyType.Arc]: EElementId.Arc,
	[DestinyEnergyType.Thermal]: EElementId.Solar,
	[DestinyEnergyType.Void]: EElementId.Void,
	[DestinyEnergyType.Stasis]: EElementId.Stasis,
	// [DestinyEnergyType.Strand]: EArmorElementalAffinity.Strand,
};

/******** Convert Bungie/DIM strings/ids/enums into our own enums *********/
export const DestinyArmorTypeToArmorSlotId = {
	Helmet: EArmorSlotId.Head,
	Gauntlets: EArmorSlotId.Arm,
	Chest: EArmorSlotId.Chest,
	Leg: EArmorSlotId.Leg,
	ClassItem: EArmorSlotId.ClassItem,
};

export const DestinyClassStringToDestinyClassId = {
	Titan: EDestinyClassId.Titan,
	Warlock: EDestinyClassId.Warlock,
	Hunter: EDestinyClassId.Hunter,
};

export const ElementEnumToEElementId = {
	[DestinyEnergyType.Stasis]: EElementId.Stasis,
	[DestinyEnergyType.Void]: EElementId.Void,
	[DestinyEnergyType.Thermal]: EElementId.Solar,
	[DestinyEnergyType.Arc]: EElementId.Arc,
	[DestinyEnergyType.Any]: EElementId.Any,
	[DestinyEnergyType.Ghost]: EElementId.Any,
	[DestinyEnergyType.Subclass]: EElementId.Any,
};

export const ItemTierNameToEGearTierId: Record<ItemTierName, EGearTierId> = {
	Exotic: EGearTierId.Exotic,
	Legendary: EGearTierId.Legendary,
	Rare: EGearTierId.Rare,
	Common: EGearTierId.Uncommon,
	Uncommon: EGearTierId.Common,
	Unknown: EGearTierId.Unknown,
	Currency: EGearTierId.Unknown,
};
