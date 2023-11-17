"use client";

import { selectAnalyzableLoadouts } from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import { selectIgnoredLoadoutOptimizationTypes } from '@dlb/redux/features/ignoredLoadoutOptimizationTypes/ignoredLoadoutOptimizationTypesSlice';
import {
	selectLoadoutTypeFilter,
	setLoadoutTypeFilter,
} from '@dlb/redux/features/loadoutTypeFilter/loadoutTypeFilterSlice';
import {
	selectOptimizationTypeFilter,
	setOptimizationTypeFilter,
} from '@dlb/redux/features/optimizationTypeFilter/optimizationTypeFilterSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ELoadoutOptimizationTypeId } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import { ELoadoutTypeFilter } from '@dlb/types/AnalyzableLoadout';
import { EnumDictionary } from '@dlb/types/globals';
import { Help } from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckIcon from '@mui/icons-material/Check';
import DiamondIcon from '@mui/icons-material/Diamond';
import FilterIcon from '@mui/icons-material/FilterAlt';
import GppBadIcon from '@mui/icons-material/GppBad';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import ReportIcon from '@mui/icons-material/Report';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import RuleIcon from '@mui/icons-material/Rule';
import ScheduleIcon from '@mui/icons-material/Schedule';

import CustomTooltip from '@dlb/components/CustomTooltip';
import useIsSmallScreen from '@dlb/hooks/useIsSmallScreen';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import { Box, Collapse, IconButton, SxProps, useTheme } from '@mui/material';
import { ReactElement, useMemo, useState } from 'react';
import AnalyzerResultsList from './AnalyzerResultsList';
import Filters from './Filters';
import { Legend } from './Legend';
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
	[ELoadoutOptimizationTypeId.UnusableMods]: (
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
	[ELoadoutOptimizationTypeId.Doomed]: <ScheduleIcon key={0} sx={iconStyle} />,
	[ELoadoutOptimizationTypeId.ManuallyCorrectableDoomed]: (
		<MoreTimeIcon key={0} sx={iconStyle} />
	),
};

export default function LoadoutAnalyzer() {
	const [showFilters, setShowFilters] = useState(false);
	const theme = useTheme();
	const analyzableLoadouts = useAppSelector(selectAnalyzableLoadouts);
	const ignoredLoadoutOptimizationTypeIdList = useAppSelector(
		selectIgnoredLoadoutOptimizationTypes
	);
	const optimizationTypeFilterValue = useAppSelector(
		selectOptimizationTypeFilter
	);
	const loadoutTypeFilter = useAppSelector(selectLoadoutTypeFilter);
	const {
		isAnalyzing,
		progressCompletionCount,
		analyzableLoadoutBreakdown,
		hiddenLoadoutIdList,
	} = analyzableLoadouts;
	const { validLoadouts } = analyzableLoadoutBreakdown;
	const dispatch = useAppDispatch();

	const hasActiveFilters = useMemo(
		() =>
			optimizationTypeFilterValue.length > 0 ||
			loadoutTypeFilter !== ELoadoutTypeFilter.All,
		[optimizationTypeFilterValue, loadoutTypeFilter]
	);

	const numValidLoadouts = useMemo(
		() => Object.entries(validLoadouts).length,
		[validLoadouts]
	);

	const analysisProgressValue =
		(progressCompletionCount / numValidLoadouts) * 100;

	const clearFilters = () => {
		dispatch(setOptimizationTypeFilter([]));
		dispatch(setLoadoutTypeFilter(ELoadoutTypeFilter.All));
	};

	const isSmallScreen = useIsSmallScreen();

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
					hiddenLoadoutIdList={hiddenLoadoutIdList}
					ignoredLoadoutOptimizationTypeIdList={
						ignoredLoadoutOptimizationTypeIdList
					}
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
			{isSmallScreen && (
				<Box
					sx={{
						marginTop: '32px',
						marginLeft: '-16px',
						// paddingX: '16px',
						background: 'rgba(50, 50, 50, 0.5)',
						width: 'calc(100% + 32px)',
					}}
				>
					<AnalyzerResultsList />
				</Box>
			)}
		</>
	);
}
