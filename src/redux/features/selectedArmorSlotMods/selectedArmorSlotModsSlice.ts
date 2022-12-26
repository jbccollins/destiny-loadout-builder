import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import { ArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';

export interface SelectedArmorSlotModsState {
	value: ArmorSlotIdToModIdListMapping;
	uuid: string;
}

const generateIntitalState = (): ArmorSlotIdToModIdListMapping => {
	return ArmorSlotWithClassItemIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = [null, null];
		return accumulator;
	}, {}) as ArmorSlotIdToModIdListMapping;
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
