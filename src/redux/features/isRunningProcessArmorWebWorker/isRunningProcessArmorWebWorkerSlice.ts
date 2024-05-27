import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface IsRunningProcessArmorWebWorkerState {
	value: boolean;
	uuid: string;
}

const initialState: IsRunningProcessArmorWebWorkerState = {
	value: false,
	uuid: NIL,
};

export const isRunningProcessArmorWebWorkerSlice = createSlice({
	name: 'isRunningProcessArmorWebWorker',
	initialState,
	reducers: {
		setIsRunningProcessArmorWebWorker: (
			state,
			action: PayloadAction<boolean>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setIsRunningProcessArmorWebWorker } =
	isRunningProcessArmorWebWorkerSlice.actions;

export const selectIsRunningProcessArmorWebWorker = (state: AppState) =>
	state.isRunningProcessArmorWebWorker.value;

export default isRunningProcessArmorWebWorkerSlice.reducer;
