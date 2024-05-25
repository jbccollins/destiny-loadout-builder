import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import allClassItemMetadataReducer from './features/allClassItemMetadata/allClassItemMetadataSlice';
import allDataLoadedReducer from './features/allDataLoaded/allDataLoadedSlice';
import analyzableLoadoutsReducer from './features/analyzableLoadouts/analyzableLoadoutsSlice';
import analyzerSearchReducer from './features/analyzerSearch/analyzerSearchSlice';
import analyzerTabIndexReducer from './features/analyzerTabIndex/analyzerTabIndexSlice';
import armorReducer from './features/armor/armorSlice';
import availableExoticArmorReducer from './features/availableExoticArmor/availableExoticArmorSlice';
import charactersReducer from './features/characters/charactersSlice';
import counterReducer from './features/counter/counterSlice';
import desiredArmorStatsReducer, {
	setDesiredArmorStats,
} from './features/desiredArmorStats/desiredArmorStatsSlice';
import hasValidLoadoutQueryParams from './features/hasValidLoadoutQueryParams/hasValidLoadoutQueryParamsSlice';
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
import selectedAssumedStatValuesReducer from './features/selectedAssumedStatValues/selectedAssumedStatValuesSlice';
import selectedClassAbilityReducer from './features/selectedClassAbility/selectedClassAbilitySlice';
import selectedDestinyClassReducer from './features/selectedDestinyClass/selectedDestinyClassSlice';
import selectedDestinySubclassReducer from './features/selectedDestinySubclass/selectedDestinySubclassSlice';
import selectedExoticArmorReducer from './features/selectedExoticArmor/selectedExoticArmorSlice';
import selectedExoticArtificeAssumptionReducer from './features/selectedExoticArtificeAssumption/selectedExoticArtificeAssumptionSlice';
import selectedFragmentsReducer from './features/selectedFragments/selectedFragmentsSlice';
import selectedGrenadeReducer from './features/selectedGrenade/selectedGrenadeSlice';
import selectedIntrinsicArmorPerkOrAttributeIdsSlice from './features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import selectedJumpReducer from './features/selectedJump/selectedJumpSlice';
import selectedMasterworkAssumptionReducer from './features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import selectedMeleeReducer from './features/selectedMelee/selectedMeleeSlice';
import selectedRaidModsReducer from './features/selectedRaidMods/selectedRaidModsSlice';
import selectedSuperAbilityReducer from './features/selectedSuperAbility/selectedSuperAbilitySlice';
import tabIndexReducer from './features/tabIndex/tabIndexSlice';

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

