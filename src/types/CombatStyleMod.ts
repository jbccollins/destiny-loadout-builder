import { getDestinyClassAbilityStat } from './DestinyClass';
import {
	IIdentifiableName,
	IIcon,
	IHash,
	EnumDictionary,
	StatBonus,
} from './globals';
import { EArmorStatId, ECombatStyleModId, EElementId } from './IdEnums';

export const CombatStyleModIdList = Object.values(ECombatStyleModId);

export interface ICombatStyleMod extends IIdentifiableName, IIcon, IHash {
	description: string;
	bonuses: StatBonus[];
	cost: number;
	element: EElementId;
}

const CombatStyleModIdToCombatStyleModMapping: EnumDictionary<
	ECombatStyleModId,
	ICombatStyleMod
> = {
	// POSITIVE Mods
	[ECombatStyleModId.PowerfulFriends]: {
		id: ECombatStyleModId.PowerfulFriends,
		name: 'Powerful Friends',
		description:
			'When you become Charged with Light, nearby allies also become Charged with Light, if they are not already.',
		bonuses: [{ stat: EArmorStatId.Mobility, value: 20 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 4,
		element: EElementId.Arc,
		hash: 1484685887,
	},
	[ECombatStyleModId.RadiantLight]: {
		id: ECombatStyleModId.RadiantLight,
		name: 'Radiant Light',
		description:
			'Casting your Super causes nearby allies to become Charged with Light.',
		bonuses: [{ stat: EArmorStatId.Strength, value: 20 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 3,
		element: EElementId.Arc,
		hash: 2979815167,
	},
	// NEGATIVE Mods
	[ECombatStyleModId.ProtectiveLight]: {
		id: ECombatStyleModId.ProtectiveLight,
		name: 'Protective Light',
		description:
			'While Charged with Light, you gain significant damage resistance against combatants when your shields are destroyed. This effect consumes all stacks of Charged with Light. The more stacks consumed, the longer the damage resistance lasts.',
		bonuses: [{ stat: EArmorStatId.Strength, value: -10 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 2,
		element: EElementId.Void,
		hash: 3523075120,
	},
	[ECombatStyleModId.ExtraReserves]: {
		id: ECombatStyleModId.ExtraReserves,
		name: 'Extra Reserves',
		description:
			'While Charged with Light, defeating combatants with Void damage grants a chance to drop Special ammo. This effect consumes all stacks of Charged with Light. The more stacks you have, the higher your chance of gaining the ammo drop.',
		bonuses: [{ stat: EArmorStatId.Intellect, value: -10 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 3,
		element: EElementId.Void,
		hash: 3523075121,
	},
	[ECombatStyleModId.PreciselyCharged]: {
		id: ECombatStyleModId.PreciselyCharged,
		name: 'Precisely Charged',
		description:
			'Become Charged with Light by getting multiple rapid precision final blows with Linear Fusion Rifles or Sniper Rifles.',
		bonuses: [{ stat: EArmorStatId.Discipline, value: -10 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 1,
		element: EElementId.Void,
		hash: 3523075122,
	},
	[ECombatStyleModId.StacksOnStacks]: {
		id: ECombatStyleModId.StacksOnStacks,
		name: 'Stacks on Stacks',
		description:
			'Gain an extra stack of Charged with Light for every stack you gain.',
		bonuses: [{ stat: EArmorStatId.Recovery, value: -10 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 4,
		element: EElementId.Void,
		hash: 3523075123,
	},
	[ECombatStyleModId.PrecisionCharge]: {
		id: ECombatStyleModId.PrecisionCharge,
		name: 'Precision Charge',
		description:
			'Become Charged with Light by rapidly defeating combatants with precision kills from Bows, Hand Cannons, and Scout Rifles.',
		bonuses: [{ stat: EArmorStatId.Strength, value: -10 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 2,
		element: EElementId.Void,
		hash: 2263321584,
	},
	[ECombatStyleModId.SurpriseAttack]: {
		id: ECombatStyleModId.SurpriseAttack,
		name: 'Surprise Attack',
		description:
			'While Charged with Light, reloading or readying a Sidearm will consume all stacks of Charged with Light and convert them into stacks of a major damage buff, which are depleted as you damage combatants with that Sidearm.',
		bonuses: [{ stat: EArmorStatId.Intellect, value: -10 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 1,
		element: EElementId.Void,
		hash: 2263321585,
	},
	[ECombatStyleModId.EnergyConverter]: {
		id: ECombatStyleModId.EnergyConverter,
		name: 'Energy Converter',
		description:
			'While Charged with Light, using your grenade attack grants you Super energy, consuming all stacks of Charged with Light. The more stacks you have, the more energy you gain, up to a maximum of 50% of your Super energy.',
		bonuses: [{ stat: EArmorStatId.Discipline, value: -10 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 4,
		element: EElementId.Void,
		hash: 2263321586,
	},
	[ECombatStyleModId.ChargeHarvester]: {
		id: ECombatStyleModId.ChargeHarvester,
		name: 'Charge Harvester',
		description:
			'While you are not Charged with Light, any kill or assist has a small cumulative chance to cause you to become Charged with Light.',
		bonuses: [{ stat: getDestinyClassAbilityStat, value: -10 }],
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 3,
		element: EElementId.Void,
		hash: 2263321587,
	},
};

export const getCombatStyleMod = (id: ECombatStyleModId): ICombatStyleMod =>
	CombatStyleModIdToCombatStyleModMapping[id];
