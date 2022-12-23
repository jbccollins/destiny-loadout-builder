import { IIdentifiableName, IHash, IIcon } from './globals';
import {
	EElementId,
	EArmorSlotId,
	EDestinySubclassId,
	EModSocketCategoryId,
} from './IdEnums';

// Define the types/enums/interfaces used by generated files here

// TODO: These could easily change. Find a better way to generate them
export enum ECategoryName {
	CATEGORY_GENERAL = 'General',
	CATEGORY_SEASONAL_ARTIFACT = 'Seasonal Artifact',
	CATEGORY_AMMO_FINDER = 'Ammo Finder',
	CATEGORY_AMMO_SCAVENGER = 'Ammo Scavenger',
	CATEGORY_AMMO_RESERVES = 'Ammo Reserves',
	CATEGORY_TARGETING = 'Targeting',
	CATEGORY_DEXTERITY = 'Dexterity',
	CATEGORY_HOLSTER = 'Holster',
	CATEGORY_LOADERS = 'Loaders',
	CATEGORY_UNFLINCHING_AIM = 'Unflinching Aim',
	CATEGORY_LAST_WISH = 'Last Wish',
	CATEGORY_SEASON_FORGE = 'Season of the Forge',
	CATEGORY_SEASON_DRIFTER = 'Season of the Drifter',
	CATEGORY_SEASON_OPULENCE = 'Season of Opulence',
	CATEGORY_SEASON_UNDYING = 'Season of the Undying',
	CATEGORY_GARDEN_OF_SALVATION = 'Garden of Salvation',
	CATEGORY_SEASON_DAWN = 'Season of Dawn',
	CATEGORY_SEASON_WORTHY = 'Season of the Worthy',
	CATEGORY_SEASON_ARRIVALS = 'Season of Arrivals',
	CATEGORY_DEEP_STONE_CRYPT = 'Deep Stone Crypt',
	CATEGORY_HELM = 'H.E.L.M.',
	CATEGORY_VAULT_OF_GLASS = 'Vault of Glass',
	CATEGORY_VOW_OF_THE_DISCIPLE = 'Vow of the Disciple',
	CATEGORY_KINGS_FALL = "King's Fall",
}

export interface IMod extends IIdentifiableName, IHash, IIcon {
	description: string;
	modSocketCategoryId: EModSocketCategoryId;
	elementId: EElementId;
	cost: number;
	isArtifactMod: boolean;
	category: ECategoryName;
	armorSlotId: EArmorSlotId | null;
	armorSocketIndex: number;
}

export interface IAspect extends IIdentifiableName, IIcon, IHash {
	description: string;
	fragementSlots: number;
}

export interface IGrenade extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
}

export interface IMelee extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
	destinySubclassId: EDestinySubclassId;
}

export interface IClassAbility extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
	destinySubclassId: EDestinySubclassId;
}

export interface IJump extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
	destinySubclassId: EDestinySubclassId;
}

export interface ISuperAbility extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
	destinySubclassId: EDestinySubclassId;
}
