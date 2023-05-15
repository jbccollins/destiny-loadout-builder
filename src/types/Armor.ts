import { cloneDeep } from 'lodash';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EElementId,
	EGearTierId,
	EIntrinsicArmorPerkOrAttributeId,
	EMasterworkAssumption,
	ERaidAndNightMareModTypeId,
} from './IdEnums';

/***** Extra *****/
export const ArmorElementIdList = [
	EElementId.Arc,
	EElementId.Solar,
	EElementId.Void,
	EElementId.Stasis,
];

/********** Armor is all the armor that the user has *********/
// [STORED]: Used to store all the armor that the user has
export type Armor = {
	[EDestinyClassId.Titan]: ArmorGroup;
	[EDestinyClassId.Hunter]: ArmorGroup;
	[EDestinyClassId.Warlock]: ArmorGroup;
};

// Group armor by ArmorSlot
export type ArmorGroup = {
	[EArmorSlotId.Head]: ArmorRaritySplit;
	[EArmorSlotId.Arm]: ArmorRaritySplit;
	[EArmorSlotId.Chest]: ArmorRaritySplit;
	[EArmorSlotId.Leg]: ArmorRaritySplit;
	[EArmorSlotId.ClassItem]: ArmorRaritySplit;
};

// In a lot of places it's convenient to have armor already split out by
// exotic vs nonExotic so we shape our data that way from the start
export type ArmorRaritySplit = {
	exotic: Record<string, ArmorItem>;
	nonExotic: Record<string, ArmorItem>;
};

// Data about each individual piece of armor
export type ArmorItem = {
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
	armorSlot: EArmorSlotId;
	// Non-unique identifier. For example all 'Necrotic Grip' items will have the same hash
	hash: number;
	// The english display name of the class [titan, warlock, hunter]
	destinyClassName: EDestinyClassId;
	// breakerType: ??? TODO: Do exotics have a breaker type set? I think some should
	// exoticDescription: string TODO: Figure out how to add this
	// Is this armor masterworked
	isMasterworked: boolean;
	// Exotic, Legendary, Rare, etc...
	gearTierId: EGearTierId;
	// Is this a piece of artifice armor
	isArtifice: boolean;
	// What raid mods can go on this piece of armor
	socketableRaidAndNightmareModTypeId: ERaidAndNightMareModTypeId;
	// Special traits like "is iron banner", "is guardian games", etc...
	intrinsicArmorPerkOrAttributeId: EIntrinsicArmorPerkOrAttributeId;
};

/********** AvailableExoticArmor is all the exotic armor that the user has ***********/
// TODO: Could we do this more cleanly by pulling from the Armor directly? I think this is probably
// fine though. It's a bit more explicit and easier to code with, even if it isn't very DRY.
// [STORED] All available exotic armor
export type AvailableExoticArmor = {
	[EDestinyClassId.Titan]: AvailableExoticArmorGroup;
	[EDestinyClassId.Hunter]: AvailableExoticArmorGroup;
	[EDestinyClassId.Warlock]: AvailableExoticArmorGroup;
};

// Group available exotic armor by ArmorSlot
export type AvailableExoticArmorGroup = {
	[EArmorSlotId.Head]: AvailableExoticArmorItem[];
	[EArmorSlotId.Arm]: AvailableExoticArmorItem[];
	[EArmorSlotId.Chest]: AvailableExoticArmorItem[];
	[EArmorSlotId.Leg]: AvailableExoticArmorItem[];
};

// TODO: I think we only really need the hash here.
// It would be easy enough to look it up on click given that we know
// the selected class and the slot
export type AvailableExoticArmorItem = {
	hash: number;
	name: string;
	count: number;
	icon: string;
	armorSlot: EArmorSlotId;
	destinyClassName: EDestinyClassId;
	// TODO: Maybe this would be an ez way to pre-filter out exotics when
	// there is no masterworked instance of that exotic?
	// hasMasterworkedVariant: boolean
};

const defaultAvailableExoticArmorItem: AvailableExoticArmorItem = {
	hash: 0,
	name: '',
	count: 1,
	icon: '',
	armorSlot: EArmorSlotId.Head,
	destinyClassName: EDestinyClassId.Warlock,
};

export const getDefaultAvailableExoticArmorItem = () =>
	cloneDeep(defaultAvailableExoticArmorItem);

/********* Utility functions for generating empty bases to work with **********/
export const generateAvailableExoticArmorGroup =
	(): AvailableExoticArmorGroup => {
		return {
			[EArmorSlotId.Head]: [],
			[EArmorSlotId.Arm]: [],
			[EArmorSlotId.Chest]: [],
			[EArmorSlotId.Leg]: [],
		};
	};

