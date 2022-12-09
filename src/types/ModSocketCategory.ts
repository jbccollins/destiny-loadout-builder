import { ArmorStatMapping } from './ArmorStat';
import { getDestinyClassAbilityStat } from './DestinyClass';
import {
	IIdentifiableName,
	IIcon,
	IHash,
	EnumDictionary,
	StatBonus,
	MISSING_ICON,
} from './globals';
// import { EModSocketCategoryId } from './IdEnums';

// export const ModSocketCategoryIdList = Object.values(EModSocketCategoryId);

// export interface IModSocketCategory extends IIdentifiableName {
// 	id: EModSocketCategoryId;
// 	name: string;
// }

// const ModSocketCategoryIdToModSocketCategoryMapping: EnumDictionary<
// 	EModSocketCategoryId,
// 	IModSocketCategory
// > = {
// 	[EModSocketCategoryId.Stat]: {
// 		id: EModSocketCategoryId.Stat,
// 		name: '',
// 	},
//   [EModCategoryId.ChestArmorSlot]{
//     name: 'Chest Armor Mod',
//   },
// 	[EModSocketCategoryId.ArmorSlot]: {
// 		id: EModSocketCategoryId.ArmorSlot,
// 		name: '',
// 	},
// 	[EModSocketCategoryId.CombatStyle]: {
// 		id: EModSocketCategoryId.CombatStyle,
// 		name: 'Charged with Light Mod',
// 	},
// 	[EModSocketCategoryId.Artifice]: {
// 		id: EModSocketCategoryId.Artifice,
// 		name: '',
// 	},
// 	[EModSocketCategoryId.LastWish]: {
// 		id: EModSocketCategoryId.LastWish,
// 		name: '',
// 	},

// 	[EModSocketCategoryId.GardenOfSalvation]: {
// 		id: EModSocketCategoryId.GardenOfSalvation,
// 		name: '',
// 	},
// 	[EModSocketCategoryId.DeepStoneCrypt]: {
// 		id: EModSocketCategoryId.DeepStoneCrypt,
// 		name: '',
// 	},

// 	[EModSocketCategoryId.VaultOfGlass]: {
// 		id: EModSocketCategoryId.VaultOfGlass,
// 		name: 'Vault of Glass Armor Mod',
// 	},
// 	[EModSocketCategoryId.VowOfTheDisciple]: {
// 		id: EModSocketCategoryId.VowOfTheDisciple,
// 		name: '',
// 	},

// 	[EModSocketCategoryId.KingsFall]: {
// 		id: EModSocketCategoryId.KingsFall,
// 		name: '',
// 	},
// 	[EModSocketCategoryId.Other]: {
// 		id: EModSocketCategoryId.Other,
// 		name: '',
// 	},
// };
