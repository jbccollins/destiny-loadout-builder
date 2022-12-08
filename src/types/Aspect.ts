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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/97527ee6f5a41dc47c70766555766de2.png',
		name: 'Bleak Watcher',
		description: '',
		fragementSlots: 2,
		hash: 2642597904,
	},
	[EAspectId.Frostpulse]: {
		id: EAspectId.Frostpulse,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f51d178f793e3f5071537c0d1f4556c8.png',
		name: 'Frostpulse',
		description: '',
		fragementSlots: 2,
		hash: 668903197,
	},
	[EAspectId.GlacialHarvest]: {
		id: EAspectId.GlacialHarvest,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/9a6e0c2839ad21856db0f41daecc6d1a.png',
		name: 'Glacial Harvest',
		description: '',
		fragementSlots: 2,
		hash: 2651551055,
	},
	[EAspectId.IceflareBolts]: {
		id: EAspectId.IceflareBolts,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/2769eba2b5d550fc833c316129dbc145.png',
		name: 'Iceflare Bolts',
		description: '',
		fragementSlots: 2,
		hash: 668903196,
	},
	// Void
	[EAspectId.ChaosAccelerant]: {
		id: EAspectId.ChaosAccelerant,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5a8a03d4876d34a89db6aedf6189ab86.jpg',
		name: 'Chaos Accelerant',
		description: '',
		fragementSlots: 1,
		hash: 2321824285,
	},
	[EAspectId.FeedTheVoid]: {
		id: EAspectId.FeedTheVoid,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/178bb0e78e55c5b960aa6f42660b9b66.jpg',
		name: 'Feed the Void',
		description: '',
		fragementSlots: 2,
		hash: 2321824284,
	},
	[EAspectId.ChildOfTheOldGods]: {
		id: EAspectId.ChildOfTheOldGods,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ced6965ddcda23fdc728639aaf0ebd4d.jpg',
		name: 'Child of the Old gods',
		description: '',
		fragementSlots: 2,
		hash: 2321824287,
	},
	// Solar
	[EAspectId.IcarusDash]: {
		id: EAspectId.IcarusDash,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/55a690bbd9cd53777df674a279422865.jpg',
		name: 'Icarus Dash',
		description: '',
		fragementSlots: 2,
		hash: 83039195,
	},
	[EAspectId.HeatRises]: {
		id: EAspectId.HeatRises,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/d647fd2019707f044ce97b52f802e465.jpg',
		name: 'Heat Rises',
		description: '',
		fragementSlots: 2,
		hash: 83039194,
	},
	[EAspectId.TouchOfFlame]: {
		id: EAspectId.TouchOfFlame,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/d6b44fe69ff876449e732b52b7d9d334.jpg',
		name: 'Touch of Flame',
		description: '',
		fragementSlots: 2,
		hash: 83039193,
	},
	// Arc
	[EAspectId.ArcSoul]: {
		id: EAspectId.ArcSoul,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b36cd33474e547b35d4c70fa787b1b2d.jpg',
		name: 'Arc Soul',
		description: '',
		fragementSlots: 2,
		hash: 1293395731, // TODO: Fix hashes
	},
	[EAspectId.ElectrostaticMind]: {
		id: EAspectId.ElectrostaticMind,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/8937344f0b1e3947d9c0d7a779f9887a.jpg',
		name: 'Electrostatic Mind',
		description: '',
		fragementSlots: 2,
		hash: 1293395729,
	},
	[EAspectId.LightningSurge]: {
		id: EAspectId.LightningSurge,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6c97a0574dcb3b93bdea4c7b98380a91.jpg',
		name: 'Lightning Surge',
		description: '',
		fragementSlots: 2,
		hash: 1293395730,
	},
	/*** Titan ***/
	// Stasis
	[EAspectId.Cryoclasm]: {
		id: EAspectId.Cryoclasm,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/8d72a8ff10f0078a6c9f9ff898ada54f.png',
		name: 'Cryoclasm',
		description: '',
		fragementSlots: 2,
		hash: 2031919265,
	},
	[EAspectId.DiamondLance]: {
		id: EAspectId.DiamondLance,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a5c545da23fa52d1aee3807f39c91d42.png',
		name: 'Diamond Lance',
		description: '',
		fragementSlots: 3,
		hash: 3866705246,
	},
	[EAspectId.TectonicHarvest]: {
		id: EAspectId.TectonicHarvest,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f48fabf889c7b342a73a25f76e80d1d7.png',
		name: 'Tectonic Harvest',
		description: '',
		fragementSlots: 2,
		hash: 2031919264,
	},
	[EAspectId.HowlOfTheStorm]: {
		id: EAspectId.HowlOfTheStorm,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c72c2546a93ea9bdbcea853d50911321.png',
		name: 'Howl of the Storm',
		description: '',
		fragementSlots: 2,
		hash: 1563930741,
	},
	// Void
	[EAspectId.ControlledDemolition]: {
		id: EAspectId.ControlledDemolition,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ab2545998f350de7b29549d2b19996e2.jpg',
		name: 'Controlled Demolition',
		description: '',
		fragementSlots: 2,
		hash: 1602994568,
	},
	[EAspectId.Bastion]: {
		id: EAspectId.Bastion,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5428b311ff07d2bacb073e551ed2bea1.jpg',
		name: 'Bastion',
		description: '',
		fragementSlots: 1,
		hash: 1602994569,
	},
	[EAspectId.OffensiveBulwark]: {
		id: EAspectId.OffensiveBulwark,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/68683d4544848844a1fe0acdf7417019.jpg',
		name: 'Offensive Bulwark',
		description: '',
		fragementSlots: 2,
		hash: 1602994570,
	},
	// Solar
	[EAspectId.RoaringFlames]: {
		id: EAspectId.RoaringFlames,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/208e4d0d635832dd78288de5532fe062.jpg',
		name: 'Roaring Flames',
		description: '',
		fragementSlots: 2,
		hash: 2984351204,
	},
	[EAspectId.SolInvictus]: {
		id: EAspectId.SolInvictus,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1552df4d776b01d9f8c00d6c910aec97.jpg',
		name: 'Sol Invictus',
		description: '',
		fragementSlots: 2,
		hash: 2984351205,
	},
	[EAspectId.Consecration]: {
		id: EAspectId.Consecration,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5c71b63e8b653cd63a2ae0d8a8c64979.jpg',
		name: 'Consecration',
		description: '',
		fragementSlots: 2,
		hash: 2984351206,
	},
	// Arc
	[EAspectId.Juggernaut]: {
		id: EAspectId.Juggernaut,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/251274f6c6b37c2a57579e56fe4663d4.jpg',
		name: 'Juggernaut',
		description: '',
		fragementSlots: 1,
		hash: 1656549673,
	},
	[EAspectId.Knockout]: {
		id: EAspectId.Knockout,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b015a95eb452615473de1217d75330b0.jpg',
		name: 'Knockout',
		description: '',
		fragementSlots: 2,
		hash: 1656549674,
	},
	[EAspectId.TouchOfThunder]: {
		id: EAspectId.TouchOfThunder,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3e2f59a618f015ee5f318d0f2c280c6c.jpg',
		name: 'Touch of Thunder',
		description: '',
		fragementSlots: 2,
		hash: 1656549672,
	},
	/*** Hunter ***/
	// Stasis
	[EAspectId.GrimHarvest]: {
		id: EAspectId.GrimHarvest,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/9361099c677eea4b7cd1205725419218.png',
		name: 'Grim Harvest',
		description: '',
		fragementSlots: 3,
		hash: 1920417385,
	},
	[EAspectId.Shatterdive]: {
		id: EAspectId.Shatterdive,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/94578639cfb331ae92137f6fdf9a0e81.png',
		name: 'Shatterdive',
		description: '',
		fragementSlots: 1,
		hash: 2934767476,
	},
	[EAspectId.TouchOfWinter]: {
		id: EAspectId.TouchOfWinter,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b782f03e26e41a50d08aff335c86feb3.png',
		name: 'Touch of Winter',
		description: '',
		fragementSlots: 2,
		hash: 4184589900,
	},
	[EAspectId.WintersShroud]: {
		id: EAspectId.WintersShroud,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6422d9f6d4a0a4fb679890eae17bd130.png',
		name: "Winter's Shroud",
		description: '',
		fragementSlots: 2,
		hash: 2934767477,
	},
	// Void
	[EAspectId.TrappersAmbush]: {
		id: EAspectId.TrappersAmbush,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e91760df2b81d191da9e2c62cb3fcda7.jpg',
		name: "Trapper's Ambush",
		description: '',
		fragementSlots: 1,
		hash: 187655372,
	},
	[EAspectId.VanishingStep]: {
		id: EAspectId.VanishingStep,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f23323d11f0ad79781f91c70f4c644ac.jpg',
		name: 'Vanishing Step',
		description: '',
		fragementSlots: 2,
		hash: 187655373,
	},
	[EAspectId.StylishExecutioner]: {
		id: EAspectId.StylishExecutioner,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ed7f8c49b77fa46f4eec87a3c167c4b1.jpg',
		name: 'Stylish Executioner',
		description: '',
		fragementSlots: 2,
		hash: 187655374,
	},
	// Solar
	[EAspectId.OnYourMark]: {
		id: EAspectId.OnYourMark,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6b1ce964c0d1dc6beba3083353efc3f6.jpg',
		name: 'On Your Mark',
		description: '',
		fragementSlots: 3,
		hash: 3066103999,
	},
	[EAspectId.KnockEmDown]: {
		id: EAspectId.KnockEmDown,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/01a74478066a61232e0eb0d71d56d89c.jpg',
		name: "Knock 'Em Down",
		description: '',
		fragementSlots: 2,
		hash: 3066103998,
	},
	[EAspectId.GunpowderGamble]: {
		id: EAspectId.GunpowderGamble,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/765402ea0cdaa799f62fe46b57ad8437.jpg',
		name: 'Gunpowder Gamble',
		description: '',
		fragementSlots: 1,
		hash: 3066103996,
	},
	// Arc
	[EAspectId.FlowState]: {
		id: EAspectId.FlowState,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/00954a76dfc633a0714812d332e2850b.jpg',
		name: 'Flow State',
		description: '',
		fragementSlots: 2,
		hash: 4194622036,
	},
	[EAspectId.LethalCurrent]: {
		id: EAspectId.LethalCurrent,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/d62cadbf17b9cf25fee3d2438834733b.jpg',
		name: 'Lethal Current',
		description: '',
		fragementSlots: 2,
		hash: 4194622038,
	},
	[EAspectId.TempestStrike]: {
		id: EAspectId.TempestStrike,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/99e05a19e95ef2e1eceda59fab503afa.jpg',
		name: 'Tempest Strike',
		description: '',
		fragementSlots: 2,
		hash: 4194622037,
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
