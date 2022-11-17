import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
	Mapping,
} from './globals';
import { EDestinyClassId, EDestinySubclassId } from './IdEnums';

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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/84fcf9589ae5320f282abe89bd0c5fff.jpg',
	},
	[EDestinyClassId.Warlock]: {
		id: EDestinyClassId.Warlock,
		name: 'Warlock',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/67f7bbf158f84c33802b178e463b7037.jpg',
	},
	[EDestinyClassId.Hunter]: {
		id: EDestinyClassId.Hunter,
		name: 'Hunter',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/57f35a636ef455069d04231d4a564013.jpg',
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
