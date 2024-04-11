import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import {
	DestinyLoadoutColorDefinition,
	DestinyLoadoutComponent,
	DestinyLoadoutIconDefinition,
	DestinyLoadoutNameDefinition,
	DestinyLoadoutsComponent,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { NIL, v4 as uuid } from 'uuid';

export type LoadoutWithId = DestinyLoadoutComponent & {
	dlbGeneratedId: string;
};

export type InGameLoadoutsWithIdMapping = {
	[key: string]: {
		loadouts: LoadoutWithId[];
	};
};

export type InGameLoadoutsMapping = {
	[key: string]: DestinyLoadoutsComponent;
};

export type InGameLoadoutsDefinitions = {
	LoadoutName: Record<number, DestinyLoadoutNameDefinition>;
	LoadoutColor: Record<number, DestinyLoadoutColorDefinition>;
	LoadoutIcon: Record<number, DestinyLoadoutIconDefinition>;
};

export type InGameLoadoutsContext = {
	loadoutItems: InGameLoadoutsWithIdMapping;
	definitions: InGameLoadoutsDefinitions;
};

export const getDefaultInGameLoadoutsContext = (): InGameLoadoutsContext => ({
	loadoutItems: {},
	definitions: {
		LoadoutName: {},
		LoadoutColor: {},
		LoadoutIcon: {},
	},
});

export interface InGameLoadoutsState {
	value: InGameLoadoutsContext;
	uuid: string;
}

const initialState: InGameLoadoutsState = {
	value: getDefaultInGameLoadoutsContext(),
	uuid: NIL,
};

export const inGameLoadoutsSlice = createSlice({
	name: 'inGameLoadouts',
	initialState,
	reducers: {
		setInGameLoadoutsLoadoutItems: (
			state,
			action: PayloadAction<InGameLoadoutsWithIdMapping>
		) => {
			state.value.loadoutItems = action.payload;
			state.uuid = uuid();
		},
		setInGameLoadoutsDefinitions: (
			state,
			action: PayloadAction<InGameLoadoutsContext['definitions']>
		) => {
			state.value.definitions = action.payload;
			state.uuid = uuid();
		},
	},
});

export const { setInGameLoadoutsLoadoutItems, setInGameLoadoutsDefinitions } =
	inGameLoadoutsSlice.actions;

export const selectInGameLoadouts = (state: AppState) =>
	state.inGameLoadouts.value;

export default inGameLoadoutsSlice.reducer;
