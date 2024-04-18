import {
	getCharacters,
	getDestinyAccountsForBungieAccount,
	getMembershipData,
} from '@dlb/dim/bungie-api/destiny2-api';
import { loadStoresData } from '@dlb/dim/inventory/d2-stores';
import { setAllDataLoaded } from '@dlb/redux/features/allDataLoaded/allDataLoadedSlice';
import { setArmor } from '@dlb/redux/features/armor/armorSlice';
import { setAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { setCharacters } from '@dlb/redux/features/characters/charactersSlice';
import { setSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import {
	setSelectedDestinySubclass,
	setSelectedDestinySubclassForDestinyClass,
} from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import {
	setSelectedExoticArmor,
	setSelectedExoticArmorForDestinyClass,
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';

import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	extractArmor,
	extractCharacters,
	getValidDestinyClassIds,
} from '@dlb/services/data';
import {
	AvailableExoticArmor,
	AvailableExoticArmorItem,
} from '@dlb/types/Armor';
import { ArmorSlotIdList } from '@dlb/types/ArmorSlot';
import { DestinyClassIdList, getDestinyClass } from '@dlb/types/DestinyClass';

// import { getDefinitions } from '@dlb/dim/destiny2/d2-definitions';
import { ProfileResponse } from '@destinyitemmanager/dim-api-types';
import { getDefinitions } from '@dlb/dim/destiny2/d2-definitions';
import { getDimApiProfile } from '@dlb/dim/dim-api/dim-api';
import { setAllClassItemMetadata } from '@dlb/redux/features/allClassItemMetadata/allClassItemMetadataSlice';
import {
	selectAlwaysConsiderCollectionsRolls,
	setAlwaysConsiderCollectionsRolls,
} from '@dlb/redux/features/alwaysConsiderCollectionsRolls/alwaysConsiderCollectionsRollsSlice';
import {
	setAnalyzableLoadoutsBreakdown,
	setBuggedAlternateSeasonModIdList,
	setHiddenLoadoutIdList,
	setLoadoutSpecificIgnoredOptimizationTypes,
} from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import { setArmorMetadata } from '@dlb/redux/features/armorMetadata/armorMetadataSlice';
import {
	selectDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import {
	DimLoadoutWithId,
	setDimLoadouts,
} from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import {
	selectDimLoadoutsFilter,
	setDimLoadoutsFilter,
} from '@dlb/redux/features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import { setExcludeLockedItems } from '@dlb/redux/features/excludeLockedItems/excludeLockedItemsSlice';
import { setHasValidLoadoutQueryParams } from '@dlb/redux/features/hasValidLoadoutQueryParams/hasValidLoadoutQueryParamsSlice';
import { setIgnoredLoadoutOptimizationTypes } from '@dlb/redux/features/ignoredLoadoutOptimizationTypes/ignoredLoadoutOptimizationTypesSlice';
import {
	InGameLoadoutsWithIdMapping,
	LoadoutWithId,
	setInGameLoadoutsDefinitions,
	setInGameLoadoutsLoadoutItems,
} from '@dlb/redux/features/inGameLoadouts/inGameLoadoutsSlice';
import {
	selectInGameLoadoutsFilter,
	setInGameLoadoutsFilter,
} from '@dlb/redux/features/inGameLoadoutsFilter/inGameLoadoutsFilterSlice';
import { setInGameLoadoutsFlatItemIdList } from '@dlb/redux/features/inGameLoadoutsFlatItemIdList/inGameLoadoutsFlatItemIdListSlice';
import {
	LoadLog,
	setLoadError,
} from '@dlb/redux/features/loadError/loadErrorSlice';
import {
	selectReservedArmorSlotEnergy,
	setReservedArmorSlotEnergy,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	selectSelectedArmorSlotMods,
	setSelectedArmorSlotMods,
} from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import {
	selectSelectedAspects,
	setSelectedAspects,
	setSelectedAspectsForDestinySubclass,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	selectSelectedAssumedStatValues,
	setSelectedAssumedStatValues,
} from '@dlb/redux/features/selectedAssumedStatValues/selectedAssumedStatValuesSlice';
import {
	selectSelectedClassAbility,
	setSelectedClassAbility,
	setSelectedClassAbilityForDestinySubclass,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import {
	selectSelectedFragments,
	setSelectedFragments,
	setSelectedFragmentsForDestinySubclass,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import {
	selectSelectedGrenade,
	setSelectedGreandeForDestinySubclass,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import {
	selectSelectedIntrinsicArmorPerkOrAttributeIds,
	setSelectedIntrinsicArmorPerkOrAttributeIds,
} from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import {
	selectSelectedJump,
	setSelectedJump,
	setSelectedJumpForDestinySubclass,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import {
	selectSelectedMasterworkAssumption,
	setSelectedMasterworkAssumption,
} from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import {
	selectSelectedMelee,
	setSelectedMelee,
	setSelectedMeleeForDestinySubclass,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import {
	selectSelectedMinimumGearTier,
	setSelectedMinimumGearTier,
} from '@dlb/redux/features/selectedMinimumGearTier/selectedMinimumGearTierSlice';
import {
	clearSelectedRaidMods,
	selectSelectedRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	selectSelectedSuperAbility,
	setSelectedSuperAbility,
	setSelectedSuperAbilityForDestinySubclass,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import {
	selectSharedLoadoutConfigStatPriorityOrder,
	setSharedLoadoutConfigStatPriorityOrder,
} from '@dlb/redux/features/sharedLoadoutConfigStatPriorityOrder/sharedLoadoutConfigStatPriorityOrderSlice';
import {
	selectSharedLoadoutDesiredStats,
	setSharedLoadoutDesiredStats,
} from '@dlb/redux/features/sharedLoadoutDesiredStats/sharedLoadoutDesiredStatsSlice';
import { setTabIndex } from '@dlb/redux/features/tabIndex/tabIndexSlice';
import { setUseBetaDimLinks } from '@dlb/redux/features/useBetaDimLinks/useBetaDimLinksSlice';
import {
	selectUseBonusResilience,
	setUseBonusResilience,
} from '@dlb/redux/features/useBonusResilience/useBonusResilienceSlice';
import {
	selectUseOnlyMasterworkedArmor,
	setUseOnlyMasterworkedArmor,
} from '@dlb/redux/features/useOnlyMasterworkedArmor/useOnlyMasterworkedArmorSlice';
import {
	selectUseZeroWastedStats,
	setUseZeroWastedStats,
} from '@dlb/redux/features/useZeroWastedStats/useZeroWastedStatsSlice';
import { setValidDestinyClassIds } from '@dlb/redux/features/validDestinyClassIds/validDestinyClassIdsSlice';
import { DlbLoadoutConfiguration } from '@dlb/services/links/generateDlbLoadoutLink';
import { buildAnalyzableLoadoutsBreakdown } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	EDestinyClassId,
	EDestinySubclassId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import {
	LocalStorageRecall,
	getLocalStorageRecall,
} from '@dlb/types/LocalStorageRecall';
import { TabTypeList } from '@dlb/types/Tab';
import { CheckCircleRounded } from '@mui/icons-material';
import { Box, Card, CircularProgress, styled } from '@mui/material';
import { cloneDeep } from 'lodash';
import { useRouter } from 'next/navigation';
import hash from 'object-hash';
import { useEffect, useState } from 'react';

const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3),
	position: 'fixed',
	left: '50%',
	top: '50%',
	transform: 'translate(-50%, -50%)',
	minWidth: '270px',
}));

const Item = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	display: 'flex',
}));

const ItemName = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	paddingLeft: theme.spacing(1),
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
	color: theme.palette.secondary.main,
	width: '24px !important', // `${theme.spacing(2.6)} !important`,
	height: '24px !important', // `${theme.spacing(2.6)} !important`
}));

