import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReducer from './features/counter/counterSlice';
import desiredArmorStatsReducer from './features/desiredArmorStats/desiredArmorStatsSlice';
import armorReducer from './features/armor/armorSlice';
import charactersReducer from './features/characters/charactersSlice';
import selectedDestinyClassReducer from './features/selectedDestinyClass/selectedDestinyClassSlice';
import availableExoticArmorReducer from './features/availableExoticArmor/availableExoticArmorSlice';
import selectedExoticArmorReducer from './features/selectedExoticArmor/selectedExoticArmorSlice';
import allDataLoadedReducer from './features/allDataLoaded/allDataLoadedSlice';
import selectedArmorSlotRestrictionsReducer from './features/selectedArmorSlotRestrictions/selectedArmorSlotRestrictionsSlice';
import selectedFragmentsReducer from './features/selectedFragments/selectedFragmentsSlice';
import selectedAspectsReducer from './features/selectedAspects/selectedAspectsSlice';
import selectedMasterworkAssumptionReducer from './features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import selectedCombatStyleModsReducer from './features/selectedCombatStyleMods/selectedCombatStyleModsSlice';
import selectedMeleeReducer from './features/selectedMelee/selectedMeleeSlice';
import selectedGrenadeReducer from './features/selectedGrenade/selectedGrenadeSlice';
import selectedClassAbilityReducer from './features/selectedClassAbility/selectedClassAbilitySlice';
import selectedSuperAbilityReducer from './features/selectedSuperAbility/selectedSuperAbilitySlice';
import selectedDestinySubclassReducer from './features/selectedDestinySubclass/selectedDestinySubclassSlice';
import processedArmorReducer, {
	setProcessedArmor,
} from './features/processedArmor/processedArmorSlice';
import { NIL } from 'uuid';
import {
	doProcessArmor,
	preProcessArmor,
} from '@dlb/services/armor-processing';
import {
	getArmorStatMappingFromCombatStyleMods,
	getArmorStatMappingFromFragments,
} from '@dlb/types/ArmorStat';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';

export function makeStore() {
	return configureStore({
		reducer: {
			counter: counterReducer,
			desiredArmorStats: desiredArmorStatsReducer,
			armor: armorReducer,
			characters: charactersReducer,
			selectedDestinyClass: selectedDestinyClassReducer,
			availableExoticArmor: availableExoticArmorReducer,
			selectedExoticArmor: selectedExoticArmorReducer,
			allDataLoaded: allDataLoadedReducer,
			processedArmor: processedArmorReducer,
			selectedArmorSlotRestrictions: selectedArmorSlotRestrictionsReducer,
			// selectedSubclassOptions: selectedSubclassOptionsReducer,
			selectedFragments: selectedFragmentsReducer,
			selectedAspects: selectedAspectsReducer,
			selectedMasterworkAssumption: selectedMasterworkAssumptionReducer,
			selectedCombatStyleMods: selectedCombatStyleModsReducer,
			selectedMelee: selectedMeleeReducer,
			selectedGrenade: selectedGrenadeReducer,
			selectedClassAbility: selectedClassAbilityReducer,
			selectedDestinySubclass: selectedDestinySubclassReducer,
			selectedSuperAbility: selectedSuperAbilityReducer,
		},
	});
}

const store = makeStore();

