import {
	IIcon,
	IIdentifiableName,
	EnumDictionary,
	IHash,
	MISSING_ICON,
} from './globals';
import { EAspectId, EDestinySubclassId } from './IdEnums';

export const AspectIdList = Object.values(EAspectId);

export interface IAspect extends IIdentifiableName, IIcon, IHash {
	description: string;
	fragementSlots: number;
}

const AspectIdToAspectMapping: EnumDictionary<EAspectId, IAspect> = {
	/*** Warlock ***/
	// Stasis
	[EAspectId.BleakWatcher]: {
		id: EAspectId.BleakWatcher,
		icon: MISSING_ICON,
		name: 'Bleak Watcher',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.Frostpulse]: {
		id: EAspectId.Frostpulse,
		icon: MISSING_ICON,
		name: 'Frostpulse',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.GlacialHarvest]: {
		id: EAspectId.GlacialHarvest,
		icon: MISSING_ICON,
		name: 'Glacial Harvest',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.IceflareBolts]: {
		id: EAspectId.IceflareBolts,
		icon: MISSING_ICON,
		name: 'Iceflare Bolts',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	// Void
	[EAspectId.ChaosAccelerant]: {
		id: EAspectId.ChaosAccelerant,
		icon: MISSING_ICON,
		name: 'Chaos Accelerant',
		description: '',
		fragementSlots: 1,
		hash: 0,
	},
	[EAspectId.FeedTheVoid]: {
		id: EAspectId.FeedTheVoid,
		icon: MISSING_ICON,
		name: 'Feed the Void',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.ChildOfTheOldGods]: {
		id: EAspectId.ChildOfTheOldGods,
		icon: MISSING_ICON,
		name: 'Child of the Old gods',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	// Solar
	[EAspectId.IcarusDash]: {
		id: EAspectId.IcarusDash,
		icon: MISSING_ICON,
		name: 'Icarus Dash',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.HeatRises]: {
		id: EAspectId.HeatRises,
		icon: MISSING_ICON,
		name: 'Heat Rises',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.TouchOfFlame]: {
		id: EAspectId.TouchOfFlame,
		icon: MISSING_ICON,
		name: 'Touch of Flame',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	// Arc
	[EAspectId.ArcSoul]: {
		id: EAspectId.ArcSoul,
		icon: MISSING_ICON,
		name: 'Arc Soul',
		description: '',
		fragementSlots: 2,
		hash: 0, // TODO: Fix hashes
	},
	[EAspectId.ElectrostaticMind]: {
		id: EAspectId.ElectrostaticMind,
		icon: MISSING_ICON,
		name: 'Electrostatic Mind',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.LightningSurge]: {
		id: EAspectId.LightningSurge,
		icon: MISSING_ICON,
		name: 'Lightning Surge',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	/*** Titan ***/
	// Stasis
	[EAspectId.Cryoclasm]: {
		id: EAspectId.Cryoclasm,
		icon: MISSING_ICON,
		name: 'Cryoclasm',
		description: '',
		fragementSlots: 1,
		hash: 0,
	},
	[EAspectId.DiamondLance]: {
		id: EAspectId.DiamondLance,
		icon: MISSING_ICON,
		name: 'Diamond Lance',
		description: '',
		fragementSlots: 3,
		hash: 0,
	},
	[EAspectId.TectonicHarvest]: {
		id: EAspectId.TectonicHarvest,
		icon: MISSING_ICON,
		name: 'Tectonic Harvest',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.HowlOfTheStorm]: {
		id: EAspectId.HowlOfTheStorm,
		icon: MISSING_ICON,
		name: 'Howl of the Storm',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	// Void
	[EAspectId.ControlledDemolition]: {
		id: EAspectId.ControlledDemolition,
		icon: MISSING_ICON,
		name: 'Controlled Demolition',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.Bastion]: {
		id: EAspectId.Bastion,
		icon: MISSING_ICON,
		name: 'Bastion',
		description: '',
		fragementSlots: 1,
		hash: 0,
	},
	[EAspectId.OffensiveBulwark]: {
		id: EAspectId.OffensiveBulwark,
		icon: MISSING_ICON,
		name: 'Offensive Bulwark',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	// Solar
	[EAspectId.RoaringFlames]: {
		id: EAspectId.RoaringFlames,
		icon: MISSING_ICON,
		name: 'Roaring Flames',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.SolInvictus]: {
		id: EAspectId.SolInvictus,
		icon: MISSING_ICON,
		name: 'Sol Invictus',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.Consecration]: {
		id: EAspectId.Consecration,
		icon: MISSING_ICON,
		name: 'Consecration',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	// Arc
	[EAspectId.Juggernaut]: {
		id: EAspectId.Juggernaut,
		icon: MISSING_ICON,
		name: 'Juggernaut',
		description: '',
		fragementSlots: 1,
		hash: 0,
	},
	[EAspectId.Knockout]: {
		id: EAspectId.Knockout,
		icon: MISSING_ICON,
		name: 'Knockout',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.TouchOfThunder]: {
		id: EAspectId.TouchOfThunder,
		icon: MISSING_ICON,
		name: 'Touch of Thunder',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	/*** Hunter ***/
	// Stasis
	[EAspectId.GrimHarvest]: {
		id: EAspectId.GrimHarvest,
		icon: MISSING_ICON,
		name: 'Grim Harvest',
		description: '',
		fragementSlots: 3,
		hash: 0,
	},
	[EAspectId.Shatterdive]: {
		id: EAspectId.Shatterdive,
		icon: MISSING_ICON,
		name: 'Shatterdive',
		description: '',
		fragementSlots: 1,
		hash: 0,
	},
	[EAspectId.TouchOfWinter]: {
		id: EAspectId.TouchOfWinter,
		icon: MISSING_ICON,
		name: 'Touch of Winter',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.WintersShroud]: {
		id: EAspectId.WintersShroud,
		icon: MISSING_ICON,
		name: "Winter's Shroud",
		description: '',
		fragementSlots: 1,
		hash: 0,
	},
	// Void
	[EAspectId.TrappersAmbush]: {
		id: EAspectId.TrappersAmbush,
		icon: MISSING_ICON,
		name: "Trapper's Ambush",
		description: '',
		fragementSlots: 1,
		hash: 0,
	},
	[EAspectId.VanishingStep]: {
		id: EAspectId.VanishingStep,
		icon: MISSING_ICON,
		name: 'Vanishing Step',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.StylishExecutioner]: {
		id: EAspectId.StylishExecutioner,
		icon: MISSING_ICON,
		name: 'Stylish Executioner',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	// Solar
	[EAspectId.OnYourMark]: {
		id: EAspectId.OnYourMark,
		icon: MISSING_ICON,
		name: 'On Your Mark',
		description: '',
		fragementSlots: 3,
		hash: 0,
	},
	[EAspectId.KnockEmDown]: {
		id: EAspectId.KnockEmDown,
		icon: MISSING_ICON,
		name: "Knock 'Em Down",
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.GunpowderGamble]: {
		id: EAspectId.GunpowderGamble,
		icon: MISSING_ICON,
		name: 'Gunpowder Gamble',
		description: '',
		fragementSlots: 1,
		hash: 0,
	},
	// Arc
	[EAspectId.FlowState]: {
		id: EAspectId.FlowState,
		icon: MISSING_ICON,
		name: 'Flow State',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.LethalCurrent]: {
		id: EAspectId.LethalCurrent,
		icon: MISSING_ICON,
		name: 'Lethal Current',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
	[EAspectId.TempestStrike]: {
		id: EAspectId.TempestStrike,
		icon: MISSING_ICON,
		name: 'Tempest Strike',
		description: '',
		fragementSlots: 2,
		hash: 0,
	},
};

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
