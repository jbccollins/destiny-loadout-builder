import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface AlwaysConsiderCollectionsRollsState {
	value: boolean;
	uuid: string;
}

const initialState: AlwaysConsiderCollectionsRollsState = {
	value: false,
	uuid: NIL,
};

export const alwaysConsiderCollectionsRollsSlice = createSlice({
	name: 'alwaysConsiderCollectionsRolls',
	initialState,
	reducers: {
		setAlwaysConsiderCollectionsRolls: (
			state,
			action: PayloadAction<boolean>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setAlwaysConsiderCollectionsRolls } =
	alwaysConsiderCollectionsRollsSlice.actions;

export const selectAlwaysConsiderCollectionsRolls = (state: AppState) =>
	state.alwaysConsiderCollectionsRolls.value;

export default alwaysConsiderCollectionsRollsSlice.reducer;
