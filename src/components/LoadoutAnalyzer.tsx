import d2Logo from '@dlb/public/d2-logo.png';
import dimLogo from '@dlb/public/dim-logo.png';
import { selectAllClassItemMetadata } from '@dlb/redux/features/allClassItemMetadata/allClassItemMetadataSlice';
import {
	addAnalysisResult,
	AnalyzableLoadoutsValueState,
	clearProgressCanBeOptimizedCount,
	clearProgressCompletionCount,
	clearProgressErroredCount,
	incrementProgressCanBeOptimizedCount,
	incrementProgressCompletionCount,
	incrementProgressErroredCount,
	selectAnalyzableLoadouts,
	setHiddenLoadoutIdList,
	setIsAnalyzed,
	setIsAnalyzing,
} from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import {
	selectAnalyzerTabIndex,
	setAnalyzerTabIndex,
} from '@dlb/redux/features/analyzerTabIndex/analyzerTabIndexSlice';
import { selectArmor } from '@dlb/redux/features/armor/armorSlice';
import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import {
	clearDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectDimLoadouts } from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import {
	selectOptimizationTypeFilter,
	setOptimizationTypeFilter,
} from '@dlb/redux/features/optimizationTypeFilter/optimizationTypeFilterSlice';
import { setPerformingBatchUpdate } from '@dlb/redux/features/performingBatchUpdate/performingBatchUpdateSlice';
import { clearReservedArmorSlotEnergy } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	clearArmorSlotMods,
	setSelectedArmorSlotMods,
} from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import {
	clearSelectedAspects,
	SelectedAspects,
	selectSelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	clearSelectedClassAbility,
	SelectedClassAbility,
	selectSelectedClassAbility,
	setSelectedClassAbility,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { setSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import {
	clearSelectedDestinySubclass,
	selectSelectedDestinySubclass,
	setSelectedDestinySubclass,
} from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor,
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import {
	clearSelectedFragments,
	setSelectedFragments,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import {
	clearSelectedGrenade,
	SelectedGrenade,
	selectSelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { clearSelectedIntrinsicArmorPerkOrAttributeIds } from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import {
	clearSelectedJump,
	SelectedJump,
	selectSelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { selectSelectedMasterworkAssumption } from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import {
	clearSelectedMelee,
	SelectedMelee,
	selectSelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import {
	clearSelectedRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	clearSelectedSuperAbility,
	SelectedSuperAbility,
	selectSelectedSuperAbility,
	setSelectedSuperAbility,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { setTabIndex } from '@dlb/redux/features/tabIndex/tabIndexSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	EGetLoadoutsThatCanBeOptimizedProgresstype,
	ELoadoutOptimizationType,
	EMessageType,
	getLoadoutOptimization,
	GetLoadoutsThatCanBeOptimizedProgress,
	GetLoadoutsThatCanBeOptimizedWorker,
	Message,
	OrderedLoadoutOptimizationTypeList,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	AnalyzableLoadout,
	AnalyzableLoadoutMapping,
	ELoadoutType,
} from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { DestinyClassIdList, getDestinyClass } from '@dlb/types/DestinyClass';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { EnumDictionary } from '@dlb/types/globals';
import { EDestinyClassId, EDestinySubclassId } from '@dlb/types/IdEnums';
import { isDebugging } from '@dlb/utils/debugging';
import { Help } from '@mui/icons-material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckIcon from '@mui/icons-material/Check';
import DiamondIcon from '@mui/icons-material/Diamond';
import EditIcon from '@mui/icons-material/Edit';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import RuleIcon from '@mui/icons-material/Rule';
import ShowIcon from '@mui/icons-material/Visibility';
import HideIcon from '@mui/icons-material/VisibilityOff';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import {
	Box,
	Button,
	CircularProgress,
	Collapse,
	IconButton,
	LinearProgress,
	SxProps,
	useTheme,
} from '@mui/material';
import Image from 'next/image';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import CustomTooltip from './CustomTooltip';
import IconMultiSelectDropdown, { IOption } from './IconMultiSelectDropdown';
import TabContainer, { TabContainerItem } from './TabContainer';
export type LoadoutAnalyzerProps = {
	isHidden?: boolean;
};

const iconStyle: SxProps = {
	height: '20px',
	width: '20px',
};

const loadoutOptimizationIconMapping: EnumDictionary<
	ELoadoutOptimizationType,
	ReactElement
> = {
	[ELoadoutOptimizationType.HigherStatTier]: (
		<KeyboardDoubleArrowUpIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationType.LowerCost]: (
		<AttachMoneyIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationType.MissingArmor]: <RuleIcon key={0} sx={iconStyle} />,
	[ELoadoutOptimizationType.NoExoticArmor]: (
		<DiamondIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationType.UnavailableMods]: (
		<HourglassEmptyIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationType.DeprecatedMods]: (
		<WbTwilightIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationType.StatsOver100]: (
		<RestoreFromTrashIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationType.UnusedFragmentSlots]: (
		<PlaylistAddIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationType.UnmetDIMStatConstraints]: (
		<KeyboardDoubleArrowDownIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationType.UncorrectableMods]: (
		<HourglassDisabledIcon key={0} sx={iconStyle} />
	),
	[ELoadoutOptimizationType.None]: <CheckIcon key={0} sx={iconStyle} />,
};

const Legend = () => {
	const [legendOpen, setLegendOpen] = useState(false);
	return (
		<>
			<Box
				onClick={() => setLegendOpen(!legendOpen)}
				sx={{
					cursor: 'pointer',
					marginBottom: '8px',
					fontSize: '14px',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Box>Legend</Box>
				<IconButton
					aria-label="expand row"
					size="small"
					sx={{ transform: 'scale(0.8)' }}
				>
					{legendOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</Box>
			<Collapse in={legendOpen} timeout="auto" unmountOnExit>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '16px',
					}}
				>
					{OrderedLoadoutOptimizationTypeList.map((key) => {
						const { iconColor, name, description } =
							getLoadoutOptimization(key);
						return (
							<Box
								key={key}
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: '8px',
									padding: '8px',
									'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
								}}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
									}}
								>
									<IconPill key={key} color={iconColor} tooltipText={name}>
										{loadoutOptimizationIconMapping[key]}
									</IconPill>
									<Box>{name}</Box>
								</Box>
								<Box>{description}</Box>
							</Box>
						);
					})}
				</Box>
			</Collapse>
		</>
	);
};

function IconPill({
	children,
	color,

	tooltipText,
}: {
	children: ReactElement;
	color: string;
	tooltipText: string;
}) {
	const theme = useTheme();
	return (
		<CustomTooltip title={tooltipText}>
			<Box
				sx={{
					color: 'red',
					background: '#585858',
					display: 'inline-flex',
					padding: theme.spacing(0.5),
					borderRadius: '16px',
					paddingTop: '10px',
					height: '32px',
					width: '32px',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
				}}
			>
				<Box sx={{ color: color || 'white' }}>{children}</Box>
			</Box>
		</CustomTooltip>
	);
}

const getOptionValue = (
	optimizationType: ELoadoutOptimizationType
): IOption => {
	const { iconColor, name, description } =
		getLoadoutOptimization(optimizationType);
	const icon = (
		<IconPill color={iconColor} tooltipText={name}>
			{loadoutOptimizationIconMapping[optimizationType]}
		</IconPill>
	);
	return {
		name: name,
		id: optimizationType,
		icon: icon,
		description: description,
	};
};

function OptimizationTypeFilter() {
	const dispatch = useAppDispatch();
	const optimizationTypeFilterValue = useAppSelector(
		selectOptimizationTypeFilter
	);
	const handleChange = (value: ELoadoutOptimizationType[]) => {
		dispatch(setOptimizationTypeFilter(value));
	};
	// TODO: Disable options in this filter when there are no loadouts that can be optimized for that optimization type
	return (
		<IconMultiSelectDropdown
			getOptionValue={getOptionValue}
			getOptionStat={() => null}
			options={OrderedLoadoutOptimizationTypeList}
			value={optimizationTypeFilterValue}
			onChange={handleChange}
			title={'Filter By'}
			id={'optimization-type-filter'}
		/>
	);
}

const noneOptimizationType = getLoadoutOptimization(
	ELoadoutOptimizationType.None
);

type LoadoutItemProps = {
	loadout: AnalyzableLoadout;
	isHidden: boolean;
	selectedExoticArmor: Record<EDestinyClassId, AvailableExoticArmorItem>;
	flatAvailableExoticArmor: AvailableExoticArmorItem[];
	selectedDestinySubclass: Record<EDestinyClassId, EDestinySubclassId>;
	selectedSuperAbility: SelectedSuperAbility;
	selectedAspects: SelectedAspects;
	selectedGrenade: SelectedGrenade;
	selectedMelee: SelectedMelee;
	selectedClassAbility: SelectedClassAbility;
	selectedJump: SelectedJump;
	analyzeableLoadouts: AnalyzableLoadoutsValueState;
};
const LoadoutItem = (props: LoadoutItemProps) => {
	const {
		loadout,
		isHidden,
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
	} = props;
	const { analysisResults, hiddenLoadoutIdList } = analyzeableLoadouts;
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const clearApplicationState = () => {
		dispatch(clearDesiredArmorStats());
		dispatch(clearArmorSlotMods());
		dispatch(clearSelectedRaidMods());
		dispatch(clearSelectedIntrinsicArmorPerkOrAttributeIds());
		dispatch(clearReservedArmorSlotEnergy());
		dispatch(clearSelectedDestinySubclass());
		dispatch(clearSelectedSuperAbility());
		dispatch(clearSelectedAspects());
		dispatch(clearSelectedFragments());
		dispatch(clearSelectedGrenade());
		dispatch(clearSelectedMelee());
		dispatch(clearSelectedClassAbility());
		dispatch(clearSelectedJump());
		dispatch(setTabIndex(0));
	};
	const setApplicationState = (loadout: AnalyzableLoadout) => {
		if (!loadout) {
			throw new Error('wtf');
		}
		dispatch(setPerformingBatchUpdate(true));
		clearApplicationState();
		const {
			exoticHash,
			destinyClassId,
			destinySubclassId,
			aspectIdList,
			fragmentIdList,
			superAbilityId,
			classAbilityId,
			jumpId,
			grenadeId,
			meleeId,
			desiredStatTiers,
			armorSlotMods,
			raidMods,
		} = loadout;

		const newSelectedExoticArmor = { ...selectedExoticArmor };
		if (exoticHash) {
			newSelectedExoticArmor[destinyClassId] = flatAvailableExoticArmor.find(
				(x) => x.hash === exoticHash
			);
			dispatch(setSelectedExoticArmor(newSelectedExoticArmor));
		}
		dispatch(setSelectedDestinyClass(destinyClassId));
		dispatch(setDesiredArmorStats(desiredStatTiers));
		dispatch(setSelectedArmorSlotMods(armorSlotMods));
		dispatch(setSelectedRaidMods(raidMods));

		if (destinySubclassId) {
			dispatch(
				setSelectedDestinySubclass({
					...selectedDestinySubclass,
					[destinyClassId]: destinySubclassId,
				})
			);
			if (superAbilityId) {
				dispatch(
					setSelectedSuperAbility({
						...selectedSuperAbility,
						[destinySubclassId]: superAbilityId,
					})
				);
			}
			if (aspectIdList.length > 0) {
				dispatch(
					setSelectedAspects({
						...selectedAspects,
						[destinySubclassId]: [0, 1].map((i) => aspectIdList[i] || null),
					})
				);
			}
			const { elementId } = getDestinySubclass(destinySubclassId);
			if (fragmentIdList.length > 0) {
				dispatch(
					setSelectedFragments({ elementId, fragments: fragmentIdList })
				);
			}
			if (grenadeId) {
				dispatch(
					setSelectedGrenade({
						...selectedGrenade,
						[elementId]: grenadeId,
					})
				);
			}
			if (meleeId) {
				dispatch(
					setSelectedMelee({
						...selectedMelee,
						[destinySubclassId]: meleeId,
					})
				);
			}
			if (classAbilityId) {
				dispatch(
					setSelectedClassAbility({
						...selectedClassAbility,
						[destinySubclassId]: classAbilityId,
					})
				);
			}
			if (jumpId) {
				dispatch(
					setSelectedJump({
						...selectedJump,
						[destinySubclassId]: jumpId,
					})
				);
			}
		}
		dispatch(setTabIndex(0));
		dispatch(setPerformingBatchUpdate(false));
	};

	const hideAnalyzableLoadout = (loadoutId: string) => {
		dispatch(
			setHiddenLoadoutIdList({
				loadoutIdList: [...hiddenLoadoutIdList, loadoutId],
				validate: true,
			})
		);
	};

	const unHideAnalyzableLoadout = (loadoutId: string) => {
		dispatch(
			setHiddenLoadoutIdList({
				loadoutIdList: hiddenLoadoutIdList.filter((x) => x !== loadoutId),
				validate: true,
			})
		);
	};
	return (
		<Box
			sx={{
				padding: theme.spacing(1),
				marginBottom: theme.spacing(1),
				'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
				<CustomTooltip title="This is a DIM loadout">
					<Box
						sx={{
							height: '20px',
							width: '20px',
							minWidth: '20px',
							minHeight: '20px',
						}}
					>
						<Image
							src={loadout.loadoutType === ELoadoutType.DIM ? dimLogo : d2Logo}
							alt="Loadout Logo"
							height="20px"
							width="20px"
						/>
					</Box>
				</CustomTooltip>
				<CustomTooltip title="Edit this loadout">
					<IconButton onClick={() => setApplicationState(loadout)} size="small">
						<EditIcon />
					</IconButton>
				</CustomTooltip>
				{!isHidden && (
					<CustomTooltip title="Hide this loadout from the list of loadouts that can be optimized.">
						<IconButton
							onClick={() => hideAnalyzableLoadout(loadout.id)}
							size="small"
							sx={{ marginRight: theme.spacing(0.5) }}
						>
							<HideIcon />
						</IconButton>
					</CustomTooltip>
				)}
				{isHidden && (
					<CustomTooltip title="Show this loadout in the list of loadouts that can be optimized.">
						<IconButton
							onClick={() => unHideAnalyzableLoadout(loadout.id)}
							size="small"
							sx={{ marginRight: theme.spacing(0.5) }}
						>
							<ShowIcon />
						</IconButton>
					</CustomTooltip>
				)}
			</Box>
			<Box>{loadout.name}</Box>
			<Box
				sx={{
					marginTop: '8px',
					display: 'flex',
					gap: '4px',
					alignItems: 'center',
				}}
			>
				{/* This loadout has been analyzed and has optimizations */}
				{!!analysisResults[loadout.id]?.optimizationTypeList &&
					loadout.optimizationTypeList?.length > 0 && (
						<>
							{loadout.optimizationTypeList?.map((x, i) => {
								const { iconColor, name } = getLoadoutOptimization(x);
								return (
									<IconPill key={x} color={iconColor} tooltipText={name}>
										{loadoutOptimizationIconMapping[x]}
									</IconPill>
								);
							})}
						</>
					)}
				{/* This loadout has been analyzed and has NO optimizations */}
				{!!analysisResults[loadout.id]?.optimizationTypeList &&
					loadout.optimizationTypeList?.length === 0 && (
						<IconPill
							color={noneOptimizationType.iconColor}
							tooltipText={noneOptimizationType.name}
						>
							{loadoutOptimizationIconMapping[noneOptimizationType.id]}
						</IconPill>
					)}
				{/* This loadout has not been analyzed yet */}
				{!analysisResults[loadout.id]?.optimizationTypeList && (
					<>
						<Box
							sx={{
								height: '32px !important',
								width: '32px !important',
							}}
						>
							<CircularProgress
								sx={{
									height: '32px !important',
									width: '32px !important',
								}}
							/>
						</Box>
						<Box sx={{ marginLeft: '8px' }}>Checking for optimizations...</Box>
					</>
				)}
			</Box>
		</Box>
	);
};

export default function LoadoutAnalyzer(props: LoadoutAnalyzerProps) {
	const { isHidden } = props;
	const [hiddenLoadoutsOpen, setHiddenLoadoutsOpen] = useState(false);
	const theme = useTheme();
	const [fatalError, setFatalError] = useState(true);
	const dimLoadouts = useAppSelector(selectDimLoadouts);
	const armor = useAppSelector(selectArmor);
	const allClassItemMetadata = useAppSelector(selectAllClassItemMetadata);
	const masterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
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
	const optimizationTypeFilterValue = useAppSelector(
		selectOptimizationTypeFilter
	);
	const {
		isAnalyzed,
		isAnalyzing,
		progressCompletionCount,
		analysisResults,
		analyzableLoadoutBreakdown,
		hiddenLoadoutIdList,
	} = analyzeableLoadouts;
	const { validLoadouts, invalidLoadouts } = analyzableLoadoutBreakdown;
	const dispatch = useAppDispatch();

	const getLoadoutsThatCanBeOptimizedWorker: GetLoadoutsThatCanBeOptimizedWorker =
		useMemo(
			() =>
				new Worker(
					new URL(
						'@dlb/services/loadoutAnalyzer/getLoadoutsThatCanBeOptimizedWorker.ts',
						import.meta.url
					)
				),
			[]
		);

	const handleAnalyzerTabChange = (index: number) => {
		dispatch(setAnalyzerTabIndex(index));
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

	const numValidDimLoadouts = useMemo(
		() => Object.entries(validLoadouts).length,
		[validLoadouts]
	);

	const richValidLoadouts = useMemo(
		() =>
			Object.entries(validLoadouts).map(([key, value]) => {
				const analysisResult = analysisResults[key];
				return {
					...value,
					...analysisResult,
				};
			}),
		[validLoadouts, analysisResults]
	);

	const analyzeLoadouts = () => {
		dispatch(clearProgressCompletionCount());
		dispatch(clearProgressCanBeOptimizedCount());
		dispatch(clearProgressErroredCount());

		dispatch(setIsAnalyzed(false));
		dispatch(setIsAnalyzing(true));
		// TODO: This is just for testing. Remove this.
		const debugging = isDebugging();
		const _validLoadouts = debugging
			? Object.keys(validLoadouts)
					.slice(0, 10)
					.reduce((obj, key) => {
						obj[key] = validLoadouts[key];
						return obj;
					}, {} as AnalyzableLoadoutMapping)
			: validLoadouts;

		getLoadoutsThatCanBeOptimizedWorker.postMessage({
			loadouts: _validLoadouts,
			armor,
			masterworkAssumption,
			allClassItemMetadata,
			availableExoticArmor,
		});
	};

	useEffect(() => {
		if (window.Worker) {
			getLoadoutsThatCanBeOptimizedWorker.onmessage = (
				e: MessageEvent<Message>
			) => {
				switch (e.data.type) {
					case EMessageType.Progress:
						dispatch(incrementProgressCompletionCount());
						const payload = e.data
							.payload as GetLoadoutsThatCanBeOptimizedProgress;
						console.log('progress', e.data.payload);
						if (payload.canBeOptimized) {
							dispatch(incrementProgressCanBeOptimizedCount());
						}
						dispatch(
							addAnalysisResult({
								loadoutId: payload.loadoutId,
								optimizationTypeList: payload.optimizationTypeList,
							})
						);
						if (
							payload.type === EGetLoadoutsThatCanBeOptimizedProgresstype.Error
						) {
							dispatch(incrementProgressErroredCount());
						}
						break;
					case EMessageType.Results:
						console.log('results', e.data);
						dispatch(setIsAnalyzing(false));
						dispatch(setIsAnalyzed(true));
						break;
					case EMessageType.Error:
						dispatch(setIsAnalyzing(false));
						dispatch(setIsAnalyzed(false));
						dispatch(clearProgressCompletionCount());
						dispatch(clearProgressCanBeOptimizedCount());
						dispatch(clearProgressErroredCount());
						console.error('error', e.data);
						setFatalError(true);
						break;
					default:
						break;
				}
			};
			if (!isAnalyzed && !isAnalyzing) {
				analyzeLoadouts();
			}
		}
	}, []);

	if (isHidden) {
		return <></>;
	}

	if (dimLoadouts.length === 0) {
		return (
			<Box>
				You do not have any DIM loadouts. In order to use this feature you must
				have at least one DIM loadout.
			</Box>
		);
	}
	if (numValidDimLoadouts === 0) {
		return (
			<>
				<Box>
					None of your DIM loadouts are able to be analyzed. In order in order
					for a loadout to be analyzed it must meet the following criteria:
					<ul>
						<li>It must include an exotic armor piece</li>
						<li>
							It must have all five armor slots populated. If you delete a piece
							of armor that was in a loadout, then this critera will not be met
						</li>
					</ul>
				</Box>
			</>
		);
	}

	const value = (progressCompletionCount / numValidDimLoadouts) * 100;
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
								{optimizationTypeFilterValue.length > 0
									? 'No loadouts found, try removing a filter.'
									: 'No loadouts found.'}
							</Box>
						)}
						{visibleClassSpecificRichValidLoadouts.map((loadout, index) => (
							<LoadoutItem
								{...defaultLoadoutItemProps}
								key={loadout.id}
								loadout={loadout}
								isHidden={false}
							/>
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

	const clearHandler = () => {
		dispatch(setOptimizationTypeFilter([]));
	};

	return (
		<>
			<Box
				sx={{
					fontWeight: 'bold',
					fontSize: '1.5rem',
					marginBottom: theme.spacing(2),
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
				}}
			>
				<Box>Loadouts</Box>

				<CustomTooltip title="The Loadout Analyzer tool checks all of your DIM and In-Game Loadouts to see if there are any optimizations that can be made and if there are any issues with your loadouts. Take a look at the legend to see all of the possible optimizations and issues that this tool checks for.">
					<Help />
				</CustomTooltip>
				{optimizationTypeFilterValue.length > 0 && (
					<Button
						size="small"
						variant="outlined"
						onClick={clearHandler}
						sx={{ height: '30px', marginLeft: 'auto' }}
					>
						Clear Filters
					</Button>
				)}
			</Box>
			{isAnalyzing && (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						marginBottom: theme.spacing(4),
						gap: '4px',
					}}
				>
					<Box>Analysis Progress:</Box>
					<Box>
						<LinearProgress variant="determinate" value={value} />
					</Box>
				</Box>
			)}
			<OptimizationTypeFilter />

			<Legend />
			{!isAnalyzed && !isAnalyzing && (
				<>
					<p>
						Click the button below to analyze your loadouts. Analysis may take a
						few minutes.
					</p>
				</>
			)}
			{/* {!isAnalyzing && (
				<Button variant="contained" onClick={analyzeLoadouts}>
					{isAnalyzed ? 'Re-Run Analysis' : 'Analyze'}
				</Button>
			)} */}

			<Box
				sx={{
					marginTop: theme.spacing(1),
					marginLeft: '-16px',
					paddingX: '16px',
					background: 'rgba(50, 50, 50, 0.5)',
					width: 'calc(100% + 32px)',
				}}
			>
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
					/>
				</Box>
				{dimLoadouts.length > numValidDimLoadouts && (
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
										<ul>
											<li>
												It must include some combination of armor, mods or
												subclass options
											</li>
											<li>It must NOT contain five legendary armor pieces</li>
											<li>
												{`It must be for a specific subclass (DIM Loadouts can be made for "Any Class")`}
											</li>
										</ul>
									</Box>
								}
							>
								<Help />
							</CustomTooltip>
						</Box>
						{dimLoadouts.length - numValidDimLoadouts} of your DIM loadouts were
						not analyzed because they did not meet the criteria for analysis.
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
