import {
	EnumDictionary,
	IHash,
	Mapping,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
} from './globals';
import {
	EDestinySuperAbilityId,
	EDestinyClassId,
	EDestinySubclassId,
	EElement,
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
	destinySuperAbilityIds: EDestinySuperAbilityId[];
	destinyClass: EDestinyClassId;
	element: EElement;
}

const DestinySubclassIdToDestinySubclassMapping: EnumDictionary<
	EDestinySubclassId,
	IDestinySubclass
> = {
	[EDestinySubclassId.Stormcaller]: {
		id: EDestinySubclassId.Stormcaller,
		name: 'Stormcaller',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [
			EDestinySuperAbilityId.ChaosReach,
			EDestinySuperAbilityId.Stormtrance,
		],
		destinyClass: EDestinyClassId.Warlock,
		element: EElement.Arc,
		hash: 3168997075,
	},
	[EDestinySubclassId.Dawnblade]: {
		id: EDestinySubclassId.Dawnblade,
		name: 'Dawnblade',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [
			EDestinySuperAbilityId.Daybreak,
			EDestinySuperAbilityId.WellOfRadiance,
		],
		destinyClass: EDestinyClassId.Warlock,
		element: EElement.Solar,
		hash: 3941205951,
	},
	[EDestinySubclassId.Voidwalker]: {
		id: EDestinySubclassId.Voidwalker,
		name: 'Voidwalker',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [
			EDestinySuperAbilityId.NovaWarp,
			EDestinySuperAbilityId.NovaBombVortex,
			EDestinySuperAbilityId.NovaBombCataclysm,
		],
		destinyClass: EDestinyClassId.Warlock,
		element: EElement.Void,
		hash: 2849050827,
	},
	[EDestinySubclassId.Shadebinder]: {
		id: EDestinySubclassId.Shadebinder,
		name: 'Shadebinder',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [EDestinySuperAbilityId.WintersWrath],
		destinyClass: EDestinyClassId.Warlock,
		element: EElement.Stasis,
		hash: 3291545503,
	},
	[EDestinySubclassId.Striker]: {
		id: EDestinySubclassId.Striker,
		name: 'Striker',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [
			EDestinySuperAbilityId.Thundercrash,
			EDestinySuperAbilityId.FistsOfHavoc,
		],
		destinyClass: EDestinyClassId.Titan,
		element: EElement.Arc,
		hash: 2932390016,
	},
	[EDestinySubclassId.Sentinel]: {
		id: EDestinySubclassId.Sentinel,
		name: 'Sentinel',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [
			EDestinySuperAbilityId.SentinelShield,
			EDestinySuperAbilityId.WardOfDawn,
		],
		destinyClass: EDestinyClassId.Titan,
		element: EElement.Void,
		hash: 2842471112,
	},
	[EDestinySubclassId.Sunbreaker]: {
		id: EDestinySubclassId.Sunbreaker,
		name: 'Sunbreaker',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [
			EDestinySuperAbilityId.BurningMaul,
			EDestinySuperAbilityId.HammerOfSol,
		],
		destinyClass: EDestinyClassId.Titan,
		element: EElement.Solar,
		hash: 2550323932,
	},
	[EDestinySubclassId.Behemoth]: {
		id: EDestinySubclassId.Behemoth,
		name: 'Glacial Quake',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [EDestinySuperAbilityId.GlacialQuake],
		destinyClass: EDestinyClassId.Titan,
		element: EElement.Stasis,
		hash: 613647804,
	},
	[EDestinySubclassId.Gunslinger]: {
		id: EDestinySubclassId.Gunslinger,
		name: 'Gunslinger',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [
			EDestinySuperAbilityId.BladeBarrage,
			EDestinySuperAbilityId.GoldenGunDeadshot,
			EDestinySuperAbilityId.GoldenGunMarksman,
		],
		destinyClass: EDestinyClassId.Hunter,
		element: EElement.Solar,
		hash: 2240888816,
	},
	[EDestinySubclassId.Nightstalker]: {
		id: EDestinySubclassId.Nightstalker,
		name: 'Nightstalker',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [
			EDestinySuperAbilityId.ShadowshotDeadfall,
			EDestinySuperAbilityId.ShadowshotMoebiusQuiver,
			,
			EDestinySuperAbilityId.SpectralBlades,
		],
		destinyClass: EDestinyClassId.Hunter,
		element: EElement.Void,
		hash: 2453351420,
	},
	[EDestinySubclassId.Arcstrider]: {
		id: EDestinySubclassId.Arcstrider,
		name: 'Arcstrider',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [
			EDestinySuperAbilityId.ArcStaff,
			EDestinySuperAbilityId.GatheringStorm,
		],
		destinyClass: EDestinyClassId.Hunter,
		element: EElement.Arc,
		hash: 2328211300,
	},
	[EDestinySubclassId.Revenant]: {
		id: EDestinySubclassId.Revenant,
		name: 'Revenant',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		destinySuperAbilityIds: [EDestinySuperAbilityId.SilenceAndSquall],
		destinyClass: EDestinyClassId.Hunter,
		element: EElement.Stasis,
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
	EElement.Arc,
	EElement.Solar,
	EElement.Void,
	EElement.Stasis,
];
