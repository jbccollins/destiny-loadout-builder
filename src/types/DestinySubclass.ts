import {
	EnumDictionary,
	IHash,
	Mapping,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
	MISSING_ICON,
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
	elementId: EElementId;
}

const DestinySubclassIdToDestinySubclassMapping: EnumDictionary<
	EDestinySubclassId,
	IDestinySubclass
> = {
	[EDestinySubclassId.Stormcaller]: {
		id: EDestinySubclassId.Stormcaller,
		name: 'Stormcaller',
		icon: MISSING_ICON,
		superAbilityIdList: [
			ESuperAbilityId.ChaosReach,
			ESuperAbilityId.Stormtrance,
		],
		destinyClassId: EDestinyClassId.Warlock,
		elementId: EElementId.Arc,
		hash: 3168997075,
	},
	[EDestinySubclassId.Dawnblade]: {
		id: EDestinySubclassId.Dawnblade,
		name: 'Dawnblade',
		icon: MISSING_ICON,
		superAbilityIdList: [
			ESuperAbilityId.Daybreak,
			ESuperAbilityId.WellOfRadiance,
		],
		destinyClassId: EDestinyClassId.Warlock,
		elementId: EElementId.Solar,
		hash: 3941205951,
	},
	[EDestinySubclassId.Voidwalker]: {
		id: EDestinySubclassId.Voidwalker,
		name: 'Voidwalker',
		icon: MISSING_ICON,
		superAbilityIdList: [
			ESuperAbilityId.NovaWarp,
			ESuperAbilityId.NovaBombVortex,
			ESuperAbilityId.NovaBombCataclysm,
		],
		destinyClassId: EDestinyClassId.Warlock,
		elementId: EElementId.Void,
		hash: 2849050827,
	},
	[EDestinySubclassId.Shadebinder]: {
		id: EDestinySubclassId.Shadebinder,
		name: 'Shadebinder',
		icon: MISSING_ICON,
		superAbilityIdList: [ESuperAbilityId.WintersWrath],
		destinyClassId: EDestinyClassId.Warlock,
		elementId: EElementId.Stasis,
		hash: 3291545503,
	},
	[EDestinySubclassId.Striker]: {
		id: EDestinySubclassId.Striker,
		name: 'Striker',
		icon: MISSING_ICON,
		superAbilityIdList: [
			ESuperAbilityId.Thundercrash,
			ESuperAbilityId.FistsOfHavoc,
		],
		destinyClassId: EDestinyClassId.Titan,
		elementId: EElementId.Arc,
		hash: 2932390016,
	},
	[EDestinySubclassId.Sentinel]: {
		id: EDestinySubclassId.Sentinel,
		name: 'Sentinel',
		icon: MISSING_ICON,
		superAbilityIdList: [
			ESuperAbilityId.SentinelShield,
			ESuperAbilityId.WardOfDawn,
		],
		destinyClassId: EDestinyClassId.Titan,
		elementId: EElementId.Void,
		hash: 2842471112,
	},
	[EDestinySubclassId.Sunbreaker]: {
		id: EDestinySubclassId.Sunbreaker,
		name: 'Sunbreaker',
		icon: MISSING_ICON,
		superAbilityIdList: [
			ESuperAbilityId.BurningMaul,
			ESuperAbilityId.HammerOfSol,
		],
		destinyClassId: EDestinyClassId.Titan,
		elementId: EElementId.Solar,
		hash: 2550323932,
	},
	[EDestinySubclassId.Behemoth]: {
		id: EDestinySubclassId.Behemoth,
		name: 'Glacial Quake',
		icon: MISSING_ICON,
		superAbilityIdList: [ESuperAbilityId.GlacialQuake],
		destinyClassId: EDestinyClassId.Titan,
		elementId: EElementId.Stasis,
		hash: 613647804,
	},
	[EDestinySubclassId.Gunslinger]: {
		id: EDestinySubclassId.Gunslinger,
		name: 'Gunslinger',
		icon: MISSING_ICON,
		superAbilityIdList: [
			ESuperAbilityId.BladeBarrage,
			ESuperAbilityId.GoldenGunDeadshot,
			ESuperAbilityId.GoldenGunMarksman,
		],
		destinyClassId: EDestinyClassId.Hunter,
		elementId: EElementId.Solar,
		hash: 2240888816,
	},
	[EDestinySubclassId.Nightstalker]: {
		id: EDestinySubclassId.Nightstalker,
		name: 'Nightstalker',
		icon: MISSING_ICON,
		superAbilityIdList: [
			ESuperAbilityId.ShadowshotDeadfall,
			ESuperAbilityId.ShadowshotMoebiusQuiver,
			,
			ESuperAbilityId.SpectralBlades,
		],
		destinyClassId: EDestinyClassId.Hunter,
		elementId: EElementId.Void,
		hash: 2453351420,
	},
	[EDestinySubclassId.Arcstrider]: {
		id: EDestinySubclassId.Arcstrider,
		name: 'Arcstrider',
		icon: MISSING_ICON,
		superAbilityIdList: [
			ESuperAbilityId.ArcStaff,
			ESuperAbilityId.GatheringStorm,
		],
		destinyClassId: EDestinyClassId.Hunter,
		elementId: EElementId.Arc,
		hash: 2328211300,
	},
	[EDestinySubclassId.Revenant]: {
		id: EDestinySubclassId.Revenant,
		name: 'Revenant',
		icon: MISSING_ICON,
		superAbilityIdList: [ESuperAbilityId.SilenceAndSquall],
		destinyClassId: EDestinyClassId.Hunter,
		elementId: EElementId.Stasis,
		hash: 873720784,
	},
};

export const getDestinySubclass = (id: EDestinySubclassId): IDestinySubclass =>
	DestinySubclassIdToDestinySubclassMapping[id];

/******* Extra *******/

export const DestinySubclassElementIds = [
	EElementId.Arc,
	EElementId.Solar,
	EElementId.Void,
	EElementId.Stasis,
];
