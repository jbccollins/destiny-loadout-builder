import { run as generateMods } from './mods/generateMods';
import { run as generateAspects } from './aspects/generateAspects';
import { run as generateGrenades } from './grenades/generateGrenades';
import { run as generateMelees } from './melees/generateMelees';

(async function run() {
	// await generateMods();
	// await generateAspects();
	// await generateGrenades();
	await generateMelees();
})();
