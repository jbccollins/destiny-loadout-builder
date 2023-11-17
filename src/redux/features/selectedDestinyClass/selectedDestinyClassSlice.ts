import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { v4 as uuid, NIL } from 'uuid';

export interface SelectedDestinyClassState {
	value: EDestinyClassId;
	uuid: string;
}

const initialState: SelectedDestinyClassState = {
	value: null,
	uuid: NIL,
};

export const selectedDestinyClassSlice = createSlice({
	name: 'selectedDestinyClass',
	initialState,
	reducers: {
		setSelectedDestinyClass: (
			state,
			action: PayloadAction<EDestinyClassId>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedDestinyClass } = selectedDestinyClassSlice.actions;

export const selectSelectedDestinyClass = (state: AppState) =>
	state.selectedDestinyClass.value;

export default selectedDestinyClassSlice.reducer;
