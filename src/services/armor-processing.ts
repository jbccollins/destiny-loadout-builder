import {
	ArmorGroup,
	ArmorIdList,
	ArmorItems,
	getExtraMasterworkedStats,
	IArmorItem,
	ISelectedExoticArmor,
	StatList,
	StrictArmorItems,
} from '@dlb/types/Armor';
import { ArmorSlotIdList } from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatIdToArmorStatModSplit,
	ArmorStatMapping,
} from '@dlb/types/ArmorStat';
import {
	getArmorStatMappingFromArmorStatMods,
	getArmorStatMod,
} from '@dlb/types/ArmorStatMod';
import {
	EArmorSlotId,
	EArmorStatModId,
	EArmorStatId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';

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

const getArmorSlotFromNumRemainingArmorPieces = (num: number) => {
	if ([3, 2, 1, 0].includes(num)) {
		return numRemainingArmorPiecesToArmorSlot[num];
	}
	throw `num is not 3,2,1,0: ${num}`;
};

// We never need to check legs as written since we always process top down.
// TODO: This will need to change if prioritization of shortcircuiting based
// on slot length actually matters. Basically... should we process slots with more items
// first since we have more chances to short circuit? Or does it not matter at all.
// TOOD: Investigate this.
const numRemainingArmorPiecesToArmorSlot = {
	3: EArmorSlotId.Head,
	2: EArmorSlotId.Arm,
	1: EArmorSlotId.Chest,
	0: EArmorSlotId.Leg,
};

// Round a number up to the nearest 5
function roundUp5(x: number) {
	return Math.ceil(x / 5) * 5;
}

// Round a number up to the nearest 10
function roundUp10(x: number) {
	return Math.ceil(x / 10) * 10;
}

// Round a number down to the nearest 10
function roundDown10(x: number) {
	return Math.floor(x / 10) * 10;
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
}: GetRequiredArmorStatModsParams): [EArmorStatModId[], ArmorStatMapping] => {
	const requiredArmorStatMods: EArmorStatModId[] = [];
	stats.forEach((stat, i) => {
		const armorStat = ArmorStatIdList[i];
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
		const { major, minor } = ArmorStatIdToArmorStatModSplit.get(armorStat);
		for (let i = 0; i < numRequiredMajorMods; i++) {
			requiredArmorStatMods.push(major);
		}
		if (withMinorStatMod) {
			requiredArmorStatMods.push(minor);
		}
	});
	return [
		requiredArmorStatMods,
		getArmorStatMappingFromArmorStatMods(requiredArmorStatMods),
	];
};

export type ShouldShortCircuitParams = {
	sumOfSeenStats: StatList;
	desiredArmorStats: ArmorStatMapping;
	numRemainingArmorPieces: number; // TODO: Can we enforce this to be one of 3 | 2 | 1
};

export type ShouldShortCircuitOutput = [
	boolean,
	EArmorStatModId[],
	ArmorStatMapping,
	EArmorStatId | null, // null means that there were to many required mods
	EArmorSlotId.Head | EArmorSlotId.Arm | EArmorSlotId.Chest | EArmorSlotId.Leg // TODO: This is probably just a keyof something I already have
];

export const shouldShortCircuit = (
	params: ShouldShortCircuitParams
): ShouldShortCircuitOutput => {
	const { sumOfSeenStats, desiredArmorStats, numRemainingArmorPieces } = params;

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

	for (let i = 0; i < ArmorStatIdList.length; i++) {
		const armorStat = ArmorStatIdList[i];
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
	masterworkAssumption: EMasterworkAssumption;
	fragmentArmorStatMapping: ArmorStatMapping;
	combatStyleModArmorStatMapping: ArmorStatMapping;
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
	masterworkAssumption,
	fragmentArmorStatMapping,
	combatStyleModArmorStatMapping,
}: DoProcessArmorParams): ProcessArmorOutput => {
	const sumOfSeenStats =
		masterworkAssumption !== EMasterworkAssumption.None
			? [2, 2, 2, 2, 2, 2]
			: [0, 0, 0, 0, 0, 0];
	ArmorStatIdList.forEach((id, i) => {
		sumOfSeenStats[i] =
			sumOfSeenStats[i] +
			fragmentArmorStatMapping[id] +
			combatStyleModArmorStatMapping[id];
	});
	return processArmor({
		masterworkAssumption,
		desiredArmorStats,
		armorItems,
		// Assume class item is masterworked
		// TODO: Get rid of the concept of StatList. Replace with ArmorStatMapping
		sumOfSeenStats: sumOfSeenStats as StatList,
		seenArmorIds: [],
	});
};

const getNextSeenStats = (
	sumOfSeenStats: StatList,
	armorSlotItem: IArmorItem,
	masterworkAssumption: EMasterworkAssumption
): StatList =>
	sumOfSeenStats.map(
		(x, i) =>
			x +
			armorSlotItem.stats[i] +
			getExtraMasterworkedStats(armorSlotItem, masterworkAssumption)
	) as StatList;

