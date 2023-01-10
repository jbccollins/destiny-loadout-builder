import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EModId } from '@dlb/generated/mod/EModId';

export interface DisabledCombatStyleModsState {
	value: Partial<Record<EModId, boolean>>;
	uuid: string;
}

const initialState: DisabledCombatStyleModsState = {
	value: {},
	uuid: NIL,
};

export const disabledCombatStyleModsSlice = createSlice({
	name: 'disabledCombatStyleMods',
	initialState,
	reducers: {
		setDisabledCombatStyleMods: (
			state,
			action: PayloadAction<Partial<Record<EModId, boolean>>>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setDisabledCombatStyleMods } =
	disabledCombatStyleModsSlice.actions;

export const selectDisabledCombatStyleMods = (state: AppState) =>
	state.disabledCombatStyleMods.value;

export default disabledCombatStyleModsSlice.reducer;
