import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EElementId } from '@dlb/types/IdEnums';
import { getGrenadeIdsByElementId } from '@dlb/types/Grenade';
import { ElementIdList } from '@dlb/types/Element';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';

type SelectedGrenade = {
	[key in EElementId]: EGrenadeId;
};

export interface SelectedGrenadeState {
	value: SelectedGrenade;
	uuid: string;
}

const generateIntitalState = (): SelectedGrenade => {
	return ElementIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = null; // getGrenadeIdsByElementId(currentValue)[0];
		return accumulator;
	}, {}) as SelectedGrenade;
};

const initialState: SelectedGrenadeState = {
	value: generateIntitalState(),
	uuid: NIL,
};

export const selectedGrenadeSlice = createSlice({
	name: 'selectedGrenade',
	initialState,
	reducers: {
		setSelectedGrenade: (state, action: PayloadAction<SelectedGrenade>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedGrenade } = selectedGrenadeSlice.actions;

export const selectSelectedGrenade = (state: AppState) =>
	state.selectedGrenade.value;

export default selectedGrenadeSlice.reducer;
