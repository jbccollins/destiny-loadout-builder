import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClass } from '@dlb/services/data';
import { v4 as uuid, NIL } from 'uuid';

export interface SelectedCharacterClassState {
	value: EDestinyClass;
	uuid: string;
}

const initialState: SelectedCharacterClassState = {
	value: null,
	uuid: NIL
};

export const selectedCharacterClassSlice = createSlice({
	name: 'selectedCharacterClass',
	initialState,
	reducers: {
		setSelectedCharacterClass: (
			state,
			action: PayloadAction<EDestinyClass>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		}
	}
});

export const { setSelectedCharacterClass } =
	selectedCharacterClassSlice.actions;

export const selectSelectedCharacterClass = (state: AppState) =>
	state.selectedCharacterClass.value;

export default selectedCharacterClassSlice.reducer;
