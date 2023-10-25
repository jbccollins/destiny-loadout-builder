import d2Logo from '@dlb/public/d2-logo.png';
import dimLogo from '@dlb/public/dim-logo.png';
import { selectAnalyzableLoadouts } from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import {
	selectAnalyzerSearch,
	setAnalyzerSearch,
} from '@dlb/redux/features/analyzerSearch/analyzerSearchSlice';
import {
	selectAnalyzerTabIndex,
	setAnalyzerTabIndex,
} from '@dlb/redux/features/analyzerTabIndex/analyzerTabIndexSlice';
import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { selectDimLoadouts } from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import { selectInGameLoadouts } from '@dlb/redux/features/inGameLoadouts/inGameLoadoutsSlice';
import {
	selectLoadoutTypeFilter,
	setLoadoutTypeFilter,
} from '@dlb/redux/features/loadoutTypeFilter/loadoutTypeFilterSlice';
import {
	selectOptimizationTypeFilter,
	setOptimizationTypeFilter,
} from '@dlb/redux/features/optimizationTypeFilter/optimizationTypeFilterSlice';
import { selectSelectedAspects } from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { selectSelectedClassAbility } from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedGrenade } from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { selectSelectedJump } from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { selectSelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { selectSelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ELoadoutOptimizationTypeId } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	ELoadoutType,
	ELoadoutTypeFilter,
	LodaoutTypeFilterToLoadoutTypeMapping,
} from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { DestinyClassIdList, getDestinyClass } from '@dlb/types/DestinyClass';
import { EnumDictionary } from '@dlb/types/globals';
import { Help } from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckIcon from '@mui/icons-material/Check';
import DiamondIcon from '@mui/icons-material/Diamond';
import FilterIcon from '@mui/icons-material/FilterAlt';
import GppBadIcon from '@mui/icons-material/GppBad';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ReportIcon from '@mui/icons-material/Report';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import RuleIcon from '@mui/icons-material/Rule';

import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import { Box, Collapse, IconButton, SxProps, useTheme } from '@mui/material';
import Image from 'next/image';
import { ReactElement, useMemo, useState } from 'react';
import CustomTextField from '../CustomTextField';
import CustomTooltip from '../CustomTooltip';
import TabContainer, { TabContainerItem } from '../TabContainer';
import Filters from './Filters';
import { Legend } from './Legend';
import LoadoutCriteria from './LoadoutCriteria';
import { LoadoutItem, LoadoutItemProps } from './LoadoutItem';
import Summary from './Summary';
const iconStyle: SxProps = {
	height: '20px',
	width: '20px',
};

export const loadoutOptimizationIconMapping: EnumDictionary<
	ELoadoutOptimizationTypeId,
	ReactElement
> = {
	[ELoadoutOptimizationTypeId.HigherStatTier]: (
		<KeyboardDoubleArrowUpIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.LowerCost]: (
		<AttachMoneyIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.MissingArmor]: (
		<RuleIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.NoExoticArmor]: (
		<DiamondIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.UnavailableMods]: (
		<HourglassEmptyIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.DeprecatedMods]: (
		<WbTwilightIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.StatsOver100]: (
		<RestoreFromTrashIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.UnusedFragmentSlots]: (
		<PlaylistAddIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.UnmetDIMStatConstraints]: (
		<KeyboardDoubleArrowDownIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.UnusableMods]: (
		<HourglassDisabledIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.UnmasterworkedArmor]: (
		<PrivacyTipIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.FewerWastedStats]: (
		<AutoAwesomeIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.UnspecifiedAspect]: (
		<NotListedLocationIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration]: (
		<ReportProblemIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.MutuallyExclusiveMods]: (
		<GppBadIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.UnusedModSlots]: (
		<PostAddIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationTypeId.None]: <CheckIcon key={0} sx={iconStyle} />,
	[ELoadoutOptimizationTypeId.Error]: <ReportIcon key={0} sx={iconStyle} />,
};

