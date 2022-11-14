import {
	ArmorGroup,
	ArmorSlots,
	ArmorStatModMapping,
	ArmorStats,
	ArmorStatMapping,
	EArmorSlot,
	EArmorStat,
	EStatModifier,
	getArmorStatMappingFromStatModifiers,
} from './data';

// No masterworked legendary piece of armor has a single stat above 32
// TODO: Can we dynamically set this per slot? Like not every user
// is going to have six heads with 30 in each of the stats. So can we create a mapping
// before processing. e.g.: {head: {mob: 28, res: 27, rec: 30, ...}, arm: {mob: 29, ...}}.
// We can even "override" this with the max stats for a specific exotic when one is chosen.
// I *think* it's impossible to have a short circuit before chest if we keep this at 30.
// But it *should* be possible once we make this dynamic. We *could* also check to see
// if there even are any masterworked items in a slot (relevant mostly for the exotic chosen)
// and if there aren't then this is just 30. Probably not needed once done dynamically anyway tho
const MAX_SINGLE_STAT_VALUE = 32;

export type StatList = [number, number, number, number, number, number];

export interface IDestinyItem {
	// Unique identifier for this specific piece of armor.
	id: string;
	// Non-unique identifier. All "Crest of Alpha Lupi" armor pieces will have the same hash.
	hash: number;
}

// "extend" the DestinyItem type
export interface IArmorItem extends IDestinyItem {
	// Mobility, Resilience, Recovery, Discipline, Intellect, Strength
	stats: StatList;
	// Is this piece of armor an exotic
	isExotic: boolean;
	// Is this piece of armor masterworked
	isMasterworked: boolean;
}

// Strictly enforce the length of this array [Heads, Arms, Chests, Legs]
export type StrictArmorItems = [
	IArmorItem[],
	IArmorItem[],
	IArmorItem[],
	IArmorItem[]
];

// We don't export this type... only in this file should we be able to use non-strict armor items
// Otherwise we MUST pass in an array of length 4 for each [Heads, Arms, Chests, Legs]
type ArmorItems = IArmorItem[];

// Four armor ids [Heads, Arms, Chests, Legs]
export type ArmorIdList = [string, string, string, string];

export interface ISelectedExoticArmor {
	hash: number;
	armorSlot: EArmorSlot;
}

const getArmorSlotFromNumRemainingArmorPieces = (num: number) => {
	if ([3, 2, 1, 0].includes(num)) {
		return numRemainingArmorPiecesToArmorSlot[num];
	}
	throw `num is not 3,2,1,0: ${num}`;
};

// Masterworking adds +2 to each stat
export const getExtraMasterworkedStats = ({ isMasterworked }: IArmorItem) =>
	isMasterworked ? 2 : 0;

// We never need to check legs as written since we always process top down.
// TODO: This will need to change if prioritization of shortcircuiting based
// on slot length actually matters. Basically... should we process slots with more items
// first since we have more chances to short circuit? Or does it not matter at all.
// TOOD: Investigate this.
const numRemainingArmorPiecesToArmorSlot = {
	3: EArmorSlot.Head,
	2: EArmorSlot.Arm,
	1: EArmorSlot.Chest,
	0: EArmorSlot.Leg,
};

// Round a number up to the nearest 5
function roundUp5(x: number) {
	return Math.ceil(x / 5) * 5;
}

// Round a number down to the nearest 10
function roundUp10(x: number) {
	return Math.ceil(x / 10) * 10;
}

// If we need 25 stats we need one minor stat and two major
function canUseMinorStatMod(x: number) {
	return roundUp5(x) % 10 === 5;
}

export type GetRequiredArmorStatModsParams = {
	desiredArmorStats: ArmorStatMapping;
	stats: StatList; // Includes masterworked / assume masterworked
	numRemainingArmorPieces: number;
};

