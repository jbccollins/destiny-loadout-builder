import { BucketHashes, StatHashes } from '@dlb/dim/data/d2/generated-enums';
import {
	DestinyClass,
	DestinyEnergyType,
} from 'bungie-api-ts-no-const-enum/destiny2';
import {
	EDestinyClassId,
	EArmorSlotId,
	EArmorStatId,
	EElement,
} from './IdEnums';

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
	[DestinyEnergyType.Arc]: EElement.Arc,
	[DestinyEnergyType.Thermal]: EElement.Solar,
	[DestinyEnergyType.Void]: EElement.Void,
	[DestinyEnergyType.Stasis]: EElement.Stasis,
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
