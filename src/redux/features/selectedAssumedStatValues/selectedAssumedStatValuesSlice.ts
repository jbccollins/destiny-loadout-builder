import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import {
	ArmorStatMapping,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import { NIL, v4 as uuid } from 'uuid';

export interface SelectedAssumedStatValuesState {
	value: ArmorStatMapping;
	uuid: string;
}

const initialState: SelectedAssumedStatValuesState = {
	value: getDefaultArmorStatMapping(),
	uuid: NIL,
};

export const selectedAssumedStatValuesSlice = createSlice({
	name: 'selectedAssumedStatValues',
	initialState,
	reducers: {
		setSelectedAssumedStatValues: (
			state,
			action: PayloadAction<ArmorStatMapping>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedAssumedStatValues } =
	selectedAssumedStatValuesSlice.actions;

export const selectSelectedAssumedStatValues = (state: AppState) =>
	state.selectedAssumedStatValues.value;

export default selectedAssumedStatValuesSlice.reducer;
