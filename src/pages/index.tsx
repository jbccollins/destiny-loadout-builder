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

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(4)
}));

const Home: NextPage = () => {
	const [hasMembershipData, setHasMembershipData] = useState(false);
	const [hasPlatformData, setHasPlatformpData] = useState(false);
	const [hasCharacterData, setHasCharacterData] = useState(false);
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
			setHasCharacterData(true);
		})();

		return () => {
			// this now gets called when the component unmounts
		};
	}, []);

	const items: [string, boolean][] = [
		['Bungie Membership Data', hasMembershipData],
		['Platform Information', hasPlatformData],
		['Characters', hasCharacterData]
	];

	return (
		<>
			<Head>
				<title>Destiny Loadout Builder</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Container>
				<Loading items={items}></Loading>
			</Container>
		</>
	);
};

export default Home;
