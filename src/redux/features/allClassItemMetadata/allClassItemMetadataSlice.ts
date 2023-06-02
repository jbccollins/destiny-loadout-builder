import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import {
	DestinyClassToAllClassItemMetadataMapping,
	getDefaultDestinyClassToAllClassItemMetadataMapping,
} from '@dlb/types/Armor';
import { NIL, v4 as uuid } from 'uuid';

export interface AllClassItemMetadataState {
	value: DestinyClassToAllClassItemMetadataMapping;
	uuid: string;
}

const initialState: AllClassItemMetadataState = {
	value: getDefaultDestinyClassToAllClassItemMetadataMapping(),
	uuid: NIL,
};

export const allClassItemMetadataSlice = createSlice({
	name: 'allClassItemMetadata',
	initialState,
	reducers: {
		setAllClassItemMetadata: (
			state,
			action: PayloadAction<DestinyClassToAllClassItemMetadataMapping>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setAllClassItemMetadata } = allClassItemMetadataSlice.actions;

export const selectAllClassItemMetadata = (state: AppState) =>
	state.allClassItemMetadata.value;

export default allClassItemMetadataSlice.reducer;
