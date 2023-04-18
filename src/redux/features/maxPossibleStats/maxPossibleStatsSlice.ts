import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

// TODO: Consider refactoring all the "user configuration stuff"
// (e.g, maxPossibleStats, selectedDestinyClass, selectedExoticArmor, etc...)
// To use a single reducer with one uuid. Or....... keep it as is and just
// Keep track of a single uuid in the store? idk... that might be harder to code around...
import { v4 as uuid, NIL } from 'uuid';
import { EArmorStatId } from '@dlb/types/IdEnums';
import {
	ArmorStatMapping,
	DefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';

export interface MaxPossibleStatsState {
	value: ArmorStatMapping;
	uuid: string;
}

const initialState: MaxPossibleStatsState = {
	value: getDefaultArmorStatMapping(),
	uuid: NIL,
};

export const maxPossibleStatsSlice = createSlice({
	name: 'maxPossibleStats',
	initialState,
	reducers: {
		setMaxPossibleStats: (state, action: PayloadAction<ArmorStatMapping>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setMaxPossibleStats } = maxPossibleStatsSlice.actions;

export const selectMaxPossibleStats = (state: AppState) =>
	state.maxPossibleStats.value;

export default maxPossibleStatsSlice.reducer;
