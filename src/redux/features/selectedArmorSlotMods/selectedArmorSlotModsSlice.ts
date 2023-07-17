import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EModId } from '@dlb/generated/mod/EModId';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	getDefaultArmorSlotIdToModIdListMapping,
} from '@dlb/types/Mod';
import { NIL, v4 as uuid } from 'uuid';

export interface SelectedArmorSlotModsState {
	value: ArmorSlotIdToModIdListMapping;
	uuid: string;
}

// const initialState: SelectedArmorSlotModsState = {
// 	value: getDefaultArmorSlotIdToModIdListMapping(),
// 	uuid: NIL,
// };
const initialState: SelectedArmorSlotModsState = {
	value: {
		...getDefaultArmorSlotIdToModIdListMapping(),
		[EArmorSlotId.Head]: [
			EModId.HeavyAmmoFinder,
			EModId.HeavyAmmoFinder,
			EModId.HeavyAmmoFinder,
		],
		[EArmorSlotId.Arm]: [
			EModId.SolarLoader,
			EModId.SolarLoader,
			EModId.SolarLoader,
		],
		[EArmorSlotId.Chest]: [
			EModId.SolarReserves,
			EModId.SolarReserves,
			null,
			// EModId.SolarReserves,
		],
	},
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
