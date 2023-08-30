import { selectAllClassItemMetadata } from '@dlb/redux/features/allClassItemMetadata/allClassItemMetadataSlice';
import { selectArmor } from '@dlb/redux/features/armor/armorSlice';
import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { setDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectDimLoadouts } from '@dlb/redux/features/dimLoadouts/dimLoadoutsSlice';
import { setSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import {
	selectSelectedDestinySubclass,
	setSelectedDestinySubclass,
} from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor,
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedMasterworkAssumption } from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import { setTabIndex } from '@dlb/redux/features/tabIndex/tabIndexSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	AnalyzableLoadout,
	buildLoadouts,
	EGetLoadoutsThatCanBeOptimizedProgresstype,
	EMessageType,
	GetLoadoutsThatCanBeOptimizedOutputItem,
	GetLoadoutsThatCanBeOptimizedProgress,
	GetLoadoutsThatCanBeOptimizedWorker,
	Message,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { DestinyClassIdList } from '@dlb/types/DestinyClass';
import EditIcon from '@mui/icons-material/Edit';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

export default function LoadoutAnalyzer() {
	const theme = useTheme();
	const [progressCompletionCount, setProgressCompletionCount] = useState(0);
	const [progressCanBeOptimizedCount, setProgressCanBeOptimizedCount] =
		useState(0);
	const [progressErroredCount, setProgressErroredCount] = useState(0);
	const [fatalError, setFatalError] = useState(true);
	const [analyzing, setAnalyzing] = useState(false);
	const [analyzed, setAnalyzed] = useState(false);
	const [analysisResults, setAnalysisResults] = useState<AnalyzableLoadout[]>(
		[]
	);
	const dimLoadouts = useAppSelector(selectDimLoadouts);
	const armor = useAppSelector(selectArmor);
	const allClassItemMetadata = useAppSelector(selectAllClassItemMetadata);
	const masterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);

	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);

	const loadouts = buildLoadouts(
		dimLoadouts,
		armor,
		allClassItemMetadata,
		masterworkAssumption
	);
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
		() => Object.entries(loadouts).length,
		[loadouts]
	);

	// This is such a fucking hack but I can't
	// figure out how to properly read state inside the
	// onmessage handler so I can't do state = currentState + 1

	const handleClick = () => {
		setProgressCompletionCount(0);
		setProgressCanBeOptimizedCount(0);
		setProgressErroredCount(0);

		setAnalyzed(false);
		setAnalyzing(true);
		getLoadoutsThatCanBeOptimizedWorker.postMessage({
			loadouts,
			armor,
			masterworkAssumption,
			allClassItemMetadata,
		});
	};

	const setApplicationState = (loadout: AnalyzableLoadout) => {
		if (!loadout) {
			throw new Error('wtf');
		}
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
		} = loadout;

		const newSelectedExoticArmor = { ...selectedExoticArmor };
		newSelectedExoticArmor[destinyClassId] = flatAvailableExoticArmor.find(
			(x) => x.hash === exoticHash
		);

		dispatch(setSelectedExoticArmor(newSelectedExoticArmor));

		dispatch(setSelectedDestinyClass(destinyClassId));
		dispatch(
			setSelectedDestinySubclass({
				...selectedDestinySubclass,
				[destinyClassId]: destinySubclassId,
			})
		);
		dispatch(setDesiredArmorStats(desiredStatTiers));
		dispatch(setTabIndex(0));
	};

	useEffect(() => {
		let _progressCompletionCount = 0;
		let _progressCanBeOptimizedCount = 0;
		let _progressErroredCount = 0;
		if (window.Worker) {
			getLoadoutsThatCanBeOptimizedWorker.onmessage = (
				e: MessageEvent<Message>
			) => {
				switch (e.data.type) {
					case EMessageType.Progress:
						_progressCompletionCount++;
						setProgressCompletionCount(_progressCompletionCount);
						const payload = e.data
							.payload as GetLoadoutsThatCanBeOptimizedProgress;
						console.log('progress', e.data, _progressCompletionCount);
						if (payload.canBeOptimized) {
							_progressCanBeOptimizedCount++;
							setProgressCanBeOptimizedCount(_progressCanBeOptimizedCount);
						}
						if (
							payload.type === EGetLoadoutsThatCanBeOptimizedProgresstype.Error
						) {
							_progressErroredCount++;
							setProgressErroredCount(_progressErroredCount);
						}
						break;
					case EMessageType.Results:
						console.log('results', e.data);
						setAnalyzing(false);
						setAnalyzed(true);
						_progressCompletionCount = 0;
						_progressCanBeOptimizedCount = 0;
						_progressErroredCount = 0;
						setAnalysisResults(
							(e.data.payload as GetLoadoutsThatCanBeOptimizedOutputItem[]).map(
								(x) => loadouts[x.loadoutId]
							)
						);
						break;
					case EMessageType.Error:
						_progressCompletionCount = 0;
						_progressCanBeOptimizedCount = 0;
						_progressErroredCount = 0;
						console.error('error', e.data);
						setFatalError(true);
						break;
					default:
						break;
				}
			};
		}
	}, []);

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
			{!analyzed && !analyzing && (
				<>
					<p>
						Click the button below to analyze your loadouts. Analysis may take a
						few minutes.
					</p>
				</>
			)}
			{!analyzing && (
				<Button variant="contained" onClick={handleClick}>
					{analyzed ? 'Re-Run Analysis' : 'Analyze'}
				</Button>
			)}
			{analyzing && <LinearProgress variant="determinate" value={value} />}
			{analyzed && (
				<Box sx={{ marginTop: theme.spacing(1) }}>
					<Box>
						{analysisResults.map((result) => (
							<Box
								key={result.id}
								sx={{
									padding: theme.spacing(0.5),
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<IconButton
									size="small"
									sx={{ marginRight: theme.spacing(0.5) }}
								>
									<EditIcon onClick={() => setApplicationState(result)} />
								</IconButton>
								<Box>{result.name}</Box>
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
				</Box>
			)}
		</>
	);
}
