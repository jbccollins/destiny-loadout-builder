import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface InGameLoadoutsFlatItemIdListState {
	value: string[];
	uuid: string;
}

const initialState: InGameLoadoutsFlatItemIdListState = {
	value: [],
	uuid: NIL,
};

export const inGameLoadoutsFlatItemIdListSlice = createSlice({
	name: 'inGameLoadoutsFlatItemIdList',
	initialState,
	reducers: {
		setInGameLoadoutsFlatItemIdList: (
			state,
			action: PayloadAction<string[]>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setInGameLoadoutsFlatItemIdList } =
	inGameLoadoutsFlatItemIdListSlice.actions;

export const selectInGameLoadoutsFlatItemIdList = (state: AppState) =>
	state.inGameLoadoutsFlatItemIdList.value;

export default inGameLoadoutsFlatItemIdListSlice.reducer;
