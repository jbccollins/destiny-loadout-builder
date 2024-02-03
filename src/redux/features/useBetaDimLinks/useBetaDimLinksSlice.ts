import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface UseBetaDimLinksState {
	value: boolean;
	uuid: string;
}

const initialState: UseBetaDimLinksState = {
	value: false,
	uuid: NIL,
};

export const useBetaDimLinksSlice = createSlice({
	name: 'useBetaDimLinks',
	initialState,
	reducers: {
		setUseBetaDimLinks: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setUseBetaDimLinks } = useBetaDimLinksSlice.actions;

export const selectUseBetaDimLinks = (state: AppState) =>
	state.useBetaDimLinks.value;

export default useBetaDimLinksSlice.reducer;
