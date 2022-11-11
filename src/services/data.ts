import { BucketHashes, StatHashes } from '@dlb/dim/data/d2/generated-enums';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import {
	DestinyClass,
	DestinyEnergyType
} from 'bungie-api-ts-no-const-enum/destiny2';

import { StatList } from './armor-processing';
import { bungieNetPath } from '@dlb/utils/item-utils';

export type EnumDictionary<T extends string | symbol | number, U> = {
	[K in T]: U;
};

/******** Enums to standardize common usage of several terms ********/
export enum EDestinyClass {
	Titan = 'titan',
	Warlock = 'warlock',
	Hunter = 'hunter'
}

export enum EArmorSlot {
	Head = 'head',
	Arm = 'arm',
	Chest = 'chest',
	Leg = 'leg',
	ClassItem = 'classItem'
}

export enum EArmorStat {
	Mobility = 'mobility',
	Resilience = 'resilience',
	Recovery = 'recovery',
	Discipline = 'discipline',
	Intellect = 'intellect',
	Strength = 'strength'
}

export enum EArmorElementalAffinity {
	Arc = 'arc',
	Solar = 'solar',
	Void = 'void',
	Stasis = 'stasis',
	// Strand = 'strand',
	Any = 'any'
}

export enum EArmorExtraModSlot {
	KingsFall = 'KF',
	VowOfTheDisciple = 'VotD',
	VaultOfGlass = 'VoG',
	DeepStoneCrypt = 'DSC',
	GardenOfSalvation = 'GoS',
	LastWish = 'LW',
	Artificer = 'Artifice',
	NightmareHunt = 'NH',
	// TODO: These are intrinsic perks, not mod slots. Not sure what to do about these. D2armorpicker supports them tho
	// IronBanner = 'IB',
	// UniformedOfficer = 'UO',
	// PlunderersTrappings = 'PT',
	Any = 'any'
}

export const ArmorExtraModSlotNames: EnumDictionary<
	EArmorExtraModSlot,
	string
> = {
	[EArmorExtraModSlot.Any]: 'Any',
	[EArmorExtraModSlot.NightmareHunt]: 'Nightmare Hunt',
	[EArmorExtraModSlot.Artificer]: 'Artificer',
	[EArmorExtraModSlot.LastWish]: 'Last Wish',
	[EArmorExtraModSlot.GardenOfSalvation]: 'Garden of Salvation',
	[EArmorExtraModSlot.DeepStoneCrypt]: 'Deep Stone Crypt',
	[EArmorExtraModSlot.VaultOfGlass]: 'Vault of Glass',
	[EArmorExtraModSlot.VowOfTheDisciple]: 'Vow of the Disciple',
	//[EArmorExtraModSlot.PerkIronBanner]: "Iron Banner Perk",
	// [EArmorExtraModSlot.PerkUniformedOfficer]: "Uniformed Officer",
	[EArmorExtraModSlot.KingsFall]: "King's Fall"
	// [EArmorExtraModSlot.PerkPlunderersTrappings]: "Plunderer's Trappings",
	// [EArmorExtraModSlot.COUNT]: "",
};

// TODO: Fix the images for a few of the newer sockets
export const ArmorExtraModSlotIcons: EnumDictionary<
	EArmorExtraModSlot,
	string
> = {
	[EArmorExtraModSlot.Any]:
		'https://www.bungie.net/img/misc/missing_icon_d2.png',
	[EArmorExtraModSlot.NightmareHunt]:
		'https://bungie.net/common/destiny2_content/icons/6bf9ba37386b907ddb514ec422fc74c9.png',
	[EArmorExtraModSlot.Artificer]:
		'https://bungie.net/common/destiny2_content/icons/74aeb2f3d7bc16a31a6924822f850184.png',
	[EArmorExtraModSlot.LastWish]:
		'https://bungie.net/common/destiny2_content/icons/c70116144be386def9e675d76dacfe64.png',
	[EArmorExtraModSlot.GardenOfSalvation]:
		'https://bungie.net/common/destiny2_content/icons/6bf9ba37386b907ddb514ec422fc74c9.png',
	[EArmorExtraModSlot.DeepStoneCrypt]:
		'https://bungie.net/common/destiny2_content/icons/3c14e3c3a747a7487c76f38602b9e2fe.png',
	[EArmorExtraModSlot.VaultOfGlass]:
		'https://bungie.net/common/destiny2_content/icons/9603e0d01826d7ab97ce1b1bf3eb3c96.png',
	[EArmorExtraModSlot.VowOfTheDisciple]:
		'https://www.bungie.net//common/destiny2_content/icons/1f66fa02b19f40e6ce5d8336c7ed5a00.png',
	// [EArmorExtraModSlot.PerkIronBanner]: "https://bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_fe57052d7cf971f7502daa75a2ca2437.png",
	// [EArmorExtraModSlot.PerkUniformedOfficer]: "https://bungie.net/common/destiny2_content/icons/b39b83dd5ea3d9144e4e63f103af8b46.png",
	[EArmorExtraModSlot.KingsFall]:
		// 'https://bungie.net/common/destiny2_content/icons/b4d05ef69d0c3227a7d4f7f35bbc2848.png'
		'https://www.bungie.net/common/destiny2_content/icons/bc809878e0c2ed8fd32feb62aaae690c.png'
	// [EArmorExtraModSlot.PerkPlunderersTrappings]: "https://www.bungie.net/common/destiny2_content/icons/d7ad8979dab2f4544e2cfb66f262f7d1.png",
	// [EArmorExtraModSlot.COUNT]: "",
};

