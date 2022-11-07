import { BucketHashes, StatHashes } from '@dlb/dim/data/d2/generated-enums';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import { DestinyClass } from 'bungie-api-ts-no-const-enum/destiny2';

import { StatList } from './armor-processing';
import { bungieNetPath } from '@dlb/utils/item-utils';

export const ValidDestinyClassesTypes = [
	DestinyClass.Titan,
	DestinyClass.Hunter,
	DestinyClass.Warlock
];

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
// to enumerate. The order in this list matters.
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

export const generateArmorGroup = (): ArmorGroup => {
	return {
		[ArmorSlot.Head]: { exotic: [], nonExotic: [] },
		[ArmorSlot.Arm]: { exotic: [], nonExotic: [] },
		[ArmorSlot.Chest]: { exotic: [], nonExotic: [] },
		[ArmorSlot.Leg]: { exotic: [], nonExotic: [] },
		[ArmorSlot.ClassItem]: { exotic: [], nonExotic: [] }
	};
};

export enum DestinyClassName {
	Titan = 'titan',
	Warlock = 'warlock',
	Hunter = 'hunter'
}

export const DestinyClassNames = [
	DestinyClassName.Titan,
	DestinyClassName.Warlock,
	DestinyClassName.Hunter
];

export enum ArmorSlot {
	Head = 'head',
	Arm = 'arm',
	Chest = 'chest',
	Leg = 'leg',
	ClassItem = 'classItem'
}

// Intentionally exclude classItem. Will need to rework
export const ArmorSlots = [
	ArmorSlot.Head,
	ArmorSlot.Arm,
	ArmorSlot.Chest,
	ArmorSlot.Leg
];

const DestinyClassHashToDestinyClassName = {
	[DestinyClass.Titan]: DestinyClassName.Titan,
	[DestinyClass.Hunter]: DestinyClassName.Hunter,
	[DestinyClass.Warlock]: DestinyClassName.Warlock
};

const DestinyItemBucketToArmorSlot = {
	[BucketHashes.Helmet]: ArmorSlot.Head,
	[BucketHashes.Gauntlets]: ArmorSlot.Arm,
	[BucketHashes.ChestArmor]: ArmorSlot.Chest,
	[BucketHashes.LegArmor]: ArmorSlot.Leg,
	[BucketHashes.ClassArmor]: ArmorSlot.ClassItem
};

export type ArmorExoticSplit = {
	exotic: ArmorItem[];
	nonExotic: ArmorItem[];
};

export type ArmorGroup = {
	[ArmorSlot.Head]: ArmorExoticSplit;
	[ArmorSlot.Arm]: ArmorExoticSplit;
	[ArmorSlot.Chest]: ArmorExoticSplit;
	[ArmorSlot.Leg]: ArmorExoticSplit;
	[ArmorSlot.ClassItem]: ArmorExoticSplit;
};

export type Armor = {
	[DestinyClassName.Titan]: ArmorGroup;
	[DestinyClassName.Hunter]: ArmorGroup;
	[DestinyClassName.Warlock]: ArmorGroup;
};

export type ArmorItem = {
	// Is this piece of armor exotic
	isExotic: boolean;
	// The english display name
	name: string;
	// The path to icon url
	icon: string;
	// Unique id for this particular piece of armor
	id: string;
	// Sum of all base stats
	baseStatTotal: number;
	// Power level
	power: number;
	// List of stats [mobility, resilience, recovery, discipline, intellect, strength]
	stats: StatList;
	// One of [head, arm, chest, leg, classItem]
	type: ArmorSlot;
	// Non-unique identifier. For example all 'Necrotic Grip' items will have the same hash
	hash: number;
	// The english display name of the class [titan, warlock, hunter]
	characterClass: DestinyClassName;
	// breakerType: ??? TODO: Do exotics have a breaker type set? I think some should
	// exoticDescription: string TODO: Figure out how to add this
};

const DestinyArmorTypeToArmorSlot = {
	Helmet: ArmorSlot.Head,
	Gauntlets: ArmorSlot.Arm,
	Chest: ArmorSlot.Chest,
	Leg: ArmorSlot.Leg,
	ClassItem: ArmorSlot.ClassItem
};

const DestinyClassToDestinyClassName = {
	Titan: DestinyClassName.Titan,
	Warlock: DestinyClassName.Warlock,
	Hunter: DestinyClassName.Hunter
};

export type AvailableExoticArmor = {
	[DestinyClassName.Titan]: AvailableExoticArmorGroup;
	[DestinyClassName.Hunter]: AvailableExoticArmorGroup;
	[DestinyClassName.Warlock]: AvailableExoticArmorGroup;
};

