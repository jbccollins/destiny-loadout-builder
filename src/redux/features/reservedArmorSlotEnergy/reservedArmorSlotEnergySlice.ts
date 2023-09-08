import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EArmorSlotId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export type ArmorSlotEnergyMapping = Record<EArmorSlotId, number>;

export const getDefaultArmorSlotEnergyMapping = (): ArmorSlotEnergyMapping => ({
	[EArmorSlotId.Head]: 0,
	[EArmorSlotId.Arm]: 0,
	[EArmorSlotId.Chest]: 0,
	[EArmorSlotId.Leg]: 0,
	[EArmorSlotId.ClassItem]: 0,
});

export interface ReservedArmorSlotEnergyState {
	value: ArmorSlotEnergyMapping;
	uuid: string;
}

const initialState: ReservedArmorSlotEnergyState = {
	value: getDefaultArmorSlotEnergyMapping(),
	uuid: NIL,
};

export const reservedArmorSlotEnergySlice = createSlice({
	name: 'reservedArmorSlotEnergy',
	initialState,
	reducers: {
		setReservedArmorSlotEnergy: (
			state,
			action: PayloadAction<ArmorSlotEnergyMapping>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
		clearReservedArmorSlotEnergy: (state) => {
			state.value = getDefaultArmorSlotEnergyMapping();
			state.uuid = uuid();
		},
	},
});

export const { setReservedArmorSlotEnergy, clearReservedArmorSlotEnergy } =
	reservedArmorSlotEnergySlice.actions;

export const selectReservedArmorSlotEnergy = (state: AppState) =>
	state.reservedArmorSlotEnergy.value;

export default reservedArmorSlotEnergySlice.reducer;
