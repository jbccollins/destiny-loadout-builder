import { selectAllClassItemMetadata } from '@dlb/redux/features/allClassItemMetadata/allClassItemMetadataSlice';
import {
	clearProgressCanBeOptimizedCount,
	clearProgressCompletionCount,
	clearProgressErroredCount,
	incrementProgressCanBeOptimizedCount,
	incrementProgressCompletionCount,
	incrementProgressErroredCount,
	selectAnalyzableLoadouts,
	setAnalysisResults,
	setIsAnalyzed,
	setIsAnalyzing,
} from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import { selectArmor } from '@dlb/redux/features/armor/armorSlice';
import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import {
	clearDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectDimLoadouts } from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import { setPerformingBatchUpdate } from '@dlb/redux/features/performingBatchUpdate/performingBatchUpdateSlice';
import { clearReservedArmorSlotEnergy } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	clearArmorSlotMods,
	setSelectedArmorSlotMods,
} from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import {
	clearSelectedAspects,
	selectSelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	clearSelectedClassAbility,
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
	selectSelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { clearSelectedIntrinsicArmorPerkOrAttributeIds } from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import {
	clearSelectedJump,
	selectSelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { selectSelectedMasterworkAssumption } from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import {
	clearSelectedMelee,
	selectSelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import {
	clearSelectedRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	clearSelectedSuperAbility,
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
	GetLoadoutsThatCanBeOptimizedOutputItem,
	GetLoadoutsThatCanBeOptimizedProgress,
	GetLoadoutsThatCanBeOptimizedWorker,
	Message,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	AnalysisResults,
	AnalyzableLoadout,
	AnalyzableLoadoutMapping,
} from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { DestinyClassIdList } from '@dlb/types/DestinyClass';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { EnumDictionary } from '@dlb/types/globals';
import {
	AlignHorizontalLeft,
	AttachMoney,
	KeyboardDoubleArrowDown,
	KeyboardDoubleArrowUp,
} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	SxProps,
	useTheme,
} from '@mui/material';
import { ReactElement, useEffect, useMemo, useState } from 'react';

export type LoadoutAnalyzerProps = {
	isHidden?: boolean;
};

const iconStyle: SxProps = {
	height: '20px',
	width: '20px',
};

const loadoutOptimizationIcons: EnumDictionary<
	ELoadoutOptimizationType,
	ReactElement[]
> = {
	[ELoadoutOptimizationType.HigherStatTier]: [
		<AlignHorizontalLeft sx={iconStyle} key={0} />,
		<KeyboardDoubleArrowUp key={1} sx={iconStyle} />,
	],
	[ELoadoutOptimizationType.LowerCost]: [
		<AttachMoney key={0} sx={iconStyle} />,
		<KeyboardDoubleArrowDown key={1} sx={iconStyle} />,
	],
};

export default function LoadoutAnalyzer(props: LoadoutAnalyzerProps) {
	const { isHidden } = props;
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

	const {
		isAnalyzed,
		isAnalyzing,
		progressCompletionCount,
		analysisResults,
		analyzableLoadoutBreakdown,
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
		const debugging = false;
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
		});
	};

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
		newSelectedExoticArmor[destinyClassId] = flatAvailableExoticArmor.find(
			(x) => x.hash === exoticHash
		);

		dispatch(setSelectedExoticArmor(newSelectedExoticArmor));
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
						const analysisResults: AnalysisResults = {};
						(
							e.data.payload as GetLoadoutsThatCanBeOptimizedOutputItem[]
						).forEach((x) => {
							analysisResults[x.loadoutId] = {
								optimizationTypes: x.optimizationTypes,
							};
						});
						dispatch(setAnalysisResults(analysisResults));
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
	return (
		<>
			<Box
				sx={{
					fontWeight: 'bold',
					fontSize: '1.5rem',
					marginBottom: theme.spacing(2),
				}}
			>
				Loadout Analyzer
			</Box>
			{!isAnalyzed && !isAnalyzing && (
				<>
					<p>
						Click the button below to analyze your loadouts. Analysis may take a
						few minutes.
					</p>
				</>
			)}
			{!isAnalyzing && (
				<Button variant="contained" onClick={analyzeLoadouts}>
					{isAnalyzed ? 'Re-Run Analysis' : 'Analyze'}
				</Button>
			)}
			{isAnalyzing && <LinearProgress variant="determinate" value={value} />}
			{isAnalyzed && (
				<Box sx={{ marginTop: theme.spacing(1) }}>
					<Box>
						{richValidLoadouts.map((value, index) => (
							<Box
								key={value.id}
								sx={{
									padding: theme.spacing(0.5),
									marginBottom: theme.spacing(1),
									'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center' }}>
									<IconButton
										onClick={() => setApplicationState(value)}
										size="small"
										sx={{ marginRight: theme.spacing(0.5) }}
									>
										<EditIcon />
									</IconButton>
									<Box>{value.name}</Box>
								</Box>
								<Box sx={{ marginTop: '8px' }}>
									{value.optimizationTypes?.map((x, i) => {
										const { iconColors } = getLoadoutOptimization(x);
										return (
											<Box
												sx={{
													color: 'red',
													background: '#2b2b2b',
													display: 'inline-flex',
													padding: theme.spacing(0.5),
													borderRadius: '16px',
													paddingTop: '10px',
													height: '32px',
													alignItems: 'center',
													paddingLeft: theme.spacing(2),
													paddingRight: theme.spacing(1.5),
												}}
												key={x}
											>
												{loadoutOptimizationIcons[x].map((x, i) => (
													<Box key={i} sx={{ color: iconColors[i] || 'white' }}>
														{x}
													</Box>
												))}
											</Box>
										);
									})}
								</Box>
							</Box>
						))}
					</Box>
					{dimLoadouts.length > numValidDimLoadouts && (
						<Box
							sx={{
								marginTop: theme.spacing(1),
							}}
						>
							{dimLoadouts.length - numValidDimLoadouts} of your DIM loadouts
							were not analyzed because they did not meet the criteria for
							analysis.
						</Box>
					)}
					{Object.values(invalidLoadouts).map((value) => {
						return <Box key={value.id}>{value.name}</Box>;
					})}
				</Box>
			)}
		</>
	);
}
