import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { AvailableExoticArmorItem, EDestinyClass } from '@dlb/services/data';

export interface SelectedExoticArmorState {
	value: Record<EDestinyClass, AvailableExoticArmorItem>;
}

const initialState: SelectedExoticArmorState = {
	value: {
		[EDestinyClass.Titan]: null,
		[EDestinyClass.Hunter]: null,
		[EDestinyClass.Warlock]: null
	}
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
		}
	}
});

export const { setSelectedExoticArmor } = selectedExoticArmorSlice.actions;

export const selectSelectedExoticArmor = (state: AppState) =>
	state.selectedExoticArmor.value;

export default selectedExoticArmorSlice.reducer;
