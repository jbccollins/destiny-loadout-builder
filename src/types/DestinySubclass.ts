import {
	EnumDictionary,
	IHash,
	Mapping,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
} from './globals';
import {
	ESuperAbilityId,
	EDestinyClassId,
	EDestinySubclassId,
	EElementId,
} from './IdEnums';

// Sorted by [hunter, warlock, titan] and then alphabetically
export const DestinySubclassIdList = ValidateEnumList(
	Object.values(EDestinySubclassId),
	[
		EDestinySubclassId.Arcstrider,
		EDestinySubclassId.Gunslinger,
		EDestinySubclassId.Nightstalker,
		EDestinySubclassId.Revenant,
		EDestinySubclassId.Dawnblade,
		EDestinySubclassId.Shadebinder,
		EDestinySubclassId.Stormcaller,
		EDestinySubclassId.Voidwalker,
		EDestinySubclassId.Behemoth,
		EDestinySubclassId.Sentinel,
		EDestinySubclassId.Striker,
		EDestinySubclassId.Sunbreaker,
	]
);

export interface IDestinySubclass extends IIdentifiableName, IIcon, IHash {
	superAbilityIdList: ESuperAbilityId[];
	destinyClassId: EDestinyClassId;
	element: EElementId;
}

const DestinySubclassIdToDestinySubclassMapping: EnumDictionary<
	EDestinySubclassId,
	IDestinySubclass
> = {
	[EDestinySubclassId.Stormcaller]: {
		id: EDestinySubclassId.Stormcaller,
		name: 'Stormcaller',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [
			ESuperAbilityId.ChaosReach,
			ESuperAbilityId.Stormtrance,
		],
		destinyClassId: EDestinyClassId.Warlock,
		element: EElementId.Arc,
		hash: 3168997075,
	},
	[EDestinySubclassId.Dawnblade]: {
		id: EDestinySubclassId.Dawnblade,
		name: 'Dawnblade',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [
			ESuperAbilityId.Daybreak,
			ESuperAbilityId.WellOfRadiance,
		],
		destinyClassId: EDestinyClassId.Warlock,
		element: EElementId.Solar,
		hash: 3941205951,
	},
	[EDestinySubclassId.Voidwalker]: {
		id: EDestinySubclassId.Voidwalker,
		name: 'Voidwalker',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [
			ESuperAbilityId.NovaWarp,
			ESuperAbilityId.NovaBombVortex,
			ESuperAbilityId.NovaBombCataclysm,
		],
		destinyClassId: EDestinyClassId.Warlock,
		element: EElementId.Void,
		hash: 2849050827,
	},
	[EDestinySubclassId.Shadebinder]: {
		id: EDestinySubclassId.Shadebinder,
		name: 'Shadebinder',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [ESuperAbilityId.WintersWrath],
		destinyClassId: EDestinyClassId.Warlock,
		element: EElementId.Stasis,
		hash: 3291545503,
	},
	[EDestinySubclassId.Striker]: {
		id: EDestinySubclassId.Striker,
		name: 'Striker',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [
			ESuperAbilityId.Thundercrash,
			ESuperAbilityId.FistsOfHavoc,
		],
		destinyClassId: EDestinyClassId.Titan,
		element: EElementId.Arc,
		hash: 2932390016,
	},
	[EDestinySubclassId.Sentinel]: {
		id: EDestinySubclassId.Sentinel,
		name: 'Sentinel',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [
			ESuperAbilityId.SentinelShield,
			ESuperAbilityId.WardOfDawn,
		],
		destinyClassId: EDestinyClassId.Titan,
		element: EElementId.Void,
		hash: 2842471112,
	},
	[EDestinySubclassId.Sunbreaker]: {
		id: EDestinySubclassId.Sunbreaker,
		name: 'Sunbreaker',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [
			ESuperAbilityId.BurningMaul,
			ESuperAbilityId.HammerOfSol,
		],
		destinyClassId: EDestinyClassId.Titan,
		element: EElementId.Solar,
		hash: 2550323932,
	},
	[EDestinySubclassId.Behemoth]: {
		id: EDestinySubclassId.Behemoth,
		name: 'Glacial Quake',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [ESuperAbilityId.GlacialQuake],
		destinyClassId: EDestinyClassId.Titan,
		element: EElementId.Stasis,
		hash: 613647804,
	},
	[EDestinySubclassId.Gunslinger]: {
		id: EDestinySubclassId.Gunslinger,
		name: 'Gunslinger',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [
			ESuperAbilityId.BladeBarrage,
			ESuperAbilityId.GoldenGunDeadshot,
			ESuperAbilityId.GoldenGunMarksman,
		],
		destinyClassId: EDestinyClassId.Hunter,
		element: EElementId.Solar,
		hash: 2240888816,
	},
	[EDestinySubclassId.Nightstalker]: {
		id: EDestinySubclassId.Nightstalker,
		name: 'Nightstalker',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [
			ESuperAbilityId.ShadowshotDeadfall,
			ESuperAbilityId.ShadowshotMoebiusQuiver,
			,
			ESuperAbilityId.SpectralBlades,
		],
		destinyClassId: EDestinyClassId.Hunter,
		element: EElementId.Void,
		hash: 2453351420,
	},
	[EDestinySubclassId.Arcstrider]: {
		id: EDestinySubclassId.Arcstrider,
		name: 'Arcstrider',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [
			ESuperAbilityId.ArcStaff,
			ESuperAbilityId.GatheringStorm,
		],
		destinyClassId: EDestinyClassId.Hunter,
		element: EElementId.Arc,
		hash: 2328211300,
	},
	[EDestinySubclassId.Revenant]: {
		id: EDestinySubclassId.Revenant,
		name: 'Revenant',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		superAbilityIdList: [ESuperAbilityId.SilenceAndSquall],
		destinyClassId: EDestinyClassId.Hunter,
		element: EElementId.Stasis,
		hash: 873720784,
	},
};

export const DestinySubclassIdToDestinySubclass: Mapping<
	EDestinySubclassId,
	IDestinySubclass
> = {
	get: (key: EDestinySubclassId) =>
		DestinySubclassIdToDestinySubclassMapping[key],
};

/******* Extra *******/

export const DestinySubclassElementIds = [
	EElementId.Arc,
	EElementId.Solar,
	EElementId.Void,
	EElementId.Stasis,
];
