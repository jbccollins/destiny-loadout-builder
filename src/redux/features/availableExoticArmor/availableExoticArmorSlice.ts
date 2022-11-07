import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import {
	AvailableExoticArmor,
	DestinyClassName,
	generateAvailableExoticArmorGroup
} from '@dlb/services/data';

export interface AvailableExoticArmorState {
	value: AvailableExoticArmor;
}

const initialState: AvailableExoticArmorState = {
	value: {
		[DestinyClassName.Titan]: generateAvailableExoticArmorGroup(),
		[DestinyClassName.Hunter]: generateAvailableExoticArmorGroup(),
		[DestinyClassName.Warlock]: generateAvailableExoticArmorGroup()
	}
};
export const availableExoticArmorSlice = createSlice({
	name: 'availableExoticArmor',
	initialState,
	reducers: {
		setAvailableExoticArmor: (
			state,
			action: PayloadAction<AvailableExoticArmor>
		) => {
			state.value = action.payload;
		}
	}
});

export const { setAvailableExoticArmor } = availableExoticArmorSlice.actions;

export const selectAvailableExoticArmor = (state: AppState) =>
	state.availableExoticArmor.value;

export default availableExoticArmorSlice.reducer;
