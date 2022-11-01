import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DesiredArmorStats, EArmorStatName } from '@dlb/services/data';
import { AppState } from '@dlb/redux/store';

export interface DesiredArmorStatsState {
	value: DesiredArmorStats;
}

const initialState: DesiredArmorStatsState = {
	value: {
		[EArmorStatName.Mobility]: 0,
		[EArmorStatName.Resilience]: 0,
		[EArmorStatName.Recovery]: 0,
		[EArmorStatName.Discipline]: 0,
		[EArmorStatName.Intellect]: 0,
		[EArmorStatName.Strength]: 0
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
