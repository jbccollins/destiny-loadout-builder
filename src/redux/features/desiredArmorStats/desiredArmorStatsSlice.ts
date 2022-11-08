import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DesiredArmorStats, EArmorStat } from '@dlb/services/data';
import { AppState } from '@dlb/redux/store';

// TODO: Consider refactoring all the "user configuration stuff"
// (e.g, desiredArmorStats, selectedCharacterClass, selectedExoticArmor, etc...)
// To use a single reducer with one uuid. Or....... keep it as is and just
// Keep track of a single uuid in the store? idk... that might be harder to code around...
import { v4 as uuid, NIL } from 'uuid';

export interface DesiredArmorStatsState {
	value: DesiredArmorStats;
	uuid: string;
}

const initialState: DesiredArmorStatsState = {
	value: {
		[EArmorStat.Mobility]: 0,
		[EArmorStat.Resilience]: 0,
		[EArmorStat.Recovery]: 0,
		[EArmorStat.Discipline]: 0,
		[EArmorStat.Intellect]: 0,
		[EArmorStat.Strength]: 0
	},
	uuid: NIL
};

export const desiredArmorStatsSlice = createSlice({
	name: 'desiredArmorStats',
	initialState,
	reducers: {
		setDesiredArmorStats: (state, action: PayloadAction<DesiredArmorStats>) => {
			state.value = action.payload;
			state.uuid = uuid();
		}
	}
});

export const { setDesiredArmorStats } = desiredArmorStatsSlice.actions;

export const selectDesiredArmorStats = (state: AppState) =>
	state.desiredArmorStats.value;

export default desiredArmorStatsSlice.reducer;
