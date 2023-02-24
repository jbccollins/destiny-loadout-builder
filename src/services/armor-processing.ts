import { Loadout } from '@destinyitemmanager/dim-api-types/loadouts';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	ArmorGroup,
	ArmorIdList,
	ArmorItem,
	ArmorItems,
	ArmorMetadata,
	ArmorMetadataItem,
	getExtraMasterworkedStats,
	IArmorItem,
	ISelectedExoticArmor,
	StatList,
	StrictArmorItems,
} from '@dlb/types/Armor';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
} from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatModSpitFromArmorStatId,
	getArmorStatMappingFromMods,
	sumArmorStatMappings,
	getArtificeArmorStatsToExtrapolate,
	DefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EMasterworkAssumption,
	EDimLoadoutsFilterId,
	EDestinyClassId,
	EGearTierId,
} from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	getMod,
	hasValidArmorStatModPermutation,
	MajorStatModIdList,
	MinorStatModIdList,
	ValidCombatStyleModPlacements,
} from '@dlb/types/Mod';
import { ARTIFICE_BONUS_VALUE } from '@dlb/utils/item-utils';

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

type GetRequiredArtificeModArmorStatIdListParams = {
	desiredArmorStats: ArmorStatMapping;
	totalArmorStatMapping: ArmorStatMapping;
};

const getRequiredArtificeModArmorStatIdList = ({
	desiredArmorStats,
	totalArmorStatMapping,
}: GetRequiredArtificeModArmorStatIdListParams): EArmorStatId[] => {
	const requiredArtificeModArmorStatIdList: EArmorStatId[] = [];
	ArmorStatIdList.forEach((armorStatId) => {
		const desiredArmorStat = desiredArmorStats[armorStatId];
		const achievedArmorStat = totalArmorStatMapping[armorStatId];
		const diff = desiredArmorStat - achievedArmorStat;
		let numRequiredArtificeMods = 0;
		if (diff > 0) {
			numRequiredArtificeMods += Math.ceil(diff / 3);
			for (let i = 0; i < numRequiredArtificeMods; i++) {
				requiredArtificeModArmorStatIdList.push(armorStatId);
			}
		}
	});
	return requiredArtificeModArmorStatIdList;
};

export type GetRequiredArmorStatModsParams = {
	desiredArmorStats: ArmorStatMapping;
	stats: StatList; // Includes masterworked / assume masterworked
	numRemainingArmorPieces: number;
	destinyClassId: EDestinyClassId;
	numSeenArtificeArmorItems: number;
};

