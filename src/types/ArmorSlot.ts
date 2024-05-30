import { ItemCategoryHashes } from '@dlb/dim/data/d2/generated-enums';
import { EArmorSlotId } from './IdEnums';
import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
} from './globals';

export const ArmorSlotIdList = [
	EArmorSlotId.Head,
	EArmorSlotId.Arm,
	EArmorSlotId.Chest,
	EArmorSlotId.Leg,
];

export interface IArmorSlot extends IIdentifiableName, IIcon { }

const ArmorSlotIdToArmorSlotMapping: EnumDictionary<EArmorSlotId, IArmorSlot> =
{
	[EArmorSlotId.Head]: {
		id: EArmorSlotId.Head,
		name: 'Helmet',
		icon: "data:image/svg+xml,%3csvg fill='%23B7B7B7' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 51 51'%3e%3cpath d='M24.77 7.03c-8.15.38-14.42 7.41-14.42 15.57v16.06c0 .23.13.44.34.53l10.33 4.68c.78.35 1.66-.22 1.66-1.07V31.9c0-.39-.19-.75-.52-.97l-5.39-3.64c-.87-.52-1.43-1.5-1.34-2.61.13-1.46 1.46-2.52 2.93-2.52h4.36c.65 0 1.17.53 1.17 1.17v6.71s0 .61 1.61.61 1.61-.61 1.61-.61v-6.71c0-.65.52-1.17 1.17-1.17h4.36c1.47 0 2.8 1.06 2.93 2.52.1 1.11-.47 2.09-1.34 2.61l-5.39 3.64c-.32.22-.52.58-.52.97v10.91c0 .85.88 1.42 1.66 1.07l10.33-4.68c.21-.1.34-.3.34-.53v-16.5c.01-8.61-7.18-15.55-15.88-15.14z'/%3e%3c/svg%3e",
	},
	[EArmorSlotId.Arm]: {
		id: EArmorSlotId.Arm,
		name: 'Gauntlets',
		icon: "data:image/svg+xml,%3csvg fill='%23B7B7B7' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 51 51'%3e%3cpath d='M40.1 30.03c.39-.47.59-1.11.42-1.8-.18-.76-.81-1.39-1.58-1.55-.81-.17-1.54.14-2.01.68 0 0-.03.04-.05.07l-.12.15c-.47.61-1.95 2.37-3.29 2.45-1.62.1 2.51-16.14 2.51-16.14h-.01c.04-.15.07-.31.07-.48 0-.98-.79-1.77-1.77-1.77-.81 0-1.49.55-1.69 1.29h-.01s-.01.03-.01.05l-.03.15c-.24 1.21-1.68 8.2-2.81 8.89-1.24.75-1.22-13.23-1.22-13.23 0-.98-.79-1.77-1.77-1.77s-1.77.79-1.77 1.77c0 0-.35 12.85-1.73 12.73-1.37-.12-2.47-10.67-2.47-10.67 0-.98-.79-1.77-1.77-1.77s-1.77.79-1.77 1.77c0 .15.02.28.06.42.27 2.06 1.36 11.12-.06 11.12-1.6 0-3.68-6.35-3.68-6.35a1.62 1.62 0 0 0-3.14.56c0 .09.01.17.03.25l-.03.01s.02.07.07.19c.02.09.05.17.09.25.99 2.71 6.28 17.46 7.26 26.23.03.25.24.44.49.44H30.5a.5.5 0 0 0 .5-.45c.1-1.04.52-3.68 2.09-5.54 1.8-2.14 6.06-6.89 6.86-7.79.02-.02.03-.04.05-.06.07-.06.11-.1.1-.1z'/%3e%3c/svg%3e",
	},
	[EArmorSlotId.Chest]: {
		id: EArmorSlotId.Chest,
		name: 'Chest Armor',
		icon: "data:image/svg+xml,%3csvg fill='%23B7B7B7' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 51 51'%3e%3cpath d='M42.49 13.55c-1.06-1.51-4.05-5.05-9.52-6.49a.635.635 0 0 0-.78.5c-.35 2.04-1.78 8.08-6.69 8.08s-6.34-6.04-6.69-8.08a.635.635 0 0 0-.78-.5c-5.47 1.44-8.46 4.98-9.52 6.49-.24.34-.09.8.3.94 2.01.7 7.34 2.94 7.34 7.01 0 4.24-4.47 6.89-5.87 7.61-.25.13-.38.4-.33.67 1.44 7.62 7.55 13.09 8.67 14.04.11.1.25.15.4.15h12.94c.15 0 .29-.05.4-.15 1.12-.95 7.23-6.42 8.67-14.04a.624.624 0 0 0-.33-.67c-1.4-.72-5.87-3.37-5.87-7.61 0-4.08 5.33-6.32 7.34-7.01.41-.14.56-.61.32-.94z'/%3e%3c/svg%3e",
	},
	[EArmorSlotId.Leg]: {
		id: EArmorSlotId.Leg,
		name: 'Leg Armor',
		icon: "data:image/svg+xml,%3csvg fill='%23B7B7B7' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 51 51'%3e%3cpath d='M13 7.6h13.96c1.73 0 2.99 1.64 2.54 3.32l-5.44 20.46c-.07.28.03.57.28.72.99.62 4.64 2.57 8.15 5.78.12.11 2.92-.03 3.09-.01 2.31.2 3.97-.08 5.05 4.7.09.42-.21.82-.64.82H11.82c-.34 0-.63-.26-.66-.61-.15-1.82-.4-7.23 1.74-9.32a.62.62 0 0 0 .2-.6c-.39-1.74-2.09-9.83-2.74-22.48-.07-1.5 1.12-2.78 2.64-2.78z'/%3e%3c/svg%3e",
	},
	[EArmorSlotId.ClassItem]: {
		id: EArmorSlotId.ClassItem,
		name: 'Class Item',
		icon: "data:image/svg+xml,%3csvg fill='%23B7B7B7' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 51 51'%3e%3cpath d='M43.12 7.12c-4.13 2.33-17.62 1.9-17.62 1.9s-13.49.43-17.62-1.9c-.37-.21-.85-.03-.94.39-.36 1.49-.87 4.42.09 5.86.09.13.22.21.38.25 1.23.3 7.36 1.65 18.09 1.65s16.86-1.35 18.09-1.65c.15-.04.29-.12.38-.25.96-1.44.45-4.37.1-5.86-.1-.42-.58-.6-.95-.39zM9.27 28.34s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V15.73c-1.93-.22-3.45-.45-4.55-.65v13.26zM16.3 34.8s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V16.24c-1.66-.06-3.18-.16-4.55-.27V34.8zM37.18 28.34s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V15.08c-1.09.2-2.61.44-4.55.65v12.61zM30.15 34.8s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V15.97c-1.36.11-2.88.21-4.55.27V34.8zM23.23 16.31v25.31s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V16.31c-.74.01-1.49.02-2.27.02-.78.01-1.54 0-2.27-.02z'/%3e%3c/svg%3e"
	},
};

