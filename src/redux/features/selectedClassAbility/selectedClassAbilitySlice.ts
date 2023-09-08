import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { DestinySubclassIdList } from '@dlb/types/DestinySubclass';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export type SelectedClassAbility = {
	[key in EDestinySubclassId]: EClassAbilityId;
};

export interface SelectedClassAbilityState {
	value: SelectedClassAbility;
	uuid: string;
}

const generateIntitalState = (): SelectedClassAbility => {
	return DestinySubclassIdList.reduce((accumulator, currentValue) => {
		accumulator[currentValue] = null;
		// getClassAbilityIdsByDestinySubclassId(currentValue)[0];
		return accumulator;
	}, {}) as SelectedClassAbility;
};

const initialState: SelectedClassAbilityState = {
	value: generateIntitalState(),
	uuid: NIL,
};

export const selectedClassAbilitySlice = createSlice({
	name: 'selectedClassAbility',
	initialState,
	reducers: {
		setSelectedClassAbility: (
			state,
			action: PayloadAction<SelectedClassAbility>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
		clearSelectedClassAbility: (state) => {
			state.value = generateIntitalState();
			state.uuid = uuid();
		},
	},
});

export const { setSelectedClassAbility, clearSelectedClassAbility } =
	selectedClassAbilitySlice.actions;

export const selectSelectedClassAbility = (state: AppState) =>
	state.selectedClassAbility.value;

export default selectedClassAbilitySlice.reducer;