// Get the required armor stat mods for a given combination.
// If we don't have a full combination yet then assume that we have the
// max possible stat value for each remaining stat.
export const getRequiredArmorStatMods = ({
	desiredArmorStats,
	stats,
	numRemainingArmorPieces,
	destinyClassId,
	numSeenArtificeArmorItems,
}: GetRequiredArmorStatModsParams): [
	EModId[],
	EArmorStatId[],
	ArmorStatMapping
] => {
	const requiredArmorStatMods: EModId[] = [];
	stats.forEach((stat, i) => {
		const armorStat = ArmorStatIdList[i];
		const desiredStat = desiredArmorStats[armorStat];
		// Assume that for each remaining armor piece we have perfect stats
		const diff =
			desiredStat -
			(stat +
				getMaxPossibleRemainingStatValue(
					numRemainingArmorPieces,
					0 // numSeenArtificeArmorItems
				));
		// If the desired stat is less than or equal to the total possible stat
		// then we don't need any stat mods or artifice stat mods to boost that stat
		if (diff <= 0) {
			return;
		}
		const withMinorStatMod = canUseMinorStatMod(diff);
		// TODO: We can optimize this a bit I think... Like if we only need two major and one minor
		// and we have no remaining pieces then we can probably just push five minor stat mods.
		// Maybe that should be a setting.. like "Prefer minor mods" or something idk.
		const numRequiredMajorMods =
			roundUp10(diff) / 10 - (withMinorStatMod ? 1 : 0);
		const { major, minor } = getArmorStatModSpitFromArmorStatId(armorStat);
		for (let i = 0; i < numRequiredMajorMods; i++) {
			requiredArmorStatMods.push(major);
		}
		if (withMinorStatMod) {
			requiredArmorStatMods.push(minor);
		}
	});
	let requiredArtificeModArmorStatIdList: EArmorStatId[] = [];
	let adjustedArmorStatMods: EModId[] = [...requiredArmorStatMods];
	// Find a single permutation of artifice mods to pad the stats. Only do this if necessary
	if (numRemainingArmorPieces === 0 || requiredArmorStatMods.length > 5) {
		// TODO: This is an upper bound for the number of artifice items left.
		// Constrain this further by checking which slot has an exotic and which
		// slots even have artifice pieces available.
		// In the future if we allow the usage of a loadout without an exotic this will need to change.
		const numPotentialArtificeItems =
			numSeenArtificeArmorItems + numRemainingArmorPieces;

		const baseArmorStatMapping = getArmorStatMappingFromStatList(stats);
		const sortedRequiredArmorStatMods = [...requiredArmorStatMods].sort(
			(a, b) => getMod(b).cost - getMod(a).cost
		);
		adjustedArmorStatMods = [...sortedRequiredArmorStatMods];
		const removedIndices: number[] = [];
		for (let i = 0; i < sortedRequiredArmorStatMods.length; i++) {
			const _adjustedArmorStatMods = [...sortedRequiredArmorStatMods];
			// Rip out the currently considered mod
			_adjustedArmorStatMods.splice(i, 1);
			// Rip out the other mods that we are not considering
			for (let j = removedIndices.length - 1; j >= 0; j--) {
				_adjustedArmorStatMods.splice(removedIndices[j], 1);
			}

			const adjustedArmorStatMapping = getArmorStatMappingFromMods(
				_adjustedArmorStatMods,
				destinyClassId
			);
			const _requiredArtificeModArmorStatIdList =
				getRequiredArtificeModArmorStatIdList({
					desiredArmorStats,
					totalArmorStatMapping: sumArmorStatMappings([
						adjustedArmorStatMapping,
						baseArmorStatMapping,
					]),
				});
			if (
				_requiredArtificeModArmorStatIdList.length > numPotentialArtificeItems
			) {
				continue;
			} else {
				removedIndices.push(i);
				adjustedArmorStatMods = _adjustedArmorStatMods;
				requiredArtificeModArmorStatIdList =
					_requiredArtificeModArmorStatIdList;
			}
		}
	}
	// Try to optimize a bit further by swapping out major mods with minor mods and padding with artifice mods
	if (
		numRemainingArmorPieces === 0 &&
		requiredArtificeModArmorStatIdList.length <= numSeenArtificeArmorItems
	) {
		let optimizedArmorStatMods = [...adjustedArmorStatMods];
		for (let i = 0; i < adjustedArmorStatMods.length; i++) {
			// If this is a minor mod we can't optimize it any further
			// TODO: This is almost certainly wrong behavior. In the case
			// where all we need is a single minor mod to reach our desired stats
			// we can just replace that minor mod with one or two artifice mods
			if (MinorStatModIdList.includes(adjustedArmorStatMods[i])) {
				continue;
			}
			// TODO: If stat mods ever give more than one bonus this won't work
			// Additionally this cast to EArmorStatId won't work if there are ever class specific
			// Armor stat mods...
			const armorStatId = getMod(adjustedArmorStatMods[i]).bonuses[0]
				.stat as EArmorStatId;
			const minorMod = getArmorStatModSpitFromArmorStatId(armorStatId).minor;
			const _optimizedArmorStatMods = [...optimizedArmorStatMods];
			// Swap out the currently considered mod
			_optimizedArmorStatMods[i] = minorMod;

			const optimizedArmorStatMapping = getArmorStatMappingFromMods(
				_optimizedArmorStatMods,
				destinyClassId
			);

			const baseArmorStatMapping = getArmorStatMappingFromStatList(stats);
			//const temp_MasterworkClassItemAssumptionStatMapping =
			// getArmorStatMappingFromStatList([2, 2, 2, 2, 2, 2]);
			const totalArmorStatMapping = sumArmorStatMappings([
				//temp_MasterworkClassItemAssumptionStatMapping,
				optimizedArmorStatMapping,
				baseArmorStatMapping,
			]);
			const _requiredArtificeModArmorStatIdList =
				getRequiredArtificeModArmorStatIdList({
					desiredArmorStats,
					totalArmorStatMapping,
				});
			if (
				_requiredArtificeModArmorStatIdList.length > numSeenArtificeArmorItems
			) {
				continue;
			} else {
				optimizedArmorStatMods = _optimizedArmorStatMods;
				requiredArtificeModArmorStatIdList =
					_requiredArtificeModArmorStatIdList;
			}
		}
		adjustedArmorStatMods = optimizedArmorStatMods;
	}
	return [
		adjustedArmorStatMods,
		requiredArtificeModArmorStatIdList,
		getArmorStatMappingFromMods(adjustedArmorStatMods, destinyClassId),
	];
};

