import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@dlb/styles/Home.module.css';
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
import {
	DestinyProfileResponse,
	getDestinyManifest
} from 'bungie-api-ts-no-const-enum/destiny2';
import { unauthenticatedHttpClient } from '@dlb/dim/bungie-api/bungie-service-helper';
import { getDefinitions } from '@dlb/dim/destiny2/d2-definitions';
import CharacterSelector from '@dlb/components/CharacterSelector';
import { loadStoresData } from '@dlb/dim/inventory/d2-stores';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import Bucket from '@dlb/components/Bucket';
import { structureStoreData } from '@dlb/services/data';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(4)
}));

const Home: NextPage = () => {
	const [hasMembershipData, setHasMembershipData] = useState(false);
	const [hasPlatformData, setHasPlatformpData] = useState(false);
	const [hasManifest, setHasManifest] = useState(false);
	const [characters, setCharacters] = useState<null | DestinyProfileResponse>(
		null
	);
	const [stores, setStores] = useState<null | DimStore<DimItem>[]>(null);
	const [armor, setArmor] = useState<null | DimItem[]>(null);
	useEffect(() => {
		(async () => {
			const membershipData = await getMembershipData();
			setHasMembershipData(true);
			const platformData = await getDestinyAccountsForBungieAccount(
				membershipData.membershipId
			);
			const mostRecentPlatform = platformData.find(
				(platform) => platform.membershipId === membershipData.membershipId
			);
			setHasPlatformpData(true);
			const characters = await getCharacters(mostRecentPlatform);
			console.log('>>>>>>>>>>> characters <<<<<<<<<<<', characters);
			setCharacters(characters);
			// const manifest = await getDestinyManifest(unauthenticatedHttpClient);
			const manifest = await getDefinitions();
			console.log('>>>>>>>>>>> manifest <<<<<<<<<<<', manifest);
			setHasManifest(true);
			const stores = await loadStoresData(mostRecentPlatform);
			console.log('>>>>>>>>>> stores <<<<<<<<<<<', stores);
			setStores(stores);
			const [armor, nonArmor] = structureStoreData(stores);
			setArmor(armor);
			console.log('>>>>>>>>>> armor <<<<<<<<<<<', armor);
		})();

		return () => {
			// this now gets called when the component unmounts
		};
	}, []);

	const hasCharacterData = characters != null;
	const hasStoresData = stores != null;

	const items: [string, boolean][] = [
		['Bungie Membership Data', hasMembershipData],
		['Platform Information', hasPlatformData],
		['Characters', hasCharacterData],
		['Manifest', hasManifest],
		['Stores', hasStoresData]
	];

	return (
		<>
			<Head>
				<title>Destiny Loadout Builder</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Container>
				<Loading items={items} />
				{hasCharacterData && (
					<CharacterSelector characters={characters.characters} />
				)}
				{armor && <Bucket items={armor} />}
			</Container>
		</>
	);
};

export default Home;
