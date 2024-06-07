// import { run as generateAspects } from './aspects/generateAspects';
// import { run as generateClassAbilities } from './classAbilities/generateClassAbilities';
// import { run as generateFragments } from './fragments/generateFragments';
// import { run as generateGrenades } from './grenades/generateGrenades';
// import { run as generateJumps } from './jumps/generateJumps';
// import { run as generateMelees } from './melees/generateMelees';
// import { run as generateSuperAbilities } from './superAbilities/generateSuperAbilities';
import { run as generateMods } from './mods/generateMods';

(async function run() {
	await generateMods();

	// await generateAspects();
	// await generateSuperAbilities();
	// await generateFragments();
	// await generateGrenades();
	// await generateMelees();
	// await generateClassAbilities();
	// await generateJumps();
})();
