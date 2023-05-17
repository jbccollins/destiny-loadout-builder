import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface UseZeroWastedStatsState {
	value: boolean;
	uuid: string;
}

const initialState: UseZeroWastedStatsState = {
	value: false,
	uuid: NIL,
};

export const useZeroWastedStatsSlice = createSlice({
	name: 'useZeroWastedStats',
	initialState,
	reducers: {
		setUseZeroWastedStats: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setUseZeroWastedStats } = useZeroWastedStatsSlice.actions;

export const selectUseZeroWastedStats = (state: AppState) =>
	state.useZeroWastedStats.value;

export default useZeroWastedStatsSlice.reducer;
