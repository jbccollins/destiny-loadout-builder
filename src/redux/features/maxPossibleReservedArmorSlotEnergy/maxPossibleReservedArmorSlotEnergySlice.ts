import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

import {
	ArmorSlotEnergyMapping,
	getDefaultArmorSlotEnergyMapping,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';

export interface MaxPossibleReservedArmorSlotEnergyState {
	value: ArmorSlotEnergyMapping;
	uuid: string;
}

const initialState: MaxPossibleReservedArmorSlotEnergyState = {
	value: getDefaultArmorSlotEnergyMapping(),
	uuid: NIL,
};

export const maxPossibleReservedArmorSlotEnergySlice = createSlice({
	name: 'maxPossibleReservedArmorSlotEnergy',
	initialState,
	reducers: {
		setMaxPossibleReservedArmorSlotEnergy: (
			state,
			action: PayloadAction<ArmorSlotEnergyMapping>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setMaxPossibleReservedArmorSlotEnergy } =
	maxPossibleReservedArmorSlotEnergySlice.actions;

export const selectMaxPossibleReservedArmorSlotEnergy = (state: AppState) =>
	state.maxPossibleReservedArmorSlotEnergy.value;

export default maxPossibleReservedArmorSlotEnergySlice.reducer;
