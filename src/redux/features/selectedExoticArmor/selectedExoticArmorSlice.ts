import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

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
		setSelectedExoticArmorForDestinyClass: (
			state,
			action: PayloadAction<{
				destinyClassId: EDestinyClassId;
				availableExoticArmorItem: AvailableExoticArmorItem;
			}>
		) => {
			state.value = {
				...state.value,
				[action.payload.destinyClassId]:
					action.payload.availableExoticArmorItem,
			};
			state.uuid = uuid();
		},
	},
});

export const { setSelectedExoticArmor, setSelectedExoticArmorForDestinyClass } =
	selectedExoticArmorSlice.actions;

export const selectSelectedExoticArmor = (state: AppState) =>
	state.selectedExoticArmor.value;

export default selectedExoticArmorSlice.reducer;
