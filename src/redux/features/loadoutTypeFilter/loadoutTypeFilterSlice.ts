import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { ELoadoutTypeFilter } from '@dlb/types/AnalyzableLoadout';
import { NIL, v4 as uuid } from 'uuid';

export interface LoadoutTypeFilterState {
	value: ELoadoutTypeFilter;
	uuid: string;
}

const initialState: LoadoutTypeFilterState = {
	value: ELoadoutTypeFilter.All,
	uuid: NIL,
};

export const loadoutTypeFilterSlice = createSlice({
	name: 'loadoutTypeFilter',
	initialState,
	reducers: {
		setLoadoutTypeFilter: (
			state,
			action: PayloadAction<ELoadoutTypeFilter>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setLoadoutTypeFilter } = loadoutTypeFilterSlice.actions;

export const selectLoadoutTypeFilter = (state: AppState) =>
	state.loadoutTypeFilter.value;

export default loadoutTypeFilterSlice.reducer;
