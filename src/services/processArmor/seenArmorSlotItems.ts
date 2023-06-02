import {
	EArmorSlotId,
	EIntrinsicArmorPerkOrAttributeId,
	ERaidAndNightMareModTypeId,
} from '@dlb/types/IdEnums';

export type SeenArmorSlotItem = {
	isArtifice: boolean;
	raidAndNightmareModTypeId: ERaidAndNightMareModTypeId | null;
	intrinsicArmorPerkOrAttributeId: EIntrinsicArmorPerkOrAttributeId | null;
	isMasterworked: boolean;
};

export type SeenArmorSlotItems = {
	[EArmorSlotId.Head]: SeenArmorSlotItem;
	[EArmorSlotId.Arm]: SeenArmorSlotItem;
	[EArmorSlotId.Chest]: SeenArmorSlotItem;
	[EArmorSlotId.Leg]: SeenArmorSlotItem;
};

export const getDefaultSeenArmorSlotItems = (): SeenArmorSlotItems => {
	return {
		[EArmorSlotId.Head]: null,
		[EArmorSlotId.Arm]: null,
		[EArmorSlotId.Chest]: null,
		[EArmorSlotId.Leg]: null,
	};
};
