import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
	Mapping,
	MISSING_ICON,
} from './globals';
import { EElementId } from './IdEnums';

export const ElementIdList = ValidateEnumList(Object.values(EElementId), [
	EElementId.Any,
	EElementId.Arc,
	EElementId.Solar,
	EElementId.Void,
	EElementId.Stasis,
]);

export interface IElement extends IIdentifiableName, IIcon {}

const ElementToElementMapping: EnumDictionary<EElementId, IElement> = {
	[EElementId.Any]: {
		id: EElementId.Any,
		name: 'Any',
		icon: MISSING_ICON,
	},
	[EElementId.Arc]: {
		id: EElementId.Arc,
		name: 'Arc',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_092d066688b879c807c3b460afdd61e6.png',
	},
	[EElementId.Solar]: {
		id: EElementId.Solar,
		name: 'Solar',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png',
	},
	[EElementId.Void]: {
		id: EElementId.Void,
		name: 'Void',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png',
	},
	[EElementId.Stasis]: {
		id: EElementId.Stasis,
		name: 'Stasis',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png',
	},
};

export const ElementIdToElement: Mapping<EElementId, IElement> = {
	get: (key: EElementId) => ElementToElementMapping[key],
};

export const getElement = (id: EElementId): IElement =>
	ElementToElementMapping[id];
