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

export const EXOTIC_CLASS_ITEM = 'Exotic Class Item';

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
	// Is this piece of armor the collections version
	isCollectible: boolean;
	// Is this piece of armor locked in-game
	isLocked: boolean;
};

export const getDefaultArmorItem = (): ArmorItem => ({
	name: '',
	icon: '',
	id: '',
	baseStatTotal: 0,
	power: 0,
	stats: [0, 0, 0, 0, 0, 0],
	armorSlot: EArmorSlotId.Head,
	hash: 0,
	destinyClassName: EDestinyClassId.Warlock,
	isMasterworked: false,
	gearTierId: EGearTierId.Legendary,
	isArtifice: false,
	socketableRaidAndNightmareModTypeId: null,
	intrinsicArmorPerkOrAttributeId: null,
	isCollectible: false,
	isLocked: false,
});

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

export type ExoticPerk = {
	name: string;
	description: string;
	hash: number;
	icon: string;
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
	exoticPerk: ExoticPerk | null;
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
	exoticPerk: null,
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

export type ClassItemMetadata = {
	hasMasterworkedVariant: boolean;
	items: ArmorItem[];
};

export type DestinyClassToAllClassItemMetadataMapping = Record<
	EDestinyClassId,
	AllClassItemMetadata
>;

export const getDefaultDestinyClassToAllClassItemMetadataMapping =
	(): DestinyClassToAllClassItemMetadataMapping => ({
		[EDestinyClassId.Hunter]: getDefaultAllClassItemMetadata(),
		[EDestinyClassId.Warlock]: getDefaultAllClassItemMetadata(),
		[EDestinyClassId.Titan]: getDefaultAllClassItemMetadata(),
	});

export type AllClassItemMetadata = Record<
	ERaidAndNightMareModTypeId,
	ClassItemMetadata
> &
	Record<EIntrinsicArmorPerkOrAttributeId, ClassItemMetadata> & {
		Artifice: ClassItemMetadata;
		Legendary: ClassItemMetadata;
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
	raidAndNightmare: {
		count: number;
		items: Partial<Record<ERaidAndNightMareModTypeId, ArmorSlotMetadata>>;
	};
	intrinsicArmorPerkOrAttribute: {
		count: number;
		items: Partial<Record<EIntrinsicArmorPerkOrAttributeId, ArmorSlotMetadata>>;
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

const getDefaultClassItemMetadata = (): ClassItemMetadata => ({
	hasMasterworkedVariant: false,
	items: [],
});

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
	raidAndNightmare: {
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
			[ERaidAndNightMareModTypeId.CrotasEnd]: getDefaultArmorSlotMetadata(),
			[ERaidAndNightMareModTypeId.NightmareHunt]: getDefaultArmorSlotMetadata(),
		},
	},
	intrinsicArmorPerkOrAttribute: {
		count: 0,
		items: {
			[EIntrinsicArmorPerkOrAttributeId.GuardianGames]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.HalloweenMask]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.IronBanner]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.PlunderersTrappings]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.QueensFavor]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.SeraphSensorArray]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.UniformedOfficer]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.VisageOfTheReaper]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.SonarAmplifier]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.ExhumedExcess]:
				getDefaultArmorSlotMetadata(),
			[EIntrinsicArmorPerkOrAttributeId.AscendantProtector]:
				getDefaultArmorSlotMetadata(),
		},
	},
};

const allClassItemMetadata: AllClassItemMetadata = {
	[EIntrinsicArmorPerkOrAttributeId.GuardianGames]:
		getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.HalloweenMask]:
		getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.IronBanner]: getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.PlunderersTrappings]:
		getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.QueensFavor]: getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.SeraphSensorArray]:
		getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.UniformedOfficer]:
		getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.VisageOfTheReaper]:
		getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.SonarAmplifier]:
		getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.ExhumedExcess]:
		getDefaultClassItemMetadata(),
	[EIntrinsicArmorPerkOrAttributeId.AscendantProtector]:
		getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.LastWish]: getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.GardenOfSalvation]: getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.DeepStoneCrypt]: getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.VaultOfGlass]: getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.VowOfTheDisciple]: getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.KingsFall]: getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.RootOfNightmares]: getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.CrotasEnd]: getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.SalvationsEdge]: getDefaultClassItemMetadata(),
	[ERaidAndNightMareModTypeId.NightmareHunt]: getDefaultClassItemMetadata(),
	Legendary: getDefaultClassItemMetadata(),
	Artifice: getDefaultClassItemMetadata(),
};
export const getDefaultAllClassItemMetadata = () =>
	cloneDeep(allClassItemMetadata);

export const getDefaultArmorMetadataItem = () => cloneDeep(ArmorMetadataItem);

export type ArmorMetadata = Record<EDestinyClassId, ArmorMetadataItem>;

const defaultArmorMetadata: ArmorMetadata = {
	[EDestinyClassId.Hunter]: getDefaultArmorMetadataItem(),
	[EDestinyClassId.Warlock]: getDefaultArmorMetadataItem(),
	[EDestinyClassId.Titan]: getDefaultArmorMetadataItem(),
};

export const getDefaultArmorMetadata = () => cloneDeep(defaultArmorMetadata);

export type ItemCounts = Partial<Record<ERaidAndNightMareModTypeId, number>> &
	Partial<Record<EIntrinsicArmorPerkOrAttributeId, number>> & {
		Artifice: number;
		Legendary: number;
	};

const defaultItemCounts: ItemCounts = {
	[ERaidAndNightMareModTypeId.LastWish]: 0,
	[ERaidAndNightMareModTypeId.GardenOfSalvation]: 0,
	[ERaidAndNightMareModTypeId.DeepStoneCrypt]: 0,
	[ERaidAndNightMareModTypeId.VaultOfGlass]: 0,
	[ERaidAndNightMareModTypeId.VowOfTheDisciple]: 0,
	[ERaidAndNightMareModTypeId.KingsFall]: 0,
	[ERaidAndNightMareModTypeId.RootOfNightmares]: 0,
	[ERaidAndNightMareModTypeId.CrotasEnd]: 0,
	[ERaidAndNightMareModTypeId.NightmareHunt]: 0,
	[EIntrinsicArmorPerkOrAttributeId.GuardianGames]: 0,
	[EIntrinsicArmorPerkOrAttributeId.HalloweenMask]: 0,
	[EIntrinsicArmorPerkOrAttributeId.IronBanner]: 0,
	[EIntrinsicArmorPerkOrAttributeId.PlunderersTrappings]: 0,
	[EIntrinsicArmorPerkOrAttributeId.QueensFavor]: 0,
	[EIntrinsicArmorPerkOrAttributeId.SeraphSensorArray]: 0,
	[EIntrinsicArmorPerkOrAttributeId.UniformedOfficer]: 0,
	[EIntrinsicArmorPerkOrAttributeId.VisageOfTheReaper]: 0,
	[EIntrinsicArmorPerkOrAttributeId.SonarAmplifier]: 0,
	[EIntrinsicArmorPerkOrAttributeId.ExhumedExcess]: 0,
	[EIntrinsicArmorPerkOrAttributeId.AscendantProtector]: 0,
	Artifice: 0,
	Legendary: 0,
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
