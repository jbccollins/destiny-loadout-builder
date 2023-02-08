import { ArmorStatMapping } from './ArmorStat';
import { getDestinyClassAbilityStat } from './DestinyClass';
import {
	IIdentifiableName,
	IIcon,
	IHash,
	EnumDictionary,
	StatBonus,
	MISSING_ICON,
} from './globals';
import { EArmorSlotId, EModTypeDisplayNameId } from './IdEnums';

export const ModTypeDisplayNameIdList = Object.values(EModTypeDisplayNameId);

export interface IModTypeDisplayName {
	name: string;
}

const ModTypeDisplayNameIdToModTypeDisplayNameMapping: EnumDictionary<
	EModTypeDisplayNameId,
	IModTypeDisplayName
> = {
	[EModTypeDisplayNameId.ArmsArmorMod]: { name: 'Arms Armor Mod' },
	[EModTypeDisplayNameId.LegArmorMod]: { name: 'Leg Armor Mod' },
	[EModTypeDisplayNameId.ChestArmorMod]: { name: 'Chest Armor Mod' },
	[EModTypeDisplayNameId.WarmindCellMod]: { name: 'Warmind Cell Mod' },
	[EModTypeDisplayNameId.GeneralArmorMod]: { name: 'General Armor Mod' },
	[EModTypeDisplayNameId.HelmetArmorMod]: { name: 'Helmet Armor Mod' },
	[EModTypeDisplayNameId.ElementalWellMod]: { name: 'Elemental Well Mod' },
	[EModTypeDisplayNameId.LastWishRaidMod]: { name: 'Last Wish Raid Mod' },
	[EModTypeDisplayNameId.ClassItemArmorMod]: { name: 'Class Item Armor Mod' },
	[EModTypeDisplayNameId.VaultofGlassArmorMod]: {
		bonuses: [],
		name: 'Vault of Glass Armor Mod',
	},
	[EModTypeDisplayNameId.ClassItemMod]: { name: 'Class Item Mod' },
	[EModTypeDisplayNameId.DeepStoneCryptRaidMod]: {
		bonuses: [],
		name: 'Deep Stone Crypt Raid Mod',
	},
	[EModTypeDisplayNameId.KingsFallMod]: { name: "King's Fall Mod" },
	[EModTypeDisplayNameId.GardenofSalvationRaidMod]: {
		bonuses: [],
		name: 'Garden of Salvation Raid Mod',
	},
	[EModTypeDisplayNameId.VowoftheDiscipleRaidMod]: {
		bonuses: [],
		name: 'Vow of the Disciple Raid Mod',
	},
	[EModTypeDisplayNameId.ChargedwithLightMod]: {
		bonuses: [],
		name: 'Charged with Light Mod',
	},
	[EModTypeDisplayNameId.NightmareMod]: { name: 'Nightmare Mod' },
};

export const getModTypeDisplayNameIdByName = (name: string) =>
	ModTypeDisplayNameIdList.find(
		(x) => ModTypeDisplayNameIdToModTypeDisplayNameMapping[x].name === name
	);

const ModTypeDisplayNameIdToArmorSlotId: EnumDictionary<
	EModTypeDisplayNameId,
	EArmorSlotId
> = {
	// Slot Specific
	[EModTypeDisplayNameId.HelmetArmorMod]: EArmorSlotId.Head,
	[EModTypeDisplayNameId.ArmsArmorMod]: EArmorSlotId.Arm,
	[EModTypeDisplayNameId.LegArmorMod]: EArmorSlotId.Leg,
	[EModTypeDisplayNameId.ChestArmorMod]: EArmorSlotId.Chest,
	[EModTypeDisplayNameId.ClassItemArmorMod]: EArmorSlotId.ClassItem,
	// Weirdly class item artifact mods have this odd type but whatever
	[EModTypeDisplayNameId.ClassItemMod]: EArmorSlotId.ClassItem,
	// Combat Style
	[EModTypeDisplayNameId.WarmindCellMod]: null,
	[EModTypeDisplayNameId.ElementalWellMod]: null,
	[EModTypeDisplayNameId.ChargedwithLightMod]: null,
	// Major / Minor stat mods
	[EModTypeDisplayNameId.GeneralArmorMod]: null,
	// Raid Mods
	[EModTypeDisplayNameId.LastWishRaidMod]: null,
	[EModTypeDisplayNameId.GardenofSalvationRaidMod]: null,
	[EModTypeDisplayNameId.DeepStoneCryptRaidMod]: null,
	[EModTypeDisplayNameId.VaultofGlassArmorMod]: null,
	[EModTypeDisplayNameId.VowoftheDiscipleRaidMod]: null,
	[EModTypeDisplayNameId.KingsFallMod]: null,
	// Nightmare mods are special
	[EModTypeDisplayNameId.NightmareMod]: null,
};

export const getArmorSlotIdByModTypeDisplayNameId = (
	id: EModTypeDisplayNameId
): EArmorSlotId => ModTypeDisplayNameIdToArmorSlotId[id];
