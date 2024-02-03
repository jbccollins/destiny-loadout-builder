'use client';
import Loading from '@dlb/components/Loading';
import StatSelection from '@dlb/components/StatSelection/StatSelection';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AnalyzeIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';
import ShieldIcon from '@mui/icons-material/Shield';
import { Box, Button, Collapse, Divider, Link, styled } from '@mui/material';
import Image from 'next/image';

import AlwaysConsiderCollectionsRollsToggleSwitch from '@dlb/components/AlwaysConsiderCollectionsRollsToggleSwitch';
import ArmorResultsView from '@dlb/components/ArmorResults/ArmorResultsView';
import DimImportDialog from '@dlb/components/DimImportDialog';
import DimLoadoutsFilterSelector from '@dlb/components/DimLoadoutsFilterSelector';
import ExcludeLockedItemsToggleSwitch from '@dlb/components/ExcludeLockedItemsToggleSwitch';
import ExoticAndDestinyClassSelectorWrapper from '@dlb/components/ExoticAndDestinyClassSelectorWrapper';
import IgnoredLoadoutOptimizationTypesSelector from '@dlb/components/IgnoredLoadoutOptimizationTypesSelector';
import InGameLoadoutsFilterSelector from '@dlb/components/InGameLoadoutsFilterSelector';
import IntrinsicArmorPerkOrAttributeSelector from '@dlb/components/IntrinsicArmorPerkOrAttributeSelector';
import AnalyzerResultsView from '@dlb/components/LoadoutAnalyzer/AnalyzerResultsView';
import LoadoutAnalysisWebWorkerWrapper from '@dlb/components/LoadoutAnalyzer/LoadoutAnalysisWebWorkerWrapper';
import LoadoutAnalyzer from '@dlb/components/LoadoutAnalyzer/LoadoutAnalyzer';
import Logout from '@dlb/components/LogOutButton';
import MasterworkAssumptionSelector from '@dlb/components/MasterworkAssumptionSelector';
import Head from '@dlb/components/Meta/Head';
import ArmorSlotModSelector from '@dlb/components/ModSelection/ArmorSlotModsSelector';
import PatchNotes from '@dlb/components/PatchNotes/PatchNotes';
import RaidModSelector from '@dlb/components/RaidModsSelector';
import ResetButton from '@dlb/components/ResetButton';
import SelectionControlGroup from '@dlb/components/SectionControlGroup';
import ShareLoadout from '@dlb/components/ShareLoadout';
import AdvancedOptions from '@dlb/components/StatSelection/AdvancedOptions';
import AspectSelector from '@dlb/components/SubclassSelector/AspectSelector';
import ClassAbilitySelector from '@dlb/components/SubclassSelector/ClassAbilitySelector';
import DestinySubclassSelector from '@dlb/components/SubclassSelector/DestinySubclassSelector';
import FragmentSelector from '@dlb/components/SubclassSelector/FragmentSelector';
import GrenadeSelector from '@dlb/components/SubclassSelector/GrenadeSelector';
import JumpSelector from '@dlb/components/SubclassSelector/JumpSelector';
import MeleeSelector from '@dlb/components/SubclassSelector/MeleeSelector';
import SuperAbilitySelector from '@dlb/components/SubclassSelector/SuperAbilitySelector';
import TabContainer from '@dlb/components/TabContainer';
import UseBetaDimLinksToggleSwitch from '@dlb/components/UseBetaDimLinksToggleSwitch';
import UseBonusResilienceToggleSwitch from '@dlb/components/UseBonusResilienceToggleSwitch';
import UseOnlyMasterworkedArmorToggleSwitch from '@dlb/components/UseOnlyMasterworkedArmorToggleSwitch';
import UseZeroWastedStatsToggleSwitch from '@dlb/components/UseZeroWastedStatsToggleSwitch';
import { DISCORD_LINK } from '@dlb/dim/utils/constants';
import useIsSmallScreen from '@dlb/hooks/useIsSmallScreen';
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
import { setSelectedFragmentsForDestinySubclass } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import {
	selectSelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { clearSelectedIntrinsicArmorPerkOrAttributeIds } from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import {
	selectSelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import {
	selectSelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { clearSelectedRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	selectSelectedSuperAbility,
	setSelectedSuperAbility,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import {
	selectTabIndex,
	setTabIndex,
} from '@dlb/redux/features/tabIndex/tabIndexSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import { getDefaultArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';
import { ETabType } from '@dlb/types/Tab';
import discord_image from '@public/discord-mark-white.png';
import React, { useEffect } from 'react';

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
	tabIndex: number;
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
	const [raidModsSelectionOpen, setRaidModsSelectionOpen] =
		React.useState(true);
	const [
		intrinsicArmorPerkOrAttributesSelectionOpen,
		setIntrinsicArmorPerkOrAttributesSelectionOpen,
	] = React.useState(true);

	const dispatch = useAppDispatch();
	const clearDesiredStatTiers = () => {
		dispatch(setDesiredArmorStats(getDefaultArmorStatMapping()));
	};

	const clearArmorSlotMods = () => {
		dispatch(
			setSelectedArmorSlotMods(getDefaultArmorSlotIdToModIdListMapping())
		);
		dispatch(setReservedArmorSlotEnergy(getDefaultArmorSlotEnergyMapping()));
	};

	const clearRaidMods = () => {
		dispatch(clearSelectedRaidMods());
	};

	const clearIntrinsicArmorPerkOrAttributes = () => {
		dispatch(clearSelectedIntrinsicArmorPerkOrAttributeIds());
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
			dispatch(
				setSelectedFragmentsForDestinySubclass({
					destinySubclassId,
					fragments: [],
				})
			);
			dispatch(
				setSelectedGrenade({
					...selectedGrenade,
					[destinySubclassId]: null,
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

	const toggleArmorModsSelectionOpen = () => {
		setModsSelectionOpen(!modsSelectionOpen);
	};

	const toggleRaidModsSelectionOpen = () => {
		setRaidModsSelectionOpen(!raidModsSelectionOpen);
	};

	const toggleIntrinsicArmorPerkOrAttributesSelectionOpen = () => {
		setIntrinsicArmorPerkOrAttributesSelectionOpen(
			!intrinsicArmorPerkOrAttributesSelectionOpen
		);
	};

	const handleTabChange = (index: number) => {
		props.onTabChange(index);
	};

	return (
		<LeftSection className="left-section" position="relative">
			<TabContainer
				tabsWrapperSx={{
					marginLeft: '-8px',
					width: 'calc(100% + 16px)',
				}}
				tabSx={{
					paddingX: '8px',
				}}
				tabIndex={props.tabIndex}
				onChange={handleTabChange}
				tabs={[
					{
						content: (
							<Box
								sx={{
									position: 'relative',
								}}
							>
								<Box sx={{ position: 'absolute', top: 0, right: '8px' }}>
									<DimImportDialog />
								</Box>
								<SelectionControlGroup title="Class and Exotic">
									<ExoticAndDestinyClassSelectorWrapper />
								</SelectionControlGroup>
								<SelectionControlGroup
									title="Desired Stat Tiers"
									clearHandler={clearDesiredStatTiers}
								>
									<StatSelection />
									<AdvancedOptions />
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
									title="Armor Mods"
									clearHandler={clearArmorSlotMods}
									withCollapse={true}
									handleCollapseToggle={toggleArmorModsSelectionOpen}
									open={modsSelectionOpen}
								>
									<Collapse in={modsSelectionOpen} timeout="auto" unmountOnExit>
										<ArmorSlotModSelector />
									</Collapse>
								</SelectionControlGroup>
								<SelectionControlGroup
									title="Raid Mods"
									clearHandler={clearRaidMods}
									withCollapse={true}
									handleCollapseToggle={toggleRaidModsSelectionOpen}
									open={raidModsSelectionOpen}
								>
									<Collapse
										in={raidModsSelectionOpen}
										timeout="auto"
										unmountOnExit
									>
										<RaidModSelector />
									</Collapse>
								</SelectionControlGroup>
								<SelectionControlGroup
									title="Armor Attributes"
									clearHandler={clearIntrinsicArmorPerkOrAttributes}
									withCollapse={true}
									handleCollapseToggle={
										toggleIntrinsicArmorPerkOrAttributesSelectionOpen
									}
									open={intrinsicArmorPerkOrAttributesSelectionOpen}
								>
									<Collapse
										in={intrinsicArmorPerkOrAttributesSelectionOpen}
										timeout="auto"
										unmountOnExit
									>
										<IntrinsicArmorPerkOrAttributeSelector />
									</Collapse>
								</SelectionControlGroup>
								<ShareLoadout />
							</Box>
						),
						index: ETabType.BUILD,
						title: 'Build',
						icon: <ShieldIcon />,
					},
					{
						content: (
							<>
								<LoadoutAnalyzer />
							</>
						),
						index: ETabType.ANALYZE,
						title: 'Analyze',
						icon: <AnalyzeIcon />,
					},
					{
						content: (
							<>
								<Box
									sx={{
										fontWeight: 'bold',
										fontSize: '1.4rem',
										marginLeft: '8px',
										marginBottom: '8px',
									}}
								>
									Build Settings
								</Box>
								<MasterworkAssumptionSelector />
								{/* <MinimumGearTierSelector />  */}
								<DimLoadoutsFilterSelector />
								<InGameLoadoutsFilterSelector />
								<UseZeroWastedStatsToggleSwitch />
								<AlwaysConsiderCollectionsRollsToggleSwitch />
								<UseOnlyMasterworkedArmorToggleSwitch />
								<UseBonusResilienceToggleSwitch />
								<ExcludeLockedItemsToggleSwitch />
								<UseBetaDimLinksToggleSwitch />
								<Divider sx={{ marginTop: '32px' }} />
								<Box
									sx={{
										fontWeight: 'bold',
										fontSize: '1.4rem',
										marginLeft: '8px',
										marginTop: '16px',
									}}
								>
									Analyzer Settings
								</Box>
								<IgnoredLoadoutOptimizationTypesSelector />
								<Divider sx={{ marginTop: '32px' }} />
								<Box sx={{ marginTop: '32px', marginLeft: '8px' }}>
									<Logout />
								</Box>
								<Box sx={{ marginTop: '16px', marginLeft: '8px' }}>
									<ResetButton />
								</Box>
							</>
						),
						index: ETabType.SETTINGS,
						title: 'Settings',
						icon: <SettingsIcon />,
					},
					{
						content: (
							<>
								<PatchNotes />
							</>
						),
						index: ETabType.ABOUT,
						title: 'About',
						icon: <InfoIcon />,
					},
				]}
			/>
			<Link
				sx={{
					zIndex: 1,
					//background: 'red',
					display: 'block',
					position: 'absolute',
					top: '24px',
					right: '40px',
				}}
				className="discord-link"
				href={DISCORD_LINK}
				target="_blank"
			>
				<Box
					sx={{
						transform: 'scale(0.7)',
						width: '40px',
						height: '40px',

						fontWeight: 500,
					}}
				>
					<Image
						src={discord_image}
						alt="me"
						height="25"
						width="35"
						className="objectFit-contain, objectPosition-center"
					/>
					<Box
						sx={{
							marginTop: '8px',
							marginLeft: '-24px',
							display: 'flex',
							gap: '4px',
							alignItems: 'center',
						}}
					>
						<Box>DISCORD</Box>
						<OpenInNewIcon />
					</Box>
				</Box>
			</Link>
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
	resultsViewType: EResultsViewType;
};

const RightSectionComponent = ({
	smallScreenData,
	resultsViewType,
}: RightSectionProps) => (
	<RightSection className="right-section">
		{resultsViewType === EResultsViewType.Build && (
			<ArmorResultsView smallScreenData={smallScreenData} />
		)}
		{resultsViewType === EResultsViewType.Analyze && <AnalyzerResultsView />}
	</RightSection>
);

enum EResultsViewType {
	Build = 'Build',
	Analyze = 'Analyze',
}

export default function HomePage() {
	const [smallScreenResultsOpen, setSmallScreenResultsOpen] =
		React.useState(false);
	const allDataLoaded = useAppSelector(selectAllDataLoaded);
	const tabIndex = useAppSelector(selectTabIndex);
	const processedArmor = useAppSelector(selectProcessedArmor);
	const isSmallScreen = useIsSmallScreen();
	const dispatch = useAppDispatch();

	const [resultsViewType, setResultsViewType] =
		React.useState<EResultsViewType>(EResultsViewType.Build);

	useEffect(() => {
		if (tabIndex === 0) {
			setResultsViewType(EResultsViewType.Build);
		}
		if (tabIndex === 1) {
			setResultsViewType(EResultsViewType.Analyze);
		}
	}, [tabIndex]);

	const smallScreenData: SmallScreenData = {
		isSmallScreen,
		isSmallScreenResultsOpen: smallScreenResultsOpen,
		toggleSmallScreenResultsView: () =>
			setSmallScreenResultsOpen(!smallScreenResultsOpen),
	};

	const handleTabChange = (index: number) => {
		dispatch(setTabIndex(index));
	};

	return (
		<>
			<Head />
			<Container className="application-container">
				{!allDataLoaded && <Loading />}
				{allDataLoaded && (
					<>
						<LoadoutAnalysisWebWorkerWrapper />
						{isSmallScreen && (
							<>
								{smallScreenResultsOpen && (
									<RightSectionComponent
										resultsViewType={resultsViewType}
										smallScreenData={smallScreenData}
									/>
								)}
								{!smallScreenResultsOpen && (
									<LeftSectionComponent
										onTabChange={handleTabChange}
										tabIndex={tabIndex}
									/>
								)}
								{!smallScreenResultsOpen && tabIndex === 0 && (
									<SmallScreenResultsViewToggle
										sx={{
											background:
												processedArmor.items.length === 0 ? 'orange' : '',
										}}
										className="small-screen-results-view-toggle"
										variant="contained"
										onClick={() =>
											setSmallScreenResultsOpen(!smallScreenResultsOpen)
										}
									>
										<Box>
											{processedArmor.items.length > 0
												? `Show Results (${processedArmor.items.length})`
												: 'No Results (Help)'}
										</Box>
									</SmallScreenResultsViewToggle>
								)}
							</>
						)}
						{!isSmallScreen && (
							<>
								<LeftSectionComponent
									onTabChange={handleTabChange}
									tabIndex={tabIndex}
								/>
								<RightSectionComponent
									resultsViewType={resultsViewType}
									smallScreenData={smallScreenData}
								/>
							</>
						)}
					</>
				)}
			</Container>
		</>
	);
}
