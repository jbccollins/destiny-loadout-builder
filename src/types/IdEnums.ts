export enum EAnimalId {
	Dog = 'Dog',
	Cat = 'Cat',
	Lion = 'Lion',
}

export enum EElementId {
	Arc = 'arc',
	Solar = 'solar',
	Void = 'void',
	Stasis = 'stasis',
	// Strand = 'strand',
	Any = 'any',
}

export enum EDestinyClassId {
	Titan = 'titan',
	Warlock = 'warlock',
	Hunter = 'hunter',
}

export enum EDestinySubclassId {
	// Warlock
	Stormcaller = 'Stormcaller',
	Dawnblade = 'Dawnblade',
	Voidwalker = 'Voidwalker',
	Shadebinder = 'Shadebinder',
	// Titan
	Striker = 'Striker',
	Sentinel = 'Sentinel',
	Sunbreaker = 'Sunbreaker',
	Behemoth = 'Behemoth',
	// Hunter
	Gunslinger = 'Gunslinger',
	Nightstalker = 'Nightstalker',
	Arcstrider = 'Arcstrider',
	Revenant = 'Revenant',
}

export enum ESuperAbilityId {
	// Stormcaller
	ChaosReach = 'ChaosReach',
	Stormtrance = 'Stormtrance',
	// Dawnblade
	Daybreak = 'Daybreak',
	WellOfRadiance = 'WellOfRadiance',
	// Voidwalker
	NovaWarp = 'NovaWarp',
	NovaBombVortex = 'NovaBombVortex',
	NovaBombCataclysm = 'NovaBombCataclysm',
	// Shadebinder
	WintersWrath = 'WintersWrath',
	// Behemoth
	GlacialQuake = 'GlacialQuake',
	// Sunbreaker
	HammerOfSol = 'HammerOfSol',
	BurningMaul = 'BurningMaul',
	// Sentinel
	SentinelShield = 'SentinelShield',
	WardOfDawn = 'WardOfDawn',
	// Striker
	Thundercrash = 'Thundercrash',
	FistsOfHavoc = 'FistsOfHavoc',
	// Revenant
	SilenceAndSquall = 'SilenceAndSquall',
	// Gunslinger
	GoldenGunDeadshot = 'GoldenGunDeadshot',
	GoldenGunMarksman = 'GoldentGunMarksman',
	BladeBarrage = 'BladeBarrage',
	// Arcstrider
	ArcStaff = 'ArcStaff',
	GatheringStorm = 'GatheringStorm',
	// Nightstalker
	ShadowshotDeadfall = 'ShadowshotDeadfall',
	ShadowshotMoebiusQuiver = 'ShadowshotMoebiusQuiver',
	SpectralBlades = 'SpectralBlades',
}

export enum EArmorSlotId {
	Head = 'head',
	Arm = 'arm',
	Chest = 'chest',
	Leg = 'leg',
	ClassItem = 'classItem',
}

export enum EArmorStatId {
	Mobility = 'mobility',
	Resilience = 'resilience',
	Recovery = 'recovery',
	Discipline = 'discipline',
	Intellect = 'intellect',
	Strength = 'strength',
}

export enum EArmorExtraModSlotId {
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
	Any = 'any',
}

export enum EArmorStatModId {
	None = 'None',
	MinorMobility = 'MinorMobility',
	MajorMobility = 'MajorMobility',
	MinorResilience = 'MinorResilience',
	MajorResilience = 'MajorResilience',
	MinorRecovery = 'MinorRecovery',
	MajorRecovery = 'MajorRecovery',
	MinorDiscipline = 'MinorDiscipline',
	MajorDiscipline = 'MajorDiscipline',
	MinorIntellect = 'MinorIntellect',
	MajorIntellect = 'MajorIntellect',
	MinorStrength = 'MinorStrength',
	MajorStrength = 'MajorStrength',
}
