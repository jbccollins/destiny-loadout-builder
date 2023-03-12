import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EModId } from '@dlb/generated/mod/EModId';

export interface LoadErrorState {
	value: string;
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
		setLoadError: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setLoadError } = loadErrorSlice.actions;

export const selectLoadError = (state: AppState) => state.loadError.value;

export default loadErrorSlice.reducer;
