import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { ProcessArmorOutput } from '@dlb/services/processArmor/index';

export interface ProcessedArmorState {
	value: ProcessArmorOutput;
}

const initialState: ProcessedArmorState = {
	value: [],
};

export const processedArmorSlice = createSlice({
	name: 'processedArmor',
	initialState,
	reducers: {
		setProcessedArmor: (state, action: PayloadAction<ProcessArmorOutput>) => {
			state.value = action.payload;
		},
	},
});

export const { setProcessedArmor } = processedArmorSlice.actions;

export const selectProcessedArmor = (state: AppState) =>
	state.processedArmor.value;

export default processedArmorSlice.reducer;
