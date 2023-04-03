export enum EAnimalId {
	Dog = 'Dog',
	Cat = 'Cat',
	Lion = 'Lion',
}

export enum EElementId {
	Arc = 'Arc',
	Solar = 'Solar',
	Void = 'Void',
	Stasis = 'Stasis',
	Strand = 'Strand',
	Any = 'Any',
}

export enum EDestinyClassId {
	Titan = 'Titan',
	Warlock = 'Warlock',
	Hunter = 'Hunter',
}

export enum EDestinySubclassId {
	// Warlock
	Stormcaller = 'Stormcaller',
	Dawnblade = 'Dawnblade',
	Voidwalker = 'Voidwalker',
	Shadebinder = 'Shadebinder',
	Broodweaver = 'Broodweaver',
	// Titan
	Striker = 'Striker',
	Sentinel = 'Sentinel',
	Sunbreaker = 'Sunbreaker',
	Behemoth = 'Behemoth',
	Berserker = 'Berserker',
	// Hunter
	Gunslinger = 'Gunslinger',
	Nightstalker = 'Nightstalker',
	Arcstrider = 'Arcstrider',
	Revenant = 'Revenant',
	Threadrunner = 'Threadrunner',
}

export enum EArmorSlotId {
	Head = 'Head',
	Arm = 'Arm',
	Chest = 'Chest',
	Leg = 'Leg',
	ClassItem = 'ClassItem',
}

export enum EArmorStatId {
	Mobility = 'Mobility',
	Resilience = 'Resilience',
	Recovery = 'Recovery',
	Discipline = 'Discipline',
	Intellect = 'Intellect',
	Strength = 'Strength',
}

export enum EArmorExtraModSlotId {
	KingsFall = 'KF',
	VowOfTheDisciple = 'VotD',
	VaultOfGlass = 'VoG',
	DeepStoneCrypt = 'DSC',
	GardenOfSalvation = 'GoS',
	LastWish = 'LW',
	RootOfNightmares = 'RoN',
	Artificer = 'Artifice',
	NightmareHunt = 'NH',
	// TODO: These are intrinsic perks, not mod slots. Not sure what to do about these. D2armorpicker supports them tho
	// IronBanner = 'IB',
	// UniformedOfficer = 'UO',
	// PlunderersTrappings = 'PT',
	Any = 'any',
}

// TODO: Name this like
// All Armor Is Masterworked, Legendary Armor is Masterworked
// No assumption is made
export enum EMasterworkAssumption {
	All = 'All',
	Legendary = 'Legendary',
	None = 'None',
}

export enum EModSocketCategoryId {
	Stat = 'Stat', // e.g. major/minor resilience
	ArtificeStat = 'ArtificeStat', // e.g. resilience-forged
	ArmorSlot = 'ArmorSlot', // e.g. bomber
	Raid = 'Raid',
	// Artifice = 'Artifice',
	// LastWish = 'LastWish',
	// GardenOfSalvation = 'GardenOfSalvation',
	// DeepStoneCrypt = 'DeepStoneCrypt',
	// VaultOfGlass = 'VaultOfGlass',
	// VowOfTheDisciple = 'VowOfTheDisciple',
	// KingsFall = 'KingsFall',
	// Nightmare = 'Nightmare',
}

export enum EModTypeDisplayNameId {
	ArmsArmorMod = 'ArmsArmorMod',
	LegArmorMod = 'LegArmorMod',
	ChestArmorMod = 'ChestArmorMod',
	WarmindCellMod = 'WarmindCellMod',
	GeneralArmorMod = 'GeneralArmorMod',
	HelmetArmorMod = 'HelmetArmorMod',
	ElementalWellMod = 'ElementalWellMod',
	LastWishRaidMod = 'LastWishRaidMod',
	ClassItemArmorMod = 'ClassItemArmorMod',
	VaultofGlassArmorMod = 'VaultofGlassArmorMod',
	ClassItemMod = 'ClassItemMod',
	DeepStoneCryptRaidMod = 'DeepStoneCryptRaidMod',
	KingsFallMod = 'KingsFallMod',
	GardenofSalvationRaidMod = 'GardenofSalvationRaidMod',
	VowoftheDiscipleRaidMod = 'VowoftheDiscipleRaidMod',
	ChargedwithLightMod = 'ChargedwithLightMod',
	NightmareMod = 'NightmareMod',
}

// TODO: These could easily change. Find a better way to generate them so this isn't so fragile
export enum EModCategoryId {
	AmmoFinder = 'AmmoFinder',
	Scavenger = 'Scavenger',
	Reserves = 'Reserves',
	Targeting = 'Targeting',
	Dexterity = 'Dexterity',
	Holster = 'Holster',
	Loader = 'Loader',
	Unflinching = 'Unflinching',
	ChargedWithLight = 'ChargedWithLight',
	ElementalWell = 'ElementalWell',
	WarmindCell = 'WarmindCell',
	LastWish = 'LastWish',
	GardenOfSalvation = 'GardenOfSalvation',
	DeepStoneCrypt = 'DeepStoneCrypt',
	VaultOfGlass = 'VaultOfGlass',
	VowOfTheDisciple = 'VowOfTheDisciple',
	KingsFall = 'KingsFall',
	RootOfNightmares = 'RootOfNightmares',
	Nightmare = 'Nightmare',
	ArmorStat = 'ArmorStat',
	ArtificeArmorStat = 'ArtificeArmorStat',
	General = 'General',
}

// TODO: Is there a better way to subset the EModCategoryId here?
// Maybe just split that enum in two?
export enum EExtraSocketModCategoryId {
	LastWish = EModCategoryId.LastWish,
	GardenOfSalvation = EModCategoryId.GardenOfSalvation,
	DeepStoneCrypt = EModCategoryId.DeepStoneCrypt,
	VaultOfGlass = EModCategoryId.VaultOfGlass,
	VowOfTheDisciple = EModCategoryId.VowOfTheDisciple,
	KingsFall = EModCategoryId.KingsFall,
	RootOfNightmares = EModCategoryId.RootOfNightmares,
	Nightmare = EModCategoryId.Nightmare,
}

export const EExtraSocketModCategoryIdList = Object.values(
	EExtraSocketModCategoryId
);

export enum EGearTierId {
	Exotic = 'Exotic',
	Legendary = 'Legendary',
	Rare = 'Rare',
	Uncommon = 'Uncommon',
	Common = 'Common',
	Unknown = 'Unknown',
}

export enum EModViolationId {
	WrongElement = 'WrongElement',
	NotEnoughSpace = 'NotEnoughSpace',
	Duplicate = 'Duplicate',
}

export enum EDimLoadoutsFilterId {
	All = 'All',
	None = 'None',
}
