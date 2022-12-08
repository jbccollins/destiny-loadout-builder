import {
	IIdentifiableName,
	IIcon,
	IHash,
	EnumDictionary,
	StatBonus,
	MISSING_ICON,
} from './globals';
import { EDestinySubclassId, EMeleeId } from './IdEnums';

export const MeleeIdList = Object.values(EMeleeId);

export interface IMelee extends IIdentifiableName, IIcon, IHash {
	description: string;
}

const MeleeIdToMeleeMapping: EnumDictionary<EMeleeId, IMelee> = {
	/*** Warlock ***/
	// Stasis
	[EMeleeId.PenumbralBlast]: {
		id: EMeleeId.PenumbralBlast,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Void
	[EMeleeId.PocketSingularity]: {
		id: EMeleeId.PocketSingularity,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Solar
	[EMeleeId.CelestialFire]: {
		id: EMeleeId.CelestialFire,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EMeleeId.IncineratorSnap]: {
		id: EMeleeId.IncineratorSnap,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Arc
	[EMeleeId.BallLightning]: {
		id: EMeleeId.BallLightning,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EMeleeId.ChainLightning]: {
		id: EMeleeId.ChainLightning,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	/*** Titan ***/
	// Stasis
	[EMeleeId.ShiverStrike]: {
		id: EMeleeId.ShiverStrike,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Void
	[EMeleeId.ShieldBash]: {
		id: EMeleeId.ShieldBash,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EMeleeId.ShieldThrow]: {
		id: EMeleeId.ShieldThrow,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Solar
	[EMeleeId.ThrowingHammer]: {
		id: EMeleeId.ThrowingHammer,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EMeleeId.HammerStrike]: {
		id: EMeleeId.HammerStrike,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Arc
	[EMeleeId.SeismicStrike]: {
		id: EMeleeId.SeismicStrike,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EMeleeId.Thunderclap]: {
		id: EMeleeId.Thunderclap,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EMeleeId.BallisticSlam]: {
		id: EMeleeId.BallisticSlam,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	/*** Hunter ***/
	// TODO: Review these and make sure I'm not missing any
	// Stasis
	[EMeleeId.WitheringBlade]: {
		id: EMeleeId.WitheringBlade,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Void
	[EMeleeId.SnareBomb]: {
		id: EMeleeId.SnareBomb,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Solar
	[EMeleeId.KnifeTrick]: {
		id: EMeleeId.KnifeTrick,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EMeleeId.ProximityExplosiveKnife]: {
		id: EMeleeId.ProximityExplosiveKnife,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EMeleeId.LightweightKnife]: {
		id: EMeleeId.LightweightKnife,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EMeleeId.WeightedThrowingKnife]: {
		id: EMeleeId.WeightedThrowingKnife,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Arc
	[EMeleeId.CombinationBlow]: {
		id: EMeleeId.CombinationBlow,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
};

export const getMelee = (id: EMeleeId): IMelee => MeleeIdToMeleeMapping[id];

/****** Extra *****/
const DestinySubclassIdToMeleeIdListMapping: EnumDictionary<
	EDestinySubclassId,
	EMeleeId[]
> = {
	// Hunter
	[EDestinySubclassId.Revenant]: [EMeleeId.WitheringBlade],
	[EDestinySubclassId.Nightstalker]: [EMeleeId.SnareBomb],
	[EDestinySubclassId.Gunslinger]: [
		EMeleeId.KnifeTrick,
		EMeleeId.LightweightKnife,
		EMeleeId.WeightedThrowingKnife,
		EMeleeId.ProximityExplosiveKnife,
	],
	[EDestinySubclassId.Arcstrider]: [EMeleeId.CombinationBlow],

	//Warlock
	[EDestinySubclassId.Shadebinder]: [EMeleeId.PenumbralBlast],
	[EDestinySubclassId.Voidwalker]: [EMeleeId.PocketSingularity],
	[EDestinySubclassId.Dawnblade]: [
		EMeleeId.IncineratorSnap,
		EMeleeId.CelestialFire,
	],
	[EDestinySubclassId.Stormcaller]: [
		EMeleeId.BallLightning,
		EMeleeId.ChainLightning,
	],

	// Titan
	[EDestinySubclassId.Behemoth]: [EMeleeId.ShiverStrike],
	[EDestinySubclassId.Sentinel]: [EMeleeId.ShieldBash, EMeleeId.ShieldThrow],
	[EDestinySubclassId.Sunbreaker]: [
		EMeleeId.HammerStrike,
		EMeleeId.ThrowingHammer,
	],
	[EDestinySubclassId.Striker]: [
		EMeleeId.Thunderclap,
		EMeleeId.SeismicStrike,
		EMeleeId.BallisticSlam,
	],
};

export const getMeleeIdsByDestinySubclassId = (
	id: EDestinySubclassId
): EMeleeId[] => DestinySubclassIdToMeleeIdListMapping[id];
