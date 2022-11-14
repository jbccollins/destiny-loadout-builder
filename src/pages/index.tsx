import type { NextPage } from 'next';
import Head from 'next/head';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Loading from '@dlb/components/Loading';
import {
	Box,
	Button,
	Collapse,
	Hidden,
	IconButton,
	styled,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import StatSelection from '@dlb/components/StatSelection/StatSelection';
import WebWorkerTest from '@dlb/components/WebWorkerTest/WebWorkerTest';

import { selectAllDataLoaded } from '@dlb/redux/features/allDataLoaded/allDataLoadedSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import ArmorResultsView from '@dlb/components/ArmorResults/ArmorResultsView';
import ExoticAndDestinyClassSelectorWrapper from '@dlb/components/ExoticAndDestinyClassSelectorWrapper';
import ArmorSlotRestrictions from '@dlb/components/ArmorSlotRestrictions/ArmorSlotRestrictions';
import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SubclassSelector from '@dlb/components/SubclassSelector/SubclassSelector';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(1),
	display: 'flex',
	width: '100%',
	// maxWidth: '100%',
	position: 'relative',
	height: '100vh', //`calc(100vh - ${theme.spacing(2)})`,

	//overflowY: 'auto',
	[theme.breakpoints.down('md')]: {
		display: 'block',
		paddingBottom: theme.spacing(10),
		//flexWrap: 'wrap',
	},
}));

const LeftSection = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	width: '425px',
	height: '100%',
	overflowY: 'auto',
	[theme.breakpoints.down('md')]: {
		width: '100%', //`calc(100vw - ${theme.spacing(4)})`,
		padding: theme.spacing(0),
	},
}));

const RightSection = styled(Box)(({ theme }) => ({
	padding: theme.spacing(0),
	flexGrow: 1,
	[theme.breakpoints.down('md')]: {
		width: '100vw', //`calc(100vw - ${theme.spacing(4)})`,
		padding: theme.spacing(0),
	},
}));

const SmallScreenResultsViewToggle = styled(Button)(({ theme }) => ({
	display: 'flex',
	width: '300px',
	position: 'fixed',
	bottom: theme.spacing(1),
	zIndex: 1,
	//background: 'red',
	left: '50%',
	transform: 'translate(-50%, -50%)',
}));

const SmallScreenResultsViewWrapper = styled(Box)(({ theme }) => ({
	display: 'block',
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	zIndex: 2,
	height: '100vh',
	background: 'black',
}));

const ArmorResultsViewWrapper = styled(Box)(({ theme }) => ({
	maxHeight: `calc(100vh - ${theme.spacing(10)})`,
	overflowY: 'auto',
}));

const Home: NextPage = () => {
	const [open, setOpen] = React.useState(false);
	const allDataLoaded = useAppSelector(selectAllDataLoaded);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
	return (
		<>
			<Head>
				<title>Destiny Loadout Builder</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			{/* <WebWorkerTest derp={true} /> */}
			<Container
				sx={{
					padding: open ? 0 : '',
				}}
			>
				{!allDataLoaded && <Loading />}
				{allDataLoaded && (
					<>
						<LeftSection>
							<ExoticAndDestinyClassSelectorWrapper />
							<ArmorSlotRestrictions />
							<SubclassSelector />
							<StatSelection locked />
						</LeftSection>
						{!isSmallScreen && (
							<RightSection>
								<ArmorResultsView />
							</RightSection>
						)}
						{isSmallScreen && (
							<>
								<SmallScreenResultsViewToggle
									variant="contained"
									onClick={() => setOpen(true)}
								>
									<Box>Show Results</Box>
								</SmallScreenResultsViewToggle>
								{open && (
									<SmallScreenResultsViewWrapper>
										<SmallScreenResultsViewToggle
											variant="contained"
											onClick={() => setOpen(false)}
										>
											Back
										</SmallScreenResultsViewToggle>
										<ArmorResultsViewWrapper>
											<ArmorResultsView />
										</ArmorResultsViewWrapper>
									</SmallScreenResultsViewWrapper>
								)}
							</>
						)}
					</>
				)}
			</Container>
		</>
	);
};

export default Home;
