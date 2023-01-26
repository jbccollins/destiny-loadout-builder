import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReducer from './features/counter/counterSlice';
import desiredArmorStatsReducer from './features/desiredArmorStats/desiredArmorStatsSlice';
import maxPossibleStatsReducer, {
	setMaxPossibleStats,
} from './features/maxPossibleStats/maxPossibleStatsSlice';
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
import selectedJumpReducer from './features/selectedJump/selectedJumpSlice';
import selectedArmorSlotModsReducer from './features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import dimLoadoutsReducer from './features/dimLoadouts/dimLoadoutsSlice';
import dimLoadoutsFilterReducer from './features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import disabledCombatStyleModsReducer, {
	setDisabledCombatStyleMods,
} from './features/disabledCombatStyleMods/disabledCombatStyleModsSlice';
import disabledArmorSlotModsReducer, {
	setDisabledArmorSlotMods,
} from './features/disabledArmorSlotMods/disabledArmorSlotModsSlice';
import armorSlotModViolationsReducer, {
	setArmorSlotModViolations,
} from './features/armorSlotModViolations/armorSlotModViolationsSlice';

import processedArmorReducer, {
	setProcessedArmor,
} from './features/processedArmor/processedArmorSlice';
import { NIL } from 'uuid';
import {
	doProcessArmor,
	preProcessArmor,
} from '@dlb/services/armor-processing';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	DefaultArmorStatMapping,
	getArmorStatMappingFromMods,
	getArmorStatMappingFromFragments,
} from '@dlb/types/ArmorStat';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import {
	ArmorSlotIdToArmorSlotModIdListMapping,
	ArmorSlotIdToModIdListMapping,
	CombatStyleModIdList,
	getValidCombatStyleModArmorSlotPlacements,
	hasValidCombatStyleModPermutation,
} from '@dlb/types/Mod';
import { EModId } from '@dlb/generated/mod/EModId';
import { getArmorSlotModViolations } from '@dlb/types/ModViolation';
import { DestinyClassHashToDestinyClass } from '@dlb/types/External';

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
			selectedFragments: selectedFragmentsReducer,
			selectedAspects: selectedAspectsReducer,
			selectedMasterworkAssumption: selectedMasterworkAssumptionReducer,
			selectedCombatStyleMods: selectedCombatStyleModsReducer,
			selectedMelee: selectedMeleeReducer,
			selectedGrenade: selectedGrenadeReducer,
			selectedClassAbility: selectedClassAbilityReducer,
			selectedDestinySubclass: selectedDestinySubclassReducer,
			selectedSuperAbility: selectedSuperAbilityReducer,
			selectedJump: selectedJumpReducer,
			selectedArmorSlotMods: selectedArmorSlotModsReducer,
			maxPossibleStats: maxPossibleStatsReducer,
			disabledCombatStyleMods: disabledCombatStyleModsReducer,
			disabledArmorSlotMods: disabledArmorSlotModsReducer,
			armorSlotModViolations: armorSlotModViolationsReducer,
			dimLoadouts: dimLoadoutsReducer,
			dimLoadoutsFilter: dimLoadoutsFilterReducer,
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
let selectedArmorSlotModsUuid = NIL;
let dimLoadoutsUuid = NIL;
let dimLoadoutsFilterUuid = NIL;
function handleChange() {
	const {
		allDataLoaded: { value: hasAllDataLoaded },
		desiredArmorStats: { uuid: nextDesiredArmorStatsUuid },
		selectedDestinyClass: { uuid: nextSelectedDestinyClassUuid },
		selectedExoticArmor: { uuid: nextSelectedExoticArmorUuid },
		selectedDestinySubclass: { uuid: nextSelectedDestinySubclassUuid },
		selectedFragments: { uuid: nextSelectedFragmentsUuid },
		selectedCombatStyleMods: { uuid: nextSelectedCombatStyleModsUuid },
		selectedArmorSlotMods: { uuid: nextSelectedArmorSlotModsUuid },
		selectedMasterworkAssumption: {
			uuid: nextSelectedMasterworkAssumptionUuid,
		},
		dimLoadouts: { uuid: nextDimLoadoutsUuid },
		dimLoadoutsFilter: { uuid: nextDimLoadoutsFilterUuid },
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
		selectedCombatStyleModsUuid !== nextSelectedCombatStyleModsUuid ||
		selectedArmorSlotModsUuid !== nextSelectedArmorSlotModsUuid ||
		dimLoadoutsUuid !== nextDimLoadoutsUuid ||
		dimLoadoutsFilterUuid !== nextDimLoadoutsFilterUuid;
	const hasNonDefaultUuids =
		nextDesiredArmorStatsUuid !== NIL &&
		nextSelectedDestinyClassUuid !== NIL &&
		nextSelectedExoticArmorUuid !== NIL &&
		nextSelectedDestinySubclassUuid !== NIL &&
		nextSelectedMasterworkAssumptionUuid !== NIL &&
		nextSelectedCombatStyleModsUuid !== NIL &&
		nextSelectedFragmentsUuid !== NIL &&
		nextSelectedArmorSlotModsUuid !== NIL &&
		nextDimLoadoutsUuid !== NIL &&
		nextDimLoadoutsFilterUuid !== NIL;

	if (hasAllDataLoaded && hasMismatchedUuids && hasNonDefaultUuids) {
		console.log('>>>>>>>>>>> store is dirty <<<<<<<<<<<');
		desiredArmorStatsUuid = nextDesiredArmorStatsUuid;
		selectedDestinyClassUuid = nextSelectedDestinyClassUuid;
		selectedExoticArmorUuid = nextSelectedExoticArmorUuid;
		selectedDestinySubclassUuid = nextSelectedDestinySubclassUuid;
		selectedMasterworkAssumptionUuid = nextSelectedMasterworkAssumptionUuid;
		selectedFragmentsUuid = nextSelectedFragmentsUuid;
		selectedCombatStyleModsUuid = nextSelectedCombatStyleModsUuid;
		selectedArmorSlotModsUuid = nextSelectedArmorSlotModsUuid;
		dimLoadoutsUuid = nextDimLoadoutsUuid;
		dimLoadoutsFilterUuid = nextDimLoadoutsFilterUuid;

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
			selectedArmorSlotMods: { value: selectedArmorSlotMods },
			dimLoadouts: { value: dimLoadouts },
			dimLoadoutsFilter: { value: dimLoadoutsFilter },
		} = store.getState();

		const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
		const { elementId } = getDestinySubclass(destinySubclassId);
		const fragmentArmorStatMapping = getArmorStatMappingFromFragments(
			selectedFragments[elementId],
			selectedDestinyClass
		);
		let mods = [...selectedCombatStyleMods];
		ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
			mods = [...mods, ...selectedArmorSlotMods[armorSlotId]];
		});
		const modsArmorStatMapping = getArmorStatMappingFromMods(
			mods,
			selectedDestinyClass
		);

		const validCombatStyleModArmorSlotPlacements =
			getValidCombatStyleModArmorSlotPlacements(
				selectedArmorSlotMods,
				selectedCombatStyleMods
			);
		console.log(
			'>>>>>>+ validCombatStyleModArmorSlotPlacements',
			validCombatStyleModArmorSlotPlacements
		);

		hasValidCombatStyleModPermutation(
			selectedArmorSlotMods,
			selectedCombatStyleMods
		);
		const disabledArmorSlotMods = getDisabledArmorSlotMods(
			selectedArmorSlotMods,
			selectedCombatStyleMods
		);
		console.log('>>>>>+ disabledArmorSlotMods', disabledArmorSlotMods);
		store.dispatch(setDisabledArmorSlotMods(disabledArmorSlotMods));

		const disabledCombatStyleMods = getDisabledCombatStyleMods(
			selectedArmorSlotMods,
			selectedCombatStyleMods
		);
		console.log('>>>>>+ disabledCombatStyleMods', disabledCombatStyleMods);
		store.dispatch(setDisabledCombatStyleMods(disabledCombatStyleMods));

		const armorSlotModViolations = getArmorSlotModViolations(
			selectedArmorSlotMods
		);
		store.dispatch(setArmorSlotModViolations(armorSlotModViolations));

		// TODO: no need to preProcessArmor when only the stat slider has changed.
		// Maybe we don't need to trigger that fake initial dispatch in
		// the slider component if we fix this?
		const preProcessedArmor = preProcessArmor(
			armor[selectedDestinyClass],
			selectedExoticArmor[selectedDestinyClass],
			dimLoadouts.filter(
				(x) =>
					DestinyClassHashToDestinyClass[x.classType] === selectedDestinyClass
			),
			dimLoadoutsFilter
		);
		console.log('>>>>>>>>>>> preProcessedArmor <<<<<<<<<<<', preProcessedArmor);
		const results = doProcessArmor({
			masterworkAssumption,
			desiredArmorStats,
			armorItems: preProcessedArmor,
			fragmentArmorStatMapping,
			modArmorStatMapping: modsArmorStatMapping,
			validCombatStyleModArmorSlotPlacements,
			armorSlotMods: selectedArmorSlotMods,
			destinyClassId: selectedDestinyClass,
		});
		console.log('>>>>>>>>>>> results <<<<<<<<<<<', results);
		const maxPossibleStats: ArmorStatMapping = { ...DefaultArmorStatMapping };
		results.forEach((result) => {
			const availableMods = 5 - result.armorStatModIdList.length;
			ArmorStatIdList.forEach((armorStatId) => {
				const possibleStat =
					result.metadata.totalArmorStatMapping[armorStatId] +
					10 * availableMods;
				if (possibleStat > maxPossibleStats[armorStatId]) {
					maxPossibleStats[armorStatId] = possibleStat;
				}
			});
		});
		// TODO: We can probably calculate max possible stats while doing armor processing without
		// the need to loop over the processed armor again here.
		console.log('>>>>>>>>>>> maxPossibleStats <<<<<<<<<<<', maxPossibleStats);
		store.dispatch(setMaxPossibleStats(maxPossibleStats));
		store.dispatch(setProcessedArmor(results));
	}
}

