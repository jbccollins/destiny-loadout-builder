import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinySubclassId } from '@dlb/types/IdEnums';
import { v4 as uuid, NIL } from 'uuid';
import {
	DestinySubclassIdList,
	getDestinySubclass,
} from '@dlb/types/DestinySubclass';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';

type SelectedSuperAbility = {
	[key in EDestinySubclassId]: ESuperAbilityId;
};

export interface SelectedSuperAbilityState {
	value: SelectedSuperAbility;
	uuid: string;
}

const generateIntitalState = (): SelectedSuperAbility => {
	return DestinySubclassIdList.reduce((accumulator, currentValue) => {
		const { superAbilityIdList } = getDestinySubclass(currentValue);
		accumulator[currentValue] = superAbilityIdList[0];
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
