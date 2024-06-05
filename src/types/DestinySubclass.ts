import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { EDestinyClassId, EDestinySubclassId, EElementId } from './IdEnums';
import {
	EnumDictionary,
	IHash,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
} from './globals';

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
		EDestinySubclassId.Broodweaver,
		EDestinySubclassId.Threadrunner,
		EDestinySubclassId.Berserker,
		EDestinySubclassId.PrismHunter,
		EDestinySubclassId.PrismTitan,
		EDestinySubclassId.PrismWarlock,
	]
);

export interface IDestinySubclass extends IIdentifiableName, IIcon, IHash {
	superAbilityIdList: ESuperAbilityId[];
	destinyClassId: EDestinyClassId;
	elementId: EElementId;
}

// TODO: Generate this
const DestinySubclassIdToDestinySubclassMapping: EnumDictionary<
	EDestinySubclassId,
	IDestinySubclass
> = {
	[EDestinySubclassId.Stormcaller]: {
		id: EDestinySubclassId.Stormcaller,
		name: 'Stormcaller',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/949af7a61d60a8e6071282daafa9e6e9.png',
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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fedcb91b7ab0584c12f0e9fec730702b.png',
		superAbilityIdList: [
			ESuperAbilityId.Daybreak,
			ESuperAbilityId.WellOfRadiance,
			ESuperAbilityId.SongOfFlame
		],
		destinyClassId: EDestinyClassId.Warlock,
		elementId: EElementId.Solar,
		hash: 3941205951,
	},
	[EDestinySubclassId.Voidwalker]: {
		id: EDestinySubclassId.Voidwalker,
		name: 'Voidwalker',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/32b112a9460e6f0e2b9ee15dc53fe1c1.png',
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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6e441ffa8c8171ce9caf71e51b72fc19.png',
		superAbilityIdList: [ESuperAbilityId.WintersWrath],
		destinyClassId: EDestinyClassId.Warlock,
		elementId: EElementId.Stasis,
		hash: 3291545503,
	},
	[EDestinySubclassId.Broodweaver]: {
		id: EDestinySubclassId.Broodweaver,
		name: 'Broodweaver',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/41c0024ce809085ac16f4e0777ea0ac4.png',
		superAbilityIdList: [ESuperAbilityId.Needlestorm],
		destinyClassId: EDestinyClassId.Warlock,
		elementId: EElementId.Strand,
		hash: 4204413574,
	},
	[EDestinySubclassId.Striker]: {
		id: EDestinySubclassId.Striker,
		name: 'Striker',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/949af7a61d60a8e6071282daafa9e6e9.png',
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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/32b112a9460e6f0e2b9ee15dc53fe1c1.png',
		superAbilityIdList: [
			ESuperAbilityId.SentinelShield,
			ESuperAbilityId.WardOfDawn,
			ESuperAbilityId.TwilightArsenal
		],
		destinyClassId: EDestinyClassId.Titan,
		elementId: EElementId.Void,
		hash: 2842471112,
	},
	[EDestinySubclassId.Sunbreaker]: {
		id: EDestinySubclassId.Sunbreaker,
		name: 'Sunbreaker',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fedcb91b7ab0584c12f0e9fec730702b.png',
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
		name: 'Behemoth',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6e441ffa8c8171ce9caf71e51b72fc19.png',
		superAbilityIdList: [ESuperAbilityId.GlacialQuake],
		destinyClassId: EDestinyClassId.Titan,
		elementId: EElementId.Stasis,
		hash: 613647804,
	},
	[EDestinySubclassId.Berserker]: {
		id: EDestinySubclassId.Berserker,
		name: 'Berserker',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/41c0024ce809085ac16f4e0777ea0ac4.png',
		superAbilityIdList: [ESuperAbilityId.Bladefury],
		destinyClassId: EDestinyClassId.Titan,
		elementId: EElementId.Strand,
		hash: 242419885,
	},
	[EDestinySubclassId.Gunslinger]: {
		id: EDestinySubclassId.Gunslinger,
		name: 'Gunslinger',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fedcb91b7ab0584c12f0e9fec730702b.png',
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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/32b112a9460e6f0e2b9ee15dc53fe1c1.png',
		superAbilityIdList: [
			ESuperAbilityId.ShadowshotDeadfall,
			ESuperAbilityId.ShadowshotMoebiusQuiver,
			ESuperAbilityId.SpectralBlades,
		],
		destinyClassId: EDestinyClassId.Hunter,
		elementId: EElementId.Void,
		hash: 2453351420,
	},
	[EDestinySubclassId.Arcstrider]: {
		id: EDestinySubclassId.Arcstrider,
		name: 'Arcstrider',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/949af7a61d60a8e6071282daafa9e6e9.png',
		superAbilityIdList: [
			ESuperAbilityId.ArcStaff,
			ESuperAbilityId.GatheringStorm,
			ESuperAbilityId.StormsEdge
		],
		destinyClassId: EDestinyClassId.Hunter,
		elementId: EElementId.Arc,
		hash: 2328211300,
	},
	[EDestinySubclassId.Revenant]: {
		id: EDestinySubclassId.Revenant,
		name: 'Revenant',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6e441ffa8c8171ce9caf71e51b72fc19.png',
		superAbilityIdList: [ESuperAbilityId.SilenceAndSquall],
		destinyClassId: EDestinyClassId.Hunter,
		elementId: EElementId.Stasis,
		hash: 873720784,
	},
	[EDestinySubclassId.Threadrunner]: {
		id: EDestinySubclassId.Threadrunner,
		name: 'Threadrunner',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/41c0024ce809085ac16f4e0777ea0ac4.png',
		superAbilityIdList: [ESuperAbilityId.Silkstrike],
		destinyClassId: EDestinyClassId.Hunter,
		elementId: EElementId.Strand,
		hash: 3785442599,
	},
	[EDestinySubclassId.PrismHunter]: {
		id: EDestinySubclassId.PrismHunter,
		name: 'Prismatic Hunter',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fab506e62fa4f188bfe2fb6d56b39614.png',
		superAbilityIdList: [
			ESuperAbilityId.StormsEdgePrism,
			ESuperAbilityId.GoldenGunMarksmanPrism,
			ESuperAbilityId.SilenceAndSquallPrism,
			ESuperAbilityId.SilkstrikePrism,
			ESuperAbilityId.ShadowshotDeadfallPrism,
		],
		destinyClassId: EDestinyClassId.Hunter,
		elementId: EElementId.Prism,
		hash: 4282591831,
	},
	[EDestinySubclassId.PrismTitan]: {
		id: EDestinySubclassId.PrismTitan,
		name: 'Prismatic Titan',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c1740d829e62afc40a9e57af4e3cad4c.png',
		superAbilityIdList: [
			ESuperAbilityId.TwilightArsenalPrism,
			ESuperAbilityId.ThundercrashPrism,
			ESuperAbilityId.BladefuryPrism,
			ESuperAbilityId.HammerOfSolPrism,
			ESuperAbilityId.GlacialQuakePrism,
		],
		destinyClassId: EDestinyClassId.Titan,
		elementId: EElementId.Prism,
		hash: 1616346845,
	},
	[EDestinySubclassId.PrismWarlock]: {
		id: EDestinySubclassId.PrismWarlock,
		name: 'Prismatic Warlock',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/652406349e99e3db0c3198f78af4eeae.png',
		superAbilityIdList: [
			ESuperAbilityId.SongOfFlamePrism,
			ESuperAbilityId.NovaBombCataclysmPrism,
			ESuperAbilityId.StormtrancePrism,
			ESuperAbilityId.WintersWrathPrism,
			ESuperAbilityId.NeedlestormPrism,
		],
		destinyClassId: EDestinyClassId.Warlock,
		elementId: EElementId.Prism,
		hash: 3893112950,
	},
};