// Get the required armor stat mods for a given combination.
// If we don't have a full combination yet then assume that we have the
// max possible stat value for each remaining stat.
export const getRequiredArmorStatMods = ({
	desiredArmorStats,
	stats,
	numRemainingArmorPieces,
}: GetRequiredArmorStatModsParams): [EStatModifier[], ArmorStatMapping] => {
	const requiredArmorStatMods: EStatModifier[] = [];
	stats.forEach((stat, i) => {
		const armorStat = ArmorStats[i];
		const desiredStat = desiredArmorStats[armorStat];
		// Assume that for each remaining armor piece we have perfect stats
		const diff =
			desiredStat - (stat + MAX_SINGLE_STAT_VALUE * numRemainingArmorPieces);
		// If the desired stat is less than or equal to the total possible stat
		// then we don't need any stat mods to boost that stat
		if (diff <= 0) {
			return;
		}
		const withMinorStatMod = canUseMinorStatMod(diff);
		// TODO: We can optimize this a bit I think... Like if we only need two major and one minor
		// and we have no remaining pieces then we can probably just push five minor stat mods.
		// Maybe that should be a setting.. like "Prefer minor mods" or something idk.
		const numRequiredMajorMods =
			roundUp10(diff) / 10 - (withMinorStatMod ? 1 : 0);
		for (let i = 0; i < numRequiredMajorMods; i++) {
			requiredArmorStatMods.push(ArmorStatModMapping[armorStat].major);
		}
		if (withMinorStatMod) {
			requiredArmorStatMods.push(ArmorStatModMapping[armorStat].minor);
		}
	});
	return [
		requiredArmorStatMods,
		getArmorStatMappingFromStatModifiers(requiredArmorStatMods),
	];
};

export type ShouldShortCircuitParams = {
	sumOfSeenStats: StatList;
	desiredArmorStats: ArmorStatMapping;
	numRemainingArmorPieces: number; // TODO: Can we enforce this to be one of 3 | 2 | 1
};

export type ShouldShortCircuitOutput = [
	boolean,
	EStatModifier[],
	ArmorStatMapping,
	EArmorStat | null, // null means that there were to many required mods
	EArmorSlot.Head | EArmorSlot.Arm | EArmorSlot.Chest | EArmorSlot.Leg // TODO: This is probably just a keyof something I already have
];

export const shouldShortCircuit = (
	params: ShouldShortCircuitParams
): ShouldShortCircuitOutput => {
	const {
		sumOfSeenStats,
		// armorStats,
		desiredArmorStats,
		numRemainingArmorPieces,
	} = params;

	// TODO: Knowing the rules around stat clustering [mob, res, rec] and [dis, int, str]
	// how each of those groups adds up to a max base total of 34 we can probably short circuit
	// muuuuuch more often. If we know that we needed to have a 30 in both mob and res for a
	// single armor piece in order for it to work in this combination we can tell that's an impossible
	// piece of armor so we are done right then and there. Combine that logic
	// with dynamic MAX_SINGLE_STAT_VALUE and we can have a really efficient check here.
	const maxRemaningPossibleStatValue =
		MAX_SINGLE_STAT_VALUE * numRemainingArmorPieces;

	const [requiredArmorStatMods, armorStatMapping] = getRequiredArmorStatMods({
		desiredArmorStats,
		stats: sumOfSeenStats,
		numRemainingArmorPieces,
	});

	const slot = getArmorSlotFromNumRemainingArmorPieces(numRemainingArmorPieces);

	if (requiredArmorStatMods.length > 5) {
		// console.log(`
		// 		short-circuiting ${slot}:
		// 			stat: none,
		// 			requiredArmorStatMods: ${requiredArmorStatMods}
		// 	`);
		return [true, requiredArmorStatMods, armorStatMapping, null, slot];
	}

	for (let i = 0; i < ArmorStats.length; i++) {
		const armorStat = ArmorStats[i];
		if (
			sumOfSeenStats[i] +
				armorStatMapping[armorStat] +
				maxRemaningPossibleStatValue <
			desiredArmorStats[armorStat]
		) {
			// console.log(`
			// 	short-circuiting ${slot}:
			// 		stat: ${desiredArmorStats[ArmorStats[i]]},
			// 		sum: ${sumOfSeenStats[i]},
			// 		value: ${stat}
			// `);
			return [true, requiredArmorStatMods, armorStatMapping, armorStat, slot];
		}
	}
	return [false, requiredArmorStatMods, armorStatMapping, null, null];
};

export type DoProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: StrictArmorItems;
};

