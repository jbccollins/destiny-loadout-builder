import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	Mapping,
	MISSING_ICON,
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
			icon: MISSING_ICON,
		},
		[EArmorSlotId.Arm]: {
			id: EArmorSlotId.Arm,
			name: 'Gauntlets',
			icon: MISSING_ICON,
		},
		[EArmorSlotId.Chest]: {
			id: EArmorSlotId.Chest,
			name: 'Chest Armor',
			icon: MISSING_ICON,
		},
		[EArmorSlotId.Leg]: {
			id: EArmorSlotId.Leg,
			name: 'Leg Armor',
			icon: MISSING_ICON,
		},
		[EArmorSlotId.ClassItem]: {
			id: EArmorSlotId.ClassItem,
			name: 'Class Item',
			icon: MISSING_ICON,
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
