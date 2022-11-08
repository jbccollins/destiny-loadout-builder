import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

export interface AllDataLoadedState {
	value: boolean;
}

const initialState: AllDataLoadedState = {
	value: false
};

export const allDataLoadedSlice = createSlice({
	name: 'allDataLoaded',
	initialState,
	reducers: {
		setAllDataLoaded: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
		}
	}
});

export const { setAllDataLoaded } = allDataLoadedSlice.actions;

export const selectAllDataLoaded = (state: AppState) =>
	state.allDataLoaded.value;

export default allDataLoadedSlice.reducer;
