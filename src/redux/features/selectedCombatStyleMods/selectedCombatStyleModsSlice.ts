import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

// TODO: Consider refactoring all the "user configuration stuff"
// (e.g, selectedCombatStyleMods, selectedDestinyClass, selectedExoticArmor, etc...)
// To use a single reducer with one uuid. Or....... keep it as is and just
// Keep track of a single uuid in the store? idk... that might be harder to code around...
import { v4 as uuid, NIL } from 'uuid';
import {
	EArmorStatId,
	ECombatStyleModId,
	EElementId,
	EFragmentId,
} from '@dlb/types/IdEnums';
import { ArmorStatMapping } from '@dlb/types/ArmorStat';

export interface SelectedCombatStyleModsState {
	value: ECombatStyleModId[];
	uuid: string;
}

const initialState: SelectedCombatStyleModsState = {
	value: [],
	uuid: NIL,
};

export const selectedCombatStyleModsSlice = createSlice({
	name: 'selectedCombatStyleMods',
	initialState,
	reducers: {
		setSelectedCombatStyleMods: (
			state,
			action: PayloadAction<ECombatStyleModId[]>
		) => {
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
