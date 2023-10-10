import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { DestinySubclassIdList } from '@dlb/types/DestinySubclass';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export type SelectedGrenade = Record<EDestinySubclassId, EGrenadeId>;

export interface SelectedGrenadeState {
	value: SelectedGrenade;
	uuid: string;
}

const generateIntitalState = (): SelectedGrenade => {
	return DestinySubclassIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = null;
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
		setSelectedGreandeForDestinySubclass: (
			state,
			action: PayloadAction<{
				destinySubclassId: EDestinySubclassId;
				grenadeId: EGrenadeId;
			}>
		) => {
			state.value = {
				...state.value,
				[action.payload.destinySubclassId]: action.payload.grenadeId,
			};
			state.uuid = uuid();
		},
		clearSelectedGrenade: (state) => {
			state.value = generateIntitalState();
			state.uuid = uuid();
		},
	},
});

export const {
	setSelectedGrenade,
	clearSelectedGrenade,
	setSelectedGreandeForDestinySubclass,
} = selectedGrenadeSlice.actions;

export const selectSelectedGrenade = (state: AppState) =>
	state.selectedGrenade.value;

export default selectedGrenadeSlice.reducer;