/**** This is a janky way to check when a change that would trigger a re-process of armor is needed *****/
let desiredArmorStatsUuid = NIL;
let selectedDestinyClassUuid = NIL;
let selectedExoticArmorUuid = NIL;
let selectedDestinySubclassUuid = NIL;
let selectedMasterworkAssumptionUuid = NIL;
let selectedFragmentsUuid = NIL;
let selectedCombatStyleModsUuid = NIL;
function handleChange() {
	const {
		allDataLoaded: { value: hasAllDataLoaded },
		desiredArmorStats: { uuid: nextDesiredArmorStatsUuid },
		selectedDestinyClass: { uuid: nextSelectedDestinyClassUuid },
		selectedExoticArmor: { uuid: nextSelectedExoticArmorUuid },
		selectedDestinySubclass: { uuid: nextSelectedDestinySubclassUuid },
		selectedFragments: { uuid: nextSelectedFragmentsUuid },
		selectedCombatStyleMods: { uuid: nextSelectedCombatStyleModsUuid },
		selectedMasterworkAssumption: {
			uuid: nextSelectedMasterworkAssumptionUuid,
		},
	} = store.getState();

	const hasMismatchedUuids =
		desiredArmorStatsUuid !== nextDesiredArmorStatsUuid ||
		selectedDestinyClassUuid !== nextSelectedDestinyClassUuid ||
		selectedExoticArmorUuid !== nextSelectedExoticArmorUuid ||
		// TODO: We probably don't need to trigger a dirty if this changes to "All" but all
		// variants of the selected exotic armor piece are masterworked. If we ever process
		// armor without requiring an exotic then we would need to revisit that condition
		selectedMasterworkAssumptionUuid !== nextSelectedMasterworkAssumptionUuid ||
		selectedFragmentsUuid !== nextSelectedFragmentsUuid ||
		selectedDestinySubclassUuid !== nextSelectedDestinySubclassUuid ||
		selectedCombatStyleModsUuid !== nextSelectedCombatStyleModsUuid;
	const hasNonDefaultUuids =
		nextDesiredArmorStatsUuid !== NIL &&
		nextSelectedDestinyClassUuid !== NIL &&
		nextSelectedExoticArmorUuid !== NIL &&
		nextSelectedDestinySubclassUuid !== NIL &&
		nextSelectedMasterworkAssumptionUuid !== NIL &&
		nextSelectedCombatStyleModsUuid !== NIL &&
		nextSelectedFragmentsUuid !== NIL;

	if (hasAllDataLoaded && hasMismatchedUuids && hasNonDefaultUuids) {
		console.log('>>>>>>>>>>> store is dirty <<<<<<<<<<<');
		desiredArmorStatsUuid = nextDesiredArmorStatsUuid;
		selectedDestinyClassUuid = nextSelectedDestinyClassUuid;
		selectedExoticArmorUuid = nextSelectedExoticArmorUuid;
		selectedDestinySubclassUuid = nextSelectedDestinySubclassUuid;
		selectedMasterworkAssumptionUuid = nextSelectedMasterworkAssumptionUuid;
		selectedFragmentsUuid = nextSelectedFragmentsUuid;
		selectedCombatStyleModsUuid = nextSelectedCombatStyleModsUuid;

		// TODO: Move this out of the store file
		const {
			armor: { value: armor },
			selectedExoticArmor: { value: selectedExoticArmor },
			selectedDestinyClass: { value: selectedDestinyClass },
			desiredArmorStats: { value: desiredArmorStats },
			selectedMasterworkAssumption: { value: masterworkAssumption },
			selectedFragments: { value: selectedFragments },
			selectedCombatStyleMods: { value: selectedCombatStyleMods },
			selectedDestinySubclass: { value: selectedDestinySubclass },
		} = store.getState();

		const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
		const { elementId } = getDestinySubclass(destinySubclassId);
		const fragmentArmorStatMapping = getArmorStatMappingFromFragments(
			selectedFragments[elementId],
			selectedDestinyClass
		);
		const combatStyleModArmorStatMapping =
			getArmorStatMappingFromCombatStyleMods(
				selectedCombatStyleMods,
				selectedDestinyClass
			);

		console.log(
			'>>>>>>>>>>>>>>>>>>> fragmentArmorStatMapping',
			fragmentArmorStatMapping
		);

		// TODO: no need to preProcessArmor when only the stat slider has changed.
		// Maybe we don't need to trigger that fake initial dispatch in
		// the slider component if we fix this?
		const preProcessedArmor = preProcessArmor(
			armor[selectedDestinyClass],
			selectedExoticArmor[selectedDestinyClass]
		);
		console.log('>>>>>>>>>>> preProcessedArmor <<<<<<<<<<<', preProcessedArmor);
		const results = doProcessArmor({
			masterworkAssumption,
			desiredArmorStats,
			armorItems: preProcessedArmor,
			fragmentArmorStatMapping,
			combatStyleModArmorStatMapping,
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
