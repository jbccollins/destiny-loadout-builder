import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

// TODO: Consider refactoring all the "user configuration stuff"
// (e.g, desiredArmorStats, selectedDestinyClass, selectedExoticArmor, etc...)
// To use a single reducer with one uuid. Or....... keep it as is and just
// Keep track of a single uuid in the store? idk... that might be harder to code around...
import {
	ArmorStatMapping,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import { NIL, v4 as uuid } from 'uuid';

export interface DesiredArmorStatsState {
	value: ArmorStatMapping;
	uuid: string;
}
const getInitialStateValue = () => getDefaultArmorStatMapping();

const initialState: DesiredArmorStatsState = {
	value: getInitialStateValue(),
	uuid: NIL,
};

export const desiredArmorStatsSlice = createSlice({
	name: 'desiredArmorStats',
	initialState,
	reducers: {
		setDesiredArmorStats: (state, action: PayloadAction<ArmorStatMapping>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
		clearDesiredArmorStats: (state) => {
			state.value = getInitialStateValue();
			state.uuid = uuid();
		},
	},
});

export const { setDesiredArmorStats, clearDesiredArmorStats } =
	desiredArmorStatsSlice.actions;

export const selectDesiredArmorStats = (state: AppState) =>
	state.desiredArmorStats.value;

export default desiredArmorStatsSlice.reducer;
