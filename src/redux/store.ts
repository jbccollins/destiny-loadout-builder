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
import selectedMasterworkAssumptionReducer from './features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';

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
			selectedMasterworkAssumption: selectedMasterworkAssumptionReducer,
		},
	});
}

const store = makeStore();

/**** This is a janky way to check when a change that would trigger a re-process of armor is needed *****/
let desiredArmorStatsUuid = NIL;
let selectedCharacterClassUuid = NIL;
let selectedExoticArmorUuid = NIL;
let selectedSubclassOptionsUuid = NIL;
let selectedMasterworkAssumptionUuid = NIL;
function handleChange() {
	const {
		allDataLoaded: { value: hasAllDataLoaded },
		desiredArmorStats: { uuid: nextDesiredArmorStatsUuid },
		selectedCharacterClass: { uuid: nextSelectedCharacterClassUuid },
		selectedExoticArmor: { uuid: nextSelectedExoticArmorUuid },
		selectedSubclassOptions: { uuid: nextSelectedSubclassOptionsUuid },
		selectedMasterworkAssumption: {
			uuid: nextSelectedMasterworkAssumptionUuid,
		},
	} = store.getState();

	const hasMismatchedUuids =
		desiredArmorStatsUuid !== nextDesiredArmorStatsUuid ||
		selectedCharacterClassUuid !== nextSelectedCharacterClassUuid ||
		selectedExoticArmorUuid !== nextSelectedExoticArmorUuid ||
		// TODO: We probably don't need to trigger a dirty if this changes to "All" but all
		// variants of the selected exotic armor piece are masterworked. If we ever process
		// armor without requiring an exotic then we would need to revisit that condition
		selectedMasterworkAssumptionUuid !== nextSelectedMasterworkAssumptionUuid ||
		selectedSubclassOptionsUuid !== nextSelectedSubclassOptionsUuid;
	const hasNonDefaultUuids =
		nextDesiredArmorStatsUuid !== NIL &&
		nextSelectedCharacterClassUuid !== NIL &&
		nextSelectedExoticArmorUuid !== NIL &&
		nextSelectedSubclassOptionsUuid !== NIL &&
		nextSelectedMasterworkAssumptionUuid !== NIL;

	if (hasAllDataLoaded && hasMismatchedUuids && hasNonDefaultUuids) {
		console.log('>>>>>>>>>>> store is dirty <<<<<<<<<<<');
		desiredArmorStatsUuid = nextDesiredArmorStatsUuid;
		selectedCharacterClassUuid = nextSelectedCharacterClassUuid;
		selectedExoticArmorUuid = nextSelectedExoticArmorUuid;
		selectedSubclassOptionsUuid = nextSelectedSubclassOptionsUuid;
		selectedMasterworkAssumptionUuid = nextSelectedMasterworkAssumptionUuid;

		// TODO: Move this out of the store file
		const {
			armor: { value: armor },
			selectedExoticArmor: { value: selectedExoticArmor },
			selectedCharacterClass: { value: selectedCharacterClass },
			desiredArmorStats: { value: desiredArmorStats },
			selectedMasterworkAssumption: { value: masterworkAssumption },
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
			masterworkAssumption,
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
