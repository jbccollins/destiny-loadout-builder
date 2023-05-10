import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { v4 as uuid, NIL } from 'uuid';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	ArmorStatMapping,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';

type SharedLoadoutDesiredStatsValue = {
	desiredArmorStats: ArmorStatMapping;
	needed: boolean;
	processing: boolean;
	complete: boolean;
};

const defaultSharedLoadoutDesiredStatsValue: SharedLoadoutDesiredStatsValue = {
	desiredArmorStats: getDefaultArmorStatMapping(),
	needed: false,
	processing: false,
	complete: false,
};

export interface SharedLoadoutDesiredStatsState {
	value: SharedLoadoutDesiredStatsValue;
	uuid: string;
}

const initialState: SharedLoadoutDesiredStatsState = {
	// TODO: If we ever let the user have a build with all
	// Legendary items this will need to have 5 mod slots
	value: defaultSharedLoadoutDesiredStatsValue,
	uuid: NIL,
};

export const sharedLoadoutDesiredStatsSlice = createSlice({
	name: 'sharedLoadoutDesiredStats',
	initialState,
	reducers: {
		setSharedLoadoutDesiredStats: (
			state,
			action: PayloadAction<SharedLoadoutDesiredStatsValue>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSharedLoadoutDesiredStats } =
	sharedLoadoutDesiredStatsSlice.actions;

export const selectSharedLoadoutDesiredStats = (state: AppState) =>
	state.sharedLoadoutDesiredStats.value;

export default sharedLoadoutDesiredStatsSlice.reducer;
