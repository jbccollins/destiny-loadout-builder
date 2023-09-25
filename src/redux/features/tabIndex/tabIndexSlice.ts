import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { ETabType } from '@dlb/types/Tab';
import { NIL, v4 as uuid } from 'uuid';

export interface TabIndexState {
	value: number;
	uuid: string;
}

const initialState: TabIndexState = {
	value: 0,
	uuid: NIL,
};

export const tabIndexSlice = createSlice({
	name: 'tabIndex',
	initialState,
	reducers: {
		setTabIndex: (state, action: PayloadAction<number>) => {
			state.value = action.payload;
			state.uuid = uuid();
			// Add the tab as a new query param to the URL
			// We only want to support linking to the analyze tab
			const url = new URL(window.location.href);
			const params = new URLSearchParams(url.search);
			if (action.payload !== ETabType.ANALYZE) {
				params.delete('tab');
			} else {
				params.set('tab', action.payload.toString());
			}
			url.search = params.toString();
			window.history.replaceState({}, '', url.toString());
		},
	},
});

export const { setTabIndex } = tabIndexSlice.actions;

export const selectTabIndex = (state: AppState) => state.tabIndex.value;

export default tabIndexSlice.reducer;
