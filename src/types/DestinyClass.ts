import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
	Mapping,
} from './globals';
import { EArmorStatId, EDestinyClassId, EDestinySubclassId } from './IdEnums';

export const DestinyClassIdList = ValidateEnumList(
	Object.values(EDestinyClassId),
	[EDestinyClassId.Titan, EDestinyClassId.Warlock, EDestinyClassId.Hunter]
);

export interface IDestinyClass extends IIdentifiableName, IIcon {}

const DestinyClassIdToDestinyClassMapping: EnumDictionary<
	EDestinyClassId,
	IDestinyClass
> = {
	[EDestinyClassId.Titan]: {
		id: EDestinyClassId.Titan,
		name: 'Titan',
		icon: 'https://raw.githubusercontent.com/justrealmilk/destiny-icons/2e747b9ab94cea9423a001710c35af35c79ff625/general/class_titan_outline.svg',
	},
	[EDestinyClassId.Warlock]: {
		id: EDestinyClassId.Warlock,
		name: 'Warlock',
		icon: 'https://raw.githubusercontent.com/justrealmilk/destiny-icons/2e747b9ab94cea9423a001710c35af35c79ff625/general/class_warlock_outline.svg',
		//icon: 'https://www.bungie.net/common/destiny2_content/icons/67f7bbf158f84c33802b178e463b7037.jpg',
	},
	[EDestinyClassId.Hunter]: {
		id: EDestinyClassId.Hunter,
		name: 'Hunter',
		icon: 'https://raw.githubusercontent.com/justrealmilk/destiny-icons/2e747b9ab94cea9423a001710c35af35c79ff625/general/class_hunter_outline.svg',
	},
};

export const DestinyClassIdToDestinyClass: Mapping<
	EDestinyClassId,
	IDestinyClass
> = {
	get: (key: EDestinyClassId) => DestinyClassIdToDestinyClassMapping[key],
};

/****** Related Mappings *****/
const DestinyClassIdToDestinySubclassesMapping: EnumDictionary<
	EDestinyClassId,
	EDestinySubclassId[]
> = {
	[EDestinyClassId.Hunter]: [
		EDestinySubclassId.Arcstrider,
		EDestinySubclassId.Gunslinger,
		EDestinySubclassId.Nightstalker,
		EDestinySubclassId.Revenant,
	],
	[EDestinyClassId.Warlock]: [
		EDestinySubclassId.Dawnblade,
		EDestinySubclassId.Shadebinder,
		EDestinySubclassId.Stormcaller,
		EDestinySubclassId.Voidwalker,
	],
	[EDestinyClassId.Titan]: [
		EDestinySubclassId.Behemoth,
		EDestinySubclassId.Sentinel,
		EDestinySubclassId.Striker,
		EDestinySubclassId.Sunbreaker,
	],
};

export const DestinyClassIdToDestinySubclasses: Mapping<
	EDestinyClassId,
	EDestinySubclassId[]
> = {
	get: (key: EDestinyClassId) => DestinyClassIdToDestinySubclassesMapping[key],
};

// The mapping between destiny classes and the stats that control
// dodge for hunter, rift for warlock and barricade for titan
const DestinyClassIdToClassAbilityStat: EnumDictionary<
	EDestinyClassId,
	EArmorStatId
> = {
	[EDestinyClassId.Hunter]: EArmorStatId.Mobility,
	[EDestinyClassId.Warlock]: EArmorStatId.Recovery,
	[EDestinyClassId.Titan]: EArmorStatId.Resilience,
};

export const getDestinyClassAbilityStat = (id: EDestinyClassId): EArmorStatId =>
	DestinyClassIdToClassAbilityStat[id];
