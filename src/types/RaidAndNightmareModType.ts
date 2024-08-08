import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_427561ad3d02d80a76a9cce7802c1323.png',
	},
	[ERaidAndNightMareModTypeId.GardenOfSalvation]: {
		id: ERaidAndNightMareModTypeId.GardenOfSalvation,
		name: 'Garden of Salvation',
		abbreviation: 'GoS',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_eb9f4e265e29cb5e50559b6bf814a9c9.png',
	},
	[ERaidAndNightMareModTypeId.KingsFall]: {
		id: ERaidAndNightMareModTypeId.KingsFall,
		name: "King's Fall",
		abbreviation: 'KF',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_58109af839b023d7bf44c7b734818e47.png',
	},
	[ERaidAndNightMareModTypeId.LastWish]: {
		id: ERaidAndNightMareModTypeId.LastWish,
		name: 'Last Wish',
		abbreviation: 'LW',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_56d1f52f0cb40248a990408d7ac84bd3.png',
	},
	[ERaidAndNightMareModTypeId.NightmareHunt]: {
		id: ERaidAndNightMareModTypeId.NightmareHunt,
		name: 'Nightmare Hunt',
		abbreviation: 'NH',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_48ad57129cd0c46a355ef8bcaa1acd04.png',
	},
	[ERaidAndNightMareModTypeId.VaultOfGlass]: {
		id: ERaidAndNightMareModTypeId.VaultOfGlass,
		name: 'Vault of Glass',
		abbreviation: 'VoG',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_44a010ae763cd975d56c632ff72c48a1.png',
	},
	[ERaidAndNightMareModTypeId.VowOfTheDisciple]: {
		id: ERaidAndNightMareModTypeId.VowOfTheDisciple,
		name: 'Vow of the Disciple',
		abbreviation: 'VotD',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_bc5d4a8377955b809dbbe0fb71645e6e.png',
	},
	[ERaidAndNightMareModTypeId.RootOfNightmares]: {
		id: ERaidAndNightMareModTypeId.RootOfNightmares,
		name: 'Root of Nightmares',
		abbreviation: 'RoN',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_d3dc8747ee63f991c6a56ac7908047ba.png',
	},
	[ERaidAndNightMareModTypeId.CrotasEnd]: {
		id: ERaidAndNightMareModTypeId.CrotasEnd,
		name: "Crota's End",
		abbreviation: 'CE',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_2c5b645accc12584f882c472deb30017.png',
	},
	[ERaidAndNightMareModTypeId.SalvationsEdge]: {
		id: ERaidAndNightMareModTypeId.SalvationsEdge,
		name: "Salvation's Edge",
		abbreviation: 'SE',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyMilestoneDefinition_329a6f8ba06cf48f5831b92c7777b16b.png',
	}
};

export const getRaidAndNightmareModType = (
	id: ERaidAndNightMareModTypeId
): IRaidAndNightmareModType =>
	RaidAndNightMareModTypeIdToRaidAndNightMareModTypeMapping[id];

export const RaidAndNightmareModTypeIdList = ValidateEnumList(
	Object.values(ERaidAndNightMareModTypeId),
	[
		ERaidAndNightMareModTypeId.DeepStoneCrypt,
		ERaidAndNightMareModTypeId.GardenOfSalvation,
		ERaidAndNightMareModTypeId.KingsFall,
		ERaidAndNightMareModTypeId.LastWish,
		ERaidAndNightMareModTypeId.NightmareHunt,
		ERaidAndNightMareModTypeId.VaultOfGlass,
		ERaidAndNightMareModTypeId.VowOfTheDisciple,
		ERaidAndNightMareModTypeId.RootOfNightmares,
		ERaidAndNightMareModTypeId.CrotasEnd,
		ERaidAndNightMareModTypeId.SalvationsEdge,
	]
);

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
