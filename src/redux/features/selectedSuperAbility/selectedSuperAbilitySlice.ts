import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { AppState } from '@dlb/redux/store';
import {
	DestinySubclassIdList,
	getDestinySubclass,
} from '@dlb/types/DestinySubclass';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export type SelectedSuperAbility = {
	[key in EDestinySubclassId]: ESuperAbilityId;
};

export interface SelectedSuperAbilityState {
	value: SelectedSuperAbility;
	uuid: string;
}

const generateIntitalState = (): SelectedSuperAbility => {
	return DestinySubclassIdList.reduce((accumulator, currentValue) => {
		const { superAbilityIdList } = getDestinySubclass(currentValue);
		accumulator[currentValue] = null; // superAbilityIdList[0];
		return accumulator;
	}, {}) as SelectedSuperAbility;
};

const initialState: SelectedSuperAbilityState = {
	value: generateIntitalState(),
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
	},
});

export const { setSelectedSuperAbility } = selectedSuperAbilitySlice.actions;

export const selectSelectedSuperAbility = (state: AppState) =>
	state.selectedSuperAbility.value;

export default selectedSuperAbilitySlice.reducer;
