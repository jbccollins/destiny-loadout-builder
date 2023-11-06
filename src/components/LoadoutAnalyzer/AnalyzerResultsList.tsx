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
import { selectIgnoredLoadoutOptimizationTypes } from '@dlb/redux/features/ignoredLoadoutOptimizationTypes/ignoredLoadoutOptimizationTypesSlice';
import { selectInGameLoadouts } from '@dlb/redux/features/inGameLoadouts/inGameLoadoutsSlice';
import { selectLoadoutTypeFilter } from '@dlb/redux/features/loadoutTypeFilter/loadoutTypeFilterSlice';
import { selectOptimizationTypeFilter } from '@dlb/redux/features/optimizationTypeFilter/optimizationTypeFilterSlice';
import { selectSelectedAspects } from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { selectSelectedClassAbility } from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedGrenade } from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { selectSelectedJump } from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { selectSelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { selectSelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	ELoadoutType,
	filterOptimizationTypeList,
	LodaoutTypeFilterToLoadoutTypeMapping,
} from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { DestinyClassIdList, getDestinyClass } from '@dlb/types/DestinyClass';
import { Help } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { Box, Collapse, IconButton, SxProps, useTheme } from '@mui/material';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import CustomTextField from '../CustomTextField';
import CustomTooltip from '../CustomTooltip';
import TabContainer, { TabContainerItem } from '../TabContainer';
import LoadoutCriteria from './LoadoutCriteria';
import { LoadoutItem, LoadoutItemProps } from './LoadoutItem';
const iconStyle: SxProps = {
	height: '20px',
	width: '20px',
};

export default function AnalyzerResultsList() {
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
	const ignoredLoadoutOptimizationTypeIdList = useAppSelector(
		selectIgnoredLoadoutOptimizationTypes
	);
	const optimizationTypeFilterValue = useAppSelector(
		selectOptimizationTypeFilter
	);
	const loadoutTypeFilter = useAppSelector(selectLoadoutTypeFilter);
	const { analysisResults, analyzableLoadoutBreakdown, hiddenLoadoutIdList } =
		analyzeableLoadouts;
	const { validLoadouts, invalidLoadouts } = analyzableLoadoutBreakdown;
	const dispatch = useAppDispatch();

	const filteredLoadoutTypes =
		LodaoutTypeFilterToLoadoutTypeMapping[loadoutTypeFilter];

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

					const optimizationTypeList = filterOptimizationTypeList(
						analysisResult?.optimizationTypeList || [],
						ignoredLoadoutOptimizationTypeIdList
					);

					return {
						...value,
						...analysisResult,
						optimizationTypeList,
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
		[validLoadouts, analysisResults, ignoredLoadoutOptimizationTypeIdList]
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

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '8px',
				}}
			></Box>
			<Box
				sx={
					{
						// marginLeft: '-16px',
						// paddingX: '16px',
						// background: 'rgba(50, 50, 50, 0.5)',
						//width: 'calc(100% + 32px)',
					}
				}
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
							paddingX: theme.spacing(1),
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