export default function LoadoutAnalyzer() {
	const [hiddenLoadoutsOpen, setHiddenLoadoutsOpen] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const theme = useTheme();
	const dimLoadouts = useAppSelector(selectDimLoadouts);
	const inGameLoadouts = useAppSelector(selectInGameLoadouts);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedJump = useAppSelector(selectSelectedJump);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const analyzeableLoadouts = useAppSelector(selectAnalyzableLoadouts);
	const analyzerTabIndex = useAppSelector(selectAnalyzerTabIndex);
	const analyzerSearch = useAppSelector(selectAnalyzerSearch);
	const optimizationTypeFilterValue = useAppSelector(
		selectOptimizationTypeFilter
	);
	const loadoutTypeFilter = useAppSelector(selectLoadoutTypeFilter);
	const {
		isAnalyzing,
		progressCompletionCount,
		analysisResults,
		analyzableLoadoutBreakdown,
		hiddenLoadoutIdList,
	} = analyzeableLoadouts;
	const { validLoadouts, invalidLoadouts } = analyzableLoadoutBreakdown;
	const dispatch = useAppDispatch();

	const filteredLoadoutTypes =
		LodaoutTypeFilterToLoadoutTypeMapping[loadoutTypeFilter];

	const hasActiveFilters = useMemo(
		() =>
			optimizationTypeFilterValue.length > 0 ||
			loadoutTypeFilter !== ELoadoutTypeFilter.All,
		[optimizationTypeFilterValue, loadoutTypeFilter]
	);

	const numTotalLoadouts = useMemo(() => {
		let result = dimLoadouts.length;
		Object.values(inGameLoadouts.loadoutItems).forEach((x) => {
			result += x.loadouts.length;
		});
		return result;
	}, [dimLoadouts, inGameLoadouts]);

	const handleAnalyzerTabChange = (index: number) => {
		dispatch(setAnalyzerTabIndex(index));
	};

	const handleSearchChange = (value: string) => {
		dispatch(setAnalyzerSearch(value));
	};

	const flatAvailableExoticArmor: AvailableExoticArmorItem[] = useMemo(() => {
		let flatAvailableExoticArmor: AvailableExoticArmorItem[] = [];
		DestinyClassIdList.forEach((destinyClassId) => {
			Object.values(availableExoticArmor[destinyClassId]).forEach((x) => {
				flatAvailableExoticArmor = flatAvailableExoticArmor.concat(x);
			});
		});

		return flatAvailableExoticArmor;
	}, [availableExoticArmor]);

	const numValidLoadouts = useMemo(
		() => Object.entries(validLoadouts).length,
		[validLoadouts]
	);

	const richValidLoadouts = useMemo(
		() =>
			Object.entries(validLoadouts)
				.map(([key, value]) => {
					const analysisResult = analysisResults[key];
					return {
						...value,
						...analysisResult,
					};
				})
				.sort((a, b) => {
					// Sort by three factors
					// D2 loadouts always before DIM
					// D2 loadouts are sorted by index
					// DIM loadouts are sorted by name
					if (a.loadoutType === ELoadoutType.InGame) {
						if (b.loadoutType === ELoadoutType.InGame) {
							return a.index - b.index;
						} else {
							return -1;
						}
					} else {
						if (b.loadoutType === ELoadoutType.InGame) {
							return 1;
						} else {
							return a.name.localeCompare(b.name);
						}
					}
				}),
		[validLoadouts, analysisResults]
	);

	if (numTotalLoadouts === 0) {
		return (
			<Box>
				You do not have any loadouts. In order to use this feature you must have
				at least one loadout either in DIM or in-game.
			</Box>
		);
	}
	if (numValidLoadouts === 0) {
		return (
			<>
				<Box>
					None of your loadouts are able to be analyzed. In order in order for a
					loadout to be analyzed it must meet the following criteria:
					<LoadoutCriteria />
				</Box>
			</>
		);
	}

	const analysisProgressValue =
		(progressCompletionCount / numValidLoadouts) * 100;
	const getTabs = (): TabContainerItem[] => {
		const tabs: TabContainerItem[] = [];
		const defaultLoadoutItemProps: LoadoutItemProps = {
			selectedExoticArmor,
			flatAvailableExoticArmor,
			selectedDestinySubclass,
			selectedSuperAbility,
			selectedAspects,
			selectedGrenade,
			selectedMelee,
			selectedClassAbility,
			selectedJump,
			analyzeableLoadouts,
			loadout: null,
			isHidden: false,
		};
		DestinyClassIdList.forEach((destinyClassId, index) => {
			if (!destinyClassId) {
				return;
			}
			const classSpecificRichValidLoadouts = richValidLoadouts.filter(
				(x) =>
					x.name.toLowerCase().includes(analyzerSearch.toLowerCase()) &&
					filteredLoadoutTypes.includes(x.loadoutType) &&
					x.destinyClassId === destinyClassId &&
					(optimizationTypeFilterValue.length > 0
						? x.optimizationTypeList.some((y) =>
								optimizationTypeFilterValue.includes(y)
						  )
						: true)
			);
			const visibleClassSpecificRichValidLoadouts =
				classSpecificRichValidLoadouts.filter(
					(x) => !hiddenLoadoutIdList.includes(x.id)
				);
			const hiddenClassSpecificRichValidLoadouts =
				classSpecificRichValidLoadouts.filter((x) =>
					hiddenLoadoutIdList.includes(x.id)
				);
			const destinyClass = getDestinyClass(destinyClassId);
			tabs.push({
				index,
				title: destinyClass.name,
				icon: destinyClass.icon,
				content: (
					<Box>
						{visibleClassSpecificRichValidLoadouts.length === 0 && (
							<Box
								sx={{
									padding: theme.spacing(2),
									borderRadius: '4px',
									backgroundColor: 'black',
									border: '1px solid rgb(43, 43, 43)',
								}}
							>
								No loadouts found. Try removing a filter, or clearing your
								search.
							</Box>
						)}
						{visibleClassSpecificRichValidLoadouts.map((loadout, index) => (
							<Box
								key={loadout.id}
								sx={{
									'&:first-of-type': {
										marginTop: '-16px',
									},
								}}
							>
								<LoadoutItem
									{...defaultLoadoutItemProps}
									loadout={loadout}
									isHidden={false}
								/>
							</Box>
						))}
						{hiddenClassSpecificRichValidLoadouts.length > 0 && (
							<>
								<Box
									onClick={() => setHiddenLoadoutsOpen(!hiddenLoadoutsOpen)}
									sx={{
										cursor: 'pointer',
										marginBottom: '8px',
										fontSize: '14px',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<Box>Hidden Loadouts</Box>
									<IconButton
										aria-label="expand row"
										size="small"
										sx={{ transform: 'scale(0.8)' }}
									>
										{hiddenLoadoutsOpen ? (
											<KeyboardArrowUpIcon />
										) : (
											<KeyboardArrowDownIcon />
										)}
									</IconButton>
								</Box>
								<Collapse in={hiddenLoadoutsOpen} timeout="auto" unmountOnExit>
									{hiddenClassSpecificRichValidLoadouts.map(
										(loadout, index) => (
											<LoadoutItem
												{...defaultLoadoutItemProps}
												key={loadout.id}
												loadout={loadout}
												isHidden={true}
											/>
										)
									)}
								</Collapse>
							</>
						)}
					</Box>
				),
			});
		});

		return tabs;
	};

	const clearFilters = () => {
		dispatch(setOptimizationTypeFilter([]));
		dispatch(setLoadoutTypeFilter(ELoadoutTypeFilter.All));
	};

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '8px',
				}}
			>
				<Box
					sx={{
						fontWeight: 'bold',
						fontSize: '1.5rem',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						marginBottom: theme.spacing(2),
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
						}}
					>
						<Box>Loadouts</Box>
						<Box sx={{ height: '24px' }}>
							<CustomTooltip title="The Loadout Analyzer tool checks all of your DIM and D2 Loadouts to see if there are any optimizations that can be made and if there are any issues with your loadouts. Take a look at the legend to see all of the possible optimizations and issues that this tool checks for.">
								<Help />
							</CustomTooltip>
						</Box>
					</Box>
					<Box
						sx={{
							marginLeft: 'auto',
							// marginTop: '-4px',
							display: 'flex',
							alignItems: 'center',
							gabp: '4px',
						}}
					>
						<Legend />
						<Box sx={{ position: 'relative' }}>
							<CustomTooltip
								title={`${showFilters ? 'Hide' : 'Show'} filters`}
								hideOnMobile
							>
								<IconButton
									onClick={() => setShowFilters(!showFilters)}
									size="small"
									sx={{
										zIndex: 1,
										width: '34px',
										height: '34px',
										background: showFilters ? 'rgb(50, 50, 50)' : '',
										color: hasActiveFilters ? '#b36200' : '',
										'&:hover': {
											background: 'rgb(90, 90, 90)',
										},
									}}
								>
									<FilterIcon />
								</IconButton>
							</CustomTooltip>
							{/* arrow */}
							{showFilters && (
								<Box
									sx={{
										width: '34px',
										height: '80px',
										// borderLeft: '17px solid transparent',
										// borderRight: '17px solid transparent',
										// borderTop: '80px solid rgb(50, 50, 50)',
										// borderTop: '80px solid red',
										position: 'absolute',
										top: 0,
										right: 0,
										marginTop: '20px',
										zIndex: 0,
										background: 'rgb(50, 50, 50)',
									}}
								/>
							)}
						</Box>
					</Box>
				</Box>

				<Collapse in={showFilters} timeout="auto" unmountOnExit>
					<Box sx={{ marginBottom: theme.spacing(2) }}>
						<Filters />
					</Box>
				</Collapse>

				<Summary
					isAnalyzing={isAnalyzing}
					analysisProgressValue={analysisProgressValue}
					loadouts={richValidLoadouts}
					hiddenLoadoutIdList={hiddenLoadoutIdList}
				/>
				{hasActiveFilters && (
					<Box
						sx={{
							height: '30px',
							display: 'flex',
							alignItems: 'center',
							gap: '4px',
							background: '#b36200',
							marginLeft: '-16px',
							width: 'calc(100% + 32px)',
							paddingX: '8px',
						}}
					>
						<Box>Filters may limit results</Box>
						<Box
							sx={{
								marginLeft: 'auto',
								textDecoration: 'underline',
								textUnderlineOffset: '2px',
								cursor: 'pointer',
							}}
							onClick={clearFilters}
						>
							Clear Filters
						</Box>
					</Box>
				)}
			</Box>

			{/* {!isAnalyzed && !isAnalyzing && (
				<>
					<p>
						Click the button below to analyze your loadouts. Analysis may take a
						few minutes.
					</p>
				</>
			)} */}
			{/* {!isAnalyzing && (
				<Button variant="contained" onClick={analyzeLoadouts}>
					{isAnalyzed ? 'Re-Run Analysis' : 'Analyze'}
				</Button>
			)} */}

			<Box
				sx={{
					marginLeft: '-16px',
					// paddingX: '16px',
					background: 'rgba(50, 50, 50, 0.5)',
					width: 'calc(100% + 32px)',
				}}
			>
				<Box
					sx={{
						//marginLeft: '-16px',
						// width: 'calc(100% + 31px)',
						width: '100%',
					}}
				>
					<CustomTextField
						textFieldProps={{
							fullWidth: true,
							variant: 'outlined',
							size: 'small',
							placeholder: 'Search',
							InputProps: {
								sx: {
									borderRadius: '0px',
								},
							},
						}}
						value={analyzerSearch}
						onChange={handleSearchChange}
						label=""
					/>
				</Box>
				<Box
					sx={{
						marginBottom: theme.spacing(2),
						paddingBottom: theme.spacing(1),
					}}
				>
					<TabContainer
						tabIndex={analyzerTabIndex}
						onChange={handleAnalyzerTabChange}
						tabs={getTabs()}
						tabSx={{
							'&:first-of-type': { marginLeft: '8px' },
						}}
					/>
				</Box>
				{numTotalLoadouts > numValidLoadouts && (
					<Box
						sx={{
							marginTop: theme.spacing(1),
							marginBottom: theme.spacing(1),
						}}
					>
						<Box
							sx={{
								fontWeight: 'bold',
								fontSize: '1.5rem',
								marginBottom: theme.spacing(1),
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
							}}
						>
							<Box>Unanalyzed Loadouts</Box>
							<CustomTooltip
								title={
									<Box>
										<Box>
											In order to be analyzed a loadout must meet the following
											criteria:
										</Box>
										<LoadoutCriteria />
									</Box>
								}
							>
								<Help />
							</CustomTooltip>
						</Box>
						{numTotalLoadouts - numValidLoadouts} of your loadouts were not
						analyzed because they did not meet the criteria for analysis.
					</Box>
				)}
				{Object.values(invalidLoadouts).map((value) => {
					return (
						<Box
							sx={{
								padding: theme.spacing(1),
								marginBottom: theme.spacing(1),
								'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
							}}
							key={value.id}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<Box
									sx={{
										height: '20px',
										width: '20px',
										minWidth: '20px',
										minHeight: '20px',
									}}
								>
									<Image
										src={
											value.loadoutType === ELoadoutType.DIM ? dimLogo : d2Logo
										}
										alt="Loadout Logo"
										height="20px"
										width="20px"
									/>
								</Box>
								<Box>{value.name}</Box>
							</Box>
						</Box>
					);
				})}
			</Box>
		</>
	);
}
