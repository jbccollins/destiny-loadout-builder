import type { NextPage } from 'next';
import Head from 'next/head';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Loading from '@dlb/components/Loading';
import { Box, Button, styled, useMediaQuery, useTheme } from '@mui/material';
import StatSelection from '@dlb/components/StatSelection/StatSelection';
import WebWorkerTest from '@dlb/components/WebWorkerTest/WebWorkerTest';

import { selectAllDataLoaded } from '@dlb/redux/features/allDataLoaded/allDataLoadedSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import ArmorResultsView from '@dlb/components/ArmorResults/ArmorResultsView';
import ExoticAndDestinyClassSelectorWrapper from '@dlb/components/ExoticAndDestinyClassSelectorWrapper';
import React from 'react';
import DestinySubclassSelector from '@dlb/components/SubclassSelector/DestinySubclassSelector';
import FragmentSelector from '@dlb/components/SubclassSelector/FragmentSelector';
import AspectSelector from '@dlb/components/SubclassSelector/AspectSelector';
import MasterworkAssumptionSelector from '@dlb/components/MasterworkAssumptionSelector';
import { selectProcessedArmor } from '@dlb/redux/features/processedArmor/processedArmorSlice';
import GrenadeSelector from '@dlb/components/SubclassSelector/GrenadeSelector';
import MeleeSelector from '@dlb/components/SubclassSelector/MeleeSelector';
import ClassAbilitySelector from '@dlb/components/SubclassSelector/ClassAbilitySelector';
import JumpSelector from '@dlb/components/SubclassSelector/JumpSelector';
import SuperAbilitySelector from '@dlb/components/SubclassSelector/SuperAbilitySelector';
import ArmorSlotModSelector from '@dlb/components/ModSelection/ArmorSlotModsSelector';
import TabContainer from '@dlb/components/TabContainer';
import SelectionControlGroup from '@dlb/components/SectionControlGroup';
import DimLoadoutsFilterSelector from '@dlb/components/DimLoadoutsFilterSelector';
import MinimumGearTierSelector from '@dlb/components/MinimumGearTierSelector';
import RaidModSelector from '@dlb/components/RaidModsSelector';
import { setDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import {
	DefaultArmorStatMapping,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import { setSelectedArmorSlotMods } from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import {
	getDefaultArmorSlotIdToModIdListMapping,
	getDefaultValidRaidModArmorSlotPlacement,
} from '@dlb/types/Mod';
import PatchNotes from '@dlb/components/PatchNotes/PatchNotes';
import {
	selectSelectedDestinySubclass,
	setSelectedDestinySubclass,
} from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { EDestinyClassId, EDestinySubclassId } from '@dlb/types/IdEnums';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import {
	selectSelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	selectSelectedSuperAbility,
	setSelectedSuperAbility,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { setSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import {
	selectSelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import {
	selectSelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import {
	selectSelectedClassAbility,
	setSelectedClassAbility,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import {
	selectSelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import Logout from '@dlb/components/LogOutButton';
import {
	defaultRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import ReservedArmorSlotEnergySelector from '@dlb/components/ReservedArmorSlotEnergySelector';
import ShareLoadout from '@dlb/components/ShareLoadout';

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
		paddingBottom: '80px',
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

const LeftSectionComponent = () => {
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedJump = useAppSelector(selectSelectedJump);

	const dispatch = useAppDispatch();
	const clearDesiredStatTiers = () => {
		dispatch(setDesiredArmorStats(getDefaultArmorStatMapping()));
	};

	const clearArmorSlotMods = () => {
		dispatch(
			setSelectedArmorSlotMods(getDefaultArmorSlotIdToModIdListMapping())
		);
		dispatch(setSelectedRaidMods(defaultRaidMods));
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

	return (
		<LeftSection className="left-section">
			<TabContainer
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
								>
									<DestinySubclassSelector />
									<SuperAbilitySelector />
									<AspectSelector />
									<FragmentSelector />
									<GrenadeSelector />
									<MeleeSelector />
									<ClassAbilitySelector />
									<JumpSelector />
								</SelectionControlGroup>
								<SelectionControlGroup
									title="Mods"
									clearHandler={clearArmorSlotMods}
								>
									<ArmorSlotModSelector />
									<RaidModSelector />
									{/* <ReservedArmorSlotEnergySelector /> */}
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
						title: 'Patch Notes',
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
	return (
		<>
			<Head>
				<title>Destiny Loadout Builder</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
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
								{!smallScreenResultsOpen && <LeftSectionComponent />}
								{!smallScreenResultsOpen && (
									<SmallScreenResultsViewToggle
										className="small-screen-results-view-toggle"
										variant="contained"
										onClick={() =>
											setSmallScreenResultsOpen(!smallScreenResultsOpen)
										}
									>
										<Box>{`Show Results (${processedArmor.length})`}</Box>
									</SmallScreenResultsViewToggle>
								)}
							</>
						)}
						{!isSmallScreen && (
							<>
								<LeftSectionComponent />
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
