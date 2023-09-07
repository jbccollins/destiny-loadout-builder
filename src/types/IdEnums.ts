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
	Raid = 'Raid', // e.g. Release Recover
}

// TODO: These could easily change. Find a better way to generate them so this isn't so fragile
export enum EModCategoryId {
	// Armor Slot Mods
	AmmoFinder = 'AmmoFinder',
	Siphon = 'Siophon',
	Scavenger = 'Scavenger',
	Reserves = 'Reserves',
	Targeting = 'Targeting',
	Dexterity = 'Dexterity',
	Holster = 'Holster',
	Loader = 'Loader',
	Unflinching = 'Unflinching',
	WeaponSurge = 'WeaponSurge',
	Resistance = 'Resistance',
	OrbPickup = 'OrbPickup',
	ArmorCharge = 'ArmorCharge',
	// Stat Mods
	ArmorStat = 'ArmorStat',
	// Artifice Stat Mods
	ArtificeArmorStat = 'ArtificeArmorStat',
	// Raid Mods
	RaidAndNightmare = 'RaidAndNightmare',
	// Catchall for everything else, which should only be Armor Slot Mods
	// that don't cleanly fit into one of the above categories
	General = 'General',
	// Mods not "authorized" on the current seasonal artifact
	AlternateSeasonalArtifact = 'AlternateSeasonArtifiact',
}

export enum ERaidAndNightMareModTypeId {
	LastWish = 'LastWish',
	GardenOfSalvation = 'GardenOfSalvation',
	DeepStoneCrypt = 'DeepStoneCrypt',
	VaultOfGlass = 'VaultOfGlass',
	VowOfTheDisciple = 'VowOfTheDisciple',
	KingsFall = 'KingsFall',
	RootOfNightmares = 'RootOfNightmares',
	CrotasEnd = 'CrotasEnd',
	NightmareHunt = 'NightmareHunt',
}

export enum EIntrinsicArmorPerkOrAttributeId {
	// Perks
	ExhumedExcess = 'ExhumedExcess',
	QueensFavor = 'QueensFavor',
	UniformedOfficer = 'UniformedOfficer',
	PlunderersTrappings = 'PlunderersTrappings',
	SeraphSensorArray = 'SeraphSensorArray',
	SonarAmplifier = 'SonarAmplifier',
	VisageOfTheReaper = 'VisageOfTheReaper',
	// Attributes
	IronBanner = 'IronBanner',
	HalloweenMask = 'HalloweenMask',
	GuardianGames = 'GuardianGames',
}

export const ERaidAndNightMareModTypeIdList = Object.values(
	ERaidAndNightMareModTypeId
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

export enum EInGameLoadoutsFilterId {
	All = 'All',
	None = 'None',
}