const LoadingSpinnerContainer = styled(Box)(() => ({
	transform: `scale(0.8)`,
	width: '24px !important', // `${theme.spacing(2.6)} !important`,
	height: '24px !important', // `${theme.spacing(2.6)} !important`
}));

const LOCAL_STORAGE_SHARED_LOADOUT_URL = 'sharedLoadoutString';
const LOCAL_STORAGE_TAB = 'tab';

function Loading() {
	const logs: LoadLog[] = [];
	const log = (name: string, message: unknown, withMessage = true) => {
		if (withMessage) {
			logs.push({ name, message });
		} else {
			logs.push({ name, message: 'not-logged' });
		}

		console.log(`>>>>>>>>>>> [LOAD] ${name} <<<<<<<<<<<`, message);
	};

	const [hasMembershipData, setHasMembershipData] = useState(false);
	const [hasPlatformData, setHasPlatformData] = useState(false);
	const [hasManifest, setHasManifest] = useState(false);
	const [hasRawCharacters, setHasRawCharacters] = useState(false);
	const [hasStores, setHasStores] = useState(false);
	const router = useRouter();

	const dispatch = useAppDispatch();
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const dimLoadoutsFilter = useAppSelector(selectDimLoadoutsFilter);
	const inGameLoadoutsFilter = useAppSelector(selectInGameLoadoutsFilter);
	const useZeroWastedStats = useAppSelector(selectUseZeroWastedStats);
	const useBonusResilience = useAppSelector(selectUseBonusResilience);
	const alwaysConsiderCollectionsRolls = useAppSelector(
		selectAlwaysConsiderCollectionsRolls
	);
	const useOnlyMasterworkedArmor = useAppSelector(
		selectUseOnlyMasterworkedArmor
	);
	const selectedMinimumGearTier = useAppSelector(selectSelectedMinimumGearTier);
	const selectedReservedArmorSlotEnergy = useAppSelector(
		selectReservedArmorSlotEnergy
	);
	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const selectedIntrisicArmorPerkOrAttributeIds = useAppSelector(
		selectSelectedIntrinsicArmorPerkOrAttributeIds
	);
	const selectedMasterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	// const allClassItemMetadata = useAppSelector(selectAllClassItemMetadata);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedJump = useAppSelector(selectSelectedJump);
	const sharedLoadoutDesiredStats = useAppSelector(
		selectSharedLoadoutDesiredStats
	);
	const sharedLoadoutConfigStatPriorityOrder = useAppSelector(
		selectSharedLoadoutConfigStatPriorityOrder
	);
	const selectedAssumedStatValues = useAppSelector(
		selectSelectedAssumedStatValues
	);

	const defaultSelectedDestinySubclass: Record<
		EDestinyClassId,
		EDestinySubclassId
	> = {
		[EDestinyClassId.Titan]: null,
		[EDestinyClassId.Hunter]: null,
		[EDestinyClassId.Warlock]: null,
	};

	const defaultSelectedExoticArmor: Record<
		EDestinyClassId,
		AvailableExoticArmorItem
	> = {
		[EDestinyClassId.Titan]: null,
		[EDestinyClassId.Hunter]: null,
		[EDestinyClassId.Warlock]: null,
	};

	type LoadFromQueryParamsParams = {
		validDestinyClassIds: EDestinyClassId[];
		availableExoticArmor: AvailableExoticArmor;
		loadoutString: string;
	};
	function loadFromQueryParams({
		validDestinyClassIds,
		availableExoticArmor,
		loadoutString,
	}: LoadFromQueryParamsParams) {
		const loadoutConfig = JSON.parse(loadoutString) as DlbLoadoutConfiguration;

		const destinyClassId = loadoutConfig.dc;
		const destinyClass = destinyClassId
			? getDestinyClass(destinyClassId)
			: null;
		if (!destinyClass) {
			alert(
				'This shared loadout does not have a valid destiny class. Reverting to default.'
			);
			throw new Error('Invalid destiny class');
		}
		if (!validDestinyClassIds.includes(destinyClassId)) {
			alert(
				`You do not have enough armor to make a loadout for the ${destinyClass.name} class. The shared loadout url is being ignored as a result.`
			);
			throw new Error('Invalid destiny class');
		}

		// Class
		dispatch(setSelectedDestinyClass(loadoutConfig.dc));

		// Exotic
		// TODO: If the exotic has doesn't exist then throw some error
		for (const armorSlotId of ArmorSlotIdList) {
			const availableExoticArmorForSlot = availableExoticArmor[
				loadoutConfig.dc
			][armorSlotId] as AvailableExoticArmorItem[];
			const item = availableExoticArmorForSlot.find(
				(x) => x.hash === loadoutConfig.e
			);
			if (item) {
				dispatch(
					setSelectedExoticArmor({
						...defaultSelectedExoticArmor,
						[loadoutConfig.dc]: item,
					})
				);
				break;
			}
		}

		// Subclass
		if (loadoutConfig.dsc) {
			dispatch(
				setSelectedDestinySubclass({
					...defaultSelectedDestinySubclass,
					[loadoutConfig.dc]: loadoutConfig.dsc,
				})
			);
			// Fragments
			if (loadoutConfig.fl) {
				dispatch(
					setSelectedFragmentsForDestinySubclass({
						destinySubclassId: loadoutConfig.dsc,
						fragments: loadoutConfig.fl,
					})
				);
			}
			if (loadoutConfig.g) {
				dispatch(
					setSelectedGrenade({
						...selectedGrenade,
						[loadoutConfig.dsc]: loadoutConfig.g,
					})
				);
			}
		} else {
			dispatch(setSelectedDestinySubclass(defaultSelectedDestinySubclass));
			dispatch(setSelectedFragments(selectedFragments));
			dispatch(setSelectedGrenade(selectedGrenade));
		}

		// Super ability
		if (loadoutConfig.s) {
			dispatch(
				setSelectedSuperAbility({
					...selectedSuperAbility,
					[loadoutConfig.dsc]: loadoutConfig.s,
				})
			);
		}

		// Aspects
		if (loadoutConfig.al) {
			dispatch(
				setSelectedAspects({
					...selectedAspects,
					[loadoutConfig.dsc]: loadoutConfig.al,
				})
			);
		}

		if (loadoutConfig.m) {
			dispatch(
				setSelectedMelee({
					...selectedMelee,
					[loadoutConfig.dsc]: loadoutConfig.m,
				})
			);
		}

		if (loadoutConfig.c) {
			dispatch(
				setSelectedClassAbility({
					...selectedClassAbility,
					[loadoutConfig.dsc]: loadoutConfig.c,
				})
			);
		}

		if (loadoutConfig.j) {
			dispatch(
				setSelectedJump({
					...selectedJump,
					[loadoutConfig.dsc]: loadoutConfig.j,
				})
			);
		}

		if (loadoutConfig.asm) {
			dispatch(setSelectedArmorSlotMods(loadoutConfig.asm));
		}

		// TODO: Add defaults for all other stuff, not just raid mods.
		// This prevents the no-load bug when the shared loadout doesn't have
		// one of the keys and doesn't trigger a redux dirty
		if (loadoutConfig.rml) {
			dispatch(setSelectedRaidMods(loadoutConfig.rml));
		} else {
			dispatch(clearSelectedRaidMods());
		}

		if (loadoutConfig.das) {
			dispatch(
				setSharedLoadoutDesiredStats({
					desiredArmorStats: loadoutConfig.das,
					needed: true,
					processing: false,
					complete: false,
				})
			);
		}
		if (loadoutConfig.spo) {
			dispatch(setSharedLoadoutConfigStatPriorityOrder(loadoutConfig.spo));
		}
	}
	type LoadFromLocalStorageRecallParams = {
		availableExoticArmor: AvailableExoticArmor;
		localStorageRecall: LocalStorageRecall;
	};
	function loadFromLocalStorageRecall({
		availableExoticArmor,
		localStorageRecall,
	}: LoadFromLocalStorageRecallParams) {
		const { destinyClassId, sharedConfig, settings } = localStorageRecall;
		if (!destinyClassId) {
			return false;
		}

		dispatch(setSelectedDestinyClass(destinyClassId));
		// Dirty the subclass stuff
		dispatch(setSelectedDestinySubclass(defaultSelectedDestinySubclass));
		dispatch(setSelectedAspects(selectedAspects));
		dispatch(setSelectedFragments(selectedFragments));
		dispatch(setSelectedSuperAbility(selectedSuperAbility));
		dispatch(setSelectedGrenade(selectedGrenade));
		dispatch(setSelectedMelee(selectedMelee));
		dispatch(setSelectedClassAbility(selectedClassAbility));
		dispatch(setSelectedJump(selectedJump));

		DestinyClassIdList.forEach((destinyClassId) => {
			const { exoticHash, destinySubclassId } =
				localStorageRecall.classSpecificConfig[destinyClassId];

			// Exotics
			for (const armorSlotId of ArmorSlotIdList) {
				const availableExoticArmorForSlot = availableExoticArmor[
					destinyClassId
				][armorSlotId] as AvailableExoticArmorItem[];
				const item = availableExoticArmorForSlot.find(
					(x) => x.hash === exoticHash
				);
				if (item) {
					dispatch(
						setSelectedExoticArmorForDestinyClass({
							destinyClassId: destinyClassId as EDestinyClassId,
							availableExoticArmorItem: item,
						})
					);
					break;
				}
			}

			if (destinySubclassId) {
				dispatch(
					setSelectedDestinySubclassForDestinyClass({
						destinyClassId: destinyClassId as EDestinyClassId,
						destinySubclassId: destinySubclassId as EDestinySubclassId,
					})
				);
			}

			Object.keys(
				localStorageRecall.classSpecificConfig[destinyClassId].subclassConfig
			).forEach((destinySubclassId) => {
				const {
					fragmentIdList,
					aspectIdList,
					superAbilityId,
					grenadeId,
					jumpId,
					meleeId,
					classAbilityId,
				} =
					localStorageRecall.classSpecificConfig[destinyClassId].subclassConfig[
						destinySubclassId
					];
				// Aspects
				if (aspectIdList) {
					dispatch(
						setSelectedAspectsForDestinySubclass({
							destinySubclassId: destinySubclassId as EDestinySubclassId,
							aspects: aspectIdList,
						})
					);
				}
				// Fragments
				if (fragmentIdList) {
					dispatch(
						setSelectedFragmentsForDestinySubclass({
							destinySubclassId: destinySubclassId as EDestinySubclassId,
							fragments: fragmentIdList,
						})
					);
				}
				// SuperAbility
				if (superAbilityId) {
					dispatch(
						setSelectedSuperAbilityForDestinySubclass({
							destinySubclassId: destinySubclassId as EDestinySubclassId,
							superAbilityId,
						})
					);
				}
				// Grenade
				if (grenadeId) {
					dispatch(
						setSelectedGreandeForDestinySubclass({
							destinySubclassId: destinySubclassId as EDestinySubclassId,
							grenadeId,
						})
					);
				}
				// Melee
				if (meleeId) {
					dispatch(
						setSelectedMeleeForDestinySubclass({
							destinySubclassId: destinySubclassId as EDestinySubclassId,
							meleeId,
						})
					);
				}
				// Class Ability
				if (classAbilityId) {
					dispatch(
						setSelectedClassAbilityForDestinySubclass({
							destinySubclassId: destinySubclassId as EDestinySubclassId,
							classAbilityId,
						})
					);
				}
				// Jump
				if (jumpId) {
					dispatch(
						setSelectedJumpForDestinySubclass({
							destinySubclassId: destinySubclassId as EDestinySubclassId,
							jumpId,
						})
					);
				}
			});
		});

		const {
			armorSlotMods,
			raidModIdList,
			reservedArmorSlotEnergy,
			intrinsicArmorPerkOrAttributeIdList,
		} = sharedConfig;

		if (armorSlotMods) {
			dispatch(setSelectedArmorSlotMods(armorSlotMods));
		} else {
			dispatch(setSelectedArmorSlotMods(selectedArmorSlotMods));
		}

		if (raidModIdList) {
			dispatch(setSelectedRaidMods(raidModIdList));
		} else {
			dispatch(clearSelectedRaidMods());
		}

		if (reservedArmorSlotEnergy) {
			dispatch(setReservedArmorSlotEnergy(reservedArmorSlotEnergy));
		} else {
			dispatch(setReservedArmorSlotEnergy(selectedReservedArmorSlotEnergy));
		}

		if (intrinsicArmorPerkOrAttributeIdList) {
			dispatch(
				setSelectedIntrinsicArmorPerkOrAttributeIds(
					intrinsicArmorPerkOrAttributeIdList
				)
			);
		} else {
			dispatch(
				setSelectedIntrinsicArmorPerkOrAttributeIds(
					selectedIntrisicArmorPerkOrAttributeIds
				)
			);
		}

		const {
			masterworkAssumption,
			minimumGearTierId,
			dimLoadoutsFilterId,
			d2LoadoutsFilterId,
			useBetaDimLinks,
			useBonusResilience,
			useOnlyMasterworkedArmor,
			useZeroWastedStats,
			alwaysConsiderCollectionsRolls,
			ignoredLoadoutOptimizationTypes,
			excludeLockedItems,
		} = settings;

		dispatch(setSelectedMasterworkAssumption(masterworkAssumption));
		dispatch(setSelectedMinimumGearTier(minimumGearTierId));
		dispatch(setDimLoadoutsFilter(dimLoadoutsFilterId));
		dispatch(setInGameLoadoutsFilter(d2LoadoutsFilterId));
		dispatch(setUseBetaDimLinks(useBetaDimLinks));
		dispatch(setUseBonusResilience(useBonusResilience));
		dispatch(setUseOnlyMasterworkedArmor(useOnlyMasterworkedArmor));
		dispatch(setExcludeLockedItems(excludeLockedItems));
		dispatch(setUseZeroWastedStats(useZeroWastedStats));
		dispatch(setAlwaysConsiderCollectionsRolls(alwaysConsiderCollectionsRolls));
		if (ignoredLoadoutOptimizationTypes) {
			dispatch(
				setIgnoredLoadoutOptimizationTypes(ignoredLoadoutOptimizationTypes)
			);
		} else {
			dispatch(setIgnoredLoadoutOptimizationTypes([]));
		}

		// Dirty these things
		dispatch(setSharedLoadoutDesiredStats(sharedLoadoutDesiredStats));
		dispatch(
			setSharedLoadoutConfigStatPriorityOrder(
				sharedLoadoutConfigStatPriorityOrder
			)
		);

		return true;
	}

	useEffect(() => {
		(async () => {
			log('begin', null, false);
			const urlParams = new URLSearchParams(window.location.search);
			log('urlParams', urlParams);
			let sharedLoadoutString = urlParams.get('loadout');
			let tabString = urlParams.get('tab');
			log('sharedLoadoutString', sharedLoadoutString);
			if (sharedLoadoutString) {
				localStorage.setItem(
					LOCAL_STORAGE_SHARED_LOADOUT_URL,
					sharedLoadoutString
				);
				log(
					'sharedLoadoutString cached',
					localStorage.getItem(LOCAL_STORAGE_SHARED_LOADOUT_URL)
				);
			}
			if (tabString) {
				localStorage.setItem(LOCAL_STORAGE_TAB, tabString);
				log('tabString cached', localStorage.getItem(LOCAL_STORAGE_TAB));
			}

			try {
				dispatch(setAllDataLoaded(false));
				// TODO can any of these requests be paralellized? Like a Promise.All or whatever?
				const membershipData = await getMembershipData();
				setHasMembershipData(true);
				// If membershipData is null then we are not logged in
				let loadoutStringFromLocalStorage = false;
				if (!sharedLoadoutString) {
					loadoutStringFromLocalStorage = true;
					sharedLoadoutString = localStorage.getItem(
						LOCAL_STORAGE_SHARED_LOADOUT_URL
					);
				}
				if (loadoutStringFromLocalStorage && sharedLoadoutString) {
					router.push('/?loadout=' + encodeURIComponent(sharedLoadoutString));
				}
				let tabStringFromLocalStorage = false;
				if (!tabString) {
					tabStringFromLocalStorage = true;
					tabString = localStorage.getItem(LOCAL_STORAGE_TAB);
				}
				// TODO: This will work right now but is ugly af. At the moment the "tab" and "loadout" query params
				// are mutually exclusive. If we ever want to allow both at the same time then we need to do some
				// more work here to make sure we don't overwrite the query params
				if (tabStringFromLocalStorage && tabString) {
					router.push('/?tab=' + encodeURIComponent(tabString));
				}

				const hiddenLoadoutIdListString = localStorage.getItem(
					'hiddenLoadoutIdList'
				);
				if (hiddenLoadoutIdListString) {
					log('hiddenLoadoutIdListString', hiddenLoadoutIdListString);
					try {
						const hiddenLoadoutIdList = JSON.parse(hiddenLoadoutIdListString);
						dispatch(
							setHiddenLoadoutIdList({
								loadoutIdList: hiddenLoadoutIdList,
								validate: false,
							})
						);
						log('hiddenLoadoutIdList', hiddenLoadoutIdList);
					} catch (e) {
						localStorage.removeItem('hiddenLoadoutIdList');
					}
				}

				const loadoutSpecificIgnoredOptimizationTypesString =
					localStorage.getItem('loadoutSpecificIgnoredOptimizationTypes');
				if (loadoutSpecificIgnoredOptimizationTypesString) {
					log(
						'loadoutSpecificIgnoredOptimizationTypesString',
						loadoutSpecificIgnoredOptimizationTypesString
					);
					try {
						const loadoutSpecificIgnoredOptimizationTypes = JSON.parse(
							loadoutSpecificIgnoredOptimizationTypesString
						);
						dispatch(
							setLoadoutSpecificIgnoredOptimizationTypes({
								loadoutSpecificIgnoredOptimizationTypes,
								validate: false,
							})
						);
						log(
							'loadoutSpecificIgnoredOptimizationTypes',
							loadoutSpecificIgnoredOptimizationTypes
						);
					} catch (e) {
						localStorage.removeItem('loadoutSpecificIgnoredOptimizationTypes');
					}
				}

				let hasSharedLoadoutString = !!sharedLoadoutString;
				let hasTabString = !!tabString;
				const localStorageRecall = getLocalStorageRecall();

				log('membership', membershipData);
				const platformData = await getDestinyAccountsForBungieAccount(
					membershipData.membershipId
				);
				const mostRecentPlatform = platformData.find(
					(platform) => platform.membershipId === membershipData.membershipId
				);
				setHasPlatformData(true);
				log('platform', membershipData);

				let hasDimLoadoutsError = false;
				let dimProfile: ProfileResponse | null = null;
				let dimLoadouts: DimLoadoutWithId[] = [];
				try {
					// throw 'heck';
					dimProfile = await getDimApiProfile(mostRecentPlatform);
					dimLoadouts = dimProfile.loadouts.map((l) => {
						return {
							...cloneDeep(l),
							dlbGeneratedId: `${l.id}/${hash(l)}`,
						};
					});
					log('dimLoadouts (with dlbGeneratedId)', dimLoadouts, true);
					dispatch(setDimLoadouts(dimLoadouts));
				} catch (e) {
					console.warn(
						'Unable to load DIM loadouts. Error:',
						e,
						'DIM API Key is: ',
						process.env.NEXT_PUBLIC_DIM_API_KEY
					);
					hasDimLoadoutsError = true;
					log('dimProfileError', e);
				}
				log('dimProfile', dimProfile);

				const manifest = await getDefinitions();
				log('manifest', manifest, false);
				setHasManifest(true);

				const rawCharacters = await getCharacters(mostRecentPlatform);
				log('raw characters', rawCharacters);
				setHasRawCharacters(true);

				const {
					stores,
					inGameLoadoutsFlatItemIdList,
					inGameLoadouts,
					inGameLoadoutsDefinitions,
					exoticArmorCollectibles,
					buggedAlternateSeasonModIdList,
				} = await loadStoresData(mostRecentPlatform);
				log('exoticArmorCollectibles', exoticArmorCollectibles, false);
				log('inGameLoadouts', inGameLoadouts, true);
				log(
					'buggedAlternateSeasonModIdList',
					buggedAlternateSeasonModIdList,
					true
				);
				dispatch(setInGameLoadoutsDefinitions(inGameLoadoutsDefinitions));
				dispatch(setInGameLoadoutsFlatItemIdList(inGameLoadoutsFlatItemIdList));
				dispatch(
					setBuggedAlternateSeasonModIdList(buggedAlternateSeasonModIdList)
				);
				const inGameLoadoutsWithId: InGameLoadoutsWithIdMapping = {};
				Object.keys(inGameLoadouts).forEach((characterId) => {
					inGameLoadoutsWithId[characterId] = {
						loadouts: [],
					};
					inGameLoadouts[characterId].loadouts.forEach((loadout, i) => {
						const l: LoadoutWithId = {
							...cloneDeep(loadout),
							dlbGeneratedId: `${characterId}/${i}/${hash(loadout)}`,
						};
						inGameLoadoutsWithId[characterId].loadouts.push(l);
					});
				});

				log('inGameLoadoutsWithId', inGameLoadoutsWithId, true);
				dispatch(setInGameLoadoutsLoadoutItems(inGameLoadoutsWithId));
				setHasStores(true);
				const [
					armor,
					availableExoticArmor,
					armorMetadata,
					allClassItemMetadata,
				] = extractArmor(stores, exoticArmorCollectibles, manifest);
				log('armorMetadata', armorMetadata, false);
				log('allClassItemMetadata', allClassItemMetadata, false);

				dispatch(setArmor({ ...armor }));
				dispatch(setAvailableExoticArmor({ ...availableExoticArmor }));
				dispatch(setArmorMetadata({ ...armorMetadata }));
				dispatch(setAllClassItemMetadata(allClassItemMetadata));

				const validDestinyClassIds = getValidDestinyClassIds(armorMetadata);
				log('validDestinyClassIds', validDestinyClassIds);
				if (validDestinyClassIds.length === 0) {
					// TODO: Throw error
					console.error('No valid Destiny Class IDs found');
					router.push('/not-enough-armor');
					return;
				}
				dispatch(setValidDestinyClassIds(validDestinyClassIds));
				log('armor', armor, false);
				log('availableExoticArmor', availableExoticArmor, false);
				const characters = extractCharacters(stores);
				dispatch(setCharacters([...characters]));

				DestinyClassIdList.forEach((destinyClassId) => {
					if (availableExoticArmor[destinyClassId]) {
						for (const armorSlotId of ArmorSlotIdList) {
							// TODO: this lookup of className in the availableExoticArmor const is not
							// typesafe and is not picked up by intellisense. remove all such mapping consts
							// availableExoticArmor['derp'] is not caught!!!!!
							if (
								availableExoticArmor[destinyClassId][armorSlotId].length > 0
							) {
								// Just pick the first exotic item we find
								defaultSelectedExoticArmor[destinyClassId] =
									availableExoticArmor[destinyClassId][armorSlotId][0];
								break;
							}
						}
					}
				});
				dispatch(setSelectedExoticArmor(defaultSelectedExoticArmor));

				let successfullyParsedSharedLoadoutUrl = false;
				let successfullyParsedLocalStorageRecall = false;
				if (hasSharedLoadoutString) {
					try {
						loadFromQueryParams({
							validDestinyClassIds,
							availableExoticArmor,
							loadoutString: sharedLoadoutString,
						});
						successfullyParsedSharedLoadoutUrl = true;
						dispatch(setHasValidLoadoutQueryParams(true));
					} catch (e) {
						// Clear the shared loadout url in case it was causing an issue
						// TODO: Only do this if the error is related to the shared loadout
						localStorage.removeItem(LOCAL_STORAGE_SHARED_LOADOUT_URL);
						hasSharedLoadoutString = false;
					}
					// Shared loadout is higher priority than reading from localStorageRecall
				} else if (!!localStorageRecall) {
					try {
						successfullyParsedLocalStorageRecall = loadFromLocalStorageRecall({
							availableExoticArmor,
							localStorageRecall,
						});
					} catch (e) {
						// localStorage.removeItem(LOCAL_STORAGE_RECALL_KEY);
					}
				}
				if (hasTabString) {
					try {
						const tabIndex = Number(tabString);
						if (TabTypeList.includes(tabIndex)) {
							dispatch(setTabIndex(tabIndex));
							// Ensure that we don't always load into the analyze tab
							localStorage.removeItem(LOCAL_STORAGE_TAB);
							log('tabIndex', tabIndex);
						} else {
							log('tabError', 'Invalid tab index', true);
						}
					} catch (e) {
						console.warn('Unable to load tab. Error:', e);
						hasTabString = false;
						log('tabError', e);
					}
				}
				// Common between loadout urls and localStorageRecall
				const successfullyParsedLoadout =
					successfullyParsedSharedLoadoutUrl ||
					successfullyParsedLocalStorageRecall;
				if (!successfullyParsedLoadout) {
					dispatch(setSelectedDestinyClass(validDestinyClassIds[0]));
					log('characters', characters);

					log('defaultSelectedExoticArmor', defaultSelectedExoticArmor);

					dispatch(setSelectedDestinySubclass(defaultSelectedDestinySubclass));
					log('defaultSelectedDestinySubclass', defaultSelectedDestinySubclass);

					// This is kinda hacky but by triggering a dispatch of the existing
					// default values this stuff we "dirty" the store so it knows it needs to recalculate the
					// processedArmorItems
					dispatch(setSelectedFragments(selectedFragments));
					log('dirtySelectedFragments', null, false);
					dispatch(setSelectedArmorSlotMods(selectedArmorSlotMods));
					log('dirtySelectedArmorSlotMods', null, false);
					dispatch(setSelectedRaidMods(selectedRaidMods));
					log('dirtySelectedRaidMods', null, false);
					dispatch(setSharedLoadoutDesiredStats(sharedLoadoutDesiredStats));
					log('dirtySharedLoadoutDesiredStats', null, false);
				}
				// These are all handled by the recall
				if (!successfullyParsedLocalStorageRecall) {
					dispatch(
						setSelectedIntrinsicArmorPerkOrAttributeIds(
							selectedIntrisicArmorPerkOrAttributeIds
						)
					);
					log('dirtySelectedIntrinsicArmorPerkOrAttributeIds', null, false);
					dispatch(
						setSelectedMasterworkAssumption(selectedMasterworkAssumption)
					);
					log('dirtySelectedMasterworkAssumption', null, false);
					dispatch(setDimLoadoutsFilter(dimLoadoutsFilter));
					log('dirtyDimLoadoutsFilter', null, false);
					dispatch(setInGameLoadoutsFilter(inGameLoadoutsFilter));
					log('dirtyInGameLoadoutsFilter', null, false);
					dispatch(setUseBonusResilience(useBonusResilience));
					log('dirtyUseBonusResilience', null, false);
					dispatch(
						setAlwaysConsiderCollectionsRolls(alwaysConsiderCollectionsRolls)
					);
					log('dirtyAlwaysConsiderCollectionsRolls', null, false);
					dispatch(setUseOnlyMasterworkedArmor(useOnlyMasterworkedArmor));
					log('dirtyUseOnlyMasterworkedArmor', null, false);
					dispatch(setUseZeroWastedStats(useZeroWastedStats));
					log('dirtyUseZeroWastedStats', null, false);
					dispatch(setSelectedMinimumGearTier(selectedMinimumGearTier));
					log('dirtySelectedMinimumGearTier', null, false);
					dispatch(setReservedArmorSlotEnergy(selectedReservedArmorSlotEnergy));
					log('dirtyReservedArmorSlotEnergy', null, false);
				}
				dispatch(setDesiredArmorStats(desiredArmorStats));
				log('dirtyDesiredArmorStats', null, false);
				dispatch(setSelectedAssumedStatValues(selectedAssumedStatValues));
				log('dirtySelectedAssumedStatValues', null, false);

				if (hasDimLoadoutsError) {
					dispatch(setDimLoadouts([]));
					log('hasDimLoadoutsError', null, false);
				}

				try {
					const analyzableLoadoutsBreakdown = buildAnalyzableLoadoutsBreakdown({
						characters,
						inGameLoadoutsWithId,
						inGameLoadoutsDefinitions,
						dimLoadouts,
						armor,
						allClassItemMetadata,
						masterworkAssumption: EMasterworkAssumption.All,
						availableExoticArmor,
					});
					log('analyzableLoadoutsBreakdown', analyzableLoadoutsBreakdown);
					dispatch(setAnalyzableLoadoutsBreakdown(analyzableLoadoutsBreakdown));
				} catch (e) {
					log('buildLoadoutsError', e);
				}

				localStorage.removeItem(LOCAL_STORAGE_SHARED_LOADOUT_URL);
				// Finally we notify the store that we are done loading
				dispatch(setAllDataLoaded(true));
				log('end', null, false);
			} catch (error) {
				// TODO redirect only on the right kind of error
				// Test by deleting 'authorization' from localStorage
				localStorage.removeItem('authorization');
				console.error(error);
				const errorMessage = error.toString();
				// TODO: The DIM code hides the real error but this is good enough for now...
				if (
					errorMessage.includes('BungieService.Difficulties') || // No token
					errorMessage.includes('BungieService.NetworkError') // Bad token
				) {
					router.push('/login');
				} else if (errorMessage.includes('BungieService.Maintenance')) {
					router.push('/bungie-api-maintainence');
				} else {
					const err = error as Error;
					const errMessage = `message: ${err.message}\nstack: ${err.stack}`;
					dispatch(
						setLoadError({
							err: errMessage,
							logs,
						})
					);
					router.push('/error');
				}
			}
		})();

		return () => {
			// this now gets called when the component unmounts
			// TODO: Clean up
		};
	}, []);

	const items: [string, boolean][] = [
		['Bungie Membership Data', hasMembershipData],
		['Platform Data', hasPlatformData],
		['Destiny Manifest', hasManifest],
		['Your Characters', hasRawCharacters],
		['Your Inventory', hasStores],
	];

	return (
		<>
			<Container>
				{items.map(([name, loaded], i) => (
					<Item key={name}>
						{loaded ? (
							<CheckCircleRounded />
						) : (
							<LoadingSpinnerContainer>
								<LoadingSpinner />
							</LoadingSpinnerContainer>
						)}
						<ItemName>{name}</ItemName>
					</Item>
				))}
			</Container>
		</>
	);
}

export default Loading;
