import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EModId } from '@dlb/generated/mod/EModId';
import { NIL, v4 as uuid } from 'uuid';

export interface DisabledRaidModsState {
	value: Partial<Record<EModId, boolean>>;
	uuid: string;
}

const initialState: DisabledRaidModsState = {
	value: {},
	uuid: NIL,
};

export const disabledRaidModsSlice = createSlice({
	name: 'disabledRaidMods',
	initialState,
	reducers: {
		setDisabledRaidMods: (
			state,
			action: PayloadAction<Partial<Record<EModId, boolean>>>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setDisabledRaidMods } = disabledRaidModsSlice.actions;

export const selectDisabledRaidMods = (state: AppState) =>
	state.disabledRaidMods.value;

export default disabledRaidModsSlice.reducer;
