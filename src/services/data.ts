import { BucketHashes, StatHashes } from '@dlb/dim/data/d2/generated-enums';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import { DestinyClass } from 'bungie-api-ts-no-const-enum/destiny2';

export type ArmorGroup = {
	[BucketHashes.Helmet]: DimItem[];
	[BucketHashes.Gauntlets]: DimItem[];
	[BucketHashes.ChestArmor]: DimItem[];
	[BucketHashes.LegArmor]: DimItem[];
	[BucketHashes.ClassArmor]: DimItem[];
};

export const ValidDestinyClassesTypes = [
	DestinyClass.Titan,
	DestinyClass.Hunter,
	DestinyClass.Warlock
];

export type AllArmor = {
	[DestinyClass.Titan]: ArmorGroup;
	[DestinyClass.Hunter]: ArmorGroup;
	[DestinyClass.Warlock]: ArmorGroup;
};

// Userful for just iterating over every armor stat type
export const ArmorStatTypes = [
	StatHashes.Mobility,
	StatHashes.Resilience,
	StatHashes.Recovery,
	StatHashes.Discipline,
	StatHashes.Intellect,
	StatHashes.Strength
];

export enum EArmorStatName {
	Mobility = 'mobility',
	Resilience = 'resilience',
	Recovery = 'recovery',
	Discipline = 'discipline',
	Intellect = 'intellect',
	Strength = 'strength'
}

// An oredered list to make iterating over that enum
// easier. Fuck typescript enums and how shit they are
// to enumerate.
export const ArmorStatNamesList = [
	EArmorStatName.Mobility,
	EArmorStatName.Resilience,
	EArmorStatName.Recovery,
	EArmorStatName.Discipline,
	EArmorStatName.Intellect,
	EArmorStatName.Strength
];

// Get the english name for an armor stat
export const ArmorStatHashToName = {
	[StatHashes.Mobility]: EArmorStatName.Mobility,
	[StatHashes.Resilience]: EArmorStatName.Resilience,
	[StatHashes.Recovery]: EArmorStatName.Recovery,
	[StatHashes.Discipline]: EArmorStatName.Discipline,
	[StatHashes.Intellect]: EArmorStatName.Intellect,
	[StatHashes.Strength]: EArmorStatName.Strength
};

// Used to store the stats the the user has configured in various places
export type DesiredArmorStats = {
	[EArmorStatName.Mobility]: number;
	[EArmorStatName.Resilience]: number;
	[EArmorStatName.Recovery]: number;
	[EArmorStatName.Discipline]: number;
	[EArmorStatName.Intellect]: number;
	[EArmorStatName.Strength]: number;
};

export const ArmorStatOrder = [
	EArmorStatName.Mobility,
	EArmorStatName.Resilience,
	EArmorStatName.Recovery,
	EArmorStatName.Discipline,
	EArmorStatName.Intellect,
	EArmorStatName.Strength
];

const generateArmorGroup = (): ArmorGroup => {
	return {
		[BucketHashes.Helmet]: [],
		[BucketHashes.Gauntlets]: [],
		[BucketHashes.ChestArmor]: [],
		[BucketHashes.LegArmor]: [],
		[BucketHashes.ClassArmor]: []
	};
};

export const extractArmor = (stores: DimStore<DimItem>[]): AllArmor => {
	const allArmor: AllArmor = {
		[DestinyClass.Titan]: generateArmorGroup(),
		[DestinyClass.Hunter]: generateArmorGroup(),
		[DestinyClass.Warlock]: generateArmorGroup()
	};

	stores.forEach(({ items }) => {
		items.forEach((item) => {
			if (item.location.inArmor) {
				allArmor[item.classType][item.bucket.hash].push(item);
			}
		});
	});

	return allArmor;
};
