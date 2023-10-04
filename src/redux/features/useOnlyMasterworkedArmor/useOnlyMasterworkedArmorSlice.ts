import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { NIL, v4 as uuid } from 'uuid';

export interface UseOnlyMasterworkedArmorState {
	value: boolean;
	uuid: string;
}

const initialState: UseOnlyMasterworkedArmorState = {
	value: false,
	uuid: NIL,
};

export const useOnlyMasterworkedArmorSlice = createSlice({
	name: 'useOnlyMasterworkedArmor',
	initialState,
	reducers: {
		setUseOnlyMasterworkedArmor: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setUseOnlyMasterworkedArmor } =
	useOnlyMasterworkedArmorSlice.actions;

export const selectUseOnlyMasterworkedArmor = (state: AppState) =>
	state.useOnlyMasterworkedArmor.value;

export default useOnlyMasterworkedArmorSlice.reducer;
