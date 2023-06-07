import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

export interface HasValidLoadoutQueryParamsState {
	value: boolean;
}

const initialState: HasValidLoadoutQueryParamsState = {
	value: false,
};

export const hasValidLoadoutQueryParamsSlice = createSlice({
	name: 'hasValidLoadoutQueryParams',
	initialState,
	reducers: {
		setHasValidLoadoutQueryParams: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
		},
	},
});

export const { setHasValidLoadoutQueryParams } =
	hasValidLoadoutQueryParamsSlice.actions;

export const selectHasValidLoadoutQueryParams = (state: AppState) =>
	state.hasValidLoadoutQueryParams.value;

export default hasValidLoadoutQueryParamsSlice.reducer;
