import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EGearTierId } from '@dlb/types/IdEnums';

export interface SelectedMinimumGearTierState {
	value: EGearTierId;
	uuid: string;
}

const initialState: SelectedMinimumGearTierState = {
	value: EGearTierId.Legendary,
	uuid: NIL,
};

export const selectedMinimumGearTierSlice = createSlice({
	name: 'selectedMinimumGearTier',
	initialState,
	reducers: {
		setSelectedMinimumGearTier: (state, action: PayloadAction<EGearTierId>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedMinimumGearTier } =
	selectedMinimumGearTierSlice.actions;

export const selectSelectedMinimumGearTier = (state: AppState) =>
	state.selectedMinimumGearTier.value;

export default selectedMinimumGearTierSlice.reducer;
