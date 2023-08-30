import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { MeleeIdToMeleeMapping } from '@dlb/generated/melee/MeleeMapping';
import { IMelee } from './generation';
import { EnumDictionary } from './globals';
import { EDestinySubclassId } from './IdEnums';

export const MeleeIdList = Object.values(EMeleeId);

export const getMelee = (id: EMeleeId): IMelee => MeleeIdToMeleeMapping[id];
export const getMeleeByHash = (hash: number): IMelee => {
	return Object.values(MeleeIdToMeleeMapping).find((x) => x.hash === hash);
};

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
	[EDestinySubclassId.Arcstrider]: [
		EMeleeId.CombinationBlow,
		EMeleeId.DisorientingBlow,
	],
	[EDestinySubclassId.Threadrunner]: [EMeleeId.ThreadedSpike],

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
	[EDestinySubclassId.Broodweaver]: [EMeleeId.ArcaneNeedle],

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
	[EDestinySubclassId.Berserker]: [EMeleeId.FrenziedBlade],
};

export const getMeleeIdsByDestinySubclassId = (
	id: EDestinySubclassId
): EMeleeId[] => DestinySubclassIdToMeleeIdListMapping[id];