export const EXOTIC_CLASS_ITEM_ICON = "data:image/svg+xml,%3csvg fill='%23cead32' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 51 51'%3e%3cpath d='M43.12 7.12c-4.13 2.33-17.62 1.9-17.62 1.9s-13.49.43-17.62-1.9c-.37-.21-.85-.03-.94.39-.36 1.49-.87 4.42.09 5.86.09.13.22.21.38.25 1.23.3 7.36 1.65 18.09 1.65s16.86-1.35 18.09-1.65c.15-.04.29-.12.38-.25.96-1.44.45-4.37.1-5.86-.1-.42-.58-.6-.95-.39zM9.27 28.34s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V15.73c-1.93-.22-3.45-.45-4.55-.65v13.26zM16.3 34.8s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V16.24c-1.66-.06-3.18-.16-4.55-.27V34.8zM37.18 28.34s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V15.08c-1.09.2-2.61.44-4.55.65v12.61zM30.15 34.8s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V15.97c-1.36.11-2.88.21-4.55.27V34.8zM23.23 16.31v25.31s0 2.34 2.27 2.34 2.27-2.34 2.27-2.34V16.31c-.74.01-1.49.02-2.27.02-.78.01-1.54 0-2.27-.02z'/%3e%3c/svg%3e";

export const getArmorSlot = (id: EArmorSlotId): IArmorSlot =>
	ArmorSlotIdToArmorSlotMapping[id];

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
