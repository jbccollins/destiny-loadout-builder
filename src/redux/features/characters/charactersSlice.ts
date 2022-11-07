import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { Characters } from '@dlb/services/data';

export interface CharactersState {
	value: Characters;
}

const initialState: CharactersState = {
	value: []
};

export const charactersSlice = createSlice({
	name: 'characters',
	initialState,
	reducers: {
		setCharacters: (state, action: PayloadAction<Characters>) => {
			state.value = action.payload;
		}
	}
});

export const { setCharacters } = charactersSlice.actions;

export const selectCharacters = (state: AppState) => state.characters.value;

export default charactersSlice.reducer;