export type AvailableExoticArmorItem = {
	hash: number;
	name: string;
	count: number;
	icon: string;
	// TODO: Maybe this would be an ez way to pre-filter out exotics when
	// there is no masterworked instance of that exotic?
	// hasMasterworkedVariant: boolean
};

// TODO: Clean up the naming conventions around armor and available exotic armor
export type AvailableExoticArmorGroup = {
	[ArmorSlot.Head]: AvailableExoticArmorItem[];
	[ArmorSlot.Arm]: AvailableExoticArmorItem[];
	[ArmorSlot.Chest]: AvailableExoticArmorItem[];
	[ArmorSlot.Leg]: AvailableExoticArmorItem[];
};

export const generateAvailableExoticArmorGroup =
	(): AvailableExoticArmorGroup => {
		return {
			[ArmorSlot.Head]: [],
			[ArmorSlot.Arm]: [],
			[ArmorSlot.Chest]: [],
			[ArmorSlot.Leg]: []
		};
	};

export const extractArmor = (
	stores: DimStore<DimItem>[]
): [Armor, AvailableExoticArmor] => {
	const armor: Armor = {
		[DestinyClassName.Titan]: generateArmorGroup(),
		[DestinyClassName.Hunter]: generateArmorGroup(),
		[DestinyClassName.Warlock]: generateArmorGroup()
	};

	const availableExoticArmor: AvailableExoticArmor = {
		[DestinyClassName.Titan]: generateAvailableExoticArmorGroup(),
		[DestinyClassName.Hunter]: generateAvailableExoticArmorGroup(),
		[DestinyClassName.Warlock]: generateAvailableExoticArmorGroup()
	};

	const seenExotics: Record<
		number,
		AvailableExoticArmorItem & {
			type: ArmorSlot;
			characterClass: DestinyClassName;
		}
	> = {};

	stores.forEach(({ items }) => {
		items.forEach((item) => {
			if (item.location.inArmor) {
				const destinyClassName =
					DestinyClassHashToDestinyClassName[item.classType];
				const armorSlot = DestinyItemBucketToArmorSlot[item.bucket.hash];

				if (item.isExotic) {
					if (seenExotics[item.hash]) {
						seenExotics[item.hash].count++;
					} else {
						seenExotics[item.hash] = {
							hash: item.hash,
							name: item.name,
							icon: item.icon,
							type: DestinyArmorTypeToArmorSlot[item.type],
							characterClass:
								DestinyClassToDestinyClassName[item.classTypeNameLocalized],
							count: 1
						};
					}
				}
				const armorItem: ArmorItem = {
					isExotic: item.isExotic,
					name: item.name,
					icon: bungieNetPath(item.icon),
					id: item.id,
					// TODO: checking 'Stats.Total' is jank
					baseStatTotal: item.stats.find(
						(x) => x.displayProperties.name === 'Stats.Total'
					).base,
					power: item.power,
					// TODO: checking 'Stats.Total' is jank
					stats: item.stats
						.filter((x) => x.displayProperties.name !== 'Stats.Total')
						.map((x) => x.base) as StatList,
					type: DestinyArmorTypeToArmorSlot[item.type],
					hash: item.hash,
					characterClass:
						DestinyClassToDestinyClassName[item.classTypeNameLocalized]
				};
				if (item.isExotic) {
					armor[destinyClassName][armorSlot].exotic.push(armorItem);
				} else {
					armor[destinyClassName][armorSlot].nonExotic.push(armorItem);
				}
			}
		});
	});

	Object.values(seenExotics).forEach((exotic) => {
		availableExoticArmor[exotic.characterClass][exotic.type].push({
			name: exotic.name,
			hash: exotic.hash,
			count: exotic.count,
			icon: bungieNetPath(exotic.icon)
		});
	});

	return [armor, availableExoticArmor];
};

// export const generateCharacter = (): Character => {

// }

type Character = {
	// background image
	background: string;
	className: DestinyClassName;
	// e.g 'Exo Male'
	genderRace: string;
	// TODO: What's the difference between this and the background image
	icon: string;
	// Unique identifier
	id: string;
	// lastPlayed: string;
	// TODO: Add more sugar here... like gilded title stuff
};

export type Characters = Character[];

export const extractCharacters = (stores: DimStore<DimItem>[]): Characters => {
	const characters: Characters = [];
	stores
		.filter((store) => store.id !== 'vault')
		.forEach((store) => {
			const character: Character = {
				background: store.background,
				className: DestinyClassToDestinyClassName[store.className],
				genderRace: store.genderRace,
				icon: store.icon,
				id: store.id
				// lastPlayed: store.lastPlayed.toISOString()
			};
			characters.push(character);
		});
	return characters;
};
