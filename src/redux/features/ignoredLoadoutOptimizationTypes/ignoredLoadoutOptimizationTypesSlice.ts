import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { ELoadoutOptimizationTypeId } from '@dlb/types/AnalyzableLoadout';
import { NIL, v4 as uuid } from 'uuid';

export interface IgnoredLoadoutOptimizationTypesState {
	value: ELoadoutOptimizationTypeId[];
	uuid: string;
}

const initialState: IgnoredLoadoutOptimizationTypesState = {
	value: [],
	uuid: NIL,
};

export const ignoredLoadoutOptimizationTypesSlice = createSlice({
	name: 'ignoredLoadoutOptimizationTypes',
	initialState,
	reducers: {
		setIgnoredLoadoutOptimizationTypes: (
			state,
			action: PayloadAction<ELoadoutOptimizationTypeId[]>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setIgnoredLoadoutOptimizationTypes } =
	ignoredLoadoutOptimizationTypesSlice.actions;

export const selectIgnoredLoadoutOptimizationTypes = (state: AppState) =>
	state.ignoredLoadoutOptimizationTypes.value;

export default ignoredLoadoutOptimizationTypesSlice.reducer;
