import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { SuperAbilityIdToSuperAbilityMapping } from '@dlb/generated/superAbility/SuperAbilityMapping';
import { ISuperAbility } from './generation';
import { EnumDictionary } from './globals';
import { EDestinySubclassId } from './IdEnums';

// Order does not matter here
export const SuperAbilityIdList = Object.values(ESuperAbilityId);

export const getSuperAbility = (id: ESuperAbilityId): ISuperAbility =>
	SuperAbilityIdToSuperAbilityMapping[id];

/****** Extra *****/
const DestinySubclassIdToSuperAbilityIdListMapping: EnumDictionary<
	EDestinySubclassId,
	ESuperAbilityId[]
> = {
	// Hunter
	[EDestinySubclassId.Revenant]: [ESuperAbilityId.SilenceAndSquall],
	[EDestinySubclassId.Nightstalker]: [
		ESuperAbilityId.ShadowshotDeadfall,
		ESuperAbilityId.ShadowshotMoebiusQuiver,
		ESuperAbilityId.SpectralBlades,
	],
	[EDestinySubclassId.Gunslinger]: [
		ESuperAbilityId.GoldenGunDeadshot,
		ESuperAbilityId.GoldenGunMarksman,
		ESuperAbilityId.BladeBarrage,
	],
	[EDestinySubclassId.Arcstrider]: [
		ESuperAbilityId.ArcStaff,
		ESuperAbilityId.GatheringStorm,
	],

	//Warlock
	[EDestinySubclassId.Shadebinder]: [ESuperAbilityId.WintersWrath],
	[EDestinySubclassId.Voidwalker]: [
		ESuperAbilityId.NovaBombCataclysm,
		ESuperAbilityId.NovaBombVortex,
		ESuperAbilityId.NovaWarp,
	],
	[EDestinySubclassId.Dawnblade]: [
		ESuperAbilityId.WellOfRadiance,
		ESuperAbilityId.Daybreak,
	],
	[EDestinySubclassId.Stormcaller]: [
		ESuperAbilityId.ChaosReach,
		ESuperAbilityId.Stormtrance,
	],

	// Titan
	[EDestinySubclassId.Behemoth]: [ESuperAbilityId.GlacialQuake],
	[EDestinySubclassId.Sentinel]: [
		ESuperAbilityId.WardOfDawn,
		ESuperAbilityId.SentinelShield,
	],
	[EDestinySubclassId.Sunbreaker]: [
		ESuperAbilityId.HammerOfSol,
		ESuperAbilityId.BurningMaul,
	],
	[EDestinySubclassId.Striker]: [
		ESuperAbilityId.Thundercrash,
		ESuperAbilityId.FistsOfHavoc,
	],
};

export const getSuperAbilityIdsByDestinySubclassId = (
	id: EDestinySubclassId
): ESuperAbilityId[] => DestinySubclassIdToSuperAbilityIdListMapping[id];
