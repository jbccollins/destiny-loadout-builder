import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EIntrinsicArmorPerkOrAttributeId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export interface SelectedIntrinsicArmorPerkOrAttributeIdsState {
	value: EIntrinsicArmorPerkOrAttributeId[];
	uuid: string;
}

export const getDefaultIntrinsicArmorPerkOrAttributeIdList = (): [
	EIntrinsicArmorPerkOrAttributeId,
	EIntrinsicArmorPerkOrAttributeId,
	EIntrinsicArmorPerkOrAttributeId,
	EIntrinsicArmorPerkOrAttributeId
] => [null, null, null, null];

const initialState: SelectedIntrinsicArmorPerkOrAttributeIdsState = {
	value: getDefaultIntrinsicArmorPerkOrAttributeIdList(),
	uuid: NIL,
};

export const selectedIntrinsicArmorPerkOrAttributeIdsSlice = createSlice({
	name: 'selectedIntrinsicArmorPerkOrAttributeIds',
	initialState,
	reducers: {
		setSelectedIntrinsicArmorPerkOrAttributeIds: (
			state,
			action: PayloadAction<EIntrinsicArmorPerkOrAttributeId[]>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
		clearSelectedIntrinsicArmorPerkOrAttributeIds: (state) => {
			state.value = getDefaultIntrinsicArmorPerkOrAttributeIdList();
			state.uuid = uuid();
		},
	},
});

export const {
	setSelectedIntrinsicArmorPerkOrAttributeIds,
	clearSelectedIntrinsicArmorPerkOrAttributeIds,
} = selectedIntrinsicArmorPerkOrAttributeIdsSlice.actions;

export const selectSelectedIntrinsicArmorPerkOrAttributeIds = (
	state: AppState
) => state.selectedIntrinsicArmorPerkOrAttributeIds.value;

export default selectedIntrinsicArmorPerkOrAttributeIdsSlice.reducer;
