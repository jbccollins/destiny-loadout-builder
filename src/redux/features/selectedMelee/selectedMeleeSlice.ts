import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { DestinySubclassIdList } from '@dlb/types/DestinySubclass';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export type SelectedMelee = {
	[key in EDestinySubclassId]: EMeleeId;
};

export interface SelectedMeleeState {
	value: SelectedMelee;
	uuid: string;
}

const generateIntitalState = (): SelectedMelee => {
	return DestinySubclassIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = null; // getMeleeIdsByDestinySubclassId(currentValue)[0];
		return accumulator;
	}, {}) as SelectedMelee;
};

const initialState: SelectedMeleeState = {
	value: generateIntitalState(),
	uuid: NIL,
};

export const selectedMeleeSlice = createSlice({
	name: 'selectedMelee',
	initialState,
	reducers: {
		setSelectedMelee: (state, action: PayloadAction<SelectedMelee>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedMelee } = selectedMeleeSlice.actions;

export const selectSelectedMelee = (state: AppState) =>
	state.selectedMelee.value;

export default selectedMeleeSlice.reducer;
