import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { ArmorStatMapping } from '@dlb/types/ArmorStat';

export interface ReservedArmorSlotEnergyState {
	value: Record<EArmorSlotId, number>;
	uuid: string;
}

const initialState: ReservedArmorSlotEnergyState = {
	value: {
		[EArmorSlotId.Head]: 0,
		[EArmorSlotId.Arm]: 0,
		[EArmorSlotId.Chest]: 0,
		[EArmorSlotId.Leg]: 0,
		[EArmorSlotId.ClassItem]: 0,
	},
	uuid: NIL,
};

export const reservedArmorSlotEnergySlice = createSlice({
	name: 'reservedArmorSlotEnergy',
	initialState,
	reducers: {
		setReservedArmorSlotEnergy: (
			state,
			action: PayloadAction<Record<EArmorSlotId, number>>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setReservedArmorSlotEnergy } =
	reservedArmorSlotEnergySlice.actions;

export const selectReservedArmorSlotEnergy = (state: AppState) =>
	state.reservedArmorSlotEnergy.value;

export default reservedArmorSlotEnergySlice.reducer;
