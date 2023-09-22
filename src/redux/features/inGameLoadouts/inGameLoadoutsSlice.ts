import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { DestinyLoadoutsComponent } from 'bungie-api-ts-no-const-enum/destiny2';
import { NIL, v4 as uuid } from 'uuid';

export type InGameLoadoutsMapping = {
	[key: string]: DestinyLoadoutsComponent;
};
export interface InGameLoadoutsState {
	value: InGameLoadoutsMapping;
	uuid: string;
}

const initialState: InGameLoadoutsState = {
	value: {},
	uuid: NIL,
};

export const inGameLoadoutsSlice = createSlice({
	name: 'inGameLoadouts',
	initialState,
	reducers: {
		setInGameLoadouts: (
			state,
			action: PayloadAction<InGameLoadoutsMapping>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setInGameLoadouts } = inGameLoadoutsSlice.actions;

export const selectInGameLoadouts = (state: AppState) =>
	state.inGameLoadouts.value;

export default inGameLoadoutsSlice.reducer;
