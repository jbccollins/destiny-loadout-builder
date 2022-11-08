import type { NextPage } from 'next';
import Head from 'next/head';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Loading from '@dlb/components/Loading';
import { Box, styled } from '@mui/material';
import CharacterSelector from '@dlb/components/CharacterSelector';
import ExoticSelector from '@dlb/components/ExoticSelector';
import StatSelection from '@dlb/components/StatSelection/StatSelection';
import WebWorkerTest from '@dlb/components/WebWorkerTest/WebWorkerTest';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(4)
}));

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Destiny Loadout Builder</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<WebWorkerTest derp={true} />
			<Container>
				<Loading />
				<CharacterSelector />
				<ExoticSelector />
				<StatSelection locked />
			</Container>
		</>
	);
};

export default Home;
