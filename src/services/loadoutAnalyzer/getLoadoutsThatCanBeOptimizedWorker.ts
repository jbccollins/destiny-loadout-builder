import {
	EMessageType,
	GetLoadoutsThatCanBeOptimizedProgress,
	Message,
	PostMessageParams,
} from './helpers/types';
import { getLoadoutsThatCanBeOptimized } from './loadoutAnalyzer';

self.onmessage = (e: MessageEvent<PostMessageParams>) => {
	const getLoadoutsThatCanBeOptimizedProgressCallback = (
		progress: GetLoadoutsThatCanBeOptimizedProgress
	) => {
		self.postMessage({
			type: EMessageType.Progress,
			payload: progress,
		});
	};
	console.log('[getLoadoutsThatCanBeOptimizedWorker] start');
	try {
		const result = getLoadoutsThatCanBeOptimized({
			...e.data,
			progressCallback: getLoadoutsThatCanBeOptimizedProgressCallback,
		});
		self.postMessage({
			type: EMessageType.Results,
			payload: result,
		} as Message);
	} catch (e) {
		console.error('[getLoadoutsThatCanBeOptimizedWorker] error', e);
		self.postMessage({
			type: EMessageType.Error,
			payload: e,
		} as Message);
	}
	console.log('[getLoadoutsThatCanBeOptimizedWorker] done');
};

export { };

