import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';

import allClassItemMetadataReducer from './features/allClassItemMetadata/allClassItemMetadataSlice';
import allDataLoadedReducer from './features/allDataLoaded/allDataLoadedSlice';
import armorReducer from './features/armor/armorSlice';
import availableExoticArmorReducer from './features/availableExoticArmor/availableExoticArmorSlice';
import charactersReducer from './features/characters/charactersSlice';
import counterReducer from './features/counter/counterSlice';
import desiredArmorStatsReducer, {
	setDesiredArmorStats,
} from './features/desiredArmorStats/desiredArmorStatsSlice';
import loadErrorReducer from './features/loadError/loadErrorSlice';
import maxPossibleReservedArmorSlotEnergyReducer, {
	setMaxPossibleReservedArmorSlotEnergy,
} from './features/maxPossibleReservedArmorSlotEnergy/maxPossibleReservedArmorSlotEnergySlice';
import maxPossibleStatsReducer, {
	setMaxPossibleStats,
} from './features/maxPossibleStats/maxPossibleStatsSlice';
import reservedArmorSlotEnergyReducer, {
	ArmorSlotEnergyMapping,
} from './features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import selectedArmorSlotModsReducer from './features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import selectedAspectsReducer from './features/selectedAspects/selectedAspectsSlice';
import selectedClassAbilityReducer from './features/selectedClassAbility/selectedClassAbilitySlice';
import selectedDestinyClassReducer from './features/selectedDestinyClass/selectedDestinyClassSlice';
import selectedDestinySubclassReducer from './features/selectedDestinySubclass/selectedDestinySubclassSlice';
import selectedExoticArmorReducer from './features/selectedExoticArmor/selectedExoticArmorSlice';
import selectedFragmentsReducer from './features/selectedFragments/selectedFragmentsSlice';
import selectedGrenadeReducer from './features/selectedGrenade/selectedGrenadeSlice';
import selectedJumpReducer from './features/selectedJump/selectedJumpSlice';
import selectedMasterworkAssumptionReducer from './features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import selectedMeleeReducer from './features/selectedMelee/selectedMeleeSlice';
import selectedRaidModsReducer from './features/selectedRaidMods/selectedRaidModsSlice';
import selectedSuperAbilityReducer from './features/selectedSuperAbility/selectedSuperAbilitySlice';
import sharedLoadoutConfigStatPriorityOrderReducer, {
	defaultOrder,
	setSharedLoadoutConfigStatPriorityOrder,
} from './features/sharedLoadoutConfigStatPriorityOrder/sharedLoadoutConfigStatPriorityOrderSlice';

import sharedLoadoutDesiredStatsReducer, {
	setSharedLoadoutDesiredStats,
} from './features/sharedLoadoutDesiredStats/sharedLoadoutDesiredStatsSlice';
import validDestinyClassIdsReducer from './features/validDestinyClassIds/validDestinyClassIdsSlice';

import armorMetadataReducer from './features/armorMetadata/armorMetadataSlice';
import resultsPaginationReducer, {
	setResultsPagination,
} from './features/resultsPagination/resultsPaginationSlice';

import { NIL } from 'uuid';
import armorSlotModViolationsReducer, {
	setArmorSlotModViolations,
} from './features/armorSlotModViolations/armorSlotModViolationsSlice';
import dimLoadoutsReducer from './features/dimLoadouts/dimLoadoutsSlice';
import dimLoadoutsFilterReducer from './features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import disabledArmorSlotModsReducer, {
	setDisabledArmorSlotMods,
} from './features/disabledArmorSlotMods/disabledArmorSlotModsSlice';
import disabledRaidModsReducer, {
	setDisabledRaidMods,
} from './features/disabledRaidMods/disabledRaidModsSlice';
import inGameLoadoutsReducer from './features/inGameLoadouts/inGameLoadoutsSlice';
import inGameLoadoutsFilterReducer from './features/inGameLoadoutsFilter/inGameLoadoutsFilterSlice';
import processedArmorReducer, {
	setProcessedArmor,
} from './features/processedArmor/processedArmorSlice';
import selectedMinimumGearTierReducer from './features/selectedMinimumGearTier/selectedMinimumGearTierSlice';
import useZeroWastedStatsReducer from './features/useZeroWastedStats/useZeroWastedStatsSlice';

import { EModId } from '@dlb/generated/mod/EModId';
import {
	DoProcessArmorOutput,
	doProcessArmor,
	preProcessArmor,
} from '@dlb/services/processArmor/index';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStat,
	getArmorStatMappingFromFragments,
	getArmorStatMappingFromMods,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { DestinyClassHashToDestinyClass } from '@dlb/types/External';
