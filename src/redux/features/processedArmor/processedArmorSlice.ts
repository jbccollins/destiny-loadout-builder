import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { ProcessArmorOutput } from '@dlb/services/processArmor/index';

export type ProcessedArmor = {
	items: ProcessArmorOutput;
	totalItemCount: number;
};

export interface ProcessedArmorState {
	value: ProcessedArmor;
}

const initialState: ProcessedArmorState = {
	value: { items: [], totalItemCount: 0 },
};

export const processedArmorSlice = createSlice({
	name: 'processedArmor',
	initialState,
	reducers: {
		setProcessedArmor: (state, action: PayloadAction<ProcessedArmor>) => {
			state.value = action.payload;
		},
	},
});

export const { setProcessedArmor } = processedArmorSlice.actions;

export const selectProcessedArmor = (state: AppState) =>
	state.processedArmor.value;

export default processedArmorSlice.reducer;
