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

export const getDefaultSeenArmorSlotItem = (): SeenArmorSlotItem => ({
	isArtifice: false,
	raidAndNightmareModTypeId: null,
	intrinsicArmorPerkOrAttributeId: null,
	isMasterworked: false,
});

export type SeenArmorSlotItems = {
	[EArmorSlotId.Head]: SeenArmorSlotItem;
	[EArmorSlotId.Arm]: SeenArmorSlotItem;
	[EArmorSlotId.Chest]: SeenArmorSlotItem;
	[EArmorSlotId.Leg]: SeenArmorSlotItem;
};

export const getDefaultSeenArmorSlotItems = (): SeenArmorSlotItems => {
	return {
		[EArmorSlotId.Head]: getDefaultSeenArmorSlotItem(),
		[EArmorSlotId.Arm]: getDefaultSeenArmorSlotItem(),
		[EArmorSlotId.Chest]: getDefaultSeenArmorSlotItem(),
		[EArmorSlotId.Leg]: getDefaultSeenArmorSlotItem(),
	};
};
