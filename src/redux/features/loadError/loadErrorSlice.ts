import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export type LoadLog = { name: string; message: unknown };
type LoadError = {
	err: string;
	logs: LoadLog[];
};

export interface LoadErrorState {
	value: LoadError;
	uuid: string;
}

const initialState: LoadErrorState = {
	value: null,
	uuid: NIL,
};

export const loadErrorSlice = createSlice({
	name: 'loadError',
	initialState,
	reducers: {
		setLoadError: (state, action: PayloadAction<LoadError>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setLoadError } = loadErrorSlice.actions;

export const selectLoadError = (state: AppState) => state.loadError.value;

export default loadErrorSlice.reducer;
