import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface ExcludeLockedItemsState {
	value: boolean;
	uuid: string;
}

const initialState: ExcludeLockedItemsState = {
	value: false,
	uuid: NIL,
};

export const excludeLockedItemsSlice = createSlice({
	name: 'excludeLockedItems',
	initialState,
	reducers: {
		setExcludeLockedItems: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setExcludeLockedItems } = excludeLockedItemsSlice.actions;

export const selectExcludeLockedItems = (state: AppState) =>
	state.excludeLockedItems.value;

export default excludeLockedItemsSlice.reducer;
