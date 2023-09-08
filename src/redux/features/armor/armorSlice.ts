import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { Armor, generateArmorGroup } from '@dlb/types/Armor';
import { EDestinyClassId } from '@dlb/types/IdEnums';

export interface ArmorState {
	value: Armor;
}

const initialState: ArmorState = {
	value: {
		[EDestinyClassId.Titan]: generateArmorGroup(),
		[EDestinyClassId.Hunter]: generateArmorGroup(),
		[EDestinyClassId.Warlock]: generateArmorGroup(),
	},
};

export const armorSlice = createSlice({
	name: 'armor',
	initialState,
	reducers: {
		setArmor: (state, action: PayloadAction<Armor>) => {
			state.value = action.payload;
		},
	},
});

export const { setArmor } = armorSlice.actions;

export const selectArmor = (state: AppState) => state.armor.value;

export default armorSlice.reducer;
