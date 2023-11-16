import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EModId } from '@dlb/generated/mod/EModId';
import { NIL, v4 as uuid } from 'uuid';

export interface DisabledArmorSlotModsState {
	value: Partial<Record<EModId, Record<number, boolean>>>;
	uuid: string;
}

const initialState: DisabledArmorSlotModsState = {
	value: {},
	uuid: NIL,
};

export const disabledArmorSlotModsSlice = createSlice({
	name: 'disabledArmorSlotMods',
	initialState,
	reducers: {
		setDisabledArmorSlotMods: (
			state,
			action: PayloadAction<Partial<Record<EModId, Record<number, boolean>>>>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setDisabledArmorSlotMods } = disabledArmorSlotModsSlice.actions;

export const selectDisabledArmorSlotMods = (state: AppState) =>
	state.disabledArmorSlotMods.value;

export default disabledArmorSlotModsSlice.reducer;
