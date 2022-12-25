import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';

export type SelectedArmorSlotMods = {
	[key in EArmorSlotId]: EModId[];
};

export interface SelectedArmorSlotModsState {
	value: SelectedArmorSlotMods;
	uuid: string;
}

const generateIntitalState = (): SelectedArmorSlotMods => {
	return ArmorSlotWithClassItemIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = [null, null];
		return accumulator;
	}, {}) as SelectedArmorSlotMods;
};

const initialState: SelectedArmorSlotModsState = {
	value: generateIntitalState(),
	uuid: NIL,
};

export const selectedArmorSlotModsSlice = createSlice({
	name: 'selectedArmorSlotMods',
	initialState,
	reducers: {
		setSelectedArmorSlotMods: (
			state,
			action: PayloadAction<SelectedArmorSlotMods>
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
