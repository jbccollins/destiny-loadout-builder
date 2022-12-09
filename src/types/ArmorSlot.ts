import { ItemCategoryHashes } from '@dlb/dim/data/d2/generated-enums';
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

/*ItemCategoryHashes
	ArmorMods = 4104513227,
	ArmorModsChest = 3723676689,
	ArmorModsClass = 3196106184,
	ArmorModsClassHunter = 1037516129,
	ArmorModsClassTitan = 1650311619,
	ArmorModsClassWarlock = 2955376534,
	ArmorModsGameplay = 4062965806,
	ArmorModsGauntlets = 3872696960,
	ArmorModsGlowEffects = 1875601085,
	ArmorModsHelmet = 1362265421,
	ArmorModsLegs = 3607371986,
*/

const ArmorSlotHashToArmorSlotIdMapping: Record<number, EArmorSlotId> = {
	[ItemCategoryHashes.ArmorModsHelmet]: EArmorSlotId.Head,
	[ItemCategoryHashes.ArmorModsGauntlets]: EArmorSlotId.Arm,
	[ItemCategoryHashes.ArmorModsChest]: EArmorSlotId.Chest,
	[ItemCategoryHashes.ArmorModsLegs]: EArmorSlotId.Leg,
	[ItemCategoryHashes.ArmorModsClass]: EArmorSlotId.ClassItem,
};

export const getArmorSlotIdByHash = (hash: number): EArmorSlotId =>
	ArmorSlotHashToArmorSlotIdMapping[hash];
