import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EModId } from '@dlb/generated/mod/EModId';
import { EDimLoadoutsFilterId } from '@dlb/types/IdEnums';

export interface DimLoadoutsFilterState {
	value: EDimLoadoutsFilterId;
	uuid: string;
}

const initialState: DimLoadoutsFilterState = {
	value: EDimLoadoutsFilterId.All,
	uuid: NIL,
};

export const dimLoadoutsFilterSlice = createSlice({
	name: 'dimLoadoutsFilter',
	initialState,
	reducers: {
		setDimLoadoutsFilter: (
			state,
			action: PayloadAction<EDimLoadoutsFilterId>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setDimLoadoutsFilter } = dimLoadoutsFilterSlice.actions;

export const selectDimLoadoutsFilter = (state: AppState) =>
	state.dimLoadoutsFilter.value;

export default dimLoadoutsFilterSlice.reducer;
