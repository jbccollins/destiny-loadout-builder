import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import {
	ArmorSlotIdToModIdListMapping,
	getDefaultArmorSlotIdToModIdListMapping,
} from '@dlb/types/Mod';

export interface SelectedArmorSlotModsState {
	value: ArmorSlotIdToModIdListMapping;
	uuid: string;
}

const initialState: SelectedArmorSlotModsState = {
	value: getDefaultArmorSlotIdToModIdListMapping(),
	uuid: NIL,
};

export const selectedArmorSlotModsSlice = createSlice({
	name: 'selectedArmorSlotMods',
	initialState,
	reducers: {
		setSelectedArmorSlotMods: (
			state,
			action: PayloadAction<ArmorSlotIdToModIdListMapping>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedArmorSlotMods } = selectedArmorSlotModsSlice.actions;

export const selectSelectedArmorSlotMods = (state: AppState) =>
	state.selectedArmorSlotMods.value;

export default selectedArmorSlotModsSlice.reducer;
