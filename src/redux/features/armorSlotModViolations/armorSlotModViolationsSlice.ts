import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import {
	ArmorSlotModViolations,
	getDefaultArmorSlotModViolations,
} from '@dlb/types/ModViolation';

export interface SelectedArmorSlotModViolationsState {
	value: ArmorSlotModViolations;
	uuid: string;
}

const initialState: SelectedArmorSlotModViolationsState = {
	value: getDefaultArmorSlotModViolations(),
	uuid: NIL,
};

export const armorSlotModViolationsSlice = createSlice({
	name: 'armorSlotModViolations',
	initialState,
	reducers: {
		setArmorSlotModViolations: (
			state,
			action: PayloadAction<ArmorSlotModViolations>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setArmorSlotModViolations } =
	armorSlotModViolationsSlice.actions;

export const selectSelectedArmorSlotModViolations = (state: AppState) =>
	state.armorSlotModViolations.value;

export default armorSlotModViolationsSlice.reducer;