import { EElementId } from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToArmorSlotModIdListMapping,
	ArmorSlotIdToModIdListMapping,
	RaidModIdList,
	getValidRaidModArmorSlotPlacements,
	hasValidRaidModPermutation,
} from '@dlb/types/Mod';
import { getArmorSlotModViolations } from '@dlb/types/ModViolation';
import isEqual from 'lodash/isEqual';

function getChangedProperties(previousObj, currentObj, changes) {
	// Loop through the properties of the current object
	for (const prop in currentObj) {
		// If the property is an object, recursively check its properties
		if (
			previousObj &&
			previousObj[prop] &&
			typeof currentObj[prop] === 'object'
		) {
			getChangedProperties(previousObj[prop], currentObj[prop], changes);
		}
		// If the property has changed, add it to the changes array
		else if (
			previousObj &&
			previousObj[prop] &&
			!isEqual(previousObj[prop], currentObj[prop])
		) {
			changes.push(prop);
		}
	}

	return changes;
}

export function makeStore() {
	return configureStore({
		reducer: {
			allClassItemMetadata: allClassItemMetadataReducer,
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
			inGameLoadouts: inGameLoadoutsReducer,
			inGameLoadoutsFilter: inGameLoadoutsFilterReducer,
			loadError: loadErrorReducer,
			maxPossibleReservedArmorSlotEnergy:
				maxPossibleReservedArmorSlotEnergyReducer,
			maxPossibleStats: maxPossibleStatsReducer,
			processedArmor: processedArmorReducer,
			reservedArmorSlotEnergy: reservedArmorSlotEnergyReducer,
			resultsPagination: resultsPaginationReducer,
			selectedArmorSlotMods: selectedArmorSlotModsReducer,
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
			sharedLoadoutConfigStatPriorityOrder:
				sharedLoadoutConfigStatPriorityOrderReducer,
			sharedLoadoutDesiredStats: sharedLoadoutDesiredStatsReducer,
			useZeroWastedStats: useZeroWastedStatsReducer,
			validDestinyClassIds: validDestinyClassIdsReducer,
		},
	});
}

const store = makeStore();

/**** This is a janky way to check when a change that would trigger a re-process of armor is needed *****/
let allClassItemMetadataUuid = NIL;
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
let reservedArmorSlotEnergyUuid = NIL;
let sharedLoadoutDesiredStatsUuid = NIL;
let useZeroWastedStatsUuid = NIL;
let inGameLoadoutsUuid = NIL;
let inGameLoadoutsFilterUuid = NIL;
const debugStoreLoop = false;

