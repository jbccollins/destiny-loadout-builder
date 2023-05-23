import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface InGameLoadoutsState {
	value: string[];
	uuid: string;
}

const initialState: InGameLoadoutsState = {
	value: [],
	uuid: NIL,
};

export const inGameLoadoutsSlice = createSlice({
	name: 'inGameLoadouts',
	initialState,
	reducers: {
		setInGameLoadouts: (state, action: PayloadAction<string[]>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setInGameLoadouts } = inGameLoadoutsSlice.actions;

export const selectInGameLoadouts = (state: AppState) =>
	state.inGameLoadouts.value;

export default inGameLoadoutsSlice.reducer;
