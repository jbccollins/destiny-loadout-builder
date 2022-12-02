import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReducer from './features/counter/counterSlice';
import desiredArmorStatsReducer from './features/desiredArmorStats/desiredArmorStatsSlice';
import armorReducer from './features/armor/armorSlice';
import charactersReducer from './features/characters/charactersSlice';
import selectedCharacterClassReducer from './features/selectedCharacterClass/selectedCharacterClassSlice';
import availableExoticArmorReducer from './features/availableExoticArmor/availableExoticArmorSlice';
import selectedExoticArmorReducer from './features/selectedExoticArmor/selectedExoticArmorSlice';
import allDataLoadedReducer from './features/allDataLoaded/allDataLoadedSlice';
import selectedArmorSlotRestrictionsReducer from './features/selectedArmorSlotRestrictions/selectedArmorSlotRestrictionsSlice';
import selectedSubclassOptionsReducer from './features/selectedSubclassOptions/selectedSubclassOptionsSlice';
import selectedFragmentsReducer from './features/selectedFragments/selectedFragmentsSlice';
import selectedAspectsReducer from './features/selectedAspects/selectedAspectsSlice';

import processedArmorReducer, {
	setProcessedArmor,
} from './features/processedArmor/processedArmorSlice';
import { NIL } from 'uuid';
import {
	doProcessArmor,
	preProcessArmor,
} from '@dlb/services/armor-processing';

export function makeStore() {
	return configureStore({
		reducer: {
			counter: counterReducer,
			desiredArmorStats: desiredArmorStatsReducer,
			armor: armorReducer,
			characters: charactersReducer,
			selectedCharacterClass: selectedCharacterClassReducer,
			availableExoticArmor: availableExoticArmorReducer,
			selectedExoticArmor: selectedExoticArmorReducer,
			allDataLoaded: allDataLoadedReducer,
			processedArmor: processedArmorReducer,
			selectedArmorSlotRestrictions: selectedArmorSlotRestrictionsReducer,
			selectedSubclassOptions: selectedSubclassOptionsReducer,
			selectedFragments: selectedFragmentsReducer,
			selectedAspects: selectedAspectsReducer,
		},
	});
}

const store = makeStore();

/**** This is a janky way to check when a change that would trigger a re-process of armor is needed *****/
let desiredArmorStatsUuid = NIL;
let selectedCharacterClassUuid = NIL;
let selectedExoticArmorUuid = NIL;
let selectedSubclassOptionsUuid = NIL;
function handleChange() {
	const {
		allDataLoaded: { value: hasAllDataLoaded },
		desiredArmorStats: { uuid: nextDesiredArmorStatsUuid },
		selectedCharacterClass: { uuid: nextSelectedCharacterClassUuid },
		selectedExoticArmor: { uuid: nextSelectedExoticArmorUuid },
		selectedSubclassOptions: { uuid: nextSelectedSubclassOptionsUuid },
	} = store.getState();

	const hasMismatchedUuids =
		desiredArmorStatsUuid !== nextDesiredArmorStatsUuid ||
		selectedCharacterClassUuid !== nextSelectedCharacterClassUuid ||
		selectedExoticArmorUuid !== nextSelectedExoticArmorUuid ||
		selectedSubclassOptionsUuid !== nextSelectedSubclassOptionsUuid;
	const hasNonDefaultUuids =
		nextDesiredArmorStatsUuid !== NIL &&
		nextSelectedCharacterClassUuid !== NIL &&
		nextSelectedExoticArmorUuid !== NIL;
	nextSelectedSubclassOptionsUuid !== NIL;

	if (hasAllDataLoaded && hasMismatchedUuids && hasNonDefaultUuids) {
		console.log('>>>>>>>>>>> store is dirty <<<<<<<<<<<');
		desiredArmorStatsUuid = nextDesiredArmorStatsUuid;
		selectedCharacterClassUuid = nextSelectedCharacterClassUuid;
		selectedExoticArmorUuid = nextSelectedExoticArmorUuid;
		selectedSubclassOptionsUuid = nextSelectedSubclassOptionsUuid;

		// TODO: Move this out of the store file
		const {
			armor: { value: armor },
			selectedExoticArmor: { value: selectedExoticArmor },
			selectedCharacterClass: { value: selectedCharacterClass },
			desiredArmorStats: { value: desiredArmorStats },
		} = store.getState();

		// TODO: no need to preProcessArmor when only the stat slider has changed.
		// Maybe we don't need to trigger that fake initial dispatch in
		// the slider component if we fix this?
		const preProcessedArmor = preProcessArmor(
			armor[selectedCharacterClass],
			selectedExoticArmor[selectedCharacterClass]
		);
		console.log('>>>>>>>>>>> preProcessedArmor <<<<<<<<<<<', preProcessedArmor);
		const results = doProcessArmor({
			desiredArmorStats,
			armorItems: preProcessedArmor,
		});
		console.log('>>>>>>>>>>> results <<<<<<<<<<<', results);
		store.dispatch(setProcessedArmor(results));
	}
}

const unsubscribe = store.subscribe(handleChange);
// unsubscribe();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action<string>
>;

export default store;
