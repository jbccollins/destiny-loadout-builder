import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	Mapping,
	MISSING_ICON,
	ValidateEnumList,
} from './globals';
import { EArmorExtraModSlotId } from './IdEnums';

export const ArmorExtraModSlotIdList = ValidateEnumList(
	Object.values(EArmorExtraModSlotId),
	[
		EArmorExtraModSlotId.Any,
		EArmorExtraModSlotId.Artificer,
		EArmorExtraModSlotId.KingsFall,
		EArmorExtraModSlotId.VowOfTheDisciple,
		EArmorExtraModSlotId.VaultOfGlass,
		EArmorExtraModSlotId.DeepStoneCrypt,
		EArmorExtraModSlotId.GardenOfSalvation,
		EArmorExtraModSlotId.LastWish,
		EArmorExtraModSlotId.RootOfNightmares,
		EArmorExtraModSlotId.NightmareHunt,
	]
);

export interface IArmorExtraMotSlot extends IIdentifiableName, IIcon {}

const ArmorExtraMotSlotIdToArmorExtraMotSlotMapping: EnumDictionary<
	EArmorExtraModSlotId,
	IArmorExtraMotSlot
> = {
	[EArmorExtraModSlotId.Any]: {
		id: EArmorExtraModSlotId.Any,
		name: 'Any',
		icon: MISSING_ICON,
	},
	[EArmorExtraModSlotId.Artificer]: {
		id: EArmorExtraModSlotId.Any,
		name: 'Artificer',
		icon: MISSING_ICON,
	},
	[EArmorExtraModSlotId.DeepStoneCrypt]: {
		id: EArmorExtraModSlotId.Any,
		name: 'Deep Stone Crypt',
		icon: MISSING_ICON,
	},
	[EArmorExtraModSlotId.GardenOfSalvation]: {
		id: EArmorExtraModSlotId.Any,
		name: 'Garden of Salvation',
		icon: MISSING_ICON,
	},
	[EArmorExtraModSlotId.KingsFall]: {
		id: EArmorExtraModSlotId.Any,
		name: "King's Fall",
		icon: MISSING_ICON,
	},
	[EArmorExtraModSlotId.LastWish]: {
		id: EArmorExtraModSlotId.Any,
		name: 'Last Wish',
		icon: MISSING_ICON,
	},
	[EArmorExtraModSlotId.NightmareHunt]: {
		id: EArmorExtraModSlotId.Any,
		name: 'Nightmare Hunt',
		icon: MISSING_ICON,
	},
	[EArmorExtraModSlotId.VaultOfGlass]: {
		id: EArmorExtraModSlotId.Any,
		name: 'Vault of Glass',
		icon: MISSING_ICON,
	},
	[EArmorExtraModSlotId.VowOfTheDisciple]: {
		id: EArmorExtraModSlotId.Any,
		name: 'Vow of the Disciple',
		icon: MISSING_ICON,
	},
	[EArmorExtraModSlotId.RootOfNightmares]: {
		id: EArmorExtraModSlotId.Any,
		name: 'Root of Nightmares',
		icon: MISSING_ICON,
	},
};

export const getExtraModSlot = (id: EArmorExtraModSlotId): IArmorExtraMotSlot =>
	ArmorExtraMotSlotIdToArmorExtraMotSlotMapping[id];

// TODO copy this icons over to the new mapping
// // TODO: Fix the images for a few of the newer sockets
// export const ArmorExtraModSlotIcons: EnumDictionary<
// 	EArmorExtraModSlotId,
// 	string
// > = {
// 	[EArmorExtraModSlotId.Any]:
// 		MISSING_ICON,
// 	[EArmorExtraModSlotId.NightmareHunt]:
// 		'https://bungie.net/common/destiny2_content/icons/6bf9ba37386b907ddb514ec422fc74c9.png',
// 	[EArmorExtraModSlotId.Artificer]:
// 		'https://bungie.net/common/destiny2_content/icons/74aeb2f3d7bc16a31a6924822f850184.png',
// 	[EArmorExtraModSlotId.LastWish]:
// 		'https://bungie.net/common/destiny2_content/icons/c70116144be386def9e675d76dacfe64.png',
// 	[EArmorExtraModSlotId.GardenOfSalvation]:
// 		'https://bungie.net/common/destiny2_content/icons/6bf9ba37386b907ddb514ec422fc74c9.png',
// 	[EArmorExtraModSlotId.DeepStoneCrypt]:
// 		'https://bungie.net/common/destiny2_content/icons/3c14e3c3a747a7487c76f38602b9e2fe.png',
// 	[EArmorExtraModSlotId.VaultOfGlass]:
// 		'https://bungie.net/common/destiny2_content/icons/9603e0d01826d7ab97ce1b1bf3eb3c96.png',
// 	[EArmorExtraModSlotId.VowOfTheDisciple]:
// 		'https://www.bungie.net//common/destiny2_content/icons/1f66fa02b19f40e6ce5d8336c7ed5a00.png',
// 	// [EArmorExtraModSlot.PerkIronBanner]: "https://bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_fe57052d7cf971f7502daa75a2ca2437.png",
// 	// [EArmorExtraModSlot.PerkUniformedOfficer]: "https://bungie.net/common/destiny2_content/icons/b39b83dd5ea3d9144e4e63f103af8b46.png",
// 	[EArmorExtraModSlotId.KingsFall]:
// 		// 'https://bungie.net/common/destiny2_content/icons/b4d05ef69d0c3227a7d4f7f35bbc2848.png'
// 		'https://www.bungie.net/common/destiny2_content/icons/bc809878e0c2ed8fd32feb62aaae690c.png',
// 	// [EArmorExtraModSlot.PerkPlunderersTrappings]: "https://www.bungie.net/common/destiny2_content/icons/d7ad8979dab2f4544e2cfb66f262f7d1.png",
// 	// [EArmorExtraModSlot.COUNT]: "",
// };
