import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
	Mapping,
} from './globals';
import { EElement } from './IdEnums';

export const ElementIdList = ValidateEnumList(Object.values(EElement), [
	EElement.Any,
	EElement.Arc,
	EElement.Solar,
	EElement.Void,
	EElement.Stasis,
]);

export interface IElement extends IIdentifiableName, IIcon {}

const ElementToElementMapping: EnumDictionary<EElement, IElement> = {
	[EElement.Any]: {
		id: EElement.Any,
		name: 'Any',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EElement.Arc]: {
		id: EElement.Arc,
		name: 'Arc',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_092d066688b879c807c3b460afdd61e6.png',
	},
	[EElement.Solar]: {
		id: EElement.Solar,
		name: 'Solar',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png',
	},
	[EElement.Void]: {
		id: EElement.Void,
		name: 'Void',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png',
	},
	[EElement.Stasis]: {
		id: EElement.Stasis,
		name: 'Stasis',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEnergyTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png',
	},
};

export const ElementIdToElement: Mapping<EElement, IElement> = {
	get: (key: EElement) => ElementToElementMapping[key],
};
