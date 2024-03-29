import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { AppState } from '@dlb/redux/store';
import { DestinySubclassIdList } from '@dlb/types/DestinySubclass';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export type SelectedSuperAbility = {
	[key in EDestinySubclassId]: ESuperAbilityId;
};

export interface SelectedSuperAbilityState {
	value: SelectedSuperAbility;
	uuid: string;
}

const getInitialStateValue = (): SelectedSuperAbility => {
	return DestinySubclassIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = null;
		return accumulator;
	}, {}) as SelectedSuperAbility;
};

const initialState: SelectedSuperAbilityState = {
	value: getInitialStateValue(),
	uuid: NIL,
};

export const selectedSuperAbilitySlice = createSlice({
	name: 'selectedSuperAbility',
	initialState,
	reducers: {
		setSelectedSuperAbility: (
			state,
			action: PayloadAction<SelectedSuperAbility>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
		setSelectedSuperAbilityForDestinySubclass: (
			state,
			action: PayloadAction<{
				destinySubclassId: EDestinySubclassId;
				superAbilityId: ESuperAbilityId;
			}>
		) => {
			state.value = {
				...state.value,
				[action.payload.destinySubclassId]: action.payload.superAbilityId,
			};
			state.uuid = uuid();
		},
		clearSelectedSuperAbility: (state) => {
			state.value = getInitialStateValue();
			state.uuid = uuid();
		},
	},
});

export const {
	setSelectedSuperAbility,
	clearSelectedSuperAbility,
	setSelectedSuperAbilityForDestinySubclass,
} = selectedSuperAbilitySlice.actions;

export const selectSelectedSuperAbility = (state: AppState) =>
	state.selectedSuperAbility.value;

export default selectedSuperAbilitySlice.reducer;