export type ArmorMaxStatsMetadata = Record<
	EArmorStatId,
	{ max: number; withMasterwork: boolean }
>;

export type ArmorCountMaxStatsMetadata = {
	count: number;
	maxStats: ArmorMaxStatsMetadata;
};

export type ArmorSlotMetadata = {
	count: number;
	items: Record<EArmorSlotId, ArmorCountMaxStatsMetadata>;
};

export type ArmorMetadataItem = {
	nonExotic: {
		count: number;
		legendary: ArmorSlotMetadata;
		rare: ArmorSlotMetadata;
	};
	exotic: {
		count: number;
		items: Record<EArmorSlotId, Record<string, ArmorCountMaxStatsMetadata>>;
	};
	artifice: ArmorSlotMetadata;
	extraSocket: {
		count: number;
		items: Partial<Record<ERaidAndNightMareModTypeId, ArmorSlotMetadata>>;
	};
	classItem: {
		hasLegendaryClassItem: boolean;
		hasMasterworkedLegendaryClassItem: boolean;
		hasArtificeClassItem: boolean;
		hasMasterworkedArtificeClassItem: boolean;
	};
};

const defaultArmorMaxStatsMetadata: ArmorMaxStatsMetadata = {
	[EArmorStatId.Mobility]: { max: 0, withMasterwork: false },
	[EArmorStatId.Resilience]: { max: 0, withMasterwork: false },
	[EArmorStatId.Recovery]: { max: 0, withMasterwork: false },
	[EArmorStatId.Discipline]: { max: 0, withMasterwork: false },
	[EArmorStatId.Intellect]: { max: 0, withMasterwork: false },
	[EArmorStatId.Strength]: { max: 0, withMasterwork: false },
};

export const getDefaultArmorMaxStatsMetadata = () =>
	cloneDeep(defaultArmorMaxStatsMetadata);

const defaultArmorCountMaxStatsMetadata: ArmorCountMaxStatsMetadata = {
	count: 0,
	maxStats: getDefaultArmorMaxStatsMetadata(),
};
export const getDefaultArmorCountMaxStatsMetadata = () =>
	cloneDeep(defaultArmorCountMaxStatsMetadata);

const defaultArmorSlotMetadata: ArmorSlotMetadata = {
	count: 0,
	items: {
		[EArmorSlotId.Head]: {
			count: 0,
			maxStats: getDefaultArmorMaxStatsMetadata(),
		},
		[EArmorSlotId.Arm]: {
			count: 0,
			maxStats: getDefaultArmorMaxStatsMetadata(),
		},
		[EArmorSlotId.Chest]: {
			count: 0,
			maxStats: getDefaultArmorMaxStatsMetadata(),
		},
		[EArmorSlotId.Leg]: {
			count: 0,
			maxStats: getDefaultArmorMaxStatsMetadata(),
		},
		[EArmorSlotId.ClassItem]: {
			count: 0,
			maxStats: getDefaultArmorMaxStatsMetadata(),
		},
	},
};
const getDefaultArmorSlotMetadata = () => cloneDeep(defaultArmorSlotMetadata);

const ArmorMetadataItem: ArmorMetadataItem = {
	nonExotic: {
		count: 0,
		legendary: getDefaultArmorSlotMetadata(),
		rare: getDefaultArmorSlotMetadata(),
	},
	exotic: {
		count: 0,
		items: {
			[EArmorSlotId.Head]: {},
			[EArmorSlotId.Arm]: {},
			[EArmorSlotId.Chest]: {},
			[EArmorSlotId.Leg]: {},
			[EArmorSlotId.ClassItem]: {},
		},
	},
	artifice: getDefaultArmorSlotMetadata(),
	extraSocket: {
		count: 0,
		items: {
			[ERaidAndNightMareModTypeId.LastWish]: getDefaultArmorSlotMetadata(),
			[ERaidAndNightMareModTypeId.GardenOfSalvation]:
				getDefaultArmorSlotMetadata(),
			[ERaidAndNightMareModTypeId.DeepStoneCrypt]:
				getDefaultArmorSlotMetadata(),
			[ERaidAndNightMareModTypeId.VaultOfGlass]: getDefaultArmorSlotMetadata(),
			[ERaidAndNightMareModTypeId.VowOfTheDisciple]:
				getDefaultArmorSlotMetadata(),
			[ERaidAndNightMareModTypeId.KingsFall]: getDefaultArmorSlotMetadata(),
			[ERaidAndNightMareModTypeId.RootOfNightmares]:
				getDefaultArmorSlotMetadata(),
			[ERaidAndNightMareModTypeId.NightmareHunt]: getDefaultArmorSlotMetadata(),
		},
	},
	classItem: {
		hasLegendaryClassItem: false,
		hasMasterworkedLegendaryClassItem: false,
		hasArtificeClassItem: false,
		hasMasterworkedArtificeClassItem: false,
	},
};

