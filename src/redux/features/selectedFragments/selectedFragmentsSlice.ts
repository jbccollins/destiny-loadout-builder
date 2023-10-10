import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

// TODO: Consider refactoring all the "user configuration stuff"
// (e.g, selectedFragments, selectedDestinyClass, selectedExoticArmor, etc...)
// To use a single reducer with one uuid. Or....... keep it as is and just
// Keep track of a single uuid in the store? idk... that might be harder to code around...
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { DestinySubclassIdList } from '@dlb/types/DestinySubclass';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export type SelectedFragments = Record<EDestinySubclassId, EFragmentId[]>;
export interface SelectedFragmentsState {
	value: SelectedFragments;
	uuid: string;
}
export const getSelectedFragmentsInitialValue = (): SelectedFragments =>
	DestinySubclassIdList.reduce(
		(acc, subclassId) => ({
			...acc,
			[subclassId]: [],
		}),
		{} as SelectedFragments
	);

const initialState: SelectedFragmentsState = {
	value: getSelectedFragmentsInitialValue(),
	uuid: NIL,
};

export const selectedFragmentsSlice = createSlice({
	name: 'selectedFragments',
	initialState,
	reducers: {
		setSelectedFragments: (state, action: PayloadAction<SelectedFragments>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
		setSelectedFragmentsForDestinySubclass: (
			state,
			action: PayloadAction<{
				destinySubclassId: EDestinySubclassId;
				fragments: EFragmentId[];
			}>
		) => {
			state.value = {
				...state.value,
				[action.payload.destinySubclassId]: action.payload.fragments,
			};
			state.uuid = uuid();
		},
		clearSelectedFragments: (state) => {
			state.value = getSelectedFragmentsInitialValue();
			state.uuid = uuid();
		},
	},
});

export const {
	setSelectedFragmentsForDestinySubclass,
	setSelectedFragments,
	clearSelectedFragments,
} = selectedFragmentsSlice.actions;

export const selectSelectedFragments = (state: AppState) =>
	state.selectedFragments.value;

export default selectedFragmentsSlice.reducer;
