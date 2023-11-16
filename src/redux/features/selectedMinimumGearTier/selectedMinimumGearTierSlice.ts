import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EGearTierId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

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
