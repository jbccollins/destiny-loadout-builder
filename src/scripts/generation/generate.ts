import { run as generateMods } from './mods/generateMods';
import { run as generateAspects } from './aspects/generateAspects';
import { run as generateGrenades } from './grenades/generateGrenades';
import { run as generateMelees } from './melees/generateMelees';
import { run as generateClassAbilities } from './classAbilities/generateClassAbilities';
import { run as generateJumps } from './jumps/generateJumps';
import { run as generateSuperAbilities } from './superAbilities/generateSuperAbilities';
import { run as generateFragments } from './fragments/generateFragments';

(async function run() {
	await generateMods();
	// await generateFragments();
	// await generateAspects();
	// await generateGrenades();
	// await generateMelees();
	// await generateClassAbilities();
	// await generateJumps();
	// await generateSuperAbilities();
})();
