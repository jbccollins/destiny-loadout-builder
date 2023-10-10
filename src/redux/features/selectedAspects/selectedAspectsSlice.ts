import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { DestinySubclassIdList } from '@dlb/types/DestinySubclass';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export type SelectedAspects = {
	[key in EDestinySubclassId]: EAspectId[];
};

export interface SelectedAspectsState {
	value: SelectedAspects;
	uuid: string;
}

export const getInitialStateValue = (): SelectedAspects => {
	return DestinySubclassIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = [null, null]; // getAspectIdsByDestinySubclassId(
		// 	currentValue
		// ).slice(0, 2);
		return accumulator;
	}, {}) as SelectedAspects;
};

const initialState: SelectedAspectsState = {
	value: getInitialStateValue(),
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
		setSelectedAspectsForDestinySubclass: (
			state,
			action: PayloadAction<{
				destinySubclassId: EDestinySubclassId;
				aspects: EAspectId[];
			}>
		) => {
			state.value = {
				...state.value,
				[action.payload.destinySubclassId]: action.payload.aspects,
			};
			state.uuid = uuid();
		},
		clearSelectedAspects: (state) => {
			state.value = getInitialStateValue();
			state.uuid = uuid();
		},
	},
});

export const {
	setSelectedAspects,
	clearSelectedAspects,
	setSelectedAspectsForDestinySubclass,
} = selectedAspectsSlice.actions;

export const selectSelectedAspects = (state: AppState) =>
	state.selectedAspects.value;

export default selectedAspectsSlice.reducer;
