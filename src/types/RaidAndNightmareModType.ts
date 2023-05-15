import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	MISSING_ICON,
} from './globals';
import { ERaidAndNightMareModTypeId } from './IdEnums';

export interface IRaidAndNightmareModType extends IIdentifiableName, IIcon {
	abbreviation: string;
}

const RaidAndNightMareModTypeIdToRaidAndNightMareModTypeMapping: EnumDictionary<
	ERaidAndNightMareModTypeId,
	IRaidAndNightmareModType
> = {
	[ERaidAndNightMareModTypeId.DeepStoneCrypt]: {
		id: ERaidAndNightMareModTypeId.DeepStoneCrypt,
		name: 'Deep Stone Crypt',
		abbreviation: 'DSC',
		icon: MISSING_ICON,
	},
	[ERaidAndNightMareModTypeId.GardenOfSalvation]: {
		id: ERaidAndNightMareModTypeId.GardenOfSalvation,
		name: 'Garden of Salvation',
		abbreviation: 'GoS',
		icon: MISSING_ICON,
	},
	[ERaidAndNightMareModTypeId.KingsFall]: {
		id: ERaidAndNightMareModTypeId.KingsFall,
		name: "King's Fall",
		abbreviation: 'KF',
		icon: MISSING_ICON,
	},
	[ERaidAndNightMareModTypeId.LastWish]: {
		id: ERaidAndNightMareModTypeId.LastWish,
		name: 'Last Wish',
		abbreviation: 'LW',
		icon: MISSING_ICON,
	},
	[ERaidAndNightMareModTypeId.NightmareHunt]: {
		id: ERaidAndNightMareModTypeId.NightmareHunt,
		name: 'Nightmare Hunt',
		abbreviation: 'NH',
		icon: MISSING_ICON,
	},
	[ERaidAndNightMareModTypeId.VaultOfGlass]: {
		id: ERaidAndNightMareModTypeId.VaultOfGlass,
		name: 'Vault of Glass',
		abbreviation: 'VoG',
		icon: MISSING_ICON,
	},
	[ERaidAndNightMareModTypeId.VowOfTheDisciple]: {
		id: ERaidAndNightMareModTypeId.VowOfTheDisciple,
		name: 'Vow of the Disciple',
		abbreviation: 'VotD',
		icon: MISSING_ICON,
	},
	[ERaidAndNightMareModTypeId.RootOfNightmares]: {
		id: ERaidAndNightMareModTypeId.RootOfNightmares,
		name: 'Root of Nightmares',
		abbreviation: 'RoN',
		icon: MISSING_ICON,
	},
};

export const getRaidAndNightmareModType = (
	id: ERaidAndNightMareModTypeId
): IRaidAndNightmareModType =>
	RaidAndNightMareModTypeIdToRaidAndNightMareModTypeMapping[id];

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