/**
 * @param {ArmorItems2} armorItems - [heads, arms, chests, legs]
 * @returns {ProcessArmorOutput} All the combinations of armor ids that meet the required specs
 * @description This function expects that every combination of [heads, arms, chests, legs]
 * is valid.
 */
export const doProcessArmor = ({
	desiredArmorStats,
	armorItems,
}: DoProcessArmorParams): ProcessArmorOutput => {
	return processArmor({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats: [0, 0, 0, 0, 0, 0],
		seenArmorIds: [],
	});
};

const getNextSeenStats = (
	sumOfSeenStats: StatList,
	armorSlotItem: IArmorItem
): StatList =>
	sumOfSeenStats.map(
		(x, i) =>
			x + armorSlotItem.stats[i] + getExtraMasterworkedStats(armorSlotItem)
	) as StatList;

const _processArmorBaseCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems] = armorItems;
	const output: ProcessArmorOutput = [];
	armorSlotItems.forEach((armorSlotItem) => {
		// let isValid = true;
		const finalSumOfSeenStats = getNextSeenStats(sumOfSeenStats, armorSlotItem);

		const [shortCircuit, requiredStatMods, requiredStatModSumValues] =
			shouldShortCircuit({
				sumOfSeenStats: finalSumOfSeenStats,
				desiredArmorStats: desiredArmorStats,
				numRemainingArmorPieces: 0,
			});
		if (shortCircuit) {
			console.log(`short circuiting base case.`);
			return;
		}

		// for (let i = 0; i < ArmorStats.length; i++) {
		// 	const armorStat = ArmorStats[i];
		// 	if (desiredArmorStats[armorStat] > finalSumOfSeenStats[i]) {
		// 		// skip
		// 		isValid = false;
		// 		break;
		// 	}
		// }
		// if (isValid) {
		// 	// TODO: URGENT: Return the requiredStatMods here as well

		// TODO: Convert this type into [StatList, EStatModifier[]]
		output.push([...seenArmorIds, armorSlotItem.id, requiredStatMods] as Temp);
		//}
	});
	console.log('>>>>>> Base Case output:', output);
	return output;
};

const _processArmorRecursiveCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems, ...rest] = armorItems;
	const output: ProcessArmorOutput[] = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const nextSumOfSeenStats = getNextSeenStats(sumOfSeenStats, armorSlotItem);

		const [shortCircuit] = shouldShortCircuit({
			sumOfSeenStats: nextSumOfSeenStats,
			desiredArmorStats: desiredArmorStats,
			numRemainingArmorPieces: rest.length,
		});
		if (shortCircuit) {
			console.log(`short circuiting recursive case. ${rest.length} slots`);
			return;
		}

		output.push(
			processArmor({
				desiredArmorStats,
				armorItems: rest,
				sumOfSeenStats: nextSumOfSeenStats,
				seenArmorIds: [...seenArmorIds, armorSlotItem.id],
			})
		);
	});
	return output.flat(1);
};

type Temp = [string, string, string, string, any];
export type ProcessArmorOutput = Temp[]; //ArmorIdList[];

type ProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: ArmorItems[];
	sumOfSeenStats: StatList;
	seenArmorIds: string[];
};

const processArmor = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
}: ProcessArmorParams): ProcessArmorOutput => {
	if (armorItems.length === 1) {
		return _processArmorBaseCase({
			desiredArmorStats,
			armorItems,
			sumOfSeenStats,
			seenArmorIds,
		});
	}

	return _processArmorRecursiveCase({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats,
		seenArmorIds,
	});
};

// Transform the shape of the application's armor to be processed.
// Filter out any armor items that will definitely not be used.
export const preProcessArmor = (
	armorGroup: ArmorGroup,
	selectedExoticArmor: ISelectedExoticArmor
): StrictArmorItems => {
	const strictArmorItems: StrictArmorItems = [[], [], [], []];
	ArmorSlots.forEach((armorSlot, i) => {
		if (armorSlot === selectedExoticArmor.armorSlot) {
			strictArmorItems[i] = Object.values(armorGroup[armorSlot].exotic).filter(
				(item) => item.hash === selectedExoticArmor.hash
			);
			return;
		}
		strictArmorItems[i] = Object.values(armorGroup[armorSlot].nonExotic);
	});
	return strictArmorItems;
};