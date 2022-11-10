import type { NextPage } from 'next';
import Head from 'next/head';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Loading from '@dlb/components/Loading';
import { Box, styled } from '@mui/material';
import StatSelection from '@dlb/components/StatSelection/StatSelection';
import WebWorkerTest from '@dlb/components/WebWorkerTest/WebWorkerTest';

import { selectAllDataLoaded } from '@dlb/redux/features/allDataLoaded/allDataLoadedSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import ArmorResultsView from '@dlb/components/ArmorResults/ArmorResultsView';
import ExoticAndDestinyClassSelectorWrapper from '@dlb/components/ExoticAndDestinyClassSelectorWrapper';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(2),
	display: 'flex'
}));

const Section = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2)
}));

const RightSection = styled(Section)(({ theme }) => ({
	padding: theme.spacing(2),
	flexGrow: 1
}));

const Home: NextPage = () => {
	const allDataLoaded = useAppSelector(selectAllDataLoaded);
	return (
		<>
			<Head>
				<title>Destiny Loadout Builder</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			{/* <WebWorkerTest derp={true} /> */}
			<Container>
				{!allDataLoaded && <Loading />}
				{allDataLoaded && (
					<>
						<Section>
							<ExoticAndDestinyClassSelectorWrapper />
							<StatSelection locked />
						</Section>
						<RightSection>
							<ArmorResultsView />
						</RightSection>
					</>
				)}
			</Container>
		</>
	);
};

export default Home;
