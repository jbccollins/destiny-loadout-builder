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

export enum ECombatStyleModId {
	// Positive Mods
	PowerfulFriends = 'PowerfulFriends',
	RadiantLight = 'RadiantLight',
	// Negative Mods
	ProtectiveLight = 'ProtectiveLight',
	ExtraReserves = 'ExtraReserves',
	PreciselyCharged = 'PreciselyCharged',
	StacksOnStacks = 'StacksOnStacks',
	PrecisionCharge = 'PrecisionCharge',
	SurpriseAttack = 'SupriseAttack',
	EnergyConverter = 'EnergyConverter',
	ChargeHarvester = 'ChargeHarvester',
}

export enum EAspectId {
	/*** Warlock ***/
	// Stasis
	BleakWatcher = 'BleakWatcher',
	Frostpulse = 'Frostpulse',
	GlacialHarvest = 'GlacialHarvest',
	IceflareBolts = 'IceflareBolts',
	// Void
	ChaosAccelerant = 'ChaosAccelerant',
	FeedTheVoid = 'FeedTheVoid',
	ChildOfTheOldGods = 'ChildOfTheOldGods',
	// Solar
	IcarusDash = 'IcarusDash',
	HeatRises = 'HeatRises',
	TouchOfFlame = 'TouchOfFlame',
	// Arc
	ArcSoul = 'ArcSoul',
	ElectrostaticMind = 'ElectrostaticMind',
	LightningSurge = 'LightningSurge',

	/*** Titan ***/
	// Stasis
	Cryoclasm = 'Cryoclasm',
	DiamondLance = 'DiamondLance',
	TectonicHarvest = 'TectonicHarvest',
	HowlOfTheStorm = 'HowlOfTheStorm',
	// Void
	ControlledDemolition = 'ControlledDemolition',
	Bastion = 'Bastion',
	OffensiveBulwark = 'OffensiveBulwark',
	// Solar
	RoaringFlames = 'RoaringFlames',
	SolInvictus = 'SolInvictus',
	Consecration = 'Consecration',
	// Arc
	Juggernaut = 'Juggernaut',
	Knockout = 'Knockout',
	TouchOfThunder = 'TouchOfThunder',

	/*** Hunter ***/
	// Stasis
	GrimHarvest = 'GrimHarvest',
	Shatterdive = 'Shatterdive',
	TouchOfWinter = 'TouchOfWinter',
	WintersShroud = 'WintersShroud',
	// Void
	TrappersAmbush = 'TrappersAmbush',
	VanishingStep = 'VanishingStep',
	StylishExecutioner = 'StylishExecutioner',
	// Solar
	OnYourMark = 'OnYourMark',
	KnockEmDown = 'KnockEmDown',
	GunpowderGamble = 'GunpowderGamble',
	// Arc
	FlowState = 'FlowState',
	LethalCurrent = 'LethalCurrent',
	TempestStrike = 'TempestStrike',
}

export enum EFragmentId {
	// Arc
	SparkOfAmplitude = 'SparkOfAmplitude',
	SparkOfBeacons = 'SparkOfBeacons',
	SparkOfBrilliance = 'SparkOfBrilliance',
	SparkOfDischarge = 'SparkOfDischarge',
	SparkOfFeedback = 'SparkOfFeedback',
	SparkOfFocus = 'SparkOfFocus',
	SparkOfFrequency = 'SparkOfFrequency',
	SparkOfIons = 'SparkOfIons',
	SparkOfMagnitude = 'SparkOfMagnitude',
	SparkOfMomentum = 'SparkOfMomentum',
	SparkOfRecharge = 'SparkOfRecharge',
	SparkOfResistance = 'SparkOfResistance',
	SparkOfShock = 'SparkOfShock',
	SparkOfVolts = 'SparkOfVolts',
	// Solar
	EmberOfAshes = 'EmberOfAshes',
	EmberOfBeams = 'EmberOfBeams',
	EmberOfBenevolence = 'EmberOfBenevolence',
	EmberOfBlistering = 'EmberOfBlistering',
	EmberOfChar = 'EmberOfChar',
	EmberOfCombustion = 'EmberOfCombustion',
	EmberOfEmpyrean = 'EmberOfEmpyrean',
	EmberOfEruption = 'EmberOfEruption',
	EmberOfSearing = 'EmberOfSearing',
	EmberOfSingeing = 'EmberOfSingeing',
	EmberOfSolace = 'EmberOfSolace',
	EmberOfTempering = 'EmberOfTempering',
	EmberOfTorches = 'EmberOfTorches',
	EmberOfWonder = 'EmberOfWonder',
	// Void
	EchoOfDilation = 'EchoOfDilation',
	EchoOfDomineering = 'EchoOfDomineering',
	EchoOfExchange = 'EchoOfExchange',
	EchoOfExpulsion = 'EchoOfExpulsion',
	EchoOfHarvest = 'EchoOfHarvest',
	EchoOfInstability = 'EchoOfInstability',
	EchoOfLeeching = 'EchoOfLeeching',
	EchoOfObscurity = 'EchoOfObscurity',
	EchoOfProvision = 'EchoOfProvision',
	EchoOfRemnants = 'EchoOfRemnants',
	EchoOfReprisal = 'EchoOfReprisal',
	EchoOfPersistence = 'EchoOfPersistence',
	EchoOfStarvation = 'EchoOfStarvation',
	EchoOfUndermining = 'EchoOfUndermining',
	// Stasis
	WhisperOfBonds = 'WhisperOfBonds',
	WhisperOfChains = 'WhisperOfChains',
	WhisperOfConduction = 'WhisperOfConduction',
	WhisperOfDurance = 'WhisperOfDurance',
	WhisperOfFissures = 'WhisperOfFissures',
	WhisperOfFractures = 'WhisperOfFractures',
	WhisperOfHedrons = 'WhisperOfHedrons',
	WhisperOfHunger = 'WhisperOfHunger',
	WhisperOfImpetus = 'WhisperOfImpetus',
	WhisperOfRefraction = 'WhisperOfRefraction',
	WhisperOfRending = 'WhisperOfRending',
	WhisperOfRime = 'WhisperOfRime',
	WhisperOfShards = 'WhisperOfShards',
	WhisperOfTorment = 'WhisperOfTorment',
}

// TODO: Name this like
// All Armor Is Masterworked, Legendary Armor is Masterworked
// No assumption is made
export enum EMasterworkAssumption {
	All = 'All',
	Legendary = 'Legendary',
	None = 'None',
}