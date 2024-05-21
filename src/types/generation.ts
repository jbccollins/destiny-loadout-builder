import { EModId } from '@dlb/generated/mod/EModId';
import {
	EArmorSlotId,
	EElementId,
	EModCategoryId,
	EModSocketCategoryId,
	ERaidAndNightMareModTypeId
} from './IdEnums';
import { IBonuses, IHash, IIcon, IIdentifiableName } from './globals';

// Define the types/enums/interfaces used by generated files here

export interface IMod extends IIdentifiableName, IHash, IIcon, IBonuses {
	id: EModId;
	description: string;
	modSocketCategoryId: EModSocketCategoryId;
	modCategoryId: EModCategoryId;
	cost: number;
	isArtifactMod: boolean;
	raidAndNightmareModTypeId: ERaidAndNightMareModTypeId;
	armorSlotId: EArmorSlotId | null;
	armorSocketIndex: number;
	elementOverlayIcon: string;
	similarModsAllowed: boolean;
}

export interface IAspect extends IIdentifiableName, IIcon, IHash {
	description: string;
	fragmentSlots: number;
}

export interface IFragment extends IIdentifiableName, IIcon, IHash, IBonuses {
	description: string;
	elementId: EElementId;
}

export interface IGrenade extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
}

export interface IMelee extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
}

export interface IClassAbility extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
}

export interface IJump extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
}

export interface ISuperAbility extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
}
