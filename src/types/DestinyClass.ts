import hunter_icon from '@public/class_hunter_outline.png';
import titan_icon from '@public/class_titan_outline.png';
import warlock_icon from '@public/class_warlock_outline.png';
import {
	EnumDictionary,
	IIconStaticImageData,
	IIdentifiableName,
	Mapping,
	ValidateEnumList,
} from './globals';
import { EArmorStatId, EDestinyClassId, EDestinySubclassId } from './IdEnums';

export const DestinyClassIdList = ValidateEnumList(
	Object.values(EDestinyClassId),
	[EDestinyClassId.Titan, EDestinyClassId.Warlock, EDestinyClassId.Hunter]
);

export interface IDestinyClass
	extends IIdentifiableName,
		IIconStaticImageData {}

const DestinyClassIdToDestinyClassMapping: EnumDictionary<
	EDestinyClassId,
	IDestinyClass
> = {
	[EDestinyClassId.Titan]: {
		id: EDestinyClassId.Titan,
		name: 'Titan',
		icon: titan_icon,
	},
	[EDestinyClassId.Warlock]: {
		id: EDestinyClassId.Warlock,
		name: 'Warlock',
		icon: warlock_icon,
	},
	[EDestinyClassId.Hunter]: {
		id: EDestinyClassId.Hunter,
		name: 'Hunter',
		icon: hunter_icon,
	},
};

export const DestinyClassIdToDestinyClass: Mapping<
	EDestinyClassId,
	IDestinyClass
> = {
	get: (key: EDestinyClassId) => DestinyClassIdToDestinyClassMapping[key],
};

export const getDestinyClass = (id: EDestinyClassId): IDestinyClass =>
	DestinyClassIdToDestinyClassMapping[id];

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
		EDestinySubclassId.Threadrunner,
	],
	[EDestinyClassId.Warlock]: [
		EDestinySubclassId.Dawnblade,
		EDestinySubclassId.Shadebinder,
		EDestinySubclassId.Stormcaller,
		EDestinySubclassId.Voidwalker,
		EDestinySubclassId.Broodweaver,
	],
	[EDestinyClassId.Titan]: [
		EDestinySubclassId.Behemoth,
		EDestinySubclassId.Sentinel,
		EDestinySubclassId.Striker,
		EDestinySubclassId.Sunbreaker,
		EDestinySubclassId.Berserker,
	],
};

export const getDestinySubclassIdListByDestinyClassId = (
	destinyClassId: EDestinyClassId
): EDestinySubclassId[] =>
	DestinyClassIdToDestinySubclassesMapping[destinyClassId];

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

export const getDestinyClassIdByDestinySubclassId = (
	id: EDestinySubclassId
): EDestinyClassId => {
	for (const [destinyClassId, destinySubclassIdList] of Object.entries(
		DestinyClassIdToDestinySubclassesMapping
	)) {
		if (destinySubclassIdList.includes(id)) {
			return destinyClassId as EDestinyClassId;
		}
	}
};
