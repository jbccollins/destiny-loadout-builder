import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	Mapping,
	ValidateEnumList,
} from './globals';
import { EArmorSlotId } from './IdEnums';

export const ArmorSlotIdList = [
	EArmorSlotId.Head,
	EArmorSlotId.Arm,
	EArmorSlotId.Chest,
	EArmorSlotId.Leg,
];

export interface IArmorSlot extends IIdentifiableName, IIcon {}

const ArmorSlotIdToArmorSlotMapping: EnumDictionary<EArmorSlotId, IArmorSlot> =
	{
		[EArmorSlotId.Head]: {
			id: EArmorSlotId.Head,
			name: 'Helmet',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
		[EArmorSlotId.Arm]: {
			id: EArmorSlotId.Arm,
			name: 'Gauntlets',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
		[EArmorSlotId.Chest]: {
			id: EArmorSlotId.Chest,
			name: 'Chest Armor',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
		[EArmorSlotId.Leg]: {
			id: EArmorSlotId.Leg,
			name: 'Leg Armor',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
		[EArmorSlotId.ClassItem]: {
			id: EArmorSlotId.ClassItem,
			name: 'Class Item',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
	};

export const ArmorSlotIdToArmorSlot: Mapping<EArmorSlotId, IArmorSlot> = {
	get: (key: EArmorSlotId) => ArmorSlotIdToArmorSlotMapping[key],
};

/****** Extra ******/
export const ArmorSlotWithClassItemIdList = ValidateEnumList(
	Object.values(EArmorSlotId),
	[
		EArmorSlotId.Head,
		EArmorSlotId.Arm,
		EArmorSlotId.Chest,
		EArmorSlotId.Leg,
		EArmorSlotId.ClassItem,
	]
);
