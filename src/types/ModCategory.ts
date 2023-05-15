import { EModDisplayNameId } from '@dlb/generated/mod/EModDisplayNameId';

import { EnumDictionary, IIdentifiableName } from './globals';
import { EModCategoryId, ERaidAndNightMareModTypeId } from './IdEnums';

export interface IModCategory extends IIdentifiableName {
	description: string;
}

const ModCategoryIdToModCategoryMapping: EnumDictionary<
	EModCategoryId,
	IModCategory
> = {
	[EModCategoryId.AmmoFinder]: {
		id: EModCategoryId.AmmoFinder,
		name: 'Ammo Finder',
		description: '',
	},
	[EModCategoryId.Siphon]: {
		id: EModCategoryId.Siphon,
		name: 'Siphon',
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
	[EModCategoryId.WeaponSurge]: {
		id: EModCategoryId.WeaponSurge,
		name: 'Weapon Surge',
		description: '',
	},
	[EModCategoryId.Siphon]: {
		id: EModCategoryId.Siphon,
		name: 'Siphon',
		description: '',
	},
	[EModCategoryId.Resistance]: {
		id: EModCategoryId.Resistance,
		name: 'Resistance',
		description: '',
	},
	[EModCategoryId.ArmorCharge]: {
		id: EModCategoryId.ArmorCharge,
		name: 'Armor Charge',
		description: '',
	},
	[EModCategoryId.OrbPickup]: {
		id: EModCategoryId.OrbPickup,
		name: 'Orb Pickup',
		description: '',
	},
	[EModCategoryId.RaidAndNightmare]: {
		id: EModCategoryId.RaidAndNightmare,
		name: 'Raid and Nightmare',
		description: '',
	},
	[EModCategoryId.ArmorStat]: {
		id: EModCategoryId.ArmorStat,
		name: 'Armor Stat',
		description: '',
	},
	[EModCategoryId.ArtificeArmorStat]: {
		id: EModCategoryId.ArtificeArmorStat,
		name: 'Artifice Armor Stat',
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

const findTerm = (s: string, term: string) => {
	if (s.includes(term)) {
		return s;
	}
};

export const getModCategoryId = (
	displayNameId: EModDisplayNameId,
	name: string,
	description: string
): EModCategoryId => {
	if (displayNameId === EModDisplayNameId.ArtificeArmorMod) {
		return EModCategoryId.ArtificeArmorStat;
	}
	if (displayNameId === EModDisplayNameId.GeneralArmorMod) {
		return EModCategoryId.ArmorStat;
	}
	if (displayNameId === EModDisplayNameId.LastWishRaidMod) {
		return EModCategoryId.RaidAndNightmare;
	}
	if (displayNameId === EModDisplayNameId.GardenOfSalvationRaidMod) {
		return EModCategoryId.RaidAndNightmare;
	}
	if (displayNameId === EModDisplayNameId.DeepStoneCryptRaidMod) {
		return EModCategoryId.RaidAndNightmare;
	}
	if (displayNameId === EModDisplayNameId.VaultOfGlassArmorMod) {
		return EModCategoryId.RaidAndNightmare;
	}
	if (displayNameId === EModDisplayNameId.VowOfTheDiscipleRaidMod) {
		return EModCategoryId.RaidAndNightmare;
	}
	if (displayNameId === EModDisplayNameId.KingsFallMod) {
		return EModCategoryId.RaidAndNightmare;
	}
	if (displayNameId === EModDisplayNameId.RootOfNightmaresArmorMod) {
		return EModCategoryId.RaidAndNightmare;
	}
	if (displayNameId === EModDisplayNameId.NightmareMod) {
		return EModCategoryId.RaidAndNightmare;
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
		case findTerm(name, 'Weapon Surge'):
			return EModCategoryId.WeaponSurge;
		case findTerm(name, 'Siphon'):
			return EModCategoryId.Siphon;
		case findTerm(name, 'Resistance'):
			return EModCategoryId.Resistance;
		// TODO: Look in the description for CD?
		case findTerm(name, 'Concussive Dampener'):
			return EModCategoryId.Resistance;
	}
	switch (description) {
		case findTerm(description, 'Armor Charge'):
			return EModCategoryId.ArmorCharge;
		case findTerm(description, 'pick up an Orb of Power'):
			return EModCategoryId.OrbPickup;
	}
	return EModCategoryId.General;
};

export const getRaidAndNightmareModTypeId = (
	displayNameId: EModDisplayNameId
): ERaidAndNightMareModTypeId => {
	if (displayNameId === EModDisplayNameId.LastWishRaidMod) {
		return ERaidAndNightMareModTypeId.LastWish;
	}
	if (displayNameId === EModDisplayNameId.GardenOfSalvationRaidMod) {
		return ERaidAndNightMareModTypeId.GardenOfSalvation;
	}
	if (displayNameId === EModDisplayNameId.DeepStoneCryptRaidMod) {
		return ERaidAndNightMareModTypeId.DeepStoneCrypt;
	}
	if (displayNameId === EModDisplayNameId.VaultOfGlassArmorMod) {
		return ERaidAndNightMareModTypeId.VaultOfGlass;
	}
	if (displayNameId === EModDisplayNameId.VowOfTheDiscipleRaidMod) {
		return ERaidAndNightMareModTypeId.VowOfTheDisciple;
	}
	if (displayNameId === EModDisplayNameId.KingsFallMod) {
		return ERaidAndNightMareModTypeId.KingsFall;
	}
	if (displayNameId === EModDisplayNameId.RootOfNightmaresArmorMod) {
		return ERaidAndNightMareModTypeId.RootOfNightmares;
	}
	if (displayNameId === EModDisplayNameId.NightmareMod) {
		return ERaidAndNightMareModTypeId.NightmareHunt;
	}
	return null;
};
