import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EModId } from '@dlb/generated/mod/EModId';

export interface SelectedCombatStyleModsState {
	value: EModId[];
	uuid: string;
}

const initialState: SelectedCombatStyleModsState = {
	value: [null, null, null, null, null],
	uuid: NIL,
};

export const selectedCombatStyleModsSlice = createSlice({
	name: 'selectedCombatStyleMods',
	initialState,
	reducers: {
		setSelectedCombatStyleMods: (state, action: PayloadAction<EModId[]>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedCombatStyleMods } =
	selectedCombatStyleModsSlice.actions;

export const selectSelectedCombatStyleMods = (state: AppState) =>
	state.selectedCombatStyleMods.value;

export default selectedCombatStyleModsSlice.reducer;
