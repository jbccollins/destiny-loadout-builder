import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

// TODO: Consider refactoring all the "user configuration stuff"
// (e.g, selectedFragments, selectedDestinyClass, selectedExoticArmor, etc...)
// To use a single reducer with one uuid. Or....... keep it as is and just
// Keep track of a single uuid in the store? idk... that might be harder to code around...
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EElementId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

// TODO: There is probably a cleaner way to say
// "This type has all the elements as keys"
// See how selected aspects did this. But we would need to refactor
// EElementId to not include "Any" before doing that
export type SelectedFragments = {
	[EElementId.Stasis]: EFragmentId[];
	[EElementId.Void]: EFragmentId[];
	[EElementId.Solar]: EFragmentId[];
	[EElementId.Arc]: EFragmentId[];
	[EElementId.Strand]: EFragmentId[];
};

export interface SelectedFragmentsState {
	value: SelectedFragments;
	uuid: string;
}
export const getSelectedFragmentsInitialValue = (): SelectedFragments => ({
	[EElementId.Stasis]: [],
	[EElementId.Void]: [],
	[EElementId.Solar]: [],
	[EElementId.Arc]: [],
	[EElementId.Strand]: [],
});

const initialState: SelectedFragmentsState = {
	value: getSelectedFragmentsInitialValue(),
	uuid: NIL,
};

export const selectedFragmentsSlice = createSlice({
	name: 'selectedFragments',
	initialState,
	reducers: {
		setSelectedFragments: (
			state,
			action: PayloadAction<{ elementId: EElementId; fragments: EFragmentId[] }>
		) => {
			state.value = {
				...state.value,
				[action.payload.elementId]: action.payload.fragments,
			};
			state.uuid = uuid();
		},
		clearSelectedFragments: (state) => {
			state.value = getSelectedFragmentsInitialValue();
			state.uuid = uuid();
		},
	},
});

export const { setSelectedFragments, clearSelectedFragments } =
	selectedFragmentsSlice.actions;

export const selectSelectedFragments = (state: AppState) =>
	state.selectedFragments.value;

export default selectedFragmentsSlice.reducer;
