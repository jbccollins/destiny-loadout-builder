import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EExoticArtificeAssumption } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export interface SelectedExoticArtificeAssumptionState {
	value: EExoticArtificeAssumption;
	uuid: string;
}

const initialState: SelectedExoticArtificeAssumptionState = {
	value: EExoticArtificeAssumption.All,
	uuid: NIL,
};

export const selectedExoticArtificeAssumptionSlice = createSlice({
	name: 'selectedExoticArtificeAssumption',
	initialState,
	reducers: {
		setSelectedExoticArtificeAssumption: (
			state,
			action: PayloadAction<EExoticArtificeAssumption>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedExoticArtificeAssumption } =
	selectedExoticArtificeAssumptionSlice.actions;

export const selectSelectedExoticArtificeAssumption = (state: AppState) =>
	state.selectedExoticArtificeAssumption.value;

export default selectedExoticArtificeAssumptionSlice.reducer;
