import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EModId } from '@dlb/generated/mod/EModId';

export interface SelectedRaidModsState {
	value: EModId[];
	uuid: string;
}

const initialState: SelectedRaidModsState = {
	value: [null, null, null, null, null],
	uuid: NIL,
};

export const selectedRaidModsSlice = createSlice({
	name: 'selectedRaidMods',
	initialState,
	reducers: {
		setSelectedRaidMods: (state, action: PayloadAction<EModId[]>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedRaidMods } = selectedRaidModsSlice.actions;

export const selectSelectedRaidMods = (state: AppState) =>
	state.selectedRaidMods.value;

export default selectedRaidModsSlice.reducer;
