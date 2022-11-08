import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { Armor, EDestinyClass, generateArmorGroup } from '@dlb/services/data';

export interface ArmorState {
	value: Armor;
}

const initialState: ArmorState = {
	value: {
		[EDestinyClass.Titan]: generateArmorGroup(),
		[EDestinyClass.Hunter]: generateArmorGroup(),
		[EDestinyClass.Warlock]: generateArmorGroup()
	}
};

export const armorSlice = createSlice({
	name: 'armor',
	initialState,
	reducers: {
		setArmor: (state, action: PayloadAction<Armor>) => {
			state.value = action.payload;
		}
	}
});

export const { setArmor } = armorSlice.actions;

export const selectArmor = (state: AppState) => state.armor.value;

export default armorSlice.reducer;
