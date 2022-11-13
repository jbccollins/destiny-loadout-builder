import {
	ArmorGroup,
	ArmorSlots,
	ArmorStats,
	DesiredArmorStats,
	EArmorSlot,
	EArmorStat
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

export type ProcessArmorOutput = ArmorIdList[];

export type DoProcessArmorParams = {
	desiredArmorStats: DesiredArmorStats;
	armorItems: StrictArmorItems;
};

type ProcessArmorParams = {
	desiredArmorStats: DesiredArmorStats;
	armorItems: ArmorItems[];
	sumOfSeenStats: StatList;
	seenArmorIds: string[];
};

export type ShouldShortCircuitParams = {
	sumOfSeenStats: StatList;
	armorStats: StatList;
	desiredArmorStats: DesiredArmorStats;
	numRemainingArmorPieces: number; // TODO: Can we enforce this to be one of 3 | 2 | 1
};

const getArmorSlotFromNumRemainingArmorPieces = (num: number) => {
	if ([3, 2, 1].includes(num)) {
		return numRemainingArmorPiecesToArmorSlot[num];
	}
	throw `num is not 3,2,1: ${num}`;
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
	1: EArmorSlot.Chest
};

export const shouldShortCircuit = (
	params: ShouldShortCircuitParams
): [
	boolean,
	EArmorStat | null,
	EArmorSlot.Head | EArmorSlot.Arm | EArmorSlot.Chest | ''
] => {
	const {
		sumOfSeenStats,
		armorStats,
		desiredArmorStats,
		numRemainingArmorPieces
	} = params;
	const maxRemaning = MAX_SINGLE_STAT_VALUE * numRemainingArmorPieces;

	// TODO: I hate this entries thing, can we just use a forEach() or a normal for loop?
	for (const [i, stat] of armorStats.entries()) {
		if (
			stat + sumOfSeenStats[i] + maxRemaning <
			desiredArmorStats[ArmorStats[i]]
		) {
			const slot = getArmorSlotFromNumRemainingArmorPieces(
				numRemainingArmorPieces
			);
			// console.log(`
			// 	short-circuiting ${slot}:
			// 		stat: ${desiredArmorStats[ArmorStats[i]]},
			// 		sum: ${sumOfSeenStats[i]},
			// 		value: ${stat}
			// `);
			return [true, ArmorStats[i], slot];
		}
	}
	return [false, null, ''];
};

/**
 * @param {ArmorItems2} armorItems - [heads, arms, chests, legs]
 * @returns {ProcessArmorOutput} All the combinations of armor ids that meet the required specs
 * @description This function expects that every combination of [heads, arms, chests, legs]
 * is valid.
 */
export const doProcessArmor = ({
	desiredArmorStats,
	armorItems
}: DoProcessArmorParams): ProcessArmorOutput => {
	return processArmor({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats: [0, 0, 0, 0, 0, 0],
		seenArmorIds: []
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
	seenArmorIds
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems] = armorItems;
	const output: ProcessArmorOutput = [];
	armorSlotItems.forEach((armorSlotItem) => {
		let isValid = true;
		const finalSumOfSeenStats = getNextSeenStats(sumOfSeenStats, armorSlotItem);
		for (let i = 0; i < ArmorStats.length; i++) {
			if (desiredArmorStats[ArmorStats[i]] > finalSumOfSeenStats[i]) {
				// skip
				isValid = false;
				break;
			}
		}
		if (isValid) {
			output.push([...seenArmorIds, armorSlotItem.id] as ArmorIdList);
		}
		// const temp = [
		// 	'6917529482245637017',
		// 	'6917529401047462850',
		// 	'6917529411924140321',
		// 	'6917529469530823398'
		// ];
		// let isMatch0 = false;
		// let isMatch1 = false;
		// let isMatch2 = false;
		// let isMatch3 = false;
		// output[output.length - 1].forEach((id, i) => {
		// 	if (output[output.length - 1][0] === '6917529482245637017') {
		// 		isMatch0 = true;
		// 	}
		// 	if (output[output.length - 1][1] === '6917529401047462850') {
		// 		isMatch1 = true;
		// 	}
		// 	if (output[output.length - 1][2] === '6917529411924140321') {
		// 		isMatch2 = true;
		// 	}
		// 	if (output[output.length - 1][3] === '6917529469530823398') {
		// 		isMatch3 = true;
		// 	}
		// });

		// console.log(
		// 	`>>>>>>>>>>>>>>>> match <<<<<<<<<<<<<<< ${isMatch0}, ${isMatch1}, ${isMatch2}, ${isMatch3},`
		// );
	});
	return output;
};

const _processArmorRecursiveCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems, ...rest] = armorItems;
	const output: ProcessArmorOutput[] = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const [shortCircuit] = shouldShortCircuit({
			sumOfSeenStats,
			armorStats: armorSlotItem.stats,
			desiredArmorStats: desiredArmorStats,
			numRemainingArmorPieces: rest.length
		});
		if (shortCircuit) {
			console.log(`short circuiting ${rest.length} slots`);
			return;
		}

		const nextSumOfSeenStats = getNextSeenStats(sumOfSeenStats, armorSlotItem);
		output.push(
			processArmor({
				desiredArmorStats,
				armorItems: rest,
				sumOfSeenStats: nextSumOfSeenStats,
				seenArmorIds: [...seenArmorIds, armorSlotItem.id]
			})
		);
	});
	return output.flat(1);
};

const processArmor = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds
}: ProcessArmorParams): ProcessArmorOutput => {
	if (armorItems.length === 1) {
		return _processArmorBaseCase({
			desiredArmorStats,
			armorItems,
			sumOfSeenStats,
			seenArmorIds
		});
	}

	return _processArmorRecursiveCase({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats,
		seenArmorIds
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
