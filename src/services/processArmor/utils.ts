import { EModId } from '@dlb/generated/mod/EModId';
import {
	AllClassItemMetadata,
	ArmorItem,
	ArmorMetadataItem,
	AvailableExoticArmorItem,
	ItemCounts,
	StatList,
	getDefaultItemCounts,
	getExtraMasterworkedStats,
} from '@dlb/types/Armor';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
} from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatModSpitFromArmorStatId,
	getDefaultArmorStatMapping,
	getStat,
} from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EMasterworkAssumption,
	EModCategoryId,
	ERaidAndNightMareModTypeId,
} from '@dlb/types/IdEnums';
import { PotentialRaidModArmorSlotPlacement, getMod } from '@dlb/types/Mod';
import { RaidAndNightmareModTypeIdList } from '@dlb/types/RaidAndNightmareModType';
import { ARTIFICE_MOD_BONUS_VALUE } from '@dlb/utils/item-utils';
import { cloneDeep } from 'lodash';
import { ARTIFICE, MAX_SINGLE_STAT_VALUE } from './constants';
import { SeenArmorSlotItems } from './seenArmorSlotItems';

// Round a number up to the nearest 5
export function roundUp5(x: number) {
	return Math.ceil(x / 5) * 5;
}

// Round a number up to the nearest 10
export function roundUp10(x: number) {
	return Math.ceil(x / 10) * 10;
}

// Round a number down to the nearest 10
export function roundDown10(x: number) {
	return Math.floor(x / 10) * 10;
}

// If we need 25 stats we need one minor stat and two major
export function canUseMinorStatMod(x: number) {
	return roundUp5(x) % 10 === 5;
}

export function deleteFromArray<T>(arr: T[], item: T): void {
	const index = arr.findIndex((x) => x === item);
	if (index >= 0) {
		arr.splice(index, 1);
	}
}

export const getTotalStatTiers = (
	armorStatMapping: ArmorStatMapping
): number => {
	let res = 0;
	ArmorStatIdList.forEach((armorStatId) => {
		res += roundDown10(armorStatMapping[armorStatId]) / 10;
	});
	return res;
};

export const getTotalModCost = (armorStatModIds: EModId[]): number => {
	let res = 0;
	armorStatModIds.forEach((id) => {
		res += getMod(id).cost;
	});
	return res;
};

