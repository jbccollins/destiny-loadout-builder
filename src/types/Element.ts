import {
	EnumDictionary,
	IHash,
	IIcon,
	IIdentifiableName,
	Mapping,
	MISSING_ICON,
	ValidateEnumList,
} from './globals';
import { EElementId } from './IdEnums';

export const ElementIdList = ValidateEnumList(Object.values(EElementId), [
	EElementId.Any,
	EElementId.Arc,
	EElementId.Solar,
	EElementId.Void,
	EElementId.Stasis,
	EElementId.Strand,
]);

export interface IElement extends IIdentifiableName, IIcon, IHash {}

const ElementIdToElementMapping: EnumDictionary<EElementId, IElement> = {
	[EElementId.Any]: {
		id: EElementId.Any,
		name: 'Any',
		icon: MISSING_ICON,
		hash: 1198124803,
	},
	[EElementId.Arc]: {
		id: EElementId.Arc,
		name: 'Arc',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_092d066688b879c807c3b460afdd61e6.png',
		hash: 728351493,
	},
	[EElementId.Solar]: {
		id: EElementId.Solar,
		name: 'Solar',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png',
		hash: 591714140,
	},
	[EElementId.Void]: {
		id: EElementId.Void,
		name: 'Void',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png',
		hash: 4069572561,
	},
	[EElementId.Stasis]: {
		id: EElementId.Stasis,
		name: 'Stasis',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png',
		hash: 1819698290,
	},
	[EElementId.Strand]: {
		id: EElementId.Strand,
		name: 'Strand',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png',
		hash: 1819698290,
	},
	[EElementId.Prismatic]: {
		id: EElementId.Prismatic,
		name: 'Prismatic',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png',
		hash: 1234567890,
	},
};

export const ElementIdToElement: Mapping<EElementId, IElement> = {
	get: (key: EElementId) => ElementIdToElementMapping[key],
};

export enum EElementHash {
	Any = 1198124803,
	Arc = 728351493,
	Solar = 591714140,
	Void = 4069572561,
	Stasis = 1819698290,
}

export const getElement = (id: EElementId): IElement =>
	ElementIdToElementMapping[id];

const ElementHashToElementIdMapping: EnumDictionary<EElementHash, EElementId> =
	{
		[EElementHash.Any]: EElementId.Any,
		[EElementHash.Arc]: EElementId.Arc,
		[EElementHash.Solar]: EElementId.Solar,
		[EElementHash.Void]: EElementId.Void,
		[EElementHash.Stasis]: EElementId.Stasis,
	};

export const getElementIdByHash = (hash: EElementHash): EElementId =>
	ElementHashToElementIdMapping[hash];