export const ArmorElementalAffinityIcons: EnumDictionary<
	EArmorElementalAffinity,
	string
> = {
	[EArmorElementalAffinity.Any]:
		'https://www.bungie.net/img/misc/missing_icon_d2.png',
	[EArmorElementalAffinity.Arc]:
		'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_092d066688b879c807c3b460afdd61e6.png',
	[EArmorElementalAffinity.Solar]:
		'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png',
	[EArmorElementalAffinity.Void]:
		'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png',
	[EArmorElementalAffinity.Stasis]:
		'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png'
	// [DestinyEnergyType.Ghost]: "",
	// [DestinyEnergyType.Subclass]: ""
};

/******** Lists of the enums above to make iteration easier. Iteration
 * over enums in typescript is awful. ORDER MATTERS FOR THESE DO NOT CHANGE. ********/
export const DestinyClasses = [
	EDestinyClass.Titan,
	EDestinyClass.Warlock,
	EDestinyClass.Hunter
];

// Intentionally exclude classItem for now. Will need to rework
export const ArmorSlots = [
	EArmorSlot.Head,
	EArmorSlot.Arm,
	EArmorSlot.Chest,
	EArmorSlot.Leg
];

export const ArmorStats = [
	EArmorStat.Mobility,
	EArmorStat.Resilience,
	EArmorStat.Recovery,
	EArmorStat.Discipline,
	EArmorStat.Intellect,
	EArmorStat.Strength
];

export const ArmorElementalAffinities = [
	EArmorElementalAffinity.Any,
	EArmorElementalAffinity.Arc,
	EArmorElementalAffinity.Solar,
	EArmorElementalAffinity.Void,
	EArmorElementalAffinity.Stasis
];

export const ArmorExtraModSlots = [
	EArmorExtraModSlot.Any,
	EArmorExtraModSlot.Artificer,
	EArmorExtraModSlot.KingsFall,
	EArmorExtraModSlot.VowOfTheDisciple,
	EArmorExtraModSlot.DeepStoneCrypt,
	EArmorExtraModSlot.GardenOfSalvation,
	EArmorExtraModSlot.LastWish,
	EArmorExtraModSlot.NightmareHunt
];

/********* Mapping manifest hashes to our own enums *********/
// TODO these kinds of mappings don't seem to be type safe.
// Convert these to getter functions
const DestinyClassHashToDestinyClass = {
	[DestinyClass.Titan]: EDestinyClass.Titan,
	[DestinyClass.Hunter]: EDestinyClass.Hunter,
	[DestinyClass.Warlock]: EDestinyClass.Warlock
};

const BucketHashToArmorSlot = {
	[BucketHashes.Helmet]: EArmorSlot.Head,
	[BucketHashes.Gauntlets]: EArmorSlot.Arm,
	[BucketHashes.ChestArmor]: EArmorSlot.Chest,
	[BucketHashes.LegArmor]: EArmorSlot.Leg,
	[BucketHashes.ClassArmor]: EArmorSlot.ClassItem
};

// Get the english name for an armor stat
const StatHashToArmorStat = {
	[StatHashes.Mobility]: EArmorStat.Mobility,
	[StatHashes.Resilience]: EArmorStat.Resilience,
	[StatHashes.Recovery]: EArmorStat.Recovery,
	[StatHashes.Discipline]: EArmorStat.Discipline,
	[StatHashes.Intellect]: EArmorStat.Intellect,
	[StatHashes.Strength]: EArmorStat.Strength
};

