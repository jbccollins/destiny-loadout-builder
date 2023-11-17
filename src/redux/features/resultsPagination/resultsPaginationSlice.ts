import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface ResultsPaginationState {
	value: number;
	uuid: string;
}

const initialState: ResultsPaginationState = {
	value: 0,
	uuid: NIL,
};

export const resultsPaginationSlice = createSlice({
	name: 'resultsPagination',
	initialState,
	reducers: {
		setResultsPagination: (state, action: PayloadAction<number>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setResultsPagination } = resultsPaginationSlice.actions;

export const selectResultsPagination = (state: AppState) =>
	state.resultsPagination.value;

export default resultsPaginationSlice.reducer;
