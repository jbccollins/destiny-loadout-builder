import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClass } from '@dlb/services/data';

export interface SelectedCharacterClassState {
	value: EDestinyClass;
}

const initialState: SelectedCharacterClassState = {
	value: null
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
		}
	}
});

export const { setSelectedCharacterClass } =
	selectedCharacterClassSlice.actions;

export const selectSelectedCharacterClass = (state: AppState) =>
	state.selectedCharacterClass.value;

export default selectedCharacterClassSlice.reducer;