const unsubscribe = store.subscribe(handleChange);
// unsubscribe();

// TODO: Move this helper function out of the store
// This is not vey efficient. It will do a bunch of duplicate checks
// and doesn't do the very cheap sanity checks of just looking at elements
// and cost. Those could be big optimizations if this ends up being very slow.
const getDisabledArmorSlotMods = (
	selectedArmorSlotMods: ArmorSlotIdToModIdListMapping,
	selectedCombatStyleMods: EModId[]
): Partial<Record<EModId, Record<number, boolean>>> => {
	const disabledMods: Partial<Record<EModId, Record<number, boolean>>> = {};
	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		selectedArmorSlotMods[armorSlotId].forEach((_, i) => {
			ArmorSlotIdToArmorSlotModIdListMapping[armorSlotId].forEach((modId) => {
				const potentialSelectedArmorSlotMods = { ...selectedArmorSlotMods };
				potentialSelectedArmorSlotMods[armorSlotId] = [
					...selectedArmorSlotMods[armorSlotId],
				];
				potentialSelectedArmorSlotMods[armorSlotId][i] = modId;
				const isValid = hasValidCombatStyleModPermutation(
					potentialSelectedArmorSlotMods,
					selectedCombatStyleMods
				);
				if (!isValid) {
					console.log('>>>>>>+ !isValid armorSlot', armorSlotId, modId, i);

					if (!disabledMods[modId]) {
						disabledMods[modId] = {};
					}
					disabledMods[modId][i] = true;
				}
			});
		});
	});
	return disabledMods;
};

const getDisabledCombatStyleMods = (
	selectedArmorSlotMods: ArmorSlotIdToModIdListMapping,
	selectedCombatStyleMods: EModId[]
): Partial<Record<EModId, boolean>> => {
	const disabledMods: Partial<Record<EModId, boolean>> = {};
	selectedCombatStyleMods.forEach((_, i) => {
		CombatStyleModIdList.forEach((modId) => {
			const potentialSelectedCombatStyleMods = [...selectedCombatStyleMods];
			potentialSelectedCombatStyleMods[i] = modId;
			const isValid = hasValidCombatStyleModPermutation(
				selectedArmorSlotMods,
				potentialSelectedCombatStyleMods
			);
			if (!isValid) {
				console.log('>>>>>>+ !isValid combatStyle', modId);
				disabledMods[modId] = true;
			}
		});
	});
	return disabledMods;
};

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action<string>
>;

export default store;
