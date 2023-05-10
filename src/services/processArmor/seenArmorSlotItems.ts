import { EExtraSocketModCategoryId, EArmorSlotId } from '@dlb/types/IdEnums';

export type SeenArmorSlotClassItems = Record<
	EExtraSocketModCategoryId,
	boolean
> & {
	artifice: boolean;
};
export type SeenArmorSlotItems = {
	[EArmorSlotId.Head]: EExtraSocketModCategoryId | 'artifice';
	[EArmorSlotId.Arm]: EExtraSocketModCategoryId | 'artifice';
	[EArmorSlotId.Chest]: EExtraSocketModCategoryId | 'artifice';
	[EArmorSlotId.Leg]: EExtraSocketModCategoryId | 'artifice';
	ClassItems: SeenArmorSlotClassItems;
};

export const getDefaultSeenArmorSlotItems = (): SeenArmorSlotItems => {
	return {
		[EArmorSlotId.Head]: null,
		[EArmorSlotId.Arm]: null,
		[EArmorSlotId.Chest]: null,
		[EArmorSlotId.Leg]: null,
		ClassItems: {
			artifice: false,
			[EExtraSocketModCategoryId.DeepStoneCrypt]: false,
			[EExtraSocketModCategoryId.GardenOfSalvation]: false,
			[EExtraSocketModCategoryId.KingsFall]: false,
			[EExtraSocketModCategoryId.LastWish]: false,
			[EExtraSocketModCategoryId.Nightmare]: false,
			[EExtraSocketModCategoryId.VaultOfGlass]: false,
			[EExtraSocketModCategoryId.VowOfTheDisciple]: false,
			[EExtraSocketModCategoryId.RootOfNightmares]: false,
		},
	};
};
