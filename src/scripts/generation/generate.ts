import { run as generateMods } from './mods/generateMods';
import { run as generateAspects } from './aspects/generateAspects';
(async function run() {
	await generateMods();
	await generateAspects();
})();