export type ShouldShortCircuitParams = {
	sumOfSeenStats: StatList;
	desiredArmorStats: ArmorStatMapping;
	numRemainingArmorPieces: number; // TODO: Can we enforce this to be one of 3 | 2 | 1
	validCombatStyleModArmorSlotPlacements: ValidCombatStyleModPlacements;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	destinyClassId: EDestinyClassId;
	numSeenArtificeArmorItems: number;
};

export type ShouldShortCircuitOutput = [
	boolean,
	EModId[],
	EArmorStatId[],
	ArmorStatMapping,
	EArmorStatId | null, // null means that there were to many required mods
	EArmorSlotId.Head | EArmorSlotId.Arm | EArmorSlotId.Chest | EArmorSlotId.Leg // TODO: This is probably just a keyof something I already have
];

// TODO: Clean up these assumptions by checking against armor metadata
const getMaxPossibleRemainingStatValue = (
	numRemainingArmorPieces: number,
	numSeenArtificeArmorItems: number
): number =>
	MAX_SINGLE_STAT_VALUE * numRemainingArmorPieces + // Assume the best possible stats for each remaining piece
	numRemainingArmorPieces * 3 + // Assume all remaining pieces are artifice pieces
	numSeenArtificeArmorItems * 3;

export const shouldShortCircuit = (
	params: ShouldShortCircuitParams
): ShouldShortCircuitOutput => {
	const {
		sumOfSeenStats,
		desiredArmorStats,
		numRemainingArmorPieces,
		validCombatStyleModArmorSlotPlacements,
		armorSlotMods,
		destinyClassId,
		numSeenArtificeArmorItems,
	} = params;

	// TODO: Knowing the rules around stat clustering [mob, res, rec] and [dis, int, str]
	// how each of those groups adds up to a max base total of 34 we can probably short circuit
	// muuuuuch more often. If we know that we needed to have a 30 in both mob and res for a
	// single armor piece in order for it to work in this combination we can tell that's an impossible
	// piece of armor so we are done right then and there. Combine that logic
	// with dynamic MAX_SINGLE_STAT_VALUE and we can have a really efficient check here.
	const maxRemaningPossibleStatValue = getMaxPossibleRemainingStatValue(
		numRemainingArmorPieces,
		numSeenArtificeArmorItems
	);

	const [
		requiredArmorStatMods,
		requiredArtificeModArmorStatIdList,
		armorStatMapping,
	] = getRequiredArmorStatMods({
		desiredArmorStats,
		stats: sumOfSeenStats,
		numRemainingArmorPieces,
		destinyClassId,
		numSeenArtificeArmorItems,
	});

	const slot = getArmorSlotFromNumRemainingArmorPieces(numRemainingArmorPieces);

	if (requiredArmorStatMods.length > 5) {
		// console.log(`
		// 		short-circuiting ${slot}:
		// 			stat: none,
		// 			requiredArmorStatMods: ${requiredArmorStatMods}
		// 	`);
		return [
			true,
			requiredArmorStatMods,
			requiredArtificeModArmorStatIdList,
			armorStatMapping,
			null,
			slot,
		];
	}

	// TODO: This is an upper bound. We can constrain this further
	const maxNumPotentialArtificeItems =
		numSeenArtificeArmorItems + numRemainingArmorPieces;
	if (
		requiredArtificeModArmorStatIdList.length > maxNumPotentialArtificeItems
	) {
		return [
			true,
			requiredArmorStatMods,
			requiredArtificeModArmorStatIdList,
			armorStatMapping,
			null,
			slot,
		];
	}

	const hasValidArmorStatMods = hasValidArmorStatModPermutation(
		armorSlotMods,
		requiredArmorStatMods,
		validCombatStyleModArmorSlotPlacements
	);

	if (!hasValidArmorStatMods) {
		return [
			true,
			requiredArmorStatMods,
			requiredArtificeModArmorStatIdList,
			armorStatMapping,
			null,
			null,
		];
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
			return [
				true,
				requiredArmorStatMods,
				requiredArtificeModArmorStatIdList,
				armorStatMapping,
				armorStat,
				slot,
			];
		}
	}

	return [
		false,
		requiredArmorStatMods,
		requiredArtificeModArmorStatIdList,
		armorStatMapping,
		null,
		null,
	];
};