const DestinySubclassHashToDestinySubclassIdMapping = generateHashToIdMapping(
	DestinySubclassIdToDestinySubclassMapping
);
export const getDestinySubclassByHash = (hash: number): IDestinySubclass => {
	return DestinySubclassIdToDestinySubclassMapping[
		DestinySubclassHashToDestinySubclassIdMapping[hash]
	];
};

export const getDestinySubclass = (id: EDestinySubclassId): IDestinySubclass =>
	DestinySubclassIdToDestinySubclassMapping[id];

/******* Extra *******/

export const DestinySubclassElementIds = [
	EElementId.Arc,
	EElementId.Solar,
	EElementId.Void,
	EElementId.Stasis,
	EElementId.Strand,
];

/**
 * Some items have been replaced with equivalent new items. So far that's been
 * true of the "Light 2.0" subclasses which are an entirely different item from
 * the old one. When loading loadouts we'd like to just use the new version.
 */
export const oldToNewSubclassHashes: Record<number, number> = {
	// Arcstrider
	1334959255: 2328211300,
	// Striker
	2958378809: 2932390016,
	// Stormcaller
	1751782730: 3168997075,
	// Gunslinger
	3635991036: 2240888816,
	// Sunbreaker
	3105935002: 2550323932,
	// Dawnblade
	3481861797: 3941205951,
	// Nightstalker
	3225959819: 2453351420,
	// Sentinel
	3382391785: 2842471112,
	// Voidwalker
	3887892656: 2849050827,
};
