import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export interface ValidDestinyClassIdsState {
	value: EDestinyClassId[];
	uuid: string;
}

const initialState: ValidDestinyClassIdsState = {
	value: [],
	uuid: NIL,
};

export const validDestinyClassIdsSlice = createSlice({
	name: 'validDestinyClassIds',
	initialState,
	reducers: {
		setValidDestinyClassIds: (
			state,
			action: PayloadAction<EDestinyClassId[]>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setValidDestinyClassIds } = validDestinyClassIdsSlice.actions;

export const selectValidDestinyClassIds = (state: AppState) =>
	state.validDestinyClassIds.value;

export default validDestinyClassIdsSlice.reducer;
