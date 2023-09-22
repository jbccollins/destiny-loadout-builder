import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface AnalyzerTabIndexState {
	value: number;
	uuid: string;
}

const initialState: AnalyzerTabIndexState = {
	value: 0,
	uuid: NIL,
};

export const analyzerTabIndexSlice = createSlice({
	name: 'analyzerTabIndex',
	initialState,
	reducers: {
		setAnalyzerTabIndex: (state, action: PayloadAction<number>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setAnalyzerTabIndex } = analyzerTabIndexSlice.actions;

export const selectAnalyzerTabIndex = (state: AppState) =>
	state.analyzerTabIndex.value;

export default analyzerTabIndexSlice.reducer;
