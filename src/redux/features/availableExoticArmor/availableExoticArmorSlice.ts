import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import {
	AvailableExoticArmor,
	generateAvailableExoticArmorGroup,
} from '@dlb/types/Armor';

export interface AvailableExoticArmorState {
	value: AvailableExoticArmor;
}

const initialState: AvailableExoticArmorState = {
	value: {
		[EDestinyClassId.Titan]: generateAvailableExoticArmorGroup(),
		[EDestinyClassId.Hunter]: generateAvailableExoticArmorGroup(),
		[EDestinyClassId.Warlock]: generateAvailableExoticArmorGroup(),
	},
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
		},
	},
});

export const { setAvailableExoticArmor } = availableExoticArmorSlice.actions;

export const selectAvailableExoticArmor = (state: AppState) =>
	state.availableExoticArmor.value;

export default availableExoticArmorSlice.reducer;
