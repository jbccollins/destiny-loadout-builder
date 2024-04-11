import { selectAllClassItemMetadata } from '@dlb/redux/features/allClassItemMetadata/allClassItemMetadataSlice';
import {
	addAnalysisResult,
	clearProgressCanBeOptimizedCount,
	clearProgressCompletionCount,
	clearProgressErroredCount,
	incrementProgressCanBeOptimizedCount,
	incrementProgressCompletionCount,
	incrementProgressErroredCount,
	selectAnalyzableLoadouts,
	setIsAnalyzed,
	setIsAnalyzing,
} from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import { selectArmor } from '@dlb/redux/features/armor/armorSlice';
import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { selectSelectedMasterworkAssumption } from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	EGetLoadoutsThatCanBeOptimizedProgressType,
	EMessageType,
	GetLoadoutsThatCanBeOptimizedProgress,
	GetLoadoutsThatCanBeOptimizedWorker,
	Message,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import { AnalyzableLoadoutMapping } from '@dlb/types/AnalyzableLoadout';
import { isDebugging } from '@dlb/utils/debugging';
import { useEffect, useMemo } from 'react';

export default function LoadoutAnalysisWebWorkerWrapper() {
	const armor = useAppSelector(selectArmor);
	const allClassItemMetadata = useAppSelector(selectAllClassItemMetadata);
	const masterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const analyzeableLoadouts = useAppSelector(selectAnalyzableLoadouts);
	const { isAnalyzed, isAnalyzing, analyzableLoadoutBreakdown } =
		analyzeableLoadouts;
	const { validLoadouts } = analyzableLoadoutBreakdown;
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

	const debugging = isDebugging();

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
						if (debugging) {
							console.log('progress', e.data.payload);
						}
						if (payload.canBeOptimized) {
							dispatch(incrementProgressCanBeOptimizedCount());
						}
						dispatch(addAnalysisResult(payload));
						if (
							payload.type === EGetLoadoutsThatCanBeOptimizedProgressType.Error
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
						// setFatalError(true);
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

	return null;
}
