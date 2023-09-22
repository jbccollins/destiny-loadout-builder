import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { ELoadoutOptimizationType } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import { NIL, v4 as uuid } from 'uuid';

export interface OptimizationTypeFilterState {
	value: ELoadoutOptimizationType[];
	uuid: string;
}

const initialState: OptimizationTypeFilterState = {
	value: [],
	uuid: NIL,
};

export const optimizationTypeFilterSlice = createSlice({
	name: 'optimizationTypeFilter',
	initialState,
	reducers: {
		setOptimizationTypeFilter: (
			state,
			action: PayloadAction<ELoadoutOptimizationType[]>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setOptimizationTypeFilter } =
	optimizationTypeFilterSlice.actions;

export const selectOptimizationTypeFilter = (state: AppState) =>
	state.optimizationTypeFilter.value;

export default optimizationTypeFilterSlice.reducer;
