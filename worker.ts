// This is a module worker, so we can use imports (in the browser too!)
// import pi from './utils/pi'
import { noop } from 'lodash';

addEventListener('message', (event: MessageEvent<number>) => {
	postMessage('derp');
});

export default noop;
