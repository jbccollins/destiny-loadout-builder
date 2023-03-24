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
import selectedMeleeReducer from './features/selectedMelee/selectedMeleeSlice';
import selectedGrenadeReducer from './features/selectedGrenade/selectedGrenadeSlice';
import selectedClassAbilityReducer from './features/selectedClassAbility/selectedClassAbilitySlice';
import selectedSuperAbilityReducer from './features/selectedSuperAbility/selectedSuperAbilitySlice';
import selectedDestinySubclassReducer from './features/selectedDestinySubclass/selectedDestinySubclassSlice';
import selectedJumpReducer from './features/selectedJump/selectedJumpSlice';
import selectedArmorSlotModsReducer from './features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import selectedRaidModsReducer from './features/selectedRaidMods/selectedRaidModsSlice';
import loadErrorReducer from './features/loadError/loadErrorSlice';
import resultsPaginationReducer, {
	setResultsPagination,
} from './features/resultsPagination/resultsPaginationSlice';
import armorMetadataReducer from './features/armorMetadata/armorMetadataSlice';

import dimLoadoutsReducer from './features/dimLoadouts/dimLoadoutsSlice';
import dimLoadoutsFilterReducer from './features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import disabledRaidModsReducer, {
	setDisabledRaidMods,
} from './features/disabledRaidMods/disabledRaidModsSlice';
import disabledArmorSlotModsReducer, {
	setDisabledArmorSlotMods,
} from './features/disabledArmorSlotMods/disabledArmorSlotModsSlice';
import armorSlotModViolationsReducer, {
	setArmorSlotModViolations,
} from './features/armorSlotModViolations/armorSlotModViolationsSlice';
import selectedMinimumGearTierReducer from './features/selectedMinimumGearTier/selectedMinimumGearTierSlice';
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
	getValidRaidModArmorSlotPlacements,
	hasValidRaidModPermutation,
	RaidModIdList,
} from '@dlb/types/Mod';
import { EModId } from '@dlb/generated/mod/EModId';
import { getArmorSlotModViolations } from '@dlb/types/ModViolation';
import { DestinyClassHashToDestinyClass } from '@dlb/types/External';

