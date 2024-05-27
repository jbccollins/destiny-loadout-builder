import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { MeleeIdToMeleeMapping } from '@dlb/generated/melee/MeleeMapping';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { EDestinySubclassId } from './IdEnums';
import { IMelee } from './generation';
import { EnumDictionary } from './globals';

export const MeleeIdList = Object.values(EMeleeId);

export const getMelee = (id: EMeleeId): IMelee => MeleeIdToMeleeMapping[id];
const MeleeHashToMeleeIdMapping = generateHashToIdMapping(
	MeleeIdToMeleeMapping
);

export const getMeleeByHash = (hash: number): IMelee => {
	return MeleeIdToMeleeMapping[MeleeHashToMeleeIdMapping[hash]];
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
	[EDestinySubclassId.PrismaticHunter]: [
		EMeleeId.CombinationBlow,
		EMeleeId.KnifeTrick,
		EMeleeId.WitheringBlade,
		EMeleeId.ThreadedSpike,
		EMeleeId.SnareBomb,
	],

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
	[EDestinySubclassId.PrismaticWarlock]: [
		EMeleeId.IncineratorSnap,
		EMeleeId.PocketSingularity,
		EMeleeId.ChainLightning,
		EMeleeId.PenumbralBlast,
		EMeleeId.ArcaneNeedle,
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
	[EDestinySubclassId.Berserker]: [EMeleeId.FrenziedBlade],
	[EDestinySubclassId.PrismaticTitan]: [
		EMeleeId.ShieldThrow,
		EMeleeId.Thunderclap,
		EMeleeId.FrenziedBlade,
		EMeleeId.HammerStrike,
		EMeleeId.ShiverStrike,
	],
};

export const getMeleeIdsByDestinySubclassId = (
	id: EDestinySubclassId
): EMeleeId[] => DestinySubclassIdToMeleeIdListMapping[id];
