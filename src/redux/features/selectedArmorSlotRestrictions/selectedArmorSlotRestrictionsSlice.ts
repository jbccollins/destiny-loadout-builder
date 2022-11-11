import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import {
	Armor,
	EArmorElementalAffinity,
	EArmorSlot,
	EDestinyClass,
	EArmorExtraModSlot,
	generateArmorGroup
} from '@dlb/services/data';

export type ArmorSlotRestrictionGroup = {
	maxStatModCost: number;
	elementalAffinity: EArmorElementalAffinity;
	extraModSlot: EArmorExtraModSlot;
};

export type ArmorSlotRestrictions = {
	[EArmorSlot.Head]: ArmorSlotRestrictionGroup;
	[EArmorSlot.Arm]: ArmorSlotRestrictionGroup;
	[EArmorSlot.Chest]: ArmorSlotRestrictionGroup;
	[EArmorSlot.Leg]: ArmorSlotRestrictionGroup;
};

export interface SelectedArmorSlotRestrictionsState {
	value: ArmorSlotRestrictions;
}

const generateArmorSlotRestrictionGroup = (): ArmorSlotRestrictionGroup => {
	return {
		maxStatModCost: 5,
		elementalAffinity: EArmorElementalAffinity.Any,
		extraModSlot: EArmorExtraModSlot.Any
	};
};

const initialState: SelectedArmorSlotRestrictionsState = {
	value: {
		[EArmorSlot.Head]: generateArmorSlotRestrictionGroup(),
		[EArmorSlot.Arm]: generateArmorSlotRestrictionGroup(),
		[EArmorSlot.Chest]: generateArmorSlotRestrictionGroup(),
		[EArmorSlot.Leg]: generateArmorSlotRestrictionGroup()
	}
};

export const selectedArmorSlotRestrictionsSlice = createSlice({
	name: 'selectedArmorSlotRestrictions',
	initialState,
	reducers: {
		setSelectedArmorSlotRestrictions: (
			state,
			action: PayloadAction<ArmorSlotRestrictions>
		) => {
			state.value = action.payload;
		}
	}
});

export const { setSelectedArmorSlotRestrictions } =
	selectedArmorSlotRestrictionsSlice.actions;

export const selectSelectedArmorSlotRestrictions = (state: AppState) =>
	state.selectedArmorSlotRestrictions.value;

export default selectedArmorSlotRestrictionsSlice.reducer;
