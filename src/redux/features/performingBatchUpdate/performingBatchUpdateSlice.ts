import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface PerformingBatchUpdateState {
	value: boolean;
	uuid: string;
}

const initialState: PerformingBatchUpdateState = {
	value: false,
	uuid: NIL,
};

export const performingBatchUpdateSlice = createSlice({
	name: 'performingBatchUpdate',
	initialState,
	reducers: {
		setPerformingBatchUpdate: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setPerformingBatchUpdate } = performingBatchUpdateSlice.actions;

export const selectPerformingBatchUpdate = (state: AppState) =>
	state.performingBatchUpdate.value;

export default performingBatchUpdateSlice.reducer;
