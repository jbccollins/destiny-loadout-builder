import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClassId, EMasterworkAssumption } from '@dlb/types/IdEnums';
import { v4 as uuid, NIL } from 'uuid';

export interface SelectedMasterworkAssumptionState {
	value: EMasterworkAssumption;
	uuid: string;
}

const initialState: SelectedMasterworkAssumptionState = {
	value: EMasterworkAssumption.All,
	uuid: NIL,
};

export const selectedMasterworkAssumptionSlice = createSlice({
	name: 'selectedMasterworkAssumption',
	initialState,
	reducers: {
		setSelectedMasterworkAssumption: (
			state,
			action: PayloadAction<EMasterworkAssumption>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedMasterworkAssumption } =
	selectedMasterworkAssumptionSlice.actions;

export const selectSelectedMasterworkAssumption = (state: AppState) =>
	state.selectedMasterworkAssumption.value;

export default selectedMasterworkAssumptionSlice.reducer;
