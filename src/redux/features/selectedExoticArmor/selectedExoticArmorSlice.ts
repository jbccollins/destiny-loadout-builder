import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { AvailableExoticArmorItem, EDestinyClass } from '@dlb/services/data';
import { v4 as uuid, NIL } from 'uuid';

export interface SelectedExoticArmorState {
	value: Record<EDestinyClass, AvailableExoticArmorItem>;
	uuid: string;
}

const initialState: SelectedExoticArmorState = {
	value: {
		[EDestinyClass.Titan]: null,
		[EDestinyClass.Hunter]: null,
		[EDestinyClass.Warlock]: null
	},
	uuid: NIL
};

export const selectedExoticArmorSlice = createSlice({
	name: 'selectedExoticArmor',
	initialState,
	reducers: {
		setSelectedExoticArmor: (
			state,
			action: PayloadAction<Record<EDestinyClass, AvailableExoticArmorItem>>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		}
	}
});

export const { setSelectedExoticArmor } = selectedExoticArmorSlice.actions;

export const selectSelectedExoticArmor = (state: AppState) =>
	state.selectedExoticArmor.value;

export default selectedExoticArmorSlice.reducer;
