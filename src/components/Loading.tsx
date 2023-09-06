import {
	getCharacters,
	getDestinyAccountsForBungieAccount,
	getMembershipData,
} from '@dlb/dim/bungie-api/destiny2-api';
import { getDefinitions } from '@dlb/dim/destiny2/d2-definitions';
import { loadStoresData } from '@dlb/dim/inventory/d2-stores';
import { setAllDataLoaded } from '@dlb/redux/features/allDataLoaded/allDataLoadedSlice';
import { setArmor } from '@dlb/redux/features/armor/armorSlice';
import { setAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { setCharacters } from '@dlb/redux/features/characters/charactersSlice';
import { setSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { setSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor,
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
import { DestinyClassIdList } from '@dlb/types/DestinyClass';

import { getDimApiProfile } from '@dlb/dim/dim-api/dim-api';
import { setAllClassItemMetadata } from '@dlb/redux/features/allClassItemMetadata/allClassItemMetadataSlice';
import {
	selectAnalyzableLoadouts,
	setAnalyzableLoadouts,
} from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import { setArmorMetadata } from '@dlb/redux/features/armorMetadata/armorMetadataSlice';
import {
	selectDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import {
	selectDimLoadouts,
	setDimLoadouts,
} from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import {
	selectDimLoadoutsFilter,
	setDimLoadoutsFilter,
} from '@dlb/redux/features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import { setHasValidLoadoutQueryParams } from '@dlb/redux/features/hasValidLoadoutQueryParams/hasValidLoadoutQueryParamsSlice';
import { setInGameLoadouts } from '@dlb/redux/features/inGameLoadouts/inGameLoadoutsSlice';
import {
	selectInGameLoadoutsFilter,
	setInGameLoadoutsFilter,
} from '@dlb/redux/features/inGameLoadoutsFilter/inGameLoadoutsFilterSlice';
import { setLoadError } from '@dlb/redux/features/loadError/loadErrorSlice';
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
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	selectSelectedClassAbility,
	setSelectedClassAbility,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import {
	selectSelectedFragments,
	setSelectedFragments,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import {
	selectSelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import {
	selectSelectedIntrinsicArmorPerkOrAttributeIds,
	setSelectedIntrinsicArmorPerkOrAttributeIds,
} from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import {
	selectSelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import {
	selectSelectedMasterworkAssumption,
	setSelectedMasterworkAssumption,
} from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import {
	selectSelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import {
	selectSelectedMinimumGearTier,
	setSelectedMinimumGearTier,
} from '@dlb/redux/features/selectedMinimumGearTier/selectedMinimumGearTierSlice';
import {
	defaultRaidMods,
	selectSelectedRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	selectSelectedSuperAbility,
	setSelectedSuperAbility,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { setSharedLoadoutConfigStatPriorityOrder } from '@dlb/redux/features/sharedLoadoutConfigStatPriorityOrder/sharedLoadoutConfigStatPriorityOrderSlice';
import {
	selectSharedLoadoutDesiredStats,
	setSharedLoadoutDesiredStats,
} from '@dlb/redux/features/sharedLoadoutDesiredStats/sharedLoadoutDesiredStatsSlice';
import {
	selectUseZeroWastedStats,
	setUseZeroWastedStats,
} from '@dlb/redux/features/useZeroWastedStats/useZeroWastedStatsSlice';
import { setValidDestinyClassIds } from '@dlb/redux/features/validDestinyClassIds/validDestinyClassIdsSlice';
import { DlbLoadoutConfiguration } from '@dlb/services/links/generateDlbLoadoutLink';
import { buildLoadouts } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import {
	EDestinyClassId,
	EDestinySubclassId,
	EElementId,
} from '@dlb/types/IdEnums';
import { CheckCircleRounded } from '@mui/icons-material';
import { Box, Card, CircularProgress, styled } from '@mui/material';
import { useRouter } from 'next/router';
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

function Loading() {
	const [hasMembershipData, setHasMembershipData] = useState(false);
	const [hasPlatformData, setHasPlatformData] = useState(false);
	const [hasManifest, setHasManifest] = useState(false);
	const [hasRawCharacters, setHasRawCharacters] = useState(false);
	const [hasStores, setHasStores] = useState(false);
	const router = useRouter();

	const dispatch = useAppDispatch();
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const dimLoadouts = useAppSelector(selectDimLoadouts);
	const dimLoadoutsFilter = useAppSelector(selectDimLoadoutsFilter);
	const inGameLoadoutsFilter = useAppSelector(selectInGameLoadoutsFilter);
	const analyzableLoadouts = useAppSelector(selectAnalyzableLoadouts);
	const useZeroWastedStats = useAppSelector(selectUseZeroWastedStats);
	const selectedMinimumGearTier = useAppSelector(selectSelectedMinimumGearTier);
	const reservedArmorSlotEnergy = useAppSelector(selectReservedArmorSlotEnergy);
	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const selectedIntrisicArmorPerkOrAttributeIds = useAppSelector(
		selectSelectedIntrinsicArmorPerkOrAttributeIds
	);
	const selectedMasterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	// const allClassItemMetadata = useAppSelector(selectAllClassItemMetadata);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedJump = useAppSelector(selectSelectedJump);
	const sharedLoadoutDesiredStats = useAppSelector(
		selectSharedLoadoutDesiredStats
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
		availableExoticArmor: AvailableExoticArmor;
		loadoutString: string;
	};
	function loadFromQueryParams({
		availableExoticArmor,
		loadoutString,
	}: LoadFromQueryParamsParams) {
		const loadoutConfig = JSON.parse(loadoutString) as DlbLoadoutConfiguration;
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

		let elementId: EElementId = null;
		// Subclass
		if (loadoutConfig.dsc) {
			elementId = getDestinySubclass(loadoutConfig.dsc).elementId;
			dispatch(
				setSelectedDestinySubclass({
					...defaultSelectedDestinySubclass,
					[loadoutConfig.dc]: loadoutConfig.dsc,
				})
			);
		} else {
			dispatch(setSelectedDestinySubclass(defaultSelectedDestinySubclass));
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

		// Fragments
		if (loadoutConfig.fl) {
			dispatch(
				setSelectedFragments({
					elementId,
					fragments: loadoutConfig.fl,
				})
			);
		}

		if (loadoutConfig.g) {
			dispatch(
				setSelectedGrenade({
					...selectedGrenade,
					[elementId]: loadoutConfig.g,
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
			dispatch(setSelectedRaidMods(defaultRaidMods));
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

	useEffect(() => {
		(async () => {
			const urlParams = new URLSearchParams(window.location.search);
			let sharedLoadoutString = urlParams.get('loadout');
			console.log(
				'>>>>>>>>>>> [LOAD] sharedLoadoutString <<<<<<<<<<<',
				sharedLoadoutString
			);
			if (sharedLoadoutString) {
				localStorage.setItem(
					LOCAL_STORAGE_SHARED_LOADOUT_URL,
					sharedLoadoutString
				);
				console.log(
					'>>>>>>>>>>> [LOAD] sharedLoadoutString cached <<<<<<<<<<<',
					localStorage.getItem(LOCAL_STORAGE_SHARED_LOADOUT_URL)
				);
			}

			try {
				console.log('>>>>>>>>>>> [LOAD] begin <<<<<<<<<<<');
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

				let hasLoadout = sharedLoadoutString ? true : false;

				console.log(
					'>>>>>>>>>>> [LOAD] membership <<<<<<<<<<<',
					membershipData
				);
				const platformData = await getDestinyAccountsForBungieAccount(
					membershipData.membershipId
				);
				const mostRecentPlatform = platformData.find(
					(platform) => platform.membershipId === membershipData.membershipId
				);
				setHasPlatformData(true);
				console.log('>>>>>>>>>>> [LOAD] platform <<<<<<<<<<<', membershipData);

				let hasDimLoadoutsError = false;
				let dimProfile = null;
				try {
					// throw 'heck';
					dimProfile = await getDimApiProfile(mostRecentPlatform);
					dispatch(setDimLoadouts(dimProfile.loadouts));
					console.log('>>>>>>>>>>> [LOAD] DIM profile <<<<<<<<<<<', dimProfile);
				} catch (e) {
					console.warn(
						'Unable to load DIM loadouts. Error:',
						e,
						'DIM API Key is: ',
						process.env.NEXT_PUBLIC_DIM_API_KEY
					);
					hasDimLoadoutsError = true;
				}

				const manifest = await getDefinitions();
				console.log('>>>>>>>>>>> [LOAD] manifest <<<<<<<<<<<', manifest);
				setHasManifest(true);

				const rawCharacters = await getCharacters(mostRecentPlatform);
				console.log(
					'>>>>>>>>>>> [LOAD] raw characters <<<<<<<<<<<',
					rawCharacters
				);
				setHasRawCharacters(true);

				const { stores, inGameLoadoutItemIdList } = await loadStoresData(
					mostRecentPlatform
				);
				setHasStores(true);
				const [
					armor,
					availableExoticArmor,
					armorMetadata,
					allClassItemMetadata,
				] = extractArmor(stores, manifest);
				console.log(
					'>>>>>>>>>>> [LOAD] allClassItemMetadata <<<<<<<<<<<',
					allClassItemMetadata
				);

				dispatch(setArmor({ ...armor }));
				dispatch(setAvailableExoticArmor({ ...availableExoticArmor }));
				dispatch(setArmorMetadata({ ...armorMetadata }));
				dispatch(setAllClassItemMetadata(allClassItemMetadata));

				const validDestinyClassIds = getValidDestinyClassIds(armorMetadata);
				console.log(
					'>>>>>>>>>>> [LOAD] validDestinyClassIds <<<<<<<<<<<',
					validDestinyClassIds
				);
				if (validDestinyClassIds.length === 0) {
					// TODO: Throw error
					console.error('No valid Destiny Class IDs found');
					router.push('/not-enough-armor');
					return;
				}
				dispatch(setValidDestinyClassIds(validDestinyClassIds));
				console.log('>>>>>>>>>>> [LOAD] armor <<<<<<<<<<<', armor);
				console.log(
					'>>>>>>>>>>> [LOAD] availableExoticArmor <<<<<<<<<<<',
					availableExoticArmor
				);
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
				if (hasLoadout) {
					try {
						loadFromQueryParams({
							availableExoticArmor,
							loadoutString: sharedLoadoutString,
						});
						successfullyParsedSharedLoadoutUrl = true;
						dispatch(setHasValidLoadoutQueryParams(true));
					} catch (e) {
						// Clear the shared loadout url in case it was causing an issue
						// TODO: Only do this if the error is related to the shared loadout
						localStorage.removeItem(LOCAL_STORAGE_SHARED_LOADOUT_URL);
						hasLoadout = false;
					}
				}
				if (!successfullyParsedSharedLoadoutUrl) {
					dispatch(setSelectedDestinyClass(validDestinyClassIds[0]));
					console.log('>>>>>>>>>>> [LOAD] characters <<<<<<<<<<<', characters);

					console.log(
						'>>>>>>>>>>> [LOAD] defaultSelectedExoticArmor <<<<<<<<<<<',
						defaultSelectedExoticArmor
					);

					dispatch(setSelectedDestinySubclass(defaultSelectedDestinySubclass));
					console.log(
						'>>>>>>>>>>> [LOAD] defaultSelectedDestinySubclass <<<<<<<<<<<',
						defaultSelectedDestinySubclass
					);

					// This is kinda hacky but by triggering a dispatch of the existing
					// default values for
					//  [
					// 		desiredArmorStats,
					// 		selectedMasterworkAssumption,
					// 		selectedFragments,
					// 		dimLoadouts,
					// 		dimLoadoutsFilter,
					// 		selectedMinimumGearTier,
					// 		selectedRaidMods,
					// 		reservedArmorSlotEnergy,
					// 		allClassItemMetadata
					// 	]
					// we can "dirty" the store so it knows it needs to recalculate the
					// processedArmorItems

					// TODO: Rework setSelectedFragments to not require an element id. Just set all elements
					// with spread syntax
					dispatch(
						setSelectedFragments({
							elementId: EElementId.Stasis,
							fragments: selectedFragments[EElementId.Stasis],
						})
					);
					dispatch(setSelectedArmorSlotMods(selectedArmorSlotMods));
					dispatch(setSelectedRaidMods(selectedRaidMods));

					dispatch(setSharedLoadoutDesiredStats(sharedLoadoutDesiredStats));
				}
				dispatch(
					setSelectedIntrinsicArmorPerkOrAttributeIds(
						selectedIntrisicArmorPerkOrAttributeIds
					)
				);
				dispatch(setDesiredArmorStats(desiredArmorStats));
				dispatch(setSelectedMasterworkAssumption(selectedMasterworkAssumption));
				dispatch(setDimLoadoutsFilter(dimLoadoutsFilter));
				dispatch(setInGameLoadouts(inGameLoadoutItemIdList));
				dispatch(setInGameLoadoutsFilter(inGameLoadoutsFilter));
				dispatch(setUseZeroWastedStats(useZeroWastedStats));
				dispatch(setSelectedMinimumGearTier(selectedMinimumGearTier));
				dispatch(setReservedArmorSlotEnergy(reservedArmorSlotEnergy));
				if (hasDimLoadoutsError) {
					dispatch(setDimLoadouts([]));
				}
				if (!hasDimLoadoutsError && dimProfile) {
					const analyzableDimLoadouts = buildLoadouts(
						dimProfile.loadouts,
						armor,
						allClassItemMetadata,
						selectedMasterworkAssumption
					);
					console.log(
						'>>>>>>>>>>> [LOAD] analyzableDimLoadouts <<<<<<<<<<<',
						analyzableDimLoadouts
					);
					dispatch(
						setAnalyzableLoadouts({
							...analyzableLoadouts,
							validLoadouts: {
								...analyzableLoadouts.validLoadouts,
								...analyzableDimLoadouts,
							},
						})
					);
				}
				localStorage.removeItem(LOCAL_STORAGE_SHARED_LOADOUT_URL);
				// Finally we notify the store that we are done loading
				dispatch(setAllDataLoaded(true));
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
				} else {
					const err = error as Error;
					const errMessage = `message: ${err.message}\nstack: ${err.stack}`;
					dispatch(setLoadError(errMessage));
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
