import { EModDisplayNameId } from '@dlb/generated/mod/EModDisplayNameId';

import { EModId } from '@dlb/generated/mod/EModId';
import { EnumDictionary, IIdentifiableName } from './globals';
import {
	EElementId,
	EModCategoryId,
	ERaidAndNightMareModTypeId,
} from './IdEnums';

enum EAuthorizedAbility {
	Melee = 'Melee',
	Grenade = 'Grenade',
	ClassAbility = 'ClassAbility',
}

// TODO: Figure out how to generate these programatically
const currentSeasonAuthorizedElements: EElementId[] = [
	EElementId.Arc,
	EElementId.Void,
	EElementId.Strand,
];
const currentSeasonAuthorizedAbilities: EAuthorizedAbility[] = [
	EAuthorizedAbility.Melee,
];

const AuthorizedAbilityMapping: Record<EAuthorizedAbility, EModId[]> = {
	[EAuthorizedAbility.Melee]: [
		EModId.ArtifactHandsOn,
		EModId.ArtifactHeavyHanded,
		EModId.ArtifactFocusingStrike,
		EModId.ArtifactMeleeKickstart,
		EModId.ArtifactMomentumTransfer,
	],
	[EAuthorizedAbility.Grenade]: [],
	[EAuthorizedAbility.ClassAbility]: [],
};

const AuthorizedElementalModCategories: EModCategoryId[] = [
	EModCategoryId.AmmoFinder,
	EModCategoryId.Scavenger,
	EModCategoryId.Reserves,
	EModCategoryId.Targeting,
	EModCategoryId.Dexterity,
	EModCategoryId.Holster,
	EModCategoryId.Loader,
	EModCategoryId.Unflinching,
	EModCategoryId.WeaponSurge,
	EModCategoryId.Siphon,
];

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
	[EModCategoryId.AlternateSeasonalArtifact]: {
		id: EModCategoryId.AlternateSeasonalArtifact,
		// TODO: Fix this name. It starts with z for sorting
		name: 'z Alternate Seasonal Artifact z',
		description: '',
	},
};

export const getModCategory = (id: EModCategoryId) => {
	return ModCategoryIdToModCategoryMapping[id];
};

const findTerm = (s: string, term: string) => {
	if (s.toLowerCase().includes(term.toLowerCase())) {
		return s;
	}
};

export const getModCategoryId = (
	displayNameId: EModDisplayNameId,
	name: string,
	description: string,
	modId: EModId,
	isArtifactMod: boolean
): EModCategoryId => {
	// TODO: Fix this. Actually figure out which dual siphon mods are authorized
	if (modId.includes('DualSiphon')) {
		return EModCategoryId.AlternateSeasonalArtifact;
	}
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
	let termModCategory: EModCategoryId = null;
	switch (name) {
		case findTerm(name, 'Ammo Finder'):
			termModCategory = EModCategoryId.AmmoFinder;
			break;
		case findTerm(name, 'Scavenger'):
			termModCategory = EModCategoryId.Scavenger;
			break;
		case findTerm(name, 'Reserves'):
			termModCategory = EModCategoryId.Reserves;
			break;
		case findTerm(name, 'Targeting'):
			termModCategory = EModCategoryId.Targeting;
			break;
		case findTerm(name, 'Dexterity'):
			termModCategory = EModCategoryId.Dexterity;
			break;
		case findTerm(name, 'Holster'):
			termModCategory = EModCategoryId.Holster;
			break;
		case findTerm(name, 'Loader'):
			termModCategory = EModCategoryId.Loader;
			break;
		case findTerm(name, 'Unflinching'):
			termModCategory = EModCategoryId.Unflinching;
			break;
		case findTerm(name, 'Weapon Surge'):
			termModCategory = EModCategoryId.WeaponSurge;
			break;
		case findTerm(name, 'Siphon'):
			termModCategory = EModCategoryId.Siphon;
			break;
		case findTerm(name, 'Resistance'):
			termModCategory = EModCategoryId.Resistance;
			break;
		// TODO: Look in the description for CD?
		case findTerm(name, 'Concussive Dampener'):
			termModCategory = EModCategoryId.Resistance;
			break;
	}
	let isInCurrentSeasonArtifact = false;
	// Hacky check to see if the element is in the mod id
	if (termModCategory) {
		if (
			isArtifactMod &&
			AuthorizedElementalModCategories.includes(termModCategory)
		) {
			for (let i = 0; i < currentSeasonAuthorizedElements.length; i++) {
				const element = currentSeasonAuthorizedElements[i];
				if (modId.includes(element)) {
					isInCurrentSeasonArtifact = true;
					break;
				}
			}
			if (!isInCurrentSeasonArtifact) {
				return EModCategoryId.AlternateSeasonalArtifact;
			}
		}
	} else if (isArtifactMod) {
		// Hacky check to see if the ability is authorized in the current artifact
		for (let i = 0; i < currentSeasonAuthorizedAbilities.length; i++) {
			const ability = currentSeasonAuthorizedAbilities[i];
			if (AuthorizedAbilityMapping[ability].includes(modId)) {
				isInCurrentSeasonArtifact = true;
				break;
			}
		}
	}

	if (isArtifactMod && !isInCurrentSeasonArtifact) {
		return EModCategoryId.AlternateSeasonalArtifact;
	} else if (termModCategory !== null) {
		return termModCategory;
	}

	switch (description) {
		case findTerm(description, 'Armor Charge'):
			return EModCategoryId.ArmorCharge;
		case findTerm(description, 'pick up an orb of power'):
			return EModCategoryId.OrbPickup;
		case findTerm(description, 'picking up an orb of power'):
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
