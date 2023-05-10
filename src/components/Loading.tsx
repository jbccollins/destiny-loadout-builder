import {
	getMembershipData,
	getDestinyAccountsForBungieAccount,
	getCharacters,
} from '@dlb/dim/bungie-api/destiny2-api';
import { getDefinitions } from '@dlb/dim/destiny2/d2-definitions';
import { loadStoresData } from '@dlb/dim/inventory/d2-stores';
import { setAllDataLoaded } from '@dlb/redux/features/allDataLoaded/allDataLoadedSlice';
import { setArmor } from '@dlb/redux/features/armor/armorSlice';
import { setAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { setCharacters } from '@dlb/redux/features/characters/charactersSlice';
import { setSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor,
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { setSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';

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

import {
	EDestinyClassId,
	EDestinySubclassId,
	EElementId,
} from '@dlb/types/IdEnums';
import { CheckCircleRounded } from '@mui/icons-material';
import { Box, styled, Card, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
	selectDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import {
	selectSelectedMasterworkAssumption,
	setSelectedMasterworkAssumption,
} from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import {
	selectSelectedFragments,
	setSelectedFragments,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import {
	selectSelectedArmorSlotMods,
	setSelectedArmorSlotMods,
} from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import { getDimApiProfile } from '@dlb/dim/dim-api/dim-api';
import {
	selectDimLoadouts,
	setDimLoadouts,
} from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import {
	selectDimLoadoutsFilter,
	setDimLoadoutsFilter,
} from '@dlb/redux/features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import {
	selectSelectedMinimumGearTier,
	setSelectedMinimumGearTier,
} from '@dlb/redux/features/selectedMinimumGearTier/selectedMinimumGearTierSlice';
import {
	selectSelectedRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { setArmorMetadata } from '@dlb/redux/features/armorMetadata/armorMetadataSlice';
import { setLoadError } from '@dlb/redux/features/loadError/loadErrorSlice';
import { setValidDestinyClassIds } from '@dlb/redux/features/validDestinyClassIds/validDestinyClassIdsSlice';
import {
	selectReservedArmorSlotEnergy,
	setReservedArmorSlotEnergy,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { DlbLoadoutConfiguration } from '@dlb/services/links/generateDlbLoadoutLink';
import {
	selectSelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	selectSelectedSuperAbility,
	setSelectedSuperAbility,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import {
	selectSelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import {
	selectSelectedClassAbility,
	setSelectedClassAbility,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import {
	selectSelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import {
	selectSelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';

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
	const selectedMinimumGearTier = useAppSelector(selectSelectedMinimumGearTier);
	const reservedArmorSlotEnergy = useAppSelector(selectReservedArmorSlotEnergy);
	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const selectedMasterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedJump = useAppSelector(selectSelectedJump);

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
		dispatch(setSelectedDestinyClass(loadoutConfig.destinyClassId));

		// Exotic
		for (const armorSlotId of ArmorSlotIdList) {
			const availableExoticArmorForSlot = availableExoticArmor[
				loadoutConfig.destinyClassId
			][armorSlotId] as AvailableExoticArmorItem[];
			const item = availableExoticArmorForSlot.find(
				(x) => x.hash === loadoutConfig.exoticArmor.hash
			);
			if (item) {
				dispatch(
					setSelectedExoticArmor({
						...selectedExoticArmor,
						[loadoutConfig.destinyClassId]: item,
					})
				);
				break;
			}
		}

		let elementId: EElementId = null;
		// Subclass
		if (loadoutConfig.destinySubclassId) {
			elementId = getDestinySubclass(loadoutConfig.destinySubclassId).elementId;
			dispatch(
				setSelectedDestinySubclass({
					...defaultSelectedDestinySubclass,
					[loadoutConfig.destinyClassId]: loadoutConfig.destinySubclassId,
				})
			);
		} else {
			dispatch(setSelectedDestinySubclass(defaultSelectedDestinySubclass));
		}

		// Super ability
		if (loadoutConfig.superAbilityId) {
			dispatch(
				setSelectedSuperAbility({
					...selectedSuperAbility,
					[loadoutConfig.destinySubclassId]: loadoutConfig.superAbilityId,
				})
			);
		}

		// Aspects
		if (loadoutConfig.aspectIdList) {
			dispatch(
				setSelectedAspects({
					...selectedAspects,
					[loadoutConfig.destinySubclassId]: loadoutConfig.aspectIdList,
				})
			);
		}

		// Fragments
		if (loadoutConfig.fragmentIdList) {
			dispatch(
				setSelectedFragments({
					elementId,
					fragments: loadoutConfig.fragmentIdList,
				})
			);
		}

		if (loadoutConfig.grenadeId) {
			dispatch(
				setSelectedGrenade({
					...selectedGrenade,
					[elementId]: loadoutConfig.grenadeId,
				})
			);
		}

		if (loadoutConfig.meleeId) {
			dispatch(
				setSelectedMelee({
					...selectedMelee,
					[loadoutConfig.destinySubclassId]: loadoutConfig.meleeId,
				})
			);
		}

		if (loadoutConfig.classAbilityId) {
			dispatch(
				setSelectedClassAbility({
					...selectedClassAbility,
					[loadoutConfig.destinySubclassId]: loadoutConfig.classAbilityId,
				})
			);
		}

		if (loadoutConfig.jumpId) {
			dispatch(
				setSelectedJump({
					...selectedJump,
					[loadoutConfig.destinySubclassId]: loadoutConfig.jumpId,
				})
			);
		}

		if (loadoutConfig.armorSlotMods) {
			dispatch(setSelectedArmorSlotMods(loadoutConfig.armorSlotMods));
		}

		if (loadoutConfig.raidModIdList) {
			dispatch(setSelectedRaidMods(loadoutConfig.raidModIdList));
		}

		if (loadoutConfig.desiredArmorStats) {
			dispatch(setDesiredArmorStats(loadoutConfig.desiredArmorStats));
		}
	}

	useEffect(() => {
		(async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const loadoutString = urlParams.get('loadout');

			const hasLoadout = loadoutString ? true : false;

			try {
				console.log('>>>>>>>>>>> [LOAD] begin <<<<<<<<<<<');
				dispatch(setAllDataLoaded(false));
				// TODO can any of these requests be paralellized? Like a Promise.All or whatever?
				const membershipData = await getMembershipData();
				setHasMembershipData(true);
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
				try {
					// throw 'heck';
					const dimProfile = await getDimApiProfile(mostRecentPlatform);
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

				const stores = await loadStoresData(mostRecentPlatform);
				console.log('>>>>>>>>>>> [LOAD] stores <<<<<<<<<<<', stores);
				setHasStores(true);
				const [armor, availableExoticArmor, armorMetadata] =
					extractArmor(stores);

				dispatch(setArmor({ ...armor }));
				dispatch(setAvailableExoticArmor({ ...availableExoticArmor }));
				dispatch(setArmorMetadata({ ...armorMetadata }));
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
				if (hasLoadout) {
					loadFromQueryParams({
						availableExoticArmor,
						loadoutString,
					});
				} else {
					dispatch(setSelectedDestinyClass(validDestinyClassIds[0]));
					console.log('>>>>>>>>>>> [LOAD] characters <<<<<<<<<<<', characters);

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
					// 		reservedArmorSlotEnergy
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
					dispatch(setDesiredArmorStats(desiredArmorStats));
				}

				dispatch(setSelectedMasterworkAssumption(selectedMasterworkAssumption));

				if (hasDimLoadoutsError) {
					dispatch(setDimLoadouts(dimLoadouts));
				}
				dispatch(setDimLoadoutsFilter(dimLoadoutsFilter));
				dispatch(setSelectedMinimumGearTier(selectedMinimumGearTier));
				dispatch(setReservedArmorSlotEnergy(reservedArmorSlotEnergy));
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
