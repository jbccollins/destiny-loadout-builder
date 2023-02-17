import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClassId, EDestinySubclassId } from '@dlb/types/IdEnums';
import { v4 as uuid, NIL } from 'uuid';

export interface SelectedDestinySubclassState {
	value: Record<EDestinyClassId, EDestinySubclassId>;
	uuid: string;
}

const initialState: SelectedDestinySubclassState = {
	value: {
		[EDestinyClassId.Titan]: null,
		[EDestinyClassId.Hunter]: null,
		[EDestinyClassId.Warlock]: null,
	},
	uuid: NIL,
};

export const selectedDestinySubclassSlice = createSlice({
	name: 'selectedDestinySubclass',
	initialState,
	reducers: {
		setSelectedDestinySubclass: (
			state,
			action: PayloadAction<Record<EDestinyClassId, EDestinySubclassId>>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedDestinySubclass } =
	selectedDestinySubclassSlice.actions;

export const selectSelectedDestinySubclass = (state: AppState) =>
	state.selectedDestinySubclass.value;

export default selectedDestinySubclassSlice.reducer;