export const getWastedStats = (armorStatMapping: ArmorStatMapping): number => {
	let res = 0;
	ArmorStatIdList.forEach((armorStatId) => {
		res += armorStatMapping[armorStatId] % 10;
	});
	return res;
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

export const getArmorSlotFromNumRemainingArmorPieces = (
	num: number
): EArmorSlotId => {
	if ([3, 2, 1, 0].includes(num)) {
		return numRemainingArmorPiecesToArmorSlot[num];
	}
	throw `num is not 3,2,1,0: ${num}`;
};

export const sumModCosts = (modIdList: EModId[]): number => {
	let cost = 0;
	modIdList.forEach((modId) => (cost += modId ? getMod(modId).cost : 0));
	return cost;
};

// TODO: Clean up these assumptions by checking against armor metadata instead of the MAX_SINGLE_STAT_VALUE.
// A wrench... The assumption that no armor piece can roll > 30 in a single stat is no longer
// true as of lightfall. If you had the blue solstice chestpiece ornament equipped when
// lighfall launched then your chespiece permanently gained +1 to resilience. Meaning that
// the total max base stats you could have now is 69. This is very rare but we should
// consider this case.
export const getMaxPossibleRemainingStatValue = (
	numRemainingArmorPieces: number,
	numSeenArtificeArmorItems: number,
	armorMetadataItem: ArmorMetadataItem,
	selectedExotic: AvailableExoticArmorItem
): number => {
	let maxPossibleRemainingStatValue =
		MAX_SINGLE_STAT_VALUE * numRemainingArmorPieces +
		numSeenArtificeArmorItems * ARTIFICE_MOD_BONUS_VALUE;
	const armorSlotId = getArmorSlotFromNumRemainingArmorPieces(
		numRemainingArmorPieces
	);
	// Check if any of the next armor slots can be artifice
	// If so then add the artifice bonus for each slot that can be artifice
	const index = 1 + ArmorSlotIdList.findIndex((x) => x === armorSlotId);
	// Get the max possible remaining artifice bonuses
	for (let i = index; i < ArmorSlotIdList.length; i++) {
		const armorSlotId = ArmorSlotIdList[i];
		if (
			armorSlotId !== selectedExotic.armorSlot && // Exotic items cannot be artifice
			armorMetadataItem.artifice.items[armorSlotId].count > 0
		) {
			maxPossibleRemainingStatValue += ARTIFICE_MOD_BONUS_VALUE;
		}
	}
	return maxPossibleRemainingStatValue;
};

// Convert an ordered list of stats into a mapping
export const getArmorStatMappingFromStatList = (
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

export const getStatListFromArmorStatMapping = (
	armorStatMapping: ArmorStatMapping
): StatList => {
	const res: StatList = [0, 0, 0, 0, 0, 0];
	ArmorStatIdList.forEach((armorStatId, i) => {
		res[i] = armorStatMapping[armorStatId];
	});
	return res;
};

export const sumStatLists = (statLists: StatList[]): StatList => {
	const res: StatList = [0, 0, 0, 0, 0, 0];
	statLists.forEach((statList) => {
		statList.forEach((stat, i) => {
			res[i] += stat;
		});
	});
	return res;
};

export const replaceMajorModsWithMinorMods = (
	armorStatModIdList: EModId[],
	modsToReplace: EModId[],
	destinyClassId: EDestinyClassId
): void => {
	modsToReplace.forEach((modId) => {
		const index = armorStatModIdList.findIndex((x) => x === modId);
		armorStatModIdList.splice(index, 1);
		deleteFromArray(armorStatModIdList, modId);
		const { stat } = getMod(modId).bonuses[0];
		const armorStatId = getStat(stat, destinyClassId).id;
		const minorModId = getArmorStatModSpitFromArmorStatId(armorStatId).minor;
		// Push the corresponding minor mod twice
		armorStatModIdList.push(minorModId);
		armorStatModIdList.push(minorModId);
	});
};

export const getItemCountsFromSeenArmorSlotItems = (
	seenArmorSlotItems: SeenArmorSlotItems
	// withClassItems: boolean
): ItemCounts => {
	const itemCounts = getDefaultItemCounts();
	ArmorSlotIdList.forEach((armorSlotId) => {
		const seenArmorSlotItem = seenArmorSlotItems[armorSlotId];
		if (seenArmorSlotItem === null) {
			return;
		}
		if (seenArmorSlotItem.isArtifice) {
			itemCounts.Artifice++;
		} else {
			const value =
				seenArmorSlotItem.raidAndNightmareModTypeId ||
				seenArmorSlotItem.intrinsicArmorPerkOrAttributeId;
			if (value !== null) {
				itemCounts[value]++;
			}
		}
	});
	// if (withClassItems) {
	// 	Object.keys(getDefaultItemCounts()).forEach((key) => {
	// 		if (seenArmorSlotItems.ClassItems[key]) {
	// 			itemCounts[key]++;
	// 		}
	// 	});
	// }
	return itemCounts;
};

// TODO: This will need to be updated for iron banner, and seasonal perk armor etc...
// A better way to would to check if it is of type vs "is not artifice"
export const stripNonRaidSeenArmorSlotItems = (
	seenArmorSlotItems: SeenArmorSlotItems
) => {
	const items: Partial<Record<EArmorSlotId, EModCategoryId>> = {
		[EArmorSlotId.Head]: null,
		[EArmorSlotId.Arm]: null,
		[EArmorSlotId.Chest]: null,
		[EArmorSlotId.Leg]: null,
	};
	ArmorSlotIdList.forEach((armorSlotId) => {
		if (
			RaidAndNightmareModTypeIdList.includes(
				seenArmorSlotItems[armorSlotId]?.raidAndNightmareModTypeId
			)
		) {
			// TODO: God I hate this casting shit
			items[armorSlotId] = seenArmorSlotItems[armorSlotId]
				.raidAndNightmareModTypeId as EModCategoryId;
		}
	});
	return items;
};

export type FilterValidRaidModArmorSlotPlacementsParams = {
	seenArmorSlotItems: SeenArmorSlotItems;
	requiredClassItemMetadataKey: RequiredClassItemMetadataKey;
	validRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
};
// Filter out the placements that put a raid mod on a non-raid armor piece
export const filterRaidModArmorSlotPlacements = ({
	seenArmorSlotItems,
	requiredClassItemMetadataKey,
	validRaidModArmorSlotPlacements,
}: FilterValidRaidModArmorSlotPlacementsParams): PotentialRaidModArmorSlotPlacement[] => {
	const raidSeenArmorSlotItems =
		stripNonRaidSeenArmorSlotItems(seenArmorSlotItems);
	const validPlacements: PotentialRaidModArmorSlotPlacement[] = [];
	const armorItemsExtraModSocketCategories = {
		[EArmorSlotId.Head]: raidSeenArmorSlotItems.Head,
		[EArmorSlotId.Arm]: raidSeenArmorSlotItems.Arm,
		[EArmorSlotId.Chest]: raidSeenArmorSlotItems.Chest,
		[EArmorSlotId.Leg]: raidSeenArmorSlotItems.Leg,
		[EArmorSlotId.ClassItem]: requiredClassItemMetadataKey,
	};

	for (let i = 0; i < validRaidModArmorSlotPlacements.length; i++) {
		const placement = validRaidModArmorSlotPlacements[i];
		let isValid = true;
		for (let j = 0; j < ArmorSlotWithClassItemIdList.length; j++) {
			const armorSlotId = ArmorSlotWithClassItemIdList[j];
			if (placement[armorSlotId]) {
				const mod = getMod(placement[armorSlotId]);
				if (
					mod.raidAndNightmareModTypeId !==
					armorItemsExtraModSocketCategories[armorSlotId]
				) {
					isValid = false;
					break;
				}
			}
		}
		if (isValid) {
			validPlacements.push(placement);
		}
	}
	return validPlacements;
};

export const getExtraSumOfSeenStats = (
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

export const getArmorStatMappingFromArtificeModIdList = (
	artificeModIdList: EModId[]
): ArmorStatMapping => {
	const armorStatMapping: ArmorStatMapping = getDefaultArmorStatMapping();
	artificeModIdList.forEach((artificeModId) => {
		armorStatMapping[getMod(artificeModId).bonuses[0].stat] +=
			ARTIFICE_MOD_BONUS_VALUE;
	});
	return armorStatMapping;
};

export const getNextSeenStats = (
	sumOfSeenStats: StatList,
	armorSlotItem: ArmorItem,
	masterworkAssumption: EMasterworkAssumption
): StatList =>
	sumOfSeenStats.map(
		(x, i) =>
			x +
			armorSlotItem.stats[i] +
			getExtraMasterworkedStats(armorSlotItem, masterworkAssumption)
	) as StatList;

type GetNextValuesParams = {
	numArmorItems: number;
	seenArmorSlotItems: SeenArmorSlotItems;
	sumOfSeenStats: StatList;
	armorSlotItem: ArmorItem;
	masterworkAssumption: EMasterworkAssumption;
};

export const getNextValues = ({
	numArmorItems,
	seenArmorSlotItems,
	sumOfSeenStats,
	armorSlotItem,
	masterworkAssumption,
}: GetNextValuesParams) => {
	const slot = getArmorSlotFromNumRemainingArmorPieces(numArmorItems);
	const nextSeenArmorSlotItems = cloneDeep(seenArmorSlotItems);
	if (armorSlotItem.isArtifice) {
		nextSeenArmorSlotItems[slot] = ARTIFICE;
	} else if (armorSlotItem.socketableRaidAndNightmareModTypeId !== null) {
		nextSeenArmorSlotItems[slot] =
			armorSlotItem.socketableRaidAndNightmareModTypeId;
	}
	const nextSumOfSeenStats = getNextSeenStats(
		sumOfSeenStats,
		armorSlotItem,
		masterworkAssumption
	);

	return {
		nextSeenArmorSlotItems,
		nextSumOfSeenStats,
	};
};

export const getExtraSocketModCategoryIdCountsFromRaidModIdList = (
	raidModIdList: EModId[]
): Partial<Record<ERaidAndNightMareModTypeId, number>> => {
	const counts: Partial<Record<ERaidAndNightMareModTypeId, number>> = {};
	for (let i = 0; i < raidModIdList.length; i++) {
		const mod = getMod(raidModIdList[i]);
		if (!counts[mod.raidAndNightmareModTypeId]) {
			counts[mod.raidAndNightmareModTypeId] = 0;
		}
		counts[mod.raidAndNightmareModTypeId]++;
	}
	return counts;
};

export type RequiredClassItemMetadataKey = keyof AllClassItemMetadata | null;

export type HasValidSeenItemCountsParams = {
	seenItemCounts: ItemCounts;
	raidModExtraSocketModCategoryIdCounts: Partial<
		Record<ERaidAndNightMareModTypeId, number>
	>;
	allClassItemMetadata: AllClassItemMetadata;
};

export const isRaidOrNightmareRequiredClassItem = (
	requiredClassItemMetadataKey: RequiredClassItemMetadataKey
): boolean => {
	return RaidAndNightmareModTypeIdList.includes(
		requiredClassItemMetadataKey as ERaidAndNightMareModTypeId
	);
};

export const hasValidSeenItemCounts = ({
	seenItemCounts,
	raidModExtraSocketModCategoryIdCounts,
	allClassItemMetadata,
}: HasValidSeenItemCountsParams): {
	isValid: boolean;
	requiredClassItemMetadataKey: RequiredClassItemMetadataKey;
} => {
	let isValid = true;
	let requiredClassItemMetadataKey: RequiredClassItemMetadataKey = null;
	const extraSocketModCategoryIdList = Object.keys(
		raidModExtraSocketModCategoryIdCounts
	) as unknown as ERaidAndNightMareModTypeId[];
	if (extraSocketModCategoryIdList.length > 0) {
		// Check to see if we have armor that can fit these mods
		for (let i = 0; i < extraSocketModCategoryIdList.length; i++) {
			const extraSocketModCategoryId = extraSocketModCategoryIdList[i];
			if (
				raidModExtraSocketModCategoryIdCounts[extraSocketModCategoryId] >
				seenItemCounts[extraSocketModCategoryId]
			) {
				// Add in the class item if we have to
				// TODO: This logic will need to change for combos where we have enough
				// non-class item pieces but they don't have the mod space to fit the raid
				// mods without using the class item for a raid mod
				if (
					// We don't already have a special required class item
					requiredClassItemMetadataKey === null &&
					// We have a class item that can fit the special requirements
					allClassItemMetadata[extraSocketModCategoryId].items.length > 0 &&
					// Adding the special class item will allow us to potentially
					// fit all the raid mods
					raidModExtraSocketModCategoryIdCounts[extraSocketModCategoryId] ===
						seenItemCounts[extraSocketModCategoryId] + 1
				) {
					requiredClassItemMetadataKey = extraSocketModCategoryId;
					continue;
				}
				isValid = false;
				requiredClassItemMetadataKey = null;
				break;
			}
		}
	}
	return {
		isValid,
		requiredClassItemMetadataKey,
	};
};
