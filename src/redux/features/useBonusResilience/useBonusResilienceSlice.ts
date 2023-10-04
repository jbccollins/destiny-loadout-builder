import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface UseBonusResilienceState {
	value: boolean;
	uuid: string;
}

const initialState: UseBonusResilienceState = {
	value: false,
	uuid: NIL,
};

export const useBonusResilienceSlice = createSlice({
	name: 'useBonusResilience',
	initialState,
	reducers: {
		setUseBonusResilience: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setUseBonusResilience } = useBonusResilienceSlice.actions;

export const selectUseBonusResilience = (state: AppState) =>
	state.useBonusResilience.value;

export default useBonusResilienceSlice.reducer;
