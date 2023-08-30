import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface TabIndexState {
	value: number;
	uuid: string;
}

const initialState: TabIndexState = {
	value: 0,
	uuid: NIL,
};

export const tabIndexSlice = createSlice({
	name: 'tabIndex',
	initialState,
	reducers: {
		setTabIndex: (state, action: PayloadAction<number>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setTabIndex } = tabIndexSlice.actions;

export const selectTabIndex = (state: AppState) => state.tabIndex.value;

export default tabIndexSlice.reducer;
