import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClassId, EDestinySubclassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export interface SelectedDestinySubclassState {
	value: Record<EDestinyClassId, EDestinySubclassId>;
	uuid: string;
}
const getInitialStateValue = () => ({
	[EDestinyClassId.Titan]: null,
	[EDestinyClassId.Hunter]: null,
	[EDestinyClassId.Warlock]: null,
});

const initialState: SelectedDestinySubclassState = {
	value: getInitialStateValue(),
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
		clearSelectedDestinySubclass: (state) => {
			state.value = getInitialStateValue();
			state.uuid = uuid();
		},
	},
});

export const { setSelectedDestinySubclass, clearSelectedDestinySubclass } =
	selectedDestinySubclassSlice.actions;

export const selectSelectedDestinySubclass = (state: AppState) =>
	state.selectedDestinySubclass.value;

export default selectedDestinySubclassSlice.reducer;