import { EModId } from '@dlb/generated/mod/EModId';
import {
	DoProcessArmorOutput,
	DoProcessArmorParams,
	preProcessArmor,
	truncatedDoProcessArmor,
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
import { DestinyClassHashToDestinyClass } from '@dlb/types/External';
import { EIntrinsicArmorPerkOrAttributeId } from '@dlb/types/IdEnums';
import {
	getLocalStorageRecall,
	setLocalStorageRecallAsync,
} from '@dlb/types/LocalStorageRecall';
import {
	ArmorSlotIdToArmorSlotModIdListMapping,
	ArmorSlotIdToModIdListMapping,
	getValidRaidModArmorSlotPlacements,
	hasValidRaidModPermutation,
	RaidModIdList,
} from '@dlb/types/Mod';
import { getArmorSlotModViolations } from '@dlb/types/ModViolation';
import isEqual from 'lodash/isEqual';
import { NIL } from 'uuid';
import alwaysConsiderCollectionsRollsReducer from './features/alwaysConsiderCollectionsRolls/alwaysConsiderCollectionsRollsSlice';
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
import excludeLockedItemsReducer from './features/excludeLockedItems/excludeLockedItemsSlice';
import ignoredLoadoutOptimizationTypesReducer from './features/ignoredLoadoutOptimizationTypes/ignoredLoadoutOptimizationTypesSlice';
import inGameLoadoutsReducer from './features/inGameLoadouts/inGameLoadoutsSlice';
import inGameLoadoutsFilterReducer from './features/inGameLoadoutsFilter/inGameLoadoutsFilterSlice';
import inGameLoadoutsFlatItemIdListReducer from './features/inGameLoadoutsFlatItemIdList/inGameLoadoutsFlatItemIdListSlice';
import loadoutTypeFilterReducer from './features/loadoutTypeFilter/loadoutTypeFilterSlice';
import optimizationTypeFilterReducer from './features/optimizationTypeFilter/optimizationTypeFilterSlice';
import performingBatchUpdateReducer from './features/performingBatchUpdate/performingBatchUpdateSlice';
import processedArmorReducer, {
	setProcessedArmor,
} from './features/processedArmor/processedArmorSlice';
import selectedMinimumGearTierReducer from './features/selectedMinimumGearTier/selectedMinimumGearTierSlice';
import useBetaDimLinksReducer from './features/useBetaDimLinks/useBetaDimLinksSlice';
import useBonusResilienceReducer from './features/useBonusResilience/useBonusResilienceSlice';
import useOnlyMasterworkedArmorReducer from './features/useOnlyMasterworkedArmor/useOnlyMasterworkedArmorSlice';
import useZeroWastedStatsReducer from './features/useZeroWastedStats/useZeroWastedStatsSlice';

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
			alwaysConsiderCollectionsRolls: alwaysConsiderCollectionsRollsReducer,
			analyzableLoadouts: analyzableLoadoutsReducer,
			analyzerSearch: analyzerSearchReducer,
			analyzerTabIndex: analyzerTabIndexReducer,
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
			excludeLockedItems: excludeLockedItemsReducer,
			hasValidLoadoutQueryParams: hasValidLoadoutQueryParams,
			ignoredLoadoutOptimizationTypes: ignoredLoadoutOptimizationTypesReducer,
			inGameLoadouts: inGameLoadoutsReducer,
			inGameLoadoutsFlatItemIdList: inGameLoadoutsFlatItemIdListReducer,
			inGameLoadoutsFilter: inGameLoadoutsFilterReducer,
			loadError: loadErrorReducer,
			loadoutTypeFilter: loadoutTypeFilterReducer,
			maxPossibleReservedArmorSlotEnergy:
				maxPossibleReservedArmorSlotEnergyReducer,
			maxPossibleStats: maxPossibleStatsReducer,
			optimizationTypeFilter: optimizationTypeFilterReducer,
			performingBatchUpdate: performingBatchUpdateReducer,
			processedArmor: processedArmorReducer,
			reservedArmorSlotEnergy: reservedArmorSlotEnergyReducer,
			resultsPagination: resultsPaginationReducer,
			selectedArmorSlotMods: selectedArmorSlotModsReducer,
			selectedAspects: selectedAspectsReducer,
			selectedAssumedStatValues: selectedAssumedStatValuesReducer,
			selectedClassAbility: selectedClassAbilityReducer,
			selectedDestinyClass: selectedDestinyClassReducer,
			selectedDestinySubclass: selectedDestinySubclassReducer,
			selectedExoticArmor: selectedExoticArmorReducer,
			selectedFragments: selectedFragmentsReducer,
			selectedGrenade: selectedGrenadeReducer,
			selectedIntrinsicArmorPerkOrAttributeIds:
				selectedIntrinsicArmorPerkOrAttributeIdsSlice,
			selectedJump: selectedJumpReducer,
			selectedExoticArtificeAssumption: selectedExoticArtificeAssumptionReducer,
			selectedMasterworkAssumption: selectedMasterworkAssumptionReducer,
			selectedMelee: selectedMeleeReducer,
			selectedMinimumGearTier: selectedMinimumGearTierReducer,
			selectedRaidMods: selectedRaidModsReducer,
			selectedSuperAbility: selectedSuperAbilityReducer,
			sharedLoadoutConfigStatPriorityOrder:
				sharedLoadoutConfigStatPriorityOrderReducer,
			sharedLoadoutDesiredStats: sharedLoadoutDesiredStatsReducer,
			tabIndex: tabIndexReducer,
			useBetaDimLinks: useBetaDimLinksReducer,
			useBonusResilience: useBonusResilienceReducer,
			useOnlyMasterworkedArmor: useOnlyMasterworkedArmorReducer,
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
let selectedExoticArtificeAssumptionUuid = NIL;
let selectedRaidModsUuid = NIL;
let selectedArmorSlotModsUuid = NIL;
let selectedMinimumGearTierUuid = NIL;
let dimLoadoutsUuid = NIL;
let dimLoadoutsFilterUuid = NIL;
let reservedArmorSlotEnergyUuid = NIL;
let sharedLoadoutDesiredStatsUuid = NIL;
let useBetaDimLinksUuid = NIL;
let useBonusResilienceUuid = NIL;
let useZeroWastedStatsUuid = NIL;
let excludeLockedItemsUuid = NIL;
let useOnlyMasterworkedArmorUuid = NIL;
let alwaysConsiderCollectionsRollsUuid = NIL;
let inGameLoadoutsFlatItemIdListUuid = NIL;
let inGameLoadoutsFilterUuid = NIL;
let selectedIntrinsicArmorPerkOrAttributeIdsUuid = NIL;
let selectedAspectsUuid = NIL;
let selectedFragmentsUuid = NIL;
let selectedGrenadeUuid = NIL;
let selectedJumpUuid = NIL;
let selectedMeleeUuid = NIL;
let selectedSuperAbilityUuid = NIL;
let selectedClassAbilityUuid = NIL;
let ignoredLoadoutOptimizationTypesUuid = NIL;
let selectedAssumedStatValuesUuid = NIL;
const debugStoreLoop = false;

let previousState: ReturnType<typeof store.getState> = null;
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
		selectedDestinyClass: {
			value: selectedDestinyClass,
			uuid: nextSelectedDestinyClassUuid,
		},
		selectedExoticArmor: {
			value: selectedExoticArmor,
			uuid: nextSelectedExoticArmorUuid,
		},
		selectedDestinySubclass: {
			value: selectedDestinySubclass,
			uuid: nextSelectedDestinySubclassUuid,
		},
		selectedRaidMods: {
			value: selectedRaidMods,
			uuid: nextSelectedRaidModsUuid,
		},
		selectedArmorSlotMods: {
			value: selectedArmorSlotMods,
			uuid: nextSelectedArmorSlotModsUuid,
		},
		selectedMasterworkAssumption: {
			value: masterworkAssumption,
			uuid: nextSelectedMasterworkAssumptionUuid,
		},
		selectedExoticArtificeAssumption: {
			value: exoticArtificeAssumption,
			uuid: nextSelectedExoticArtificeAssumptionUuid,
		},
		selectedMinimumGearTier: {
			value: selectedMinimumGearTier,
			uuid: nextSelectedMinimumGearTierUuid,
		},
		dimLoadouts: { uuid: nextDimLoadoutsUuid },
		dimLoadoutsFilter: {
			value: dimLoadoutsFilter,
			uuid: nextDimLoadoutsFilterUuid,
		},
		reservedArmorSlotEnergy: {
			value: reservedArmorSlotEnergy,
			uuid: nextReservedArmorSlotEnergyUuid,
		},
		sharedLoadoutDesiredStats: { uuid: nextSharedLoadoutDesiredStatsUuid },
		useBetaDimLinks: { value: useBetaDimLinks, uuid: nextUseBetaDimLinksUuid },
		useBonusResilience: {
			value: useBonusResilience,
			uuid: nextUseBonusResilienceUuid,
		},
		useOnlyMasterworkedArmor: {
			value: useOnlyMasterworkedArmor,
			uuid: nextUseOnlyMasterworkedArmorUuid,
		},
		useZeroWastedStats: {
			value: useZeroWastedStats,
			uuid: nextUseZeroWastedStatsUuid,
		},
		excludeLockedItems: {
			value: excludeLockedItems,
			uuid: nextExcludeLockedItemsUuid,
		},
		alwaysConsiderCollectionsRolls: {
			value: alwaysConsiderCollectionsRolls,
			uuid: nextAlwaysConsiderCollectionsRollsUuid,
		},
		inGameLoadoutsFilter: {
			value: inGameLoadoutsFilter,
			uuid: nextInGameLoadoutsFilterUuid,
		},
		inGameLoadoutsFlatItemIdList: {
			uuid: nextInGameLoadoutsFlatItemIdListUuid,
		},
		selectedIntrinsicArmorPerkOrAttributeIds: {
			value: selectedIntrinsicArmorPerkOrAttributeIds,
			uuid: nextSelectedIntrinsicArmorPerkOrAttributeIdsUuid,
		},
		selectedAspects: { value: selectedAspects, uuid: nextSelectedAspectsUuid },
		selectedFragments: {
			value: selectedFragments,
			uuid: nextSelectedFragmentsUuid,
		},
		selectedGrenade: { value: selectedGrenade, uuid: nextSelectedGrenadeUuid },
		selectedMelee: { value: selectedMelee, uuid: nextSelectedMeleeUuid },
		selectedJump: { value: selectedJump, uuid: nextSelectedJumpUuid },
		selectedSuperAbility: {
			value: selectedSuperAbility,
			uuid: nextSelectedSuperAbilityUuid,
		},
		selectedClassAbility: {
			value: selectedClassAbility,
			uuid: nextSelectedClassAbilityUuid,
		},
		ignoredLoadoutOptimizationTypes: {
			value: ignoredLoadoutOptimizationTypes,
			uuid: nextIgnoredLoadoutOptimizationTypesUuid,
		},
		selectedAssumedStatValues: {
			value: selectedAssumedStatValues,
			uuid: nextSelectedAssumedStatValuesUuid,
		},
		performingBatchUpdate: { value: performingBatchUpdate },
	} = store.getState();
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
	const selectedExoticArmorItem = selectedExoticArmor[selectedDestinyClass];

	const hasMismatchedLocalStorageRecallIds =
		selectedDestinyClassUuid !== nextSelectedDestinyClassUuid ||
		selectedDestinySubclassUuid !== nextSelectedDestinySubclassUuid ||
		selectedExoticArmorUuid !== nextSelectedExoticArmorUuid ||
		selectedAspectsUuid !== nextSelectedAspectsUuid ||
		selectedFragmentsUuid !== nextSelectedFragmentsUuid ||
		selectedJumpUuid !== nextSelectedJumpUuid ||
		selectedMeleeUuid !== nextSelectedMeleeUuid ||
		selectedGrenadeUuid !== nextSelectedGrenadeUuid ||
		selectedSuperAbilityUuid !== nextSelectedSuperAbilityUuid ||
		selectedClassAbilityUuid !== nextSelectedClassAbilityUuid ||
		ignoredLoadoutOptimizationTypesUuid !==
		nextIgnoredLoadoutOptimizationTypesUuid ||
		selectedRaidModsUuid !== nextSelectedRaidModsUuid ||
		selectedArmorSlotModsUuid !== nextSelectedArmorSlotModsUuid ||
		reservedArmorSlotEnergyUuid !== nextReservedArmorSlotEnergyUuid ||
		selectedIntrinsicArmorPerkOrAttributeIdsUuid !==
		nextSelectedIntrinsicArmorPerkOrAttributeIdsUuid ||
		selectedMasterworkAssumptionUuid !== nextSelectedMasterworkAssumptionUuid ||
		selectedExoticArtificeAssumptionUuid !==
		nextSelectedExoticArtificeAssumptionUuid ||
		selectedMinimumGearTierUuid !== nextSelectedMinimumGearTierUuid ||
		dimLoadoutsFilterUuid !== nextDimLoadoutsFilterUuid ||
		inGameLoadoutsFilterUuid !== nextInGameLoadoutsFilterUuid ||
		useBonusResilienceUuid !== nextUseBonusResilienceUuid ||
		useBetaDimLinksUuid !== nextUseBetaDimLinksUuid ||
		useOnlyMasterworkedArmorUuid !== nextUseOnlyMasterworkedArmorUuid ||
		useZeroWastedStatsUuid !== nextUseZeroWastedStatsUuid ||
		excludeLockedItemsUuid !== nextExcludeLockedItemsUuid ||
		alwaysConsiderCollectionsRollsUuid !==
		nextAlwaysConsiderCollectionsRollsUuid;

	if (
		hasMismatchedLocalStorageRecallIds &&
		hasAllDataLoaded &&
		!performingBatchUpdate
	) {
		console.log('>>>>>> [STORE] Mismatched localStorageRecallIds <<<<<<');
		selectedAspectsUuid = nextSelectedAspectsUuid;
		selectedJumpUuid = nextSelectedJumpUuid;
		selectedMeleeUuid = nextSelectedMeleeUuid;
		selectedGrenadeUuid = nextSelectedGrenadeUuid;
		selectedSuperAbilityUuid = nextSelectedSuperAbilityUuid;
		selectedClassAbilityUuid = nextSelectedClassAbilityUuid;
		useBetaDimLinksUuid = nextUseBetaDimLinksUuid;
		ignoredLoadoutOptimizationTypesUuid =
			nextIgnoredLoadoutOptimizationTypesUuid;

		const localStorageRecall = getLocalStorageRecall();
		localStorageRecall.settings.alwaysConsiderCollectionsRolls =
			alwaysConsiderCollectionsRolls;
		localStorageRecall.settings.useOnlyMasterworkedArmor =
			useOnlyMasterworkedArmor;
		localStorageRecall.settings.useZeroWastedStats = useZeroWastedStats;
		localStorageRecall.settings.excludeLockedItems = excludeLockedItems;
		localStorageRecall.settings.useBetaDimLinks = useBetaDimLinks;
		localStorageRecall.settings.useBonusResilience = useBonusResilience;
		localStorageRecall.settings.masterworkAssumption = masterworkAssumption;
		localStorageRecall.settings.exoticArtificeAssumption = exoticArtificeAssumption;
		localStorageRecall.settings.minimumGearTierId = selectedMinimumGearTier;
		localStorageRecall.settings.dimLoadoutsFilterId = dimLoadoutsFilter;
		localStorageRecall.settings.d2LoadoutsFilterId = inGameLoadoutsFilter;
		localStorageRecall.settings.ignoredLoadoutOptimizationTypes =
			ignoredLoadoutOptimizationTypes;
		// Exotic
		localStorageRecall.classSpecificConfig[selectedDestinyClass].exoticHash =
			selectedExoticArmorItem?.hash;
		// Shared
		localStorageRecall.sharedConfig.armorSlotMods = selectedArmorSlotMods;
		localStorageRecall.sharedConfig.raidModIdList = selectedRaidMods as [
			EModId,
			EModId,
			EModId,
			EModId
		];
		localStorageRecall.sharedConfig.intrinsicArmorPerkOrAttributeIdList =
			selectedIntrinsicArmorPerkOrAttributeIds as [
				EIntrinsicArmorPerkOrAttributeId,
				EIntrinsicArmorPerkOrAttributeId,
				EIntrinsicArmorPerkOrAttributeId,
				EIntrinsicArmorPerkOrAttributeId
			];
		localStorageRecall.sharedConfig.reservedArmorSlotEnergy =
			reservedArmorSlotEnergy;
		// Class and Subclass
		localStorageRecall.destinyClassId = selectedDestinyClass;
		if (destinySubclassId) {
			localStorageRecall.classSpecificConfig[
				selectedDestinyClass
			].destinySubclassId = destinySubclassId;
			localStorageRecall.classSpecificConfig[
				selectedDestinyClass
			].subclassConfig[destinySubclassId] = {
				aspectIdList: selectedAspects[destinySubclassId],
				fragmentIdList: selectedFragments[destinySubclassId],
				superAbilityId: selectedSuperAbility[destinySubclassId],
				grenadeId: selectedGrenade[destinySubclassId],
				meleeId: selectedMelee[destinySubclassId],
				jumpId: selectedJump[destinySubclassId],
				classAbilityId: selectedClassAbility[destinySubclassId],
			};
		}
		console.log(
			'>>>>>>>>>>> [STORE] saving localStorageRecall <<<<<<<<<<<',
			localStorageRecall
		);
		// TODO: Don't do this for each iteration of the analyzer processing
		setLocalStorageRecallAsync(localStorageRecall);
	}

	const hasMismatchedUuids =
		allClassItemMetadataUuid !== nextAllClassItemMetadataUuid ||
		desiredArmorStatsUuid !== nextDesiredArmorStatsUuid ||
		selectedDestinyClassUuid !== nextSelectedDestinyClassUuid ||
		selectedExoticArmorUuid !== nextSelectedExoticArmorUuid ||
		// TODO: We probably don't need to trigger a dirty if this changes to "All" but all
		// variants of the selected exotic armor piece are masterworked. If we ever process
		// armor without requiring an exotic then we would need to revisit that condition
		selectedMasterworkAssumptionUuid !== nextSelectedMasterworkAssumptionUuid ||
		selectedExoticArtificeAssumptionUuid !== nextSelectedExoticArtificeAssumptionUuid ||
		selectedFragmentsUuid !== nextSelectedFragmentsUuid ||
		selectedDestinySubclassUuid !== nextSelectedDestinySubclassUuid ||
		selectedRaidModsUuid !== nextSelectedRaidModsUuid ||
		selectedArmorSlotModsUuid !== nextSelectedArmorSlotModsUuid ||
		selectedMinimumGearTierUuid !== nextSelectedMinimumGearTierUuid ||
		dimLoadoutsUuid !== nextDimLoadoutsUuid ||
		dimLoadoutsFilterUuid !== nextDimLoadoutsFilterUuid ||
		reservedArmorSlotEnergyUuid !== nextReservedArmorSlotEnergyUuid ||
		sharedLoadoutDesiredStatsUuid !== nextSharedLoadoutDesiredStatsUuid ||
		useBonusResilienceUuid !== nextUseBonusResilienceUuid ||
		useOnlyMasterworkedArmorUuid !== nextUseOnlyMasterworkedArmorUuid ||
		useZeroWastedStatsUuid !== nextUseZeroWastedStatsUuid ||
		excludeLockedItemsUuid !== nextExcludeLockedItemsUuid ||
		alwaysConsiderCollectionsRollsUuid !==
		nextAlwaysConsiderCollectionsRollsUuid ||
		inGameLoadoutsFilterUuid !== nextInGameLoadoutsFilterUuid ||
		inGameLoadoutsFlatItemIdListUuid !== nextInGameLoadoutsFlatItemIdListUuid ||
		selectedIntrinsicArmorPerkOrAttributeIdsUuid !==
		nextSelectedIntrinsicArmorPerkOrAttributeIdsUuid ||
		selectedAssumedStatValuesUuid !== nextSelectedAssumedStatValuesUuid;
	const hasNonDefaultUuids =
		nextAllClassItemMetadataUuid !== NIL &&
		nextDesiredArmorStatsUuid !== NIL &&
		nextSelectedDestinyClassUuid !== NIL &&
		nextSelectedExoticArmorUuid !== NIL &&
		nextSelectedDestinySubclassUuid !== NIL &&
		nextSelectedMasterworkAssumptionUuid !== NIL &&
		nextSelectedExoticArtificeAssumptionUuid !== NIL &&
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
		nextInGameLoadoutsFlatItemIdListUuid !== NIL &&
		nextSelectedIntrinsicArmorPerkOrAttributeIdsUuid !== NIL &&
		nextSelectedAssumedStatValuesUuid !== NIL;

	// if (hasAllDataLoaded) {
	// 	// log any next uuids that are NIL
	// 	[
	// 		nextAllClassItemMetadataUuid,
	// 		nextDesiredArmorStatsUuid,
	// 		nextSelectedDestinyClassUuid,
	// 		nextSelectedExoticArmorUuid,
	// 		nextSelectedDestinySubclassUuid,
	// 		nextSelectedMasterworkAssumptionUuid,
	// 		nextSelectedFragmentsUuid,
	// 		nextSelectedRaidModsUuid,
	// 		nextSelectedArmorSlotModsUuid,
	// 		nextSelectedMinimumGearTierUuid,
	// 		nextDimLoadoutsUuid,
	// 		nextDimLoadoutsFilterUuid,
	// 		nextReservedArmorSlotEnergyUuid,
	// 		nextSharedLoadoutDesiredStatsUuid,
	// 		nextUseBonusResilienceUuid,
	// 		nextUseOnlyMasterworkedArmorUuid,
	// 		nextUseZeroWastedStatsUuid,
	// 		nextAlwaysConsiderCollectionsRollsUuid,
	// 		nextInGameLoadoutsFilterUuid,
	// 		nextInGameLoadoutsFlatItemIdListUuid,
	// 		nextSelectedIntrinsicArmorPerkOrAttributeIdsUuid,
	// 	].forEach((uuid, index) => {
	// 		if (uuid === NIL) {
	// 			console.log('>>>>> NIL uuid <<<<<', index);
	// 		}
	// 	});
	// }

	// console.log(
	// 	'>>>>> hasAllDataLoaded',
	// 	hasAllDataLoaded,
	// 	'hasMismatchedUuids',
	// 	hasMismatchedUuids,
	// 	'hasNonDefaultUuids',
	// 	hasNonDefaultUuids,
	// 	'performingBatchUpdate',
	// 	performingBatchUpdate,
	// 	'<<<<<<<<<'
	// );

	if (
		!(hasAllDataLoaded && hasMismatchedUuids && hasNonDefaultUuids) ||
		performingBatchUpdate
	) {
		return;
	}

	console.log('>>>>>>>>>>> [STORE] store is dirty <<<<<<<<<<<');
	allClassItemMetadataUuid = nextAllClassItemMetadataUuid;
	desiredArmorStatsUuid = nextDesiredArmorStatsUuid;
	selectedDestinyClassUuid = nextSelectedDestinyClassUuid;
	selectedExoticArmorUuid = nextSelectedExoticArmorUuid;
	selectedDestinySubclassUuid = nextSelectedDestinySubclassUuid;
	selectedMasterworkAssumptionUuid = nextSelectedMasterworkAssumptionUuid;
	selectedExoticArtificeAssumptionUuid = nextSelectedExoticArtificeAssumptionUuid;
	selectedFragmentsUuid = nextSelectedFragmentsUuid;
	selectedRaidModsUuid = nextSelectedRaidModsUuid;
	selectedArmorSlotModsUuid = nextSelectedArmorSlotModsUuid;
	selectedMinimumGearTierUuid = nextSelectedMinimumGearTierUuid;
	dimLoadoutsUuid = nextDimLoadoutsUuid;
	dimLoadoutsFilterUuid = nextDimLoadoutsFilterUuid;
	reservedArmorSlotEnergyUuid = nextReservedArmorSlotEnergyUuid;
	sharedLoadoutDesiredStatsUuid = nextSharedLoadoutDesiredStatsUuid;
	useBonusResilienceUuid = nextUseBonusResilienceUuid;
	useOnlyMasterworkedArmorUuid = nextUseOnlyMasterworkedArmorUuid;
	useZeroWastedStatsUuid = nextUseZeroWastedStatsUuid;
	excludeLockedItemsUuid = nextExcludeLockedItemsUuid;
	alwaysConsiderCollectionsRollsUuid = nextAlwaysConsiderCollectionsRollsUuid;
	inGameLoadoutsFilterUuid = nextInGameLoadoutsFilterUuid;
	inGameLoadoutsFlatItemIdListUuid = nextInGameLoadoutsFlatItemIdListUuid;
	selectedIntrinsicArmorPerkOrAttributeIdsUuid =
		nextSelectedIntrinsicArmorPerkOrAttributeIdsUuid;
	selectedAssumedStatValuesUuid = nextSelectedAssumedStatValuesUuid;

	// TODO: Move this out of the store file
	const {
		allClassItemMetadata: { value: allClassItemMetadata },
		armor: { value: armor },
		desiredArmorStats: { value: desiredArmorStats },
		dimLoadouts: { value: dimLoadouts },
		sharedLoadoutDesiredStats: { value: sharedLoadoutDesiredStats },
		sharedLoadoutConfigStatPriorityOrder: {
			value: sharedLoadoutConfigStatPriorityOrder,
		},
		inGameLoadoutsFlatItemIdList: { value: inGameLoadoutsFlatItemIdList },
	} = store.getState();

	if (sharedLoadoutDesiredStats.processing) {
		return;
	}

	const fragmentArmorStatMapping = destinySubclassId
		? getArmorStatMappingFromFragments(
			selectedFragments[destinySubclassId],
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
	const [preProcessedArmor, _allClassItemMetadata] = preProcessArmor({
		armorGroup: armor[selectedDestinyClass],
		selectedExoticArmor: selectedExoticArmorItem,
		dimLoadouts: dimLoadouts.filter(
			(x) =>
				DestinyClassHashToDestinyClass[x.classType] === selectedDestinyClass
		),
		dimLoadoutsFilterId: dimLoadoutsFilter,
		inGameLoadoutsFlatItemIdList,
		inGameLoadoutsFilterId: inGameLoadoutsFilter,
		minimumGearTier: selectedMinimumGearTier,
		allClassItemMetadata: allClassItemMetadata[selectedDestinyClass],
		alwaysConsiderCollectionsRolls,
		useOnlyMasterworkedArmor,
		excludeLockedItems,
		exoticArtificeAssumption
	});
	console.log(
		'>>>>>>>>>>> [STORE] preProcessedArmor <<<<<<<<<<<',
		preProcessedArmor
	);

	const doProcessArmorParams: DoProcessArmorParams = {
		masterworkAssumption,
		desiredArmorStats,
		armorItems: preProcessedArmor,
		fragmentArmorStatMapping,
		modArmorStatMapping: modsArmorStatMapping,
		potentialRaidModArmorSlotPlacements: validRaidModArmorSlotPlacements,
		armorSlotMods: selectedArmorSlotMods,
		raidMods: selectedRaidMods.filter((x) => x !== null),
		intrinsicArmorPerkOrAttributeIds:
			selectedIntrinsicArmorPerkOrAttributeIds.filter((x) => x !== null),
		destinyClassId: selectedDestinyClass,
		reservedArmorSlotEnergy,
		useZeroWastedStats,
		useBonusResilience,
		selectedExoticArmorItem,
		alwaysConsiderCollectionsRolls,
		allClassItemMetadata: _allClassItemMetadata,
		assumedStatValuesStatMapping: selectedAssumedStatValues,
	};

	if (!sharedLoadoutDesiredStats.needed || sharedLoadoutDesiredStats.complete) {
		const results = truncatedDoProcessArmor(doProcessArmorParams);
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
		const sharedLoadoutDesiredStatsResults = truncatedDoProcessArmor({
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
					bestFitResults = truncatedDoProcessArmor({
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
