import {
	DestinyClass,
	DestinyItemInvestmentStatDefinition,
	TierType
} from 'bungie-api-ts-no-const-enum/destiny2/interfaces';
import { ArmorSlot } from './enum/armor';
import { ArmorPerkOrSlot } from './enum/armor';

export interface IManifestArmor {
	hash: number;
	name: string;
	icon: string;
	description: string;
	watermarkIcon: string;
	slot: ArmorSlot;
	clazz: DestinyClass;
	perk: ArmorPerkOrSlot;
	isExotic: 1 | 0;
	rarity: TierType;
	exoticPerkHash: number;
	armor2: boolean;
	isSunset: boolean;
	rawData?: string;
	itemType: number;
	itemSubType: number;
	investmentStats: DestinyItemInvestmentStatDefinition[];
}
