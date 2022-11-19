import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import {
	EDestinyClassId,
	EDestinySubclassId,
	ESuperAbilityId,
} from '@dlb/types/IdEnums';
import { v4 as uuid, NIL } from 'uuid';

export interface SelectedSubclassOptions {
	destinySubclassId: EDestinySubclassId;
	superAbilityId: ESuperAbilityId;
}

export interface SelectedSubclassOptionsState {
	value: Record<EDestinyClassId, SelectedSubclassOptions>;
	uuid: string;
}

const initialState: SelectedSubclassOptionsState = {
	value: {
		[EDestinyClassId.Titan]: null,
		[EDestinyClassId.Hunter]: null,
		[EDestinyClassId.Warlock]: null,
	},
	uuid: NIL,
};

export const selectedSubclassOptionsSlice = createSlice({
	name: 'selectedSubclassOptions',
	initialState,
	reducers: {
		setSelectedSubclassOptions: (
			state,
			action: PayloadAction<Record<EDestinyClassId, SelectedSubclassOptions>>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedSubclassOptions } =
	selectedSubclassOptionsSlice.actions;

export const selectSelectedSubclassOptions = (state: AppState) =>
	state.selectedSubclassOptions.value;

export default selectedSubclassOptionsSlice.reducer;
