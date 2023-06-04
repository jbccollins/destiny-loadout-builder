import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EInGameLoadoutsFilterId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export interface InGameLoadoutsFilterState {
	value: EInGameLoadoutsFilterId;
	uuid: string;
}

const initialState: InGameLoadoutsFilterState = {
	value: EInGameLoadoutsFilterId.All,
	uuid: NIL,
};

export const inGameLoadoutsFilterSlice = createSlice({
	name: 'inGameLoadoutsFilter',
	initialState,
	reducers: {
		setInGameLoadoutsFilter: (
			state,
			action: PayloadAction<EInGameLoadoutsFilterId>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setInGameLoadoutsFilter } = inGameLoadoutsFilterSlice.actions;

export const selectInGameLoadoutsFilter = (state: AppState) =>
	state.inGameLoadoutsFilter.value;

export default inGameLoadoutsFilterSlice.reducer;