const getDefaultArmorMetadataItem = () => cloneDeep(ArmorMetadataItem);

export type ArmorMetadata = Record<EDestinyClassId, ArmorMetadataItem>;

const defaultArmorMetadata: ArmorMetadata = {
	[EDestinyClassId.Hunter]: getDefaultArmorMetadataItem(),
	[EDestinyClassId.Warlock]: getDefaultArmorMetadataItem(),
	[EDestinyClassId.Titan]: getDefaultArmorMetadataItem(),
};

export const getDefaultArmorMetadata = () => cloneDeep(defaultArmorMetadata);

export type ItemCounts = Partial<Record<ERaidAndNightMareModTypeId, number>> & {
	artifice: number;
};

const defaultItemCounts: ItemCounts = {
	[ERaidAndNightMareModTypeId.LastWish]: 0,
	[ERaidAndNightMareModTypeId.GardenOfSalvation]: 0,
	[ERaidAndNightMareModTypeId.DeepStoneCrypt]: 0,
	[ERaidAndNightMareModTypeId.VaultOfGlass]: 0,
	[ERaidAndNightMareModTypeId.VowOfTheDisciple]: 0,
	[ERaidAndNightMareModTypeId.KingsFall]: 0,
	[ERaidAndNightMareModTypeId.RootOfNightmares]: 0,
	[ERaidAndNightMareModTypeId.NightmareHunt]: 0,
	artifice: 0,
};

export const getDefaultItemCounts = (): ItemCounts =>
	cloneDeep(defaultItemCounts);

// TODO: Maybe do this on a loop over EArmorSlot?
export const generateArmorGroup = (): ArmorGroup => {
	return {
		[EArmorSlotId.Head]: { exotic: {}, nonExotic: {} },
		[EArmorSlotId.Arm]: { exotic: {}, nonExotic: {} },
		[EArmorSlotId.Chest]: { exotic: {}, nonExotic: {} },
		[EArmorSlotId.Leg]: { exotic: {}, nonExotic: {} },
		[EArmorSlotId.ClassItem]: { exotic: {}, nonExotic: {} },
	};
};

/***** Extras  *****/
// TODO: All of this is used in the armor-processing file. Figure out a better home for this stuff

export interface IDestinyItem {
	// Unique identifier for this specific piece of armor.
	id: string;
	// Non-unique identifier. All "Crest of Alpha Lupi" armor pieces will have the same hash.
	hash: number;
}

// // "extend" the DestinyItem type
// export interface IArmorItem extends IDestinyItem {
// 	// Mobility, Resilience, Recovery, Discipline, Intellect, Strength
// 	stats: StatList;
// 	// Is this piece of armor Exotic, Legendary, etc...
// 	gearTierId: EGearTierId;
// 	// Is this piece of armor masterworked
// 	isMasterworked: boolean;
// 	// Is this a piece of artifice armor
// 	isArtifice: boolean;
// }

export type StatList = [number, number, number, number, number, number];

// Strictly enforce the length of this array [Heads, Arms, Chests, Legs]
export type StrictArmorItems = [
	ArmorItem[],
	ArmorItem[],
	ArmorItem[],
	ArmorItem[]
];

// We don't export this type... only in this file should we be able to use non-strict armor items
// Otherwise we MUST pass in an array of length 4 for each [Heads, Arms, Chests, Legs]
export type ArmorItems = ArmorItem[];

// Four armor ids [Heads, Arms, Chests, Legs]
export type ArmorIdList = [string, string, string, string];

export interface ISelectedExoticArmor {
	hash: number;
	armorSlot: EArmorSlotId;
}

// Masterworking adds +2 to each stat
export const getExtraMasterworkedStats = (
	{ isMasterworked, gearTierId }: ArmorItem,
	masterworkAssumption: EMasterworkAssumption
) =>
	isMasterworked ||
	(gearTierId === EGearTierId.Exotic &&
		masterworkAssumption === EMasterworkAssumption.All) ||
	(gearTierId === EGearTierId.Legendary &&
		(masterworkAssumption === EMasterworkAssumption.All ||
			masterworkAssumption === EMasterworkAssumption.Legendary))
		? 2
		: 0;
