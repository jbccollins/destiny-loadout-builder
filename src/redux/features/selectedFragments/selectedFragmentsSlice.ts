import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

// TODO: Consider refactoring all the "user configuration stuff"
// (e.g, selectedFragments, selectedDestinyClass, selectedExoticArmor, etc...)
// To use a single reducer with one uuid. Or....... keep it as is and just
// Keep track of a single uuid in the store? idk... that might be harder to code around...
import { v4 as uuid, NIL } from 'uuid';
import { EArmorStatId, EElementId, EFragmentId } from '@dlb/types/IdEnums';
import { ArmorStatMapping } from '@dlb/types/ArmorStat';

// TODO: There is probably a cleaner way to say
// "This type has all the elements as keys"
// See how selected aspects did this. But we would need to refactor
// EElementId to not include "Any" before doing that
type SelectedFragments = {
	[EElementId.Stasis]: EFragmentId[];
	[EElementId.Void]: EFragmentId[];
	[EElementId.Solar]: EFragmentId[];
	[EElementId.Arc]: EFragmentId[];
};

export interface SelectedFragmentsState {
	value: SelectedFragments;
	uuid: string;
}

const initialState: SelectedFragmentsState = {
	value: {
		[EElementId.Stasis]: [],
		[EElementId.Void]: [],
		[EElementId.Solar]: [],
		[EElementId.Arc]: [],
	},
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
	},
});

export const { setSelectedFragments } = selectedFragmentsSlice.actions;

export const selectSelectedFragments = (state: AppState) =>
	state.selectedFragments.value;

export default selectedFragmentsSlice.reducer;
