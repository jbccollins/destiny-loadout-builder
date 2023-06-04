import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { EModId } from '@dlb/generated/mod/EModId';
import { NIL, v4 as uuid } from 'uuid';

export const defaultRaidMods = [null, null, null, null];

// export const defaultRaidMods = [
// 	EModId.RunForYourLife,
// 	EModId.WillOfLightArc,
// 	EModId.MortalMedicine,
// 	EModId.WillOfLightKinetic,
// ];

export interface SelectedRaidModsState {
	value: EModId[];
	uuid: string;
}

const initialState: SelectedRaidModsState = {
	// TODO: If we ever let the user have a build with all
	// Legendary items this will need to have 5 mod slots
	value: defaultRaidMods,
	uuid: NIL,
};

export const selectedRaidModsSlice = createSlice({
	name: 'selectedRaidMods',
	initialState,
	reducers: {
		setSelectedRaidMods: (state, action: PayloadAction<EModId[]>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setSelectedRaidMods } = selectedRaidModsSlice.actions;

export const selectSelectedRaidMods = (state: AppState) =>
	state.selectedRaidMods.value;

export default selectedRaidModsSlice.reducer;
