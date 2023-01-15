import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EModId } from '@dlb/generated/mod/EModId';
import { Loadout } from '@destinyitemmanager/dim-api-types';

export interface DimLoadoutsState {
	value: Loadout[];
	uuid: string;
}

const initialState: DimLoadoutsState = {
	value: [],
	uuid: NIL,
};

export const dimLoadoutsSlice = createSlice({
	name: 'dimLoadouts',
	initialState,
	reducers: {
		setDimLoadouts: (state, action: PayloadAction<Loadout[]>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setDimLoadouts } = dimLoadoutsSlice.actions;

export const selectDimLoadouts = (state: AppState) => state.dimLoadouts.value;

export default dimLoadoutsSlice.reducer;
