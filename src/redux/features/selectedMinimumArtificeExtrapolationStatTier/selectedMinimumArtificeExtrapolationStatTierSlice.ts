import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { v4 as uuid, NIL } from 'uuid';

export interface SelectedMinimumArtificeExtrapolationStatTierState {
	value: number;
	uuid: string;
}

const initialState: SelectedMinimumArtificeExtrapolationStatTierState = {
	value: 7,
	uuid: NIL,
};

export const selectedMinimumArtificeExtrapolationStatTierSlice = createSlice({
	name: 'selectedMinimumArtificeExtrapolationStatTier',
	initialState,
	reducers: {
		setSelectedMinimumArtificeExtrapolationStatTier: (
			state,
			action: PayloadAction<number>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedMinimumArtificeExtrapolationStatTier } =
	selectedMinimumArtificeExtrapolationStatTierSlice.actions;

export const selectSelectedMinimumArtificeExtrapolationStatTier = (
	state: AppState
) => state.selectedMinimumArtificeExtrapolationStatTier.value;

export default selectedMinimumArtificeExtrapolationStatTierSlice.reducer;
