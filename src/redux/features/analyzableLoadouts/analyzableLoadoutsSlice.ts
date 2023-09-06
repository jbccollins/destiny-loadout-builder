import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import {
	AnalyzableLoadoutBreakdown,
	getDefaultAnalyzableLoadoutBreakdown,
} from '@dlb/types/AnalyzableLoadout';
import { NIL, v4 as uuid } from 'uuid';

export interface AnalyzableLoadoutsState {
	value: AnalyzableLoadoutBreakdown;
	uuid: string;
}

const initialState: AnalyzableLoadoutsState = {
	value: getDefaultAnalyzableLoadoutBreakdown(),
	uuid: NIL,
};

export const analyzableLoadoutsSlice = createSlice({
	name: 'analyzableLoadouts',
	initialState,
	reducers: {
		setAnalyzableLoadouts: (
			state,
			action: PayloadAction<AnalyzableLoadoutBreakdown>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setAnalyzableLoadouts } = analyzableLoadoutsSlice.actions;

export const selectAnalyzableLoadouts = (state: AppState) =>
	state.analyzableLoadouts.value;

export default analyzableLoadoutsSlice.reducer;
