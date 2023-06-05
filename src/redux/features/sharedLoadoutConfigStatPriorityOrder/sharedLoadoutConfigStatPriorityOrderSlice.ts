import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export const defaultOrder = [0, 1, 2, 3, 4, 5];

export interface SharedLoadoutConfigStatPriorityOrderState {
	value: number[];
	uuid: string;
}

const initialState: SharedLoadoutConfigStatPriorityOrderState = {
	value: defaultOrder,
	uuid: NIL,
};

export const sharedLoadoutConfigStatPriorityOrderlice = createSlice({
	name: 'sharedLoadoutConfigStatPriorityOrder',
	initialState,
	reducers: {
		setSharedLoadoutConfigStatPriorityOrder: (
			state,
			action: PayloadAction<number[]>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSharedLoadoutConfigStatPriorityOrder } =
	sharedLoadoutConfigStatPriorityOrderlice.actions;

export const selectSharedLoadoutConfigStatPriorityOrder = (state: AppState) =>
	state.sharedLoadoutConfigStatPriorityOrder.value;

export default sharedLoadoutConfigStatPriorityOrderlice.reducer;
