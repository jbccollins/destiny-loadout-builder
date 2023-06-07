import Loading from '@dlb/components/Loading';
import StatSelection from '@dlb/components/StatSelection/StatSelection';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
	Box,
	Button,
	Collapse,
	styled,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';

import ArmorResultsView from '@dlb/components/ArmorResults/ArmorResultsView';
import DimLoadoutsFilterSelector from '@dlb/components/DimLoadoutsFilterSelector';
import ExoticAndDestinyClassSelectorWrapper from '@dlb/components/ExoticAndDestinyClassSelectorWrapper';
import InGameLoadoutsFilterSelector from '@dlb/components/InGameLoadoutsFilterSelector';
import Logout from '@dlb/components/LogOutButton';
import MasterworkAssumptionSelector from '@dlb/components/MasterworkAssumptionSelector';
import MinimumGearTierSelector from '@dlb/components/MinimumGearTierSelector';
import ArmorSlotModSelector from '@dlb/components/ModSelection/ArmorSlotModsSelector';
import PatchNotes from '@dlb/components/PatchNotes/PatchNotes';
import RaidModSelector from '@dlb/components/RaidModsSelector';
import SelectionControlGroup from '@dlb/components/SectionControlGroup';
import ShareLoadout from '@dlb/components/ShareLoadout';
import AspectSelector from '@dlb/components/SubclassSelector/AspectSelector';
import ClassAbilitySelector from '@dlb/components/SubclassSelector/ClassAbilitySelector';
import DestinySubclassSelector from '@dlb/components/SubclassSelector/DestinySubclassSelector';
import FragmentSelector from '@dlb/components/SubclassSelector/FragmentSelector';
import GrenadeSelector from '@dlb/components/SubclassSelector/GrenadeSelector';
import JumpSelector from '@dlb/components/SubclassSelector/JumpSelector';
import MeleeSelector from '@dlb/components/SubclassSelector/MeleeSelector';
import SuperAbilitySelector from '@dlb/components/SubclassSelector/SuperAbilitySelector';
import TabContainer from '@dlb/components/TabContainer';
import UseZeroWastedStatsToggleSwitch from '@dlb/components/UseZeroWastedStatsToggleSwitch';
import { selectAllDataLoaded } from '@dlb/redux/features/allDataLoaded/allDataLoadedSlice';
import { setDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectProcessedArmor } from '@dlb/redux/features/processedArmor/processedArmorSlice';
import {
	getDefaultArmorSlotEnergyMapping,
	setReservedArmorSlotEnergy,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { setSelectedArmorSlotMods } from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import {
	selectSelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	selectSelectedClassAbility,
	setSelectedClassAbility,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import {
	selectSelectedDestinySubclass,
	setSelectedDestinySubclass,
} from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { setSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import {
	selectSelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import {
	selectSelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import {
	selectSelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import {
	defaultRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	selectSelectedSuperAbility,
	setSelectedSuperAbility,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getDefaultArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';
import React from 'react';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: 0,
	display: 'flex',
	width: '100%',
	position: 'relative',
	[theme.breakpoints.up('md')]: {
		height: '100vh',
		overflowY: 'hidden',
	},
}));

const LeftSection = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	// width: '400px',
	// minWidth: '400px',
	height: '100vh',
	overflowY: 'auto',
	[theme.breakpoints.up('md')]: {
		minWidth: '400px',
		width: '400px',
	},
	[theme.breakpoints.down('md')]: {
		width: '100%', //`calc(100vw - ${theme.spacing(4)})`,
		paddingBottom: '180px',
	},
}));

const RightSection = styled(Box)(({ theme }) => ({
	flexGrow: 1,
	height: '100vh',
	// [theme.breakpoints.up('md')]: {
	// 	height: '100vh',
	// },
	[theme.breakpoints.down('md')]: {
		width: '100vw',
		// height: `calc(100vh - 170px)`,
	},
}));

const SmallScreenResultsViewToggle = styled(Button)(({ theme }) => ({
	display: 'flex',
	width: '300px',
	position: 'fixed',
	bottom: theme.spacing(1),
	zIndex: 1,
	left: '50%',
	transform: 'translate(-50%, -50%)',
}));

type LeftSectionComponentProps = {
	onTabChange: (value: number) => void;
};

const LeftSectionComponent = (props: LeftSectionComponentProps) => {
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedJump = useAppSelector(selectSelectedJump);
	const [subclassSelectionOpen, setSubclassSelectionOpen] =
		React.useState(true);
	const [modsSelectionOpen, setModsSelectionOpen] = React.useState(true);

	const dispatch = useAppDispatch();
	const clearDesiredStatTiers = () => {
		dispatch(setDesiredArmorStats(getDefaultArmorStatMapping()));
	};

	const clearArmorSlotMods = () => {
		dispatch(
			setSelectedArmorSlotMods(getDefaultArmorSlotIdToModIdListMapping())
		);
		dispatch(setSelectedRaidMods(defaultRaidMods));
		dispatch(setReservedArmorSlotEnergy(getDefaultArmorSlotEnergyMapping()));
	};

	const clearSubclassOptions = () => {
		dispatch(
			setSelectedDestinySubclass({
				...selectedDestinySubclass,
				[selectedDestinyClass]: null,
			})
		);
		if (destinySubclassId) {
			dispatch(
				setSelectedAspects({
					...selectedAspects,
					[destinySubclassId]: [null, null],
				})
			);
			dispatch(
				setSelectedSuperAbility({
					...selectedSuperAbility,
					[destinySubclassId]: null,
				})
			);
			// TODO: This will clear fragments for all classes. Is that desired?
			const { elementId } = getDestinySubclass(destinySubclassId);
			dispatch(setSelectedFragments({ elementId, fragments: [] }));
			dispatch(
				setSelectedGrenade({
					...selectedGrenade,
					[elementId]: null,
				})
			);
			dispatch(
				setSelectedMelee({
					...selectedMelee,
					[destinySubclassId]: null,
				})
			);
			dispatch(
				setSelectedClassAbility({
					...selectedClassAbility,
					[destinySubclassId]: null,
				})
			);
			dispatch(
				setSelectedJump({
					...selectedJump,
					[destinySubclassId]: null,
				})
			);
		}
	};

	const toggleSubclassSelectionOpen = () => {
		setSubclassSelectionOpen(!subclassSelectionOpen);
	};

	const toggleModsSelectionOpen = () => {
		setModsSelectionOpen(!modsSelectionOpen);
	};

	const handleTabChange = (index: number) => {
		props.onTabChange(index);
	};

	return (
		<LeftSection className="left-section">
			<TabContainer
				onChange={handleTabChange}
				tabs={[
					{
						content: (
							<>
								<SelectionControlGroup title="Class and Exotic">
									<ExoticAndDestinyClassSelectorWrapper />
								</SelectionControlGroup>
								<SelectionControlGroup
									title="Desired Stat Tiers"
									clearHandler={clearDesiredStatTiers}
								>
									<StatSelection />
								</SelectionControlGroup>
								<SelectionControlGroup
									title="Subclass Options"
									clearHandler={clearSubclassOptions}
									withCollapse={true}
									handleCollapseToggle={toggleSubclassSelectionOpen}
									open={subclassSelectionOpen}
								>
									<Collapse
										in={subclassSelectionOpen}
										timeout="auto"
										unmountOnExit
									>
										<DestinySubclassSelector />
										<SuperAbilitySelector />
										<AspectSelector />
										<FragmentSelector />
										<GrenadeSelector />
										<MeleeSelector />
										<ClassAbilitySelector />
										<JumpSelector />
									</Collapse>
								</SelectionControlGroup>
								<SelectionControlGroup
									title="Mods"
									clearHandler={clearArmorSlotMods}
									withCollapse={true}
									handleCollapseToggle={toggleModsSelectionOpen}
									open={modsSelectionOpen}
								>
									<Collapse in={modsSelectionOpen} timeout="auto" unmountOnExit>
										<ArmorSlotModSelector />
										<RaidModSelector />
									</Collapse>
								</SelectionControlGroup>
								<ShareLoadout />
							</>
						),
						index: 0,
						title: 'Loadout',
					},
					{
						content: (
							<>
								<MasterworkAssumptionSelector />
								<MinimumGearTierSelector />
								<DimLoadoutsFilterSelector />
								<InGameLoadoutsFilterSelector />
								<UseZeroWastedStatsToggleSwitch />
								<Logout />
							</>
						),
						index: 1,
						title: 'Settings',
					},
					{
						content: (
							<>
								<PatchNotes />
							</>
						),
						index: 2,
						title: 'About',
					},
				]}
			/>

			{/* <ArmorSlotRestrictions /> */}
		</LeftSection>
	);
};

export type SmallScreenData = {
	isSmallScreen: boolean;
	isSmallScreenResultsOpen: boolean;
	toggleSmallScreenResultsView: () => void;
};

type RightSectionProps = {
	smallScreenData: SmallScreenData;
};

const RightSectionComponent = ({ smallScreenData }: RightSectionProps) => (
	<RightSection className="right-section">
		<ArmorResultsView smallScreenData={smallScreenData} />
	</RightSection>
);

const Home: NextPage = () => {
	const [smallScreenResultsOpen, setSmallScreenResultsOpen] =
		React.useState(false);
	const allDataLoaded = useAppSelector(selectAllDataLoaded);
	const processedArmor = useAppSelector(selectProcessedArmor);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

	const smallScreenData: SmallScreenData = {
		isSmallScreen,
		isSmallScreenResultsOpen: smallScreenResultsOpen,
		toggleSmallScreenResultsView: () =>
			setSmallScreenResultsOpen(!smallScreenResultsOpen),
	};

	const [tabIndex, setTabIndex] = React.useState(0);

	return (
		<>
			<Head>
				<title>Destiny Loadout Builder</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<link rel="shortcut icon" href="/favicon.ico" sizes="any" />
			</Head>
			{/* <WebWorkerTest derp={true} /> */}
			<Container className="application-container">
				{!allDataLoaded && <Loading />}
				{allDataLoaded && (
					<>
						{isSmallScreen && (
							<>
								{smallScreenResultsOpen && (
									<RightSectionComponent smallScreenData={smallScreenData} />
								)}
								{!smallScreenResultsOpen && (
									<LeftSectionComponent onTabChange={setTabIndex} />
								)}
								{!smallScreenResultsOpen && tabIndex === 0 && (
									<SmallScreenResultsViewToggle
										disabled={processedArmor.items.length === 0}
										className="small-screen-results-view-toggle"
										variant="contained"
										onClick={() =>
											setSmallScreenResultsOpen(!smallScreenResultsOpen)
										}
									>
										<Box>
											{processedArmor.items.length > 0
												? `Show Results (${processedArmor.items.length})`
												: 'No Results'}
										</Box>
									</SmallScreenResultsViewToggle>
								)}
							</>
						)}
						{!isSmallScreen && (
							<>
								<LeftSectionComponent onTabChange={setTabIndex} />
								<RightSectionComponent smallScreenData={smallScreenData} />
							</>
						)}
					</>
				)}
			</Container>
		</>
	);
};

export default Home;
