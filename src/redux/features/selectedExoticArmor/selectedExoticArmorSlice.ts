import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { v4 as uuid, NIL } from 'uuid';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';

export interface SelectedExoticArmorState {
	value: Record<EDestinyClassId, AvailableExoticArmorItem>;
	uuid: string;
}

const initialState: SelectedExoticArmorState = {
	value: {
		[EDestinyClassId.Titan]: null,
		[EDestinyClassId.Hunter]: null,
		[EDestinyClassId.Warlock]: null,
	},
	uuid: NIL,
};

export const selectedExoticArmorSlice = createSlice({
	name: 'selectedExoticArmor',
	initialState,
	reducers: {
		setSelectedExoticArmor: (
			state,
			action: PayloadAction<Record<EDestinyClassId, AvailableExoticArmorItem>>
		) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedExoticArmor } = selectedExoticArmorSlice.actions;

export const selectSelectedExoticArmor = (state: AppState) =>
	state.selectedExoticArmor.value;

export default selectedExoticArmorSlice.reducer;