export type DoProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: StrictArmorItems;
	masterworkAssumption: EMasterworkAssumption;
	fragmentArmorStatMapping: ArmorStatMapping;
	modArmorStatMapping: ArmorStatMapping;
	validCombatStyleModArmorSlotPlacements: ValidCombatStyleModPlacements;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	destinyClassId: EDestinyClassId;
	armorMetadataItem: ArmorMetadataItem;
};

const getExtraSumOfSeenStats = (
	fragmentArmorStatMapping: ArmorStatMapping,
	modArmorStatMapping: ArmorStatMapping
): StatList => {
	const sumOfSeenStats: StatList = [0, 0, 0, 0, 0, 0];
	ArmorStatIdList.forEach((id, i) => {
		sumOfSeenStats[i] =
			sumOfSeenStats[i] +
			fragmentArmorStatMapping[id] +
			modArmorStatMapping[id];
	});
	return sumOfSeenStats;
};

const getArmorStatMappingFromArtificeModArmorStatIdList = (
	artificeModArmorStatIdList: EArmorStatId[]
): ArmorStatMapping => {
	const armorStatMapping: ArmorStatMapping = { ...DefaultArmorStatMapping };
	artificeModArmorStatIdList.forEach((armorStatId) => {
		armorStatMapping[armorStatId] += ARTIFICE_BONUS_VALUE;
	});
	return armorStatMapping;
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
	modArmorStatMapping,
	validCombatStyleModArmorSlotPlacements,
	armorSlotMods,
	destinyClassId,
	armorMetadataItem, // TODO: We probably don't need to pass in the full fat armorMetadata. Preselect just the metadata for the current class
}: DoProcessArmorParams): ProcessArmorOutput => {
	// Add in the class item
	const extraSumOfSeenStats = getExtraSumOfSeenStats(
		fragmentArmorStatMapping,
		modArmorStatMapping
	);
	let sumOfSeenStats = [...extraSumOfSeenStats];
	if (
		armorMetadataItem.classItem.hasMasterworkedLegendaryClassItem ||
		(masterworkAssumption !== EMasterworkAssumption.None &&
			armorMetadataItem.classItem.hasLegendaryClassItem)
	) {
		sumOfSeenStats = sumOfSeenStats.map((x) => x + 2);
	}

	// const artificeExtrapolationStats = getArtificeArmorStatsToExtrapolate(
	// 	minimumArtificeExtrapolationStatTier,
	// 	desiredArmorStats
	// );

	const processArmorParams: ProcessArmorParams = {
		masterworkAssumption,
		desiredArmorStats,
		armorItems,
		sumOfSeenStats: sumOfSeenStats as StatList,
		seenArmorIds: [],
		validCombatStyleModArmorSlotPlacements,
		armorSlotMods,
		destinyClassId,
		numSeenArtificeArmorItems: armorMetadataItem.classItem.hasArtificeClassItem
			? 1
			: 0,
	};

	const processedArmor: ProcessArmorOutput = processArmor(processArmorParams);

	// // Make sure we include the artifice class items bonus stats
	// if (armorMetadata[destinyClassId].classItem.hasArtificeClassItem) {
	// 	sumOfSeenStats = [...extraSumOfSeenStats];
	// 	if (
	// 		armorMetadata[destinyClassId].classItem
	// 			.hasMasterworkedArtificeClassItem ||
	// 		masterworkAssumption !== EMasterworkAssumption.None
	// 	) {
	// 		sumOfSeenStats = sumOfSeenStats.map((x) => x + 2);
	// 	}

	// 	// ArmorStatIdList.forEach((armorStatId, i) => {
	// 	// 	if (artificeExtrapolationStats[armorStatId]) {
	// 	// 		const _sumOfSeenStats = [...sumOfSeenStats];
	// 	// 		_sumOfSeenStats[i] += 3;
	// 	// 		processedArmor = processedArmor.concat(
	// 	// 			processArmor({
	// 	// 				...processArmorParams,
	// 	// 				sumOfSeenStats: _sumOfSeenStats as StatList,
	// 	// 				hasArtificeClassItem: armorStatId,
	// 	// 			})
	// 	// 		);
	// 	// 	}
	// 	// });
	// }
	return processedArmor;
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
	validCombatStyleModArmorSlotPlacements,
	armorSlotMods,
	destinyClassId,
	numSeenArtificeArmorItems,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems] = armorItems;
	const output: ProcessArmorOutput = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const finalNumSeenArtificeArmorItems = armorSlotItem.isArtifice
			? numSeenArtificeArmorItems + 1
			: numSeenArtificeArmorItems;
		const finalSumOfSeenStats = getNextSeenStats(
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption
		);

		const [
			shortCircuit,
			requiredStatMods,
			requiredArtificeModArmorStatIdList,
			requiredStatModArmorStatMapping,
		] = shouldShortCircuit({
			sumOfSeenStats: finalSumOfSeenStats,
			desiredArmorStats,
			numRemainingArmorPieces: 0,
			validCombatStyleModArmorSlotPlacements,
			armorSlotMods,
			destinyClassId,
			numSeenArtificeArmorItems: finalNumSeenArtificeArmorItems,
		});
		if (shortCircuit) {
			console.log(`short circuiting base case.`);
			return;
		}

		const armorIdList = [...seenArmorIds, armorSlotItem.id] as ArmorIdList;
		let totalArmorStatMapping = sumArmorStatMappings([
			getArmorStatMappingFromStatList(finalSumOfSeenStats),
			requiredStatModArmorStatMapping,
		]);

		totalArmorStatMapping = sumArmorStatMappings([
			getArmorStatMappingFromArtificeModArmorStatIdList(
				requiredArtificeModArmorStatIdList
			),
			totalArmorStatMapping,
		]);

		output.push({
			armorIdList,
			armorStatModIdList: requiredStatMods,
			artificeModArmorStatIdList: requiredArtificeModArmorStatIdList,
			metadata: {
				// requiredStatModIdList: requiredStatMods, // TODO: Why is this necessary when it's returned right above here?
				totalModCost: getTotalModCost(requiredStatMods),
				totalStatTiers: getTotalStatTiers(totalArmorStatMapping),
				wastedStats: getWastedStats(totalArmorStatMapping),
				totalArmorStatMapping,
				// requiredArtificeModArmorStatIdList,
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
	validCombatStyleModArmorSlotPlacements,
	armorSlotMods,
	destinyClassId,
	numSeenArtificeArmorItems,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems, ...rest] = armorItems;
	const output: ProcessArmorOutput[] = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const nextNumSeenArtificeArmorItems = armorSlotItem.isArtifice
			? numSeenArtificeArmorItems + 1
			: numSeenArtificeArmorItems;
		const nextSumOfSeenStats = getNextSeenStats(
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption
		);

		const [shortCircuit] = shouldShortCircuit({
			sumOfSeenStats: nextSumOfSeenStats,
			desiredArmorStats: desiredArmorStats,
			numRemainingArmorPieces: rest.length,
			validCombatStyleModArmorSlotPlacements,
			armorSlotMods,
			destinyClassId,
			numSeenArtificeArmorItems: nextNumSeenArtificeArmorItems,
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
				validCombatStyleModArmorSlotPlacements,
				armorSlotMods,
				destinyClassId,
				numSeenArtificeArmorItems: nextNumSeenArtificeArmorItems,
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
	// requiredStatModIdList: EModId[];
	// requiredArtificeModArmorStatIdList: EArmorStatId[];
};

type ProcessArmorOutputItem = {
	armorIdList: ArmorIdList;
	armorStatModIdList: EModId[];
	artificeModArmorStatIdList: EArmorStatId[];
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
	validCombatStyleModArmorSlotPlacements: ValidCombatStyleModPlacements;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	destinyClassId: EDestinyClassId;
	numSeenArtificeArmorItems: number;
};

const processArmor = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	validCombatStyleModArmorSlotPlacements,
	armorSlotMods,
	destinyClassId,
	numSeenArtificeArmorItems,
}: ProcessArmorParams): ProcessArmorOutput => {
	if (armorItems.length === 1) {
		return _processArmorBaseCase({
			desiredArmorStats,
			armorItems,
			sumOfSeenStats,
			seenArmorIds,
			masterworkAssumption,
			validCombatStyleModArmorSlotPlacements,
			armorSlotMods,
			destinyClassId,
			numSeenArtificeArmorItems,
		});
	}

	return _processArmorRecursiveCase({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats,
		seenArmorIds,
		masterworkAssumption,
		validCombatStyleModArmorSlotPlacements,
		armorSlotMods,
		destinyClassId,
		numSeenArtificeArmorItems,
	});
};

// Transform the shape of the application's armor to be processed.
// Filter out any armor items that will definitely not be used.
export const preProcessArmor = (
	armorGroup: ArmorGroup,
	selectedExoticArmor: ISelectedExoticArmor,
	dimLoadouts: Loadout[],
	dimLoadoutsFilterId: EDimLoadoutsFilterId,
	minimumGearTier: EGearTierId,
	minimumArtificeExtrapolationStatTier: number,
	desiredArmorStats: ArmorStatMapping
): StrictArmorItems => {
	const excludedItemIds: Record<string, boolean> = {};
	if (dimLoadoutsFilterId === EDimLoadoutsFilterId.None) {
		dimLoadouts.forEach((loadout) =>
			loadout.equipped.forEach((equipped) => {
				excludedItemIds[equipped.id] = true;
			})
		);
	}
	const artificeExtrapolationStats = getArtificeArmorStatsToExtrapolate(
		minimumArtificeExtrapolationStatTier,
		desiredArmorStats
	);
	const strictArmorItems: StrictArmorItems = [[], [], [], []];
	ArmorSlotIdList.forEach((armorSlot, i) => {
		if (armorSlot === selectedExoticArmor.armorSlot) {
			strictArmorItems[i] = Object.values(armorGroup[armorSlot].exotic).filter(
				(item) =>
					!excludedItemIds[item.id] && item.hash === selectedExoticArmor.hash
			);
			return;
		}
		strictArmorItems[i] = Object.values(armorGroup[armorSlot].nonExotic).filter(
			(item) => {
				// Filter out artifice armor with boosted stats that do not meet
				// the extrapolation threshold
				if (
					item.isArtifice &&
					item.artificeBoostedStat &&
					!artificeExtrapolationStats[item.artificeBoostedStat]
				) {
					return false;
				}
				// TODO: Write a better comparator for gear tiers
				if (
					item.gearTierId === EGearTierId.Uncommon ||
					item.gearTierId === EGearTierId.Common ||
					item.gearTierId === EGearTierId.Unknown
				) {
					return false;
				}
				// TODO: If the gear tier selector ever allows lower than blue this will need to be changed
				if (
					minimumGearTier === EGearTierId.Legendary &&
					item.gearTierId !== EGearTierId.Legendary
				) {
					return false;
				}
				return !excludedItemIds[item.id];
			}
		);
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

const getTotalModCost = (armorStatModIds: EModId[]): number => {
	let res = 0;
	armorStatModIds.forEach((id) => {
		res += getMod(id).cost;
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