export function makeStore() {
	return configureStore({
		reducer: {
			allDataLoaded: allDataLoadedReducer,
			armor: armorReducer,
			armorMetadata: armorMetadataReducer,
			armorSlotModViolations: armorSlotModViolationsReducer,
			availableExoticArmor: availableExoticArmorReducer,
			characters: charactersReducer,
			counter: counterReducer,
			desiredArmorStats: desiredArmorStatsReducer,
			dimLoadouts: dimLoadoutsReducer,
			dimLoadoutsFilter: dimLoadoutsFilterReducer,
			disabledArmorSlotMods: disabledArmorSlotModsReducer,
			disabledRaidMods: disabledRaidModsReducer,
			loadError: loadErrorReducer,
			maxPossibleStats: maxPossibleStatsReducer,
			processedArmor: processedArmorReducer,
			resultsPagination: resultsPaginationReducer,
			selectedArmorSlotMods: selectedArmorSlotModsReducer,
			selectedArmorSlotRestrictions: selectedArmorSlotRestrictionsReducer,
			selectedAspects: selectedAspectsReducer,
			selectedClassAbility: selectedClassAbilityReducer,
			selectedDestinyClass: selectedDestinyClassReducer,
			selectedDestinySubclass: selectedDestinySubclassReducer,
			selectedExoticArmor: selectedExoticArmorReducer,
			selectedFragments: selectedFragmentsReducer,
			selectedGrenade: selectedGrenadeReducer,
			selectedJump: selectedJumpReducer,
			selectedMasterworkAssumption: selectedMasterworkAssumptionReducer,
			selectedMelee: selectedMeleeReducer,
			selectedMinimumGearTier: selectedMinimumGearTierReducer,
			selectedRaidMods: selectedRaidModsReducer,
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
let selectedRaidModsUuid = NIL;
let selectedArmorSlotModsUuid = NIL;
let selectedMinimumGearTierUuid = NIL;
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
		selectedRaidMods: { uuid: nextSelectedRaidModsUuid },
		selectedArmorSlotMods: { uuid: nextSelectedArmorSlotModsUuid },
		selectedMasterworkAssumption: {
			uuid: nextSelectedMasterworkAssumptionUuid,
		},
		selectedMinimumGearTier: { uuid: nextSelectedMinimumGearTierUuid },
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
		selectedRaidModsUuid !== nextSelectedRaidModsUuid ||
		selectedArmorSlotModsUuid !== nextSelectedArmorSlotModsUuid ||
		selectedMinimumGearTierUuid !== nextSelectedMinimumGearTierUuid ||
		dimLoadoutsUuid !== nextDimLoadoutsUuid ||
		dimLoadoutsFilterUuid !== nextDimLoadoutsFilterUuid;
	const hasNonDefaultUuids =
		nextDesiredArmorStatsUuid !== NIL &&
		nextSelectedDestinyClassUuid !== NIL &&
		nextSelectedExoticArmorUuid !== NIL &&
		nextSelectedDestinySubclassUuid !== NIL &&
		nextSelectedMasterworkAssumptionUuid !== NIL &&
		nextSelectedFragmentsUuid !== NIL &&
		nextSelectedRaidModsUuid !== NIL &&
		nextSelectedArmorSlotModsUuid !== NIL &&
		nextSelectedMinimumGearTierUuid !== NIL &&
		nextDimLoadoutsUuid !== NIL &&
		nextDimLoadoutsFilterUuid !== NIL;

	if (hasAllDataLoaded && hasMismatchedUuids && hasNonDefaultUuids) {
		console.log('>>>>>>>>>>> [STORE] store is dirty <<<<<<<<<<<');
		desiredArmorStatsUuid = nextDesiredArmorStatsUuid;
		selectedDestinyClassUuid = nextSelectedDestinyClassUuid;
		selectedExoticArmorUuid = nextSelectedExoticArmorUuid;
		selectedDestinySubclassUuid = nextSelectedDestinySubclassUuid;
		selectedMasterworkAssumptionUuid = nextSelectedMasterworkAssumptionUuid;
		selectedFragmentsUuid = nextSelectedFragmentsUuid;
		selectedRaidModsUuid = nextSelectedRaidModsUuid;
		selectedArmorSlotModsUuid = nextSelectedArmorSlotModsUuid;
		selectedMinimumGearTierUuid = nextSelectedMinimumGearTierUuid;
		dimLoadoutsUuid = nextDimLoadoutsUuid;
		dimLoadoutsFilterUuid = nextDimLoadoutsFilterUuid;

		// TODO: Move this out of the store file
		const {
			armor: { value: armor },
			armorMetadata: { value: armorMetadata },
			selectedExoticArmor: { value: selectedExoticArmor },
			selectedDestinyClass: { value: selectedDestinyClass },
			desiredArmorStats: { value: desiredArmorStats },
			selectedMasterworkAssumption: { value: masterworkAssumption },
			selectedFragments: { value: selectedFragments },
			selectedDestinySubclass: { value: selectedDestinySubclass },
			selectedRaidMods: { value: selectedRaidMods },
			selectedArmorSlotMods: { value: selectedArmorSlotMods },
			selectedMinimumGearTier: { value: selectedMinimumGearTier },
			dimLoadouts: { value: dimLoadouts },
			dimLoadoutsFilter: { value: dimLoadoutsFilter },
		} = store.getState();

		const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
		const { elementId } = getDestinySubclass(destinySubclassId);
		const fragmentArmorStatMapping = getArmorStatMappingFromFragments(
			selectedFragments[elementId],
			selectedDestinyClass
		);
		let mods = [...selectedRaidMods];
		ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
			mods = [...mods, ...selectedArmorSlotMods[armorSlotId]];
		});
		const modsArmorStatMapping = getArmorStatMappingFromMods(
			mods,
			selectedDestinyClass
		);

		const validRaidModArmorSlotPlacements = getValidRaidModArmorSlotPlacements(
			selectedArmorSlotMods,
			selectedRaidMods
		);
		console.log(
			'>>>>>>>>>>> [STORE] validRaidModArmorSlotPlacements <<<<<<<<<<<',
			validRaidModArmorSlotPlacements
		);

		const disabledArmorSlotMods = getDisabledArmorSlotMods(
			selectedArmorSlotMods,
			selectedRaidMods
		);
		console.log(
			'>>>>>>>>>>> [STORE] disabledArmorSlotMods <<<<<<<<<<<',
			disabledArmorSlotMods
		);
		store.dispatch(setDisabledArmorSlotMods(disabledArmorSlotMods));

		const disabledRaidMods = getDisabledRaidMods(
			selectedArmorSlotMods,
			selectedRaidMods
		);
		console.log(
			'>>>>>>>>>>> [STORE] disabledRaidMods <<<<<<<<<<<',
			disabledRaidMods
		);
		store.dispatch(setDisabledRaidMods(disabledRaidMods));

		const armorSlotModViolations = getArmorSlotModViolations(
			selectedArmorSlotMods
		);
		store.dispatch(setArmorSlotModViolations(armorSlotModViolations));
		store.dispatch(setResultsPagination(0));
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
			dimLoadoutsFilter,
			selectedMinimumGearTier
		);
		console.log(
			'>>>>>>>>>>> [STORE] preProcessedArmor <<<<<<<<<<<',
			preProcessedArmor
		);
		const results = doProcessArmor({
			masterworkAssumption,
			desiredArmorStats,
			armorItems: preProcessedArmor,
			fragmentArmorStatMapping,
			modArmorStatMapping: modsArmorStatMapping,
			validRaidModArmorSlotPlacements: validRaidModArmorSlotPlacements,
			armorSlotMods: selectedArmorSlotMods,
			destinyClassId: selectedDestinyClass,
			armorMetadataItem: armorMetadata[selectedDestinyClass],
			selectedExotic: selectedExoticArmor[selectedDestinyClass],
		});
		console.log('>>>>>>>>>>> [STORE] results <<<<<<<<<<<', results);
		const maxPossibleStats: ArmorStatMapping = { ...DefaultArmorStatMapping };
		// TODO: This is probably just a bad assumption. I don't
		// think that the other stats will display as achievable since the loadout builder
		// won't attempt to get them that high. Meaning that if we just
		// iterate over results we are probably erroneously missing potential stats
		// that aren't in the results because they weren't asked for. This may be
		// exacerbated by artifice mods.
		results.forEach((result) => {
			const availableMods = 5 - result.armorStatModIdList.length;
			ArmorStatIdList.forEach((armorStatId) => {
				// TODO: this "* 10" is a bug that assumes you can always fit major mods.
				// This causes the desired armor stat tiers to show you can achieve stat
				// tiers that aren't actually possible.
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
		console.log(
			'>>>>>>>>>>> [STORE] maxPossibleStats <<<<<<<<<<<',
			maxPossibleStats
		);
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
	selectedRaidMods: EModId[]
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
				const isValid = hasValidRaidModPermutation(
					potentialSelectedArmorSlotMods,
					selectedRaidMods
				);
				if (!isValid) {
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

const getDisabledRaidMods = (
	selectedArmorSlotMods: ArmorSlotIdToModIdListMapping,
	selectedRaidMods: EModId[]
): Partial<Record<EModId, boolean>> => {
	const disabledMods: Partial<Record<EModId, boolean>> = {};
	selectedRaidMods.forEach((_, i) => {
		RaidModIdList.forEach((modId) => {
			const potentialSelectedRaidMods = [...selectedRaidMods];
			potentialSelectedRaidMods[i] = modId;
			const isValid = hasValidRaidModPermutation(
				selectedArmorSlotMods,
				potentialSelectedRaidMods
			);
			if (!isValid) {
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
