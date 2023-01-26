import { EModDisplayNameId } from '@dlb/generated/mod/EModDisplayNameId';

import { EnumDictionary, IIdentifiableName } from './globals';
import { EModCategoryId, EModSocketCategoryId } from './IdEnums';

export interface IModCategory extends IIdentifiableName {
	description: string;
}

const ModCategoryIdToModCategoryMapping: EnumDictionary<
	EModCategoryId,
	IModCategory
> = {
	/*** STASIS ***/
	// POSITIVE
	[EModCategoryId.AmmoFinder]: {
		id: EModCategoryId.AmmoFinder,
		name: 'Ammo Finder',
		description: '',
	},
	[EModCategoryId.Scavenger]: {
		id: EModCategoryId.Scavenger,
		name: 'Scavenger',
		description: '',
	},
	[EModCategoryId.Reserves]: {
		id: EModCategoryId.Reserves,
		name: 'Reserves',
		description: '',
	},
	[EModCategoryId.Targeting]: {
		id: EModCategoryId.Targeting,
		name: 'Targeting',
		description: '',
	},
	[EModCategoryId.Dexterity]: {
		id: EModCategoryId.Dexterity,
		name: 'Dexterity',
		description: '',
	},
	[EModCategoryId.Holster]: {
		id: EModCategoryId.Holster,
		name: 'Holster',
		description: '',
	},
	[EModCategoryId.Loader]: {
		id: EModCategoryId.Loader,
		name: 'Loader',
		description: '',
	},
	[EModCategoryId.Unflinching]: {
		id: EModCategoryId.Unflinching,
		name: 'Unflinching',
		description: '',
	},
	[EModCategoryId.ChargedWithLight]: {
		id: EModCategoryId.ChargedWithLight,
		name: 'Charged With Light',
		description: '',
	},
	[EModCategoryId.ElementalWell]: {
		id: EModCategoryId.ElementalWell,
		name: 'Elemental Well',
		description: '',
	},
	[EModCategoryId.WarmindCell]: {
		id: EModCategoryId.WarmindCell,
		name: 'Warmind Cell',
		description: '',
	},
	[EModCategoryId.LastWish]: {
		id: EModCategoryId.LastWish,
		name: 'Last Wish',
		description: '',
	},
	[EModCategoryId.GardenOfSalvation]: {
		id: EModCategoryId.GardenOfSalvation,
		name: 'Garden of Salvation',
		description: '',
	},
	[EModCategoryId.DeepStoneCrypt]: {
		id: EModCategoryId.DeepStoneCrypt,
		name: 'Deep Stone Crypt',
		description: '',
	},
	[EModCategoryId.VaultOfGlass]: {
		id: EModCategoryId.VaultOfGlass,
		name: 'Vault of Glass',
		description: '',
	},
	[EModCategoryId.VowOfTheDisciple]: {
		id: EModCategoryId.VowOfTheDisciple,
		name: 'Vow of the Disciple',
		description: '',
	},
	[EModCategoryId.KingsFall]: {
		id: EModCategoryId.KingsFall,
		name: "King's Fall",
		description: '',
	},
	[EModCategoryId.ArmorStat]: {
		id: EModCategoryId.ArmorStat,
		name: 'Armor Stat',
		description: '',
	},
	[EModCategoryId.General]: {
		id: EModCategoryId.General,
		name: 'General',
		description: '',
	},
};

export const getModCategory = (id: EModCategoryId) => {
	return ModCategoryIdToModCategoryMapping[id];
};

const findTerm = (name: string, term: string) => {
	if (name.includes(term)) {
		return name;
	}
};

export const getModCategoryIdByModName = (
	displayNameId: EModDisplayNameId,
	name: string
): EModCategoryId => {
	if (displayNameId === EModDisplayNameId.ChargedWithLightMod) {
		return EModCategoryId.ChargedWithLight;
	}
	if (displayNameId === EModDisplayNameId.ElementalWellMod) {
		return EModCategoryId.ElementalWell;
	}
	if (displayNameId === EModDisplayNameId.WarmindCellMod) {
		return EModCategoryId.WarmindCell;
	}
	if (displayNameId === EModDisplayNameId.GeneralArmorMod) {
		return EModCategoryId.ArmorStat;
	}
	switch (name) {
		case findTerm(name, 'Ammo Finder'):
			return EModCategoryId.AmmoFinder;
		case findTerm(name, 'Scavenger'):
			return EModCategoryId.Scavenger;
		case findTerm(name, 'Reserves'):
			return EModCategoryId.Reserves;
		case findTerm(name, 'Targeting'):
			return EModCategoryId.Targeting;
		case findTerm(name, 'Dexterity'):
			return EModCategoryId.Dexterity;
		case findTerm(name, 'Holster'):
			return EModCategoryId.Holster;
		case findTerm(name, 'Loader'):
			return EModCategoryId.Loader;
		case findTerm(name, 'Unflinching'):
			return EModCategoryId.Unflinching;
		case findTerm(name, 'Last Wish'):
			return EModCategoryId.LastWish;
		case findTerm(name, 'Garden of Salvation'):
			return EModCategoryId.GardenOfSalvation;
		case findTerm(name, 'Deep Stone Crypt'):
			return EModCategoryId.DeepStoneCrypt;
		case findTerm(name, 'Vault of Glass'):
			return EModCategoryId.VaultOfGlass;
		case findTerm(name, 'Vow of the Disciple'):
			return EModCategoryId.VowOfTheDisciple;
		case findTerm(name, "King's Fall"):
			return EModCategoryId.KingsFall;
		default:
			return EModCategoryId.General;
	}
};