const DestinyEnergyTypeToArmorElementalAffinity = {
	[DestinyEnergyType.Arc]: EArmorElementalAffinity.Arc,
	[DestinyEnergyType.Thermal]: EArmorElementalAffinity.Solar,
	[DestinyEnergyType.Void]: EArmorElementalAffinity.Void,
	[DestinyEnergyType.Stasis]: EArmorElementalAffinity.Stasis,
	[DestinyEnergyType.Any]: EArmorElementalAffinity.Any
	// [DestinyEnergyType.Strand]: EArmorElementalAffinity.Strand,
};

/******** Convert Bungie/DIM strings/ids/enums into our own enums *********/
const DestinyArmorTypeToArmorSlot = {
	Helmet: EArmorSlot.Head,
	Gauntlets: EArmorSlot.Arm,
	Chest: EArmorSlot.Chest,
	Leg: EArmorSlot.Leg,
	ClassItem: EArmorSlot.ClassItem
};

const DestinyClassStringToDestinyClass = {
	Titan: EDestinyClass.Titan,
	Warlock: EDestinyClass.Warlock,
	Hunter: EDestinyClass.Hunter
};

// [STORED]: Used to store the stats the the user has configured with the stat picker
export type DesiredArmorStats = {
	[EArmorStat.Mobility]: number;
	[EArmorStat.Resilience]: number;
	[EArmorStat.Recovery]: number;
	[EArmorStat.Discipline]: number;
	[EArmorStat.Intellect]: number;
	[EArmorStat.Strength]: number;
};

/********** Armor is all the armor that the user has *********/
// [STORED]: Used to store all the armor that the user has
export type Armor = {
	[EDestinyClass.Titan]: ArmorGroup;
	[EDestinyClass.Hunter]: ArmorGroup;
	[EDestinyClass.Warlock]: ArmorGroup;
};

// Group armor by ArmorSlot
export type ArmorGroup = {
	[EArmorSlot.Head]: ArmorRaritySplit;
	[EArmorSlot.Arm]: ArmorRaritySplit;
	[EArmorSlot.Chest]: ArmorRaritySplit;
	[EArmorSlot.Leg]: ArmorRaritySplit;
	[EArmorSlot.ClassItem]: ArmorRaritySplit;
};

// In a lot of places it's convenient to have armor already split out by
// exotic vs nonExotic so we shape our data that way from the start
export type ArmorRaritySplit = {
	exotic: Record<string, ArmorItem>;
	nonExotic: Record<string, ArmorItem>;
};

// Data about each individual piece of armor
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
	armorSlot: EArmorSlot;
	// Non-unique identifier. For example all 'Necrotic Grip' items will have the same hash
	hash: number;
	// The english display name of the class [titan, warlock, hunter]
	destinyClassName: EDestinyClass;
	// breakerType: ??? TODO: Do exotics have a breaker type set? I think some should
	// exoticDescription: string TODO: Figure out how to add this
};

/********** AvailableExoticArmor is all the exotic armor that the user has ***********/
// TODO: Could we do this more cleanly by pulling from the Armor directly? I think this is probably
// fine though. It's a bit more explicit and easier to code with, even if it isn't very DRY.
// [STORED] All available exotic armor
export type AvailableExoticArmor = {
	[EDestinyClass.Titan]: AvailableExoticArmorGroup;
	[EDestinyClass.Hunter]: AvailableExoticArmorGroup;
	[EDestinyClass.Warlock]: AvailableExoticArmorGroup;
};

// Group available exotic armor by ArmorSlot
export type AvailableExoticArmorGroup = {
	[EArmorSlot.Head]: AvailableExoticArmorItem[];
	[EArmorSlot.Arm]: AvailableExoticArmorItem[];
	[EArmorSlot.Chest]: AvailableExoticArmorItem[];
	[EArmorSlot.Leg]: AvailableExoticArmorItem[];
};

export const getArmorSlotDisplayName = (armorSlot: EArmorSlot) => {
	if (armorSlot == EArmorSlot.Head) {
		return 'Helmets';
	}
	if (armorSlot == EArmorSlot.Arm) {
		return 'Gauntlets';
	}
	if (armorSlot == EArmorSlot.Chest) {
		return 'Chest Armor';
	}
	if (armorSlot == EArmorSlot.Leg) {
		return 'Leg Armor';
	}
	if (armorSlot == EArmorSlot.ClassItem) {
		return 'Leg Armor';
	}
	console.error('Invalid armorSlot:', armorSlot);
	return '';
};

// TODO: I think we only really need the hash here.
// It would be easy enough to look it up on click given that we know
// the selected class and the slot
export type AvailableExoticArmorItem = {
	hash: number;
	name: string;
	count: number;
	icon: string;
	armorSlot: EArmorSlot;
	destinyClassName: EDestinyClass;
	// TODO: Maybe this would be an ez way to pre-filter out exotics when
	// there is no masterworked instance of that exotic?
	// hasMasterworkedVariant: boolean
};

