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
import { setSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { setSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import {
	SelectedSubclassOptions,
	setSelectedSubclassOptions,
} from '@dlb/redux/features/selectedSubclassOptions/selectedSubclassOptionsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { extractArmor, extractCharacters } from '@dlb/services/data';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { ArmorSlotIdList } from '@dlb/types/ArmorSlot';
import { DestinyClassIdList } from '@dlb/types/DestinyClass';
import DestinySubclassAndSuperAbilityOptions from '@dlb/constants/DestinySubclassAndSuperAbilityOptions';

import { EDestinyClassId, EElementId } from '@dlb/types/IdEnums';
import { CheckCircleRounded } from '@mui/icons-material';
import { Box, styled, Card, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
	selectDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import selectedMasterworkAssumptionSlice, {
	selectSelectedMasterworkAssumption,
	setSelectedMasterworkAssumption,
} from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import {
	selectSelectedFragments,
	setSelectedFragments,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';

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
	const selectedMasterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);

	useEffect(() => {
		(async () => {
			try {
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
				const [armor, availableExoticArmor] = extractArmor(stores);
				dispatch(setArmor({ ...armor }));
				dispatch(setAvailableExoticArmor({ ...availableExoticArmor }));
				console.log('>>>>>>>>>>> [LOAD] armor <<<<<<<<<<<', armor);
				console.log(
					'>>>>>>>>>>> [LOAD] availableExoticArmor <<<<<<<<<<<',
					availableExoticArmor
				);
				const characters = extractCharacters(stores);
				dispatch(setCharacters([...characters]));
				dispatch(setSelectedCharacterClass(characters[0].destinyClassId));
				console.log('>>>>>>>>>>> [LOAD] characters <<<<<<<<<<<', characters);

				const defaultSelectedExoticArmor: Record<
					EDestinyClassId,
					AvailableExoticArmorItem
				> = {
					[EDestinyClassId.Titan]: null,
					[EDestinyClassId.Hunter]: null,
					[EDestinyClassId.Warlock]: null,
				};
				const defaultSelectedSubclassOptions: Record<
					EDestinyClassId,
					SelectedSubclassOptions
				> = {
					[EDestinyClassId.Titan]: null,
					[EDestinyClassId.Hunter]: null,
					[EDestinyClassId.Warlock]: null,
				};
				DestinyClassIdList.forEach((destinyClassId) => {
					defaultSelectedSubclassOptions[destinyClassId] = {
						destinySubclassId:
							DestinySubclassAndSuperAbilityOptions[destinyClassId][0]
								.destinySubclassId,
						superAbilityId:
							DestinySubclassAndSuperAbilityOptions[destinyClassId][0]
								.superAbilityId,
					};

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
				dispatch(setSelectedSubclassOptions(defaultSelectedSubclassOptions));
				console.log(
					'>>>>>>>>>>> [LOAD] defaultSelectedSubclassOptions <<<<<<<<<<<',
					defaultSelectedSubclassOptions
				);
				// This is kinda hacky but by triggering a dispatch of the existing
				// default values for [desiredArmorStats, selectedMasterworkAssumption, selectedFragments]
				// we can "dirty" the store so it knows it needs to recalculate the
				// processedArmorItems
				dispatch(setDesiredArmorStats(desiredArmorStats));
				dispatch(setSelectedMasterworkAssumption(selectedMasterworkAssumption));
				// TODO: Rework setSelectedFragments to not require an element id. Just set all elements
				// with spread syntax
				dispatch(
					setSelectedFragments({
						elementId: EElementId.Stasis,
						fragments: selectedFragments[EElementId.Stasis],
					})
				);
				// Finally we notify the store that we are done loading
				dispatch(setAllDataLoaded(true));
			} catch (e) {
				// TODO redirect only on the right kind of error
				// Test by deleting 'authorization' from localStorage
				console.error(e);
				router.push('/login');
			}
		})();

		return () => {
			// this now gets called when the component unmounts
			// TODO: Clean up
		};
	}, [dispatch, router]);

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
