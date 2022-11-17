import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { v4 as uuid, NIL } from 'uuid';

export interface SelectedCharacterClassState {
	value: EDestinyClassId;
	uuid: string;
}

const initialState: SelectedCharacterClassState = {
	value: null,
	uuid: NIL,
};

export const selectedCharacterClassSlice = createSlice({
	name: 'selectedCharacterClass',
	initialState,
	reducers: {
		setSelectedCharacterClass: (
			state,
			action: PayloadAction<EDestinyClassId>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedCharacterClass } =
	selectedCharacterClassSlice.actions;

export const selectSelectedCharacterClass = (state: AppState) =>
	state.selectedCharacterClass.value;

export default selectedCharacterClassSlice.reducer;
