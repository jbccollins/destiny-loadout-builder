import { EArmorSlotId, ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';

export type SeenArmorSlotClassItems = Record<
	ERaidAndNightMareModTypeId,
	boolean
> & {
	artifice: boolean;
};
export type SeenArmorSlotItems = {
	[EArmorSlotId.Head]: ERaidAndNightMareModTypeId | 'artifice';
	[EArmorSlotId.Arm]: ERaidAndNightMareModTypeId | 'artifice';
	[EArmorSlotId.Chest]: ERaidAndNightMareModTypeId | 'artifice';
	[EArmorSlotId.Leg]: ERaidAndNightMareModTypeId | 'artifice';
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
			[ERaidAndNightMareModTypeId.DeepStoneCrypt]: false,
			[ERaidAndNightMareModTypeId.GardenOfSalvation]: false,
			[ERaidAndNightMareModTypeId.KingsFall]: false,
			[ERaidAndNightMareModTypeId.LastWish]: false,
			[ERaidAndNightMareModTypeId.NightmareHunt]: false,
			[ERaidAndNightMareModTypeId.VaultOfGlass]: false,
			[ERaidAndNightMareModTypeId.VowOfTheDisciple]: false,
			[ERaidAndNightMareModTypeId.RootOfNightmares]: false,
		},
	};
};
