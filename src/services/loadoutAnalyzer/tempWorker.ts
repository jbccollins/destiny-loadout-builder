/* eslint-disable no-restricted-globals */
self.onmessage = (e: MessageEvent<string>) => {
	self.postMessage('from worker');
};

export {};
