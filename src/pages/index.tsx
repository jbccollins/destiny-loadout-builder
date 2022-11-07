import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
	getCharacters,
	getDestinyAccountsForBungieAccount,
	getMembershipData
} from '@dlb/dim/bungie-api/destiny2-api';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Loading from '@dlb/components/Loading';
import { Box, styled } from '@mui/material';

import { getDefinitions } from '@dlb/dim/destiny2/d2-definitions';
import CharacterSelector from '@dlb/components/CharacterSelector';
import { loadStoresData } from '@dlb/dim/inventory/d2-stores';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import ExoticSelector from '@dlb/components/ExoticSelector';
import { extractArmor, extractCharacters } from '@dlb/services/data';
import StatSelection from '@dlb/components/StatSelection/StatSelection';
import WebWorkerTest from '@dlb/components/WebWorkerTest/WebWorkerTest';
import { useRouter } from 'next/router';

import { selectArmor, setArmor } from '@dlb/redux/features/armor/armorSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	selectCharacters,
	setCharacters
} from '@dlb/redux/features/characters/charactersSlice';
import {
	availableExoticArmorSlice,
	selectAvailableExoticArmor,
	setAvailableExoticArmor
} from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { selectSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(4)
}));

const Home: NextPage = () => {
	const [hasMembershipData, setHasMembershipData] = useState(false);
	const [hasPlatformData, setHasPlatformpData] = useState(false);
	const [hasManifest, setHasManifest] = useState(false);
	const [stores, setStores] = useState<null | DimStore<DimItem>[]>(null);
	const router = useRouter();

	const dispatch = useAppDispatch();
	// const armor = useAppSelector(selectArmor);
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const characters = useAppSelector(selectCharacters);

	useEffect(() => {
		(async () => {
			try {
				const membershipData = await getMembershipData();
				setHasMembershipData(true);
				console.log('>>>>>>>>>>> membership <<<<<<<<<<<', membershipData);
				const platformData = await getDestinyAccountsForBungieAccount(
					membershipData.membershipId
				);
				const mostRecentPlatform = platformData.find(
					(platform) => platform.membershipId === membershipData.membershipId
				);
				setHasPlatformpData(true);
				console.log('>>>>>>>>>>> platform <<<<<<<<<<<', membershipData);
				const rawCharacters = await getCharacters(mostRecentPlatform);
				console.log('>>>>>>>>>>> raw characters <<<<<<<<<<<', rawCharacters);
				// const manifest = await getDestinyManifest(unauthenticatedHttpClient);
				const manifest = await getDefinitions();
				console.log('>>>>>>>>>>> manifest <<<<<<<<<<<', manifest);
				setHasManifest(true);
				const stores = await loadStoresData(mostRecentPlatform);
				console.log('>>>>>>>>>> stores <<<<<<<<<<<', stores);
				setStores(stores);
				const [armor, availableExoticArmor] = extractArmor(stores);
				dispatch(setArmor({ ...armor }));
				dispatch(setAvailableExoticArmor({ ...availableExoticArmor }));
				console.log('>>>>>>>>>> armor <<<<<<<<<<<', armor);
				console.log(
					'>>>>>>>>>> availableExoticArmor <<<<<<<<<<<',
					availableExoticArmor
				);
				const characters = extractCharacters(stores);
				dispatch(setCharacters([...characters]));
				console.log('>>>>>>>>>> characters <<<<<<<<<<<', characters);
			} catch (e) {
				// TODO redirect only on the right kind of error
				// Test by deleting 'authorization' from localStorage
				router.push('/login');
				// console.error(e);
			}
		})();

		return () => {
			// this now gets called when the component unmounts
		};
	}, [dispatch, router]);

	const hasCharacterData = characters.length > 0;
	const hasStoresData = stores !== null;

	const items: [string, boolean][] = [
		['Bungie Membership Data', hasMembershipData],
		['Platform Information', hasPlatformData],
		['Manifest', hasManifest],
		['Stores', hasStoresData],
		['Characters', hasCharacterData]
	];

	return (
		<>
			<Head>
				<title>Destiny Loadout Builder</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<WebWorkerTest derp={true} />
			<Container>
				<Loading items={items} />
				{hasCharacterData && <CharacterSelector characters={characters} />}
				{availableExoticArmor && selectedCharacterClass && (
					<ExoticSelector
						items={availableExoticArmor[selectedCharacterClass]}
					/>
				)}
				<StatSelection locked />
			</Container>
		</>
	);
};

export default Home;
