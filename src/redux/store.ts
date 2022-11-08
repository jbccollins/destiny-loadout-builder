import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReducer from './features/counter/counterSlice';
import desiredArmorStatsReducer from './features/desiredArmorStats/desiredArmorStatsSlice';
import armorReducer from './features/armor/armorSlice';
import charactersReducer from './features/characters/charactersSlice';
import selectedCharacterClassReducer from './features/selectedCharacterClass/selectedCharacterClassSlice';
import availableExoticArmorReducer from './features/availableExoticArmor/availableExoticArmorSlice';
import selectedExoticArmorReducer from './features/selectedExoticArmor/selectedExoticArmorSlice';
export function makeStore() {
	return configureStore({
		reducer: {
			counter: counterReducer,
			desiredArmorStats: desiredArmorStatsReducer,
			armor: armorReducer,
			characters: charactersReducer,
			selectedCharacterClass: selectedCharacterClassReducer,
			availableExoticArmor: availableExoticArmorReducer,
			selectedExoticArmor: selectedExoticArmorReducer
		}
	});
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action<string>
>;

export default store;
