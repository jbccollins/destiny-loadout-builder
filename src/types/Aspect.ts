import { AspectIdToAspectMapping } from '@dlb/generated/aspect/AspectMapping';
import { IAspect } from './generation';
import { EnumDictionary } from './globals';
import { EAspectId, EDestinySubclassId } from './IdEnums';

export const AspectIdList = Object.values(EAspectId);

export const getAspect = (aspectId: EAspectId): IAspect =>
	AspectIdToAspectMapping[aspectId];

/***** Extra *****/

const DestinySubclassIdToAspectIdListMapping: EnumDictionary<
	EDestinySubclassId,
	EAspectId[]
> = {
	// Hunter
	[EDestinySubclassId.Revenant]: [
		EAspectId.Shatterdive,
		EAspectId.WintersShroud,
		EAspectId.GrimHarvest,
		EAspectId.TouchOfWinter,
	],
	[EDestinySubclassId.Nightstalker]: [
		EAspectId.StylishExecutioner,
		EAspectId.TrappersAmbush,
		EAspectId.VanishingStep,
	],
	[EDestinySubclassId.Gunslinger]: [
		EAspectId.GunpowderGamble,
		EAspectId.KnockEmDown,
		EAspectId.OnYourMark,
	],
	[EDestinySubclassId.Arcstrider]: [
		EAspectId.FlowState,
		EAspectId.LethalCurrent,
		EAspectId.TempestStrike,
	],

	//Warlock
	[EDestinySubclassId.Shadebinder]: [
		EAspectId.IceflareBolts,
		EAspectId.GlacialHarvest,
		EAspectId.Frostpulse,
		EAspectId.BleakWatcher,
	],
	[EDestinySubclassId.Voidwalker]: [
		EAspectId.ChaosAccelerant,
		EAspectId.ChildOfTheOldGods,
		EAspectId.FeedTheVoid,
	],
	[EDestinySubclassId.Dawnblade]: [
		EAspectId.HeatRises,
		EAspectId.IcarusDash,
		EAspectId.TouchOfFlame,
	],
	[EDestinySubclassId.Stormcaller]: [
		EAspectId.ArcSoul,
		EAspectId.ElectrostaticMind,
		EAspectId.LightningSurge,
	],

	// Titan
	[EDestinySubclassId.Behemoth]: [
		EAspectId.Cryoclasm,
		EAspectId.TectonicHarvest,
		EAspectId.HowlOfTheStorm,
		EAspectId.DiamondLance,
	],
	[EDestinySubclassId.Sentinel]: [
		EAspectId.Bastion,
		EAspectId.ControlledDemolition,
		EAspectId.OffensiveBulwark,
	],
	[EDestinySubclassId.Sunbreaker]: [
		EAspectId.Consecration,
		EAspectId.RoaringFlames,
		EAspectId.SolInvictus,
	],
	[EDestinySubclassId.Striker]: [
		EAspectId.TouchOfThunder,
		EAspectId.Knockout,
		EAspectId.Juggernaut,
	],
};

export const getAspectIdsByDestinySubclassId = (
	destinySubclassId: EDestinySubclassId
): EAspectId[] => DestinySubclassIdToAspectIdListMapping[destinySubclassId];

export const getAspectsByDestinySubclassId = (
	destinySubclassId: EDestinySubclassId
): IAspect[] => {
	const aspectIds = getAspectIdsByDestinySubclassId(destinySubclassId);
	return aspectIds.map((aspectId) => getAspect(aspectId));
};
