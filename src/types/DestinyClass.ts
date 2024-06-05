import {
	EnumDictionary,
	IIdentifiableName,
	Mapping,
	ValidateEnumList,
} from './globals';
import { EArmorStatId, EDestinyClassId, EDestinySubclassId } from './IdEnums';

export const DestinyClassIdList = ValidateEnumList(
	Object.values(EDestinyClassId),
	[EDestinyClassId.Titan, EDestinyClassId.Warlock, EDestinyClassId.Hunter]
);

const DestinyClassIdToDestinyClassMapping: EnumDictionary<
	EDestinyClassId,
	IIdentifiableName
> = {
	[EDestinyClassId.Titan]: {
		id: EDestinyClassId.Titan,
		name: 'Titan',
	},
	[EDestinyClassId.Warlock]: {
		id: EDestinyClassId.Warlock,
		name: 'Warlock',
	},
	[EDestinyClassId.Hunter]: {
		id: EDestinyClassId.Hunter,
		name: 'Hunter',
	},
};

export const DestinyClassIdToDestinyClass: Mapping<
	EDestinyClassId,
	IIdentifiableName
> = {
	get: (key: EDestinyClassId) => DestinyClassIdToDestinyClassMapping[key],
};

export const getDestinyClass = (id: EDestinyClassId): IIdentifiableName =>
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
		EDestinySubclassId.PrismHunter,
	],
	[EDestinyClassId.Warlock]: [
		EDestinySubclassId.Dawnblade,
		EDestinySubclassId.Shadebinder,
		EDestinySubclassId.Stormcaller,
		EDestinySubclassId.Voidwalker,
		EDestinySubclassId.Broodweaver,
		EDestinySubclassId.PrismWarlock,
	],
	[EDestinyClassId.Titan]: [
		EDestinySubclassId.Behemoth,
		EDestinySubclassId.Sentinel,
		EDestinySubclassId.Striker,
		EDestinySubclassId.Sunbreaker,
		EDestinySubclassId.Berserker,
		EDestinySubclassId.PrismTitan,
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
