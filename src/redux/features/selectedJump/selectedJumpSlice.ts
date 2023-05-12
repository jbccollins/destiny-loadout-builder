import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { DestinySubclassIdList } from '@dlb/types/DestinySubclass';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export type SelectedJump = {
	[key in EDestinySubclassId]: EJumpId;
};

export interface SelectedJumpState {
	value: SelectedJump;
	uuid: string;
}

const generateIntitalState = (): SelectedJump => {
	return DestinySubclassIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = null; // getJumpIdsByDestinySubclassId(currentValue)[0];
		return accumulator;
	}, {}) as SelectedJump;
};

const initialState: SelectedJumpState = {
	value: generateIntitalState(),
	uuid: NIL,
};

export const selectedJumpSlice = createSlice({
	name: 'selectedJump',
	initialState,
	reducers: {
		setSelectedJump: (state, action: PayloadAction<SelectedJump>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedJump } = selectedJumpSlice.actions;

export const selectSelectedJump = (state: AppState) => state.selectedJump.value;

export default selectedJumpSlice.reducer;
