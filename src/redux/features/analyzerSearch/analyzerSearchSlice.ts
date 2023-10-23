import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface AnalyzerSearchState {
	value: string;
	uuid: string;
}

const initialState: AnalyzerSearchState = {
	value: '',
	uuid: NIL,
};

export const analyzerSearchSlice = createSlice({
	name: 'analyzerSearch',
	initialState,
	reducers: {
		setAnalyzerSearch: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setAnalyzerSearch } = analyzerSearchSlice.actions;

export const selectAnalyzerSearch = (state: AppState) =>
	state.analyzerSearch.value;

export default analyzerSearchSlice.reducer;