/********* Utility functions for generating empty bases to work with **********/
export const generateAvailableExoticArmorGroup =
	(): AvailableExoticArmorGroup => {
		return {
			[EArmorSlot.Head]: [],
			[EArmorSlot.Arm]: [],
			[EArmorSlot.Chest]: [],
			[EArmorSlot.Leg]: []
		};
	};

// TODO: Maybe do this on a loop over EArmorSlot?
export const generateArmorGroup = (): ArmorGroup => {
	return {
		[EArmorSlot.Head]: { exotic: {}, nonExotic: {} },
		[EArmorSlot.Arm]: { exotic: {}, nonExotic: {} },
		[EArmorSlot.Chest]: { exotic: {}, nonExotic: {} },
		[EArmorSlot.Leg]: { exotic: {}, nonExotic: {} },
		[EArmorSlot.ClassItem]: { exotic: {}, nonExotic: {} }
	};
};

// Convert a DimStore into our own, smaller, types and transform the data into the desired shape.
export const extractArmor = (
	stores: DimStore<DimItem>[]
): [Armor, AvailableExoticArmor] => {
	const armor: Armor = {
		[EDestinyClass.Titan]: generateArmorGroup(),
		[EDestinyClass.Hunter]: generateArmorGroup(),
		[EDestinyClass.Warlock]: generateArmorGroup()
	};

	const availableExoticArmor: AvailableExoticArmor = {
		[EDestinyClass.Titan]: generateAvailableExoticArmorGroup(),
		[EDestinyClass.Hunter]: generateAvailableExoticArmorGroup(),
		[EDestinyClass.Warlock]: generateAvailableExoticArmorGroup()
	};

	const seenExotics: Record<number, AvailableExoticArmorItem> = {};

	stores.forEach(({ items }) => {
		items.forEach((item) => {
			if (item.location.inArmor) {
				const destinyClassName = DestinyClassHashToDestinyClass[
					item.classType
				] as EDestinyClass;
				const armorSlot = BucketHashToArmorSlot[item.bucket.hash] as EArmorSlot;

				if (item.isExotic) {
					if (seenExotics[item.hash]) {
						seenExotics[item.hash].count++;
					} else {
						seenExotics[item.hash] = {
							hash: item.hash,
							name: item.name,
							icon: bungieNetPath(item.icon),
							armorSlot: DestinyArmorTypeToArmorSlot[item.type],
							destinyClassName:
								DestinyClassStringToDestinyClass[item.classTypeNameLocalized],
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
					armorSlot: DestinyArmorTypeToArmorSlot[item.type],
					hash: item.hash,
					destinyClassName:
						DestinyClassStringToDestinyClass[item.classTypeNameLocalized]
				};
				if (item.isExotic) {
					armor[destinyClassName][armorSlot].exotic[item.id] = armorItem;
				} else {
					armor[destinyClassName][armorSlot].nonExotic[item.id] = armorItem;
				}
			}
		});
	});

	Object.values(seenExotics)
		// Alphabetical order
		.sort((a, b) => (a.name > b.name ? 1 : -1))
		.forEach((exotic) => {
			availableExoticArmor[exotic.destinyClassName][exotic.armorSlot].push(
				exotic
			);
		});

	return [armor, availableExoticArmor];
};

/********* [STORED] Each character the user has. Up to three of these will exist. *********/
export type Characters = Character[];

export type Character = {
	// background image
	background: string;

	// TODO: Change this to be something other than
	destinyClass: EDestinyClass;
	// e.g 'Exo Male'
	genderRace: string;
	// I think this is a thumbnail for the emblem. May be useful for mobile views?
	icon: string;
	// Unique identifier
	id: string;
	// lastPlayed: string;
	// TODO: Add more sugar here... like gilded title stuff
};

// TODO: It may make more sense to just extract character classes. Like if you have
// two warlocks who cares which warlock you select for a build?
// In fact it may make sense to be able to make a build for a character that you don't have,
// so long as you have enough armor to make such a build. Can DIM support a loadout without
// specifying a character???
export const extractCharacters = (stores: DimStore<DimItem>[]): Characters => {
	const characters: Characters = [];
	stores
		.filter((store) => store.id !== 'vault')
		.forEach((store) => {
			const character: Character = {
				background: store.background,
				destinyClass: DestinyClassStringToDestinyClass[store.className],
				genderRace: store.genderRace,
				icon: store.icon,
				id: store.id
				// lastPlayed: store.lastPlayed.toISOString()
			};
			characters.push(character);
		});
	return characters;
};
