import { AspectIdToAspectMapping } from '@dlb/generated/aspect/AspectMapping';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import combinations from '@dlb/utils/combinations';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { EDestinySubclassId } from './IdEnums';
import { IAspect } from './generation';
import { EnumDictionary } from './globals';

export const AspectIdList = Object.values(EAspectId);

export const getAspect = (aspectId: EAspectId): IAspect =>
	AspectIdToAspectMapping[aspectId];

const AspectHashToAspectIdMapping = generateHashToIdMapping(
	AspectIdToAspectMapping
);

export const getAspectByHash = (hash: number): IAspect => {
	return AspectIdToAspectMapping[AspectHashToAspectIdMapping[hash]];
};

/***** Extra *****/

// TODO: Move this right into the subclass file
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
	[EDestinySubclassId.Threadrunner]: [
		EAspectId.EnsnaringSlam,
		EAspectId.ThreadedSpecter,
		EAspectId.WidowsSilk,
		EAspectId.WhirlingMaelstrom,
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
	[EDestinySubclassId.Broodweaver]: [
		EAspectId.MindspunInvocation,
		EAspectId.TheWanderer,
		EAspectId.WeaversCall,
		EAspectId.Weavewalk,
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
	[EDestinySubclassId.Berserker]: [
		EAspectId.DrengrsLash,
		EAspectId.FlechetteStorm,
		EAspectId.IntoTheFray,
		EAspectId.BannerOfWar,
	],
};

export const getAspectIdsByDestinySubclassId = (
	destinySubclassId: EDestinySubclassId
): EAspectId[] => DestinySubclassIdToAspectIdListMapping[destinySubclassId];

export const getAspectsByDestinySubclassId = (
	destinySubclassId: EDestinySubclassId
): IAspect[] => {
	const aspectIds = destinySubclassId
		? getAspectIdsByDestinySubclassId(destinySubclassId)
		: [];
	return aspectIds.map((aspectId) => getAspect(aspectId));
};

const getMaximumAspectFragmentSlotsByDestinySubclassId = (
	destinySubclassId: EDestinySubclassId
): number => {
	const aspectsIdList = getAspectIdsByDestinySubclassId(destinySubclassId);
	const combos = combinations(aspectsIdList, 2);
	let maxSlots = 0;
	combos.forEach((combo) => {
		const slots =
			getAspect(combo[0]).fragmentSlots + getAspect(combo[1]).fragmentSlots;
		maxSlots = Math.max(maxSlots, slots);
	});
	return maxSlots;
};

const DestinySubclassIdToMaximumAspectCapacityMapping: EnumDictionary<
	EDestinySubclassId,
	number
> = {
	[EDestinySubclassId.Stormcaller]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Stormcaller
		),
	[EDestinySubclassId.Dawnblade]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Dawnblade
		),
	[EDestinySubclassId.Voidwalker]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Voidwalker
		),
	[EDestinySubclassId.Shadebinder]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Shadebinder
		),
	[EDestinySubclassId.Broodweaver]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Broodweaver
		),
	[EDestinySubclassId.Striker]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Striker
		),
	[EDestinySubclassId.Sentinel]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Sentinel
		),
	[EDestinySubclassId.Sunbreaker]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Sunbreaker
		),
	[EDestinySubclassId.Behemoth]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Behemoth
		),
	[EDestinySubclassId.Berserker]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Berserker
		),
	[EDestinySubclassId.Gunslinger]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Gunslinger
		),
	[EDestinySubclassId.Nightstalker]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Nightstalker
		),
	[EDestinySubclassId.Arcstrider]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Arcstrider
		),
	[EDestinySubclassId.Revenant]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Revenant
		),
	[EDestinySubclassId.Threadrunner]:
		getMaximumAspectFragmentSlotsByDestinySubclassId(
			EDestinySubclassId.Threadrunner
		),
};

export const getMaximumFragmentSlotsByDestinySubclassId = (
	destinySubclassId: EDestinySubclassId
): number => {
	if (!destinySubclassId) {
		return 0;
	}
	return DestinySubclassIdToMaximumAspectCapacityMapping[destinySubclassId];
};