const _processArmorBaseCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems] = armorItems;
	const output: ProcessArmorOutput = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const finalSumOfSeenStats = getNextSeenStats(
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption
		);

		const [shortCircuit, requiredStatMods, requiredStatModArmorStatMapping] =
			shouldShortCircuit({
				sumOfSeenStats: finalSumOfSeenStats,
				desiredArmorStats: desiredArmorStats,
				numRemainingArmorPieces: 0,
			});
		if (shortCircuit) {
			console.log(`short circuiting base case.`);
			return;
		}

		const armorIdList = [...seenArmorIds, armorSlotItem.id] as ArmorIdList;
		const totalArmorStatMapping = sumArmorStatMappings([
			getArmorStatMappingFromStatList(finalSumOfSeenStats),
			requiredStatModArmorStatMapping,
		]);
		output.push({
			armorIdList,
			armorStatModIdList: requiredStatMods,
			metadata: {
				totalModCost: getTotalModCost(requiredStatMods),
				totalStatTiers: getTotalStatTiers(totalArmorStatMapping),
				wastedStats: getWastedStats(totalArmorStatMapping),
				totalArmorStatMapping,
			},
		});
	});
	// console.log('>>>>>> Base Case output:', output);
	return output;
};

const _processArmorRecursiveCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems, ...rest] = armorItems;
	const output: ProcessArmorOutput[] = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const nextSumOfSeenStats = getNextSeenStats(
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption
		);

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
				masterworkAssumption,
			})
		);
	});
	// TODO: Can we find a way to not have to do this flattening?
	return output.flat(1);
};

export type ProcessedArmorItemMetadata = {
	totalModCost: number;
	totalStatTiers: number;
	wastedStats: number;
	totalArmorStatMapping: ArmorStatMapping;
};

type ProcessArmorOutputItem = {
	armorIdList: ArmorIdList;
	armorStatModIdList: EArmorStatModId[];
	// Anything that the user can sort the results by should be pre-calculated right here
	metadata: ProcessedArmorItemMetadata;
};
export type ProcessArmorOutput = ProcessArmorOutputItem[];

type ProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: ArmorItems[];
	sumOfSeenStats: StatList;
	seenArmorIds: string[];
	masterworkAssumption: EMasterworkAssumption;
};

const processArmor = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
}: ProcessArmorParams): ProcessArmorOutput => {
	if (armorItems.length === 1) {
		return _processArmorBaseCase({
			desiredArmorStats,
			armorItems,
			sumOfSeenStats,
			seenArmorIds,
			masterworkAssumption,
		});
	}

	return _processArmorRecursiveCase({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats,
		seenArmorIds,
		masterworkAssumption,
	});
};

// Transform the shape of the application's armor to be processed.
// Filter out any armor items that will definitely not be used.
export const preProcessArmor = (
	armorGroup: ArmorGroup,
	selectedExoticArmor: ISelectedExoticArmor
): StrictArmorItems => {
	const strictArmorItems: StrictArmorItems = [[], [], [], []];
	ArmorSlotIdList.forEach((armorSlot, i) => {
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

// Convert an ordered list of stats into a mapping
const getArmorStatMappingFromStatList = (
	statList: StatList
): ArmorStatMapping => {
	const res: ArmorStatMapping = {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	};
	ArmorStatIdList.forEach((armorStatId, i) => {
		res[armorStatId] = statList[i];
	});
	return res;
};

// Get the total number of stat tiers for an ArmorStatMapping
const getTotalStatTiers = (armorStatMapping: ArmorStatMapping): number => {
	let res = 0;
	ArmorStatIdList.forEach((armorStatId) => {
		res += roundDown10(armorStatMapping[armorStatId]) / 10;
	});
	return res;
};

// Add up an arbitrary number of ArmorStatMappings
const sumArmorStatMappings = (
	armorStatMappings: ArmorStatMapping[]
): ArmorStatMapping => {
	const res: ArmorStatMapping = {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	};
	ArmorStatIdList.forEach((armorStatId) => {
		armorStatMappings.forEach((armorStatMapping) => {
			res[armorStatId] = res[armorStatId] + armorStatMapping[armorStatId];
		});
	});
	return res;
};

const getTotalModCost = (armorStatModIds: EArmorStatModId[]): number => {
	let res = 0;
	armorStatModIds.forEach((id) => {
		res += getArmorStatMod(id).cost;
	});
	return res;
};

const getWastedStats = (armorStatMapping: ArmorStatMapping): number => {
	let res = 0;
	ArmorStatIdList.forEach((armorStatId) => {
		res += armorStatMapping[armorStatId] % 10;
	});
	return res;
};
