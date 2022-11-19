import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import {
	EElementId,
	EArmorExtraModSlotId,
	EArmorSlotId,
} from '@dlb/types/IdEnums';

export type ArmorSlotRestrictionGroup = {
	maxStatModCost: number;
	element: EElementId;
	extraModSlot: EArmorExtraModSlotId;
};

export type ArmorSlotRestrictions = {
	[EArmorSlotId.Head]: ArmorSlotRestrictionGroup;
	[EArmorSlotId.Arm]: ArmorSlotRestrictionGroup;
	[EArmorSlotId.Chest]: ArmorSlotRestrictionGroup;
	[EArmorSlotId.Leg]: ArmorSlotRestrictionGroup;
};

export interface SelectedArmorSlotRestrictionsState {
	value: ArmorSlotRestrictions;
}

const generateArmorSlotRestrictionGroup = (): ArmorSlotRestrictionGroup => {
	return {
		maxStatModCost: 5,
		element: EElementId.Any,
		extraModSlot: EArmorExtraModSlotId.Any,
	};
};

const initialState: SelectedArmorSlotRestrictionsState = {
	value: {
		[EArmorSlotId.Head]: generateArmorSlotRestrictionGroup(),
		[EArmorSlotId.Arm]: generateArmorSlotRestrictionGroup(),
		[EArmorSlotId.Chest]: generateArmorSlotRestrictionGroup(),
		[EArmorSlotId.Leg]: generateArmorSlotRestrictionGroup(),
	},
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
		},
	},
});

export const { setSelectedArmorSlotRestrictions } =
	selectedArmorSlotRestrictionsSlice.actions;

export const selectSelectedArmorSlotRestrictions = (state: AppState) =>
	state.selectedArmorSlotRestrictions.value;

export default selectedArmorSlotRestrictionsSlice.reducer;
