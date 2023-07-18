import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

// TODO: Consider refactoring all the "user configuration stuff"
// (e.g, desiredArmorStats, selectedDestinyClass, selectedExoticArmor, etc...)
// To use a single reducer with one uuid. Or....... keep it as is and just
// Keep track of a single uuid in the store? idk... that might be harder to code around...
import { ArmorStatMapping } from '@dlb/types/ArmorStat';
import { EArmorStatId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export interface DesiredArmorStatsState {
	value: ArmorStatMapping;
	uuid: string;
}

const initialState: DesiredArmorStatsState = {
	value: {
		// [EArmorStatId.Mobility]: 0,
		// [EArmorStatId.Resilience]: 0,
		// [EArmorStatId.Recovery]: 0,
		// [EArmorStatId.Discipline]: 0,
		// [EArmorStatId.Intellect]: 0,
		// [EArmorStatId.Strength]: 0,
		[EArmorStatId.Mobility]: 20,
		[EArmorStatId.Resilience]: 100,
		[EArmorStatId.Recovery]: 50,
		[EArmorStatId.Discipline]: 80,
		[EArmorStatId.Intellect]: 30,
		[EArmorStatId.Strength]: 30,
	},
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
	},
});

export const { setDesiredArmorStats } = desiredArmorStatsSlice.actions;

export const selectDesiredArmorStats = (state: AppState) =>
	state.desiredArmorStats.value;

export default desiredArmorStatsSlice.reducer;