let previousState: any = null;
if (debugStoreLoop) {
	previousState = store.getState();
}
function handleChange() {
	if (debugStoreLoop) {
		const currentState = store.getState();

		const changedProperties = getChangedProperties(
			previousState,
			currentState,
			[]
		);

		if (changedProperties.length > 0) {
			console.log('>>> Redux store changed:', changedProperties);
		}

		previousState = currentState;
	}
	const {
		allClassItemMetadata: { uuid: nextAllClassItemMetadataUuid },
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
		reservedArmorSlotEnergy: { uuid: nextReservedArmorSlotEnergyUuid },
		sharedLoadoutDesiredStats: { uuid: nextSharedLoadoutDesiredStatsUuid },
		useZeroWastedStats: { uuid: nextUseZeroWastedStatsUuid },
		inGameLoadoutsFilter: { uuid: nextInGameLoadoutsFilterUuid },
		inGameLoadouts: { uuid: nextInGameLoadoutsUuid },
	} = store.getState();

	const hasMismatchedUuids =
		allClassItemMetadataUuid !== nextAllClassItemMetadataUuid ||
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
		dimLoadoutsFilterUuid !== nextDimLoadoutsFilterUuid ||
		reservedArmorSlotEnergyUuid !== nextReservedArmorSlotEnergyUuid ||
		sharedLoadoutDesiredStatsUuid !== nextSharedLoadoutDesiredStatsUuid ||
		useZeroWastedStatsUuid !== nextUseZeroWastedStatsUuid ||
		inGameLoadoutsFilterUuid !== nextInGameLoadoutsFilterUuid ||
		inGameLoadoutsUuid !== nextInGameLoadoutsUuid;
	const hasNonDefaultUuids =
		nextAllClassItemMetadataUuid !== NIL &&
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
		nextDimLoadoutsFilterUuid !== NIL &&
		nextReservedArmorSlotEnergyUuid !== NIL &&
		nextSharedLoadoutDesiredStatsUuid !== NIL &&
		nextUseZeroWastedStatsUuid !== NIL &&
		nextInGameLoadoutsFilterUuid !== NIL &&
		nextInGameLoadoutsUuid !== NIL;

	if (!(hasAllDataLoaded && hasMismatchedUuids && hasNonDefaultUuids)) {
		return;
	}

	console.log('>>>>>>>>>>> [STORE] store is dirty <<<<<<<<<<<');
	allClassItemMetadataUuid = nextAllClassItemMetadataUuid;
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
	reservedArmorSlotEnergyUuid = nextReservedArmorSlotEnergyUuid;
	sharedLoadoutDesiredStatsUuid = nextSharedLoadoutDesiredStatsUuid;
	useZeroWastedStatsUuid = nextUseZeroWastedStatsUuid;
	inGameLoadoutsFilterUuid = nextInGameLoadoutsFilterUuid;
	inGameLoadoutsUuid = nextInGameLoadoutsUuid;

	// TODO: Move this out of the store file
	const {
		allClassItemMetadata: { value: allClassItemMetadata },
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
		reservedArmorSlotEnergy: { value: reservedArmorSlotEnergy },
		sharedLoadoutDesiredStats: { value: sharedLoadoutDesiredStats },
		sharedLoadoutConfigStatPriorityOrder: {
			value: sharedLoadoutConfigStatPriorityOrder,
		},
		selectedJump: { value: selectedJump },
		selectedMelee: { value: selectedMelee },
		selectedClassAbility: { value: selectedClassAbility },
		selectedSuperAbility: { value: selectedSuperAbility },
		selectedGrenade: { value: selectedGrenade },
		selectedAspects: { value: selectedAspects },
		useZeroWastedStats: { value: useZeroWastedStats },
		inGameLoadoutsFilter: { value: inGameLoadoutsFilter },
		inGameLoadouts: { value: inGameLoadouts },
	} = store.getState();

	if (sharedLoadoutDesiredStats.processing) {
		return;
	}

	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];

	let elementId: EElementId = EElementId.Any;
	if (destinySubclassId) {
		elementId = getDestinySubclass(destinySubclassId).elementId;
	}

	const fragmentArmorStatMapping = destinySubclassId
		? getArmorStatMappingFromFragments(
				selectedFragments[elementId],
				selectedDestinyClass
		  )
		: getDefaultArmorStatMapping();
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
		reservedArmorSlotEnergy,
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
	const [preProcessedArmor, _allClassItemMetadata] = preProcessArmor(
		armor[selectedDestinyClass],
		selectedExoticArmor[selectedDestinyClass],
		dimLoadouts.filter(
			(x) =>
				DestinyClassHashToDestinyClass[x.classType] === selectedDestinyClass
		),
		dimLoadoutsFilter,
		inGameLoadouts,
		inGameLoadoutsFilter,
		selectedMinimumGearTier,
		allClassItemMetadata[selectedDestinyClass]
	);
	console.log(
		'>>>>>>>>>>> [STORE] preProcessedArmor <<<<<<<<<<<',
		preProcessedArmor
	);

	const doProcessArmorParams = {
		masterworkAssumption,
		desiredArmorStats,
		armorItems: preProcessedArmor,
		fragmentArmorStatMapping,
		modArmorStatMapping: modsArmorStatMapping,
		potentialRaidModArmorSlotPlacements: validRaidModArmorSlotPlacements,
		armorSlotMods: selectedArmorSlotMods,
		raidMods: selectedRaidMods.filter((x) => x !== null),
		destinyClassId: selectedDestinyClass,
		armorMetadataItem: armorMetadata[selectedDestinyClass],
		selectedExotic: selectedExoticArmor[selectedDestinyClass],
		reservedArmorSlotEnergy,
		useZeroWastedStats,
		allClassItemMetadata: _allClassItemMetadata,
	};

	if (!sharedLoadoutDesiredStats.needed || sharedLoadoutDesiredStats.complete) {
		const results = doProcessArmor(doProcessArmorParams);
		console.log('>>>>>>>>>>> [STORE] results <<<<<<<<<<<', results);
		store.dispatch(setMaxPossibleStats(results.maxPossibleDesiredStatTiers));
		store.dispatch(
			setMaxPossibleReservedArmorSlotEnergy(
				results.maxPossibleReservedArmorSlotEnergy
			)
		);
		store.dispatch(
			setProcessedArmor({
				items: results.items,
				totalItemCount: results.totalItemCount,
			})
		);
	}

	if (sharedLoadoutDesiredStats.needed && !sharedLoadoutDesiredStats.complete) {
		store.dispatch(
			setSharedLoadoutDesiredStats({
				...sharedLoadoutDesiredStats,
				processing: true,
			})
		);

		console.log(
			'>>>>>>>>>>> [STORE] Checking loadout shared desired stat tiers <<<<<<<<<<<'
		);
		// Try to hit exactly the stats that the creator of the shared link wanted
		const sharedLoadoutDesiredStatsResults = doProcessArmor({
			...doProcessArmorParams,
			desiredArmorStats: sharedLoadoutDesiredStats.desiredArmorStats,
		});

		if (sharedLoadoutDesiredStatsResults.items.length > 0) {
			console.log(
				'>>>>>>>>>>> [STORE] Found exact match for loadout shared desired stat tiers <<<<<<<<<<<'
			);
			store.dispatch(
				setMaxPossibleStats(
					sharedLoadoutDesiredStatsResults.maxPossibleDesiredStatTiers
				)
			);
			store.dispatch(
				setMaxPossibleReservedArmorSlotEnergy(
					sharedLoadoutDesiredStatsResults.maxPossibleReservedArmorSlotEnergy
				)
			);
			store.dispatch(
				setDesiredArmorStats(sharedLoadoutDesiredStats.desiredArmorStats)
			);
			store.dispatch(
				setProcessedArmor({
					items: sharedLoadoutDesiredStatsResults.items,
					totalItemCount: sharedLoadoutDesiredStatsResults.totalItemCount,
				})
			);
			store.dispatch(
				setSharedLoadoutDesiredStats({
					...sharedLoadoutDesiredStats,
					processing: false,
					complete: true,
				})
			);
			return;
		}
		console.log(
			'>>>>>>>>>>> [STORE] Could exact match the loadout shared desired stat tiers. Calculating bestFitResults... <<<<<<<<<<<'
		);
		// If we can't get exactly the stats that the creator of the share link wanted then then
		// find the closest stats to what they wanted
		// TODO: Allow the creator of the shared link to prioritize the stat order
		const bestFitDesiredArmorStats: ArmorStatMapping =
			getDefaultArmorStatMapping();
		let bestFitResults: DoProcessArmorOutput = null;
		[...ArmorStatIdList]
			.sort((a, b) => {
				const aIndex = getArmorStat(a).index;
				const bIndex = getArmorStat(b).index;
				return (
					sharedLoadoutConfigStatPriorityOrder.indexOf(aIndex) -
					sharedLoadoutConfigStatPriorityOrder.indexOf(bIndex)
				);
			})
			.forEach((armorStatId) => {
				const desiredStatValue =
					sharedLoadoutDesiredStats.desiredArmorStats[armorStatId];
				for (let i = desiredStatValue; i > 0; i -= 10) {
					bestFitDesiredArmorStats[armorStatId] = i;
					bestFitResults = doProcessArmor({
						...doProcessArmorParams,
						desiredArmorStats: bestFitDesiredArmorStats,
					});
					if (bestFitResults?.items.length > 0) {
						break;
					}
				}
			});
		if (bestFitResults?.items.length > 0) {
			store.dispatch(
				setMaxPossibleStats(bestFitResults.maxPossibleDesiredStatTiers)
			);
			store.dispatch(
				setMaxPossibleReservedArmorSlotEnergy(
					bestFitResults.maxPossibleReservedArmorSlotEnergy
				)
			);
			store.dispatch(setDesiredArmorStats(bestFitDesiredArmorStats));
			store.dispatch(
				setProcessedArmor({
					items: bestFitResults.items,
					totalItemCount: bestFitResults.totalItemCount,
				})
			);
			store.dispatch(
				setSharedLoadoutDesiredStats({
					...sharedLoadoutDesiredStats,
					processing: false,
					complete: true,
				})
			);
			// Reset the share order to the default
			store.dispatch(setSharedLoadoutConfigStatPriorityOrder(defaultOrder));
		}
	}
	// const localLoadout: DlbLoadoutConfiguration = getDlbLoadoutConfiguration({
	// 	desiredArmorStats,
	// 	selectedDestinyClass,
	// 	selectedFragments,
	// 	selectedDestinySubclass,
	// 	selectedArmorSlotMods,
	// 	selectedRaidMods,
	// 	selectedExoticArmor,
	// 	selectedJump,
	// 	selectedMelee,
	// 	selectedGrenade,
	// 	selectedClassAbility,
	// 	selectedSuperAbility,
	// 	selectedAspects,
	// });
	// console.log('>>>>>>>>>>localLoadout', localLoadout);
}

store.subscribe(handleChange);
// const unsubscribe = store.subscribe(handleChange);
// unsubscribe();

// TODO: Move this helper function out of the store
// This is not vey efficient. It will do a bunch of duplicate checks
// and doesn't do the very cheap sanity checks of just looking at elements
// and cost. Those could be big optimizations if this ends up being very slow.
// TODO: Rewrite this to properly respect the reservedArmorSlotEnergy
const getDisabledArmorSlotMods = (
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping,
	selectedArmorSlotMods: ArmorSlotIdToModIdListMapping,
	selectedRaidMods: EModId[]
): Partial<Record<EModId, Record<number, boolean>>> => {
	return {};
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
