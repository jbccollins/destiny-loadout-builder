import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { DestinySubclassIdList } from '@dlb/types/DestinySubclass';
import { getAspectIdsByDestinySubclassId } from '@dlb/types/Aspect';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';

type SelectedAspects = {
	[key in EDestinySubclassId]: EAspectId[];
};

export interface SelectedAspectsState {
	value: SelectedAspects;
	uuid: string;
}

const generateIntitalState = (): SelectedAspects => {
	return DestinySubclassIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = [null, null]; // getAspectIdsByDestinySubclassId(
		// 	currentValue
		// ).slice(0, 2);
		return accumulator;
	}, {}) as SelectedAspects;
};

const initialState: SelectedAspectsState = {
	value: generateIntitalState(),
	uuid: NIL,
};

export const selectedAspectsSlice = createSlice({
	name: 'selectedAspects',
	initialState,
	reducers: {
		setSelectedAspects: (state, action: PayloadAction<SelectedAspects>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedAspects } = selectedAspectsSlice.actions;

export const selectSelectedAspects = (state: AppState) =>
	state.selectedAspects.value;

export default selectedAspectsSlice.reducer;
