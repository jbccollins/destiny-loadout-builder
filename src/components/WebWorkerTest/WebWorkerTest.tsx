'use client';

import { useCallback, useEffect, useRef } from 'react';
// import derp from '../../../worker'

type WebWorkerTestProps = Readonly<{ derp: boolean }>;

function WebWorkerTest(props: WebWorkerTestProps) {
	const workerRef = useRef<Worker>();
	useEffect(() => {
		workerRef.current = new Worker(
			new URL('../../../worker.ts', import.meta.url)
		);
		workerRef.current.onmessage = (event: MessageEvent<number>) =>
			alert(`WebWorker Response => ${event.data}`);
		return () => {
			workerRef.current.terminate();
		};
	}, []);

	const handleWork = useCallback(async () => {
		workerRef.current.postMessage(100000);
	}, []);

	return (
		<>
			<button onClick={handleWork}>Send an Alert</button>
		</>
	);
}

export default WebWorkerTest;
