import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DesiredArmorStats, EArmorStat } from '@dlb/services/data';
import { AppState } from '@dlb/redux/store';

export interface DesiredArmorStatsState {
	value: DesiredArmorStats;
}

const initialState: DesiredArmorStatsState = {
	value: {
		[EArmorStat.Mobility]: 0,
		[EArmorStat.Resilience]: 0,
		[EArmorStat.Recovery]: 0,
		[EArmorStat.Discipline]: 0,
		[EArmorStat.Intellect]: 0,
		[EArmorStat.Strength]: 0
	}
};

export const desiredArmorStatsSlice = createSlice({
	name: 'desiredArmorStats',
	initialState,
	reducers: {
		setDesiredArmorStats: (state, action: PayloadAction<DesiredArmorStats>) => {
			state.value = action.payload;
		}
	}
});

export const { setDesiredArmorStats } = desiredArmorStatsSlice.actions;

export const selectDesiredArmorStats = (state: AppState) =>
	state.desiredArmorStats.value;

export default desiredArmorStatsSlice.reducer;
