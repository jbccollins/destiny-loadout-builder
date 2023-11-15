import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { ArmorMetadata, getDefaultArmorMetadata } from '@dlb/types/Armor';
import { NIL, v4 as uuid } from 'uuid';

export interface ArmorMetadataState {
	value: ArmorMetadata;
	uuid: string;
}

const initialState: ArmorMetadataState = {
	value: getDefaultArmorMetadata(),
	uuid: NIL,
};

export const armorMetadataSlice = createSlice({
	name: 'armorMetada',
	initialState,
	reducers: {
		setArmorMetadata: (state, action: PayloadAction<ArmorMetadata>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setArmorMetadata } = armorMetadataSlice.actions;

export const selectArmorMetadata = (state: AppState) =>
	state.armorMetadata.value;

export default armorMetadataSlice.reducer;
