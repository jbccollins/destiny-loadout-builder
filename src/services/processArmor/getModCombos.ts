import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { AllClassItemMetadata, ItemCounts, StatList } from '@dlb/types/Armor';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatModSpitFromArmorStatId,
} from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EDestinyClassId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import {
	ArmorSlotCapacity,
	ArmorSlotIdToModIdListMapping,
	PotentialRaidModArmorSlotPlacement,
	getArmorSlotEnergyCapacity,
	getDefaultPotentialRaidModArmorSlotPlacement,
	getMod,
} from '@dlb/types/Mod';
import { ARTIFICE, EXTRA_MASTERWORK_STAT_LIST } from './constants';
import { filterPotentialRaidModArmorSlotPlacements } from './filterPotentialRaidModArmorSlotPlacements';
import {
	StatModCombo,
	getDefaultStatModCombo,
	getStatModCombosFromDesiredStats,
} from './getStatModCombosFromDesiredStats';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import {
	RequiredClassItemMetadataKey,
	getItemCountsFromSeenArmorSlotItems,
	sumModCosts,
	sumStatLists,
} from './utils';

/***** ArmorSlotModComboPlacementWithArtificeMods *****/
export type ArmorStatAndRaidModComboPlacementValue = {
	armorStatModId: EModId;
	raidModId: EModId;
};

export type ArmorStatAndRaidModComboPlacement = Record<
	EArmorSlotId,
	ArmorStatAndRaidModComboPlacementValue
>;

export type ModPlacement = {
	placement: ArmorStatAndRaidModComboPlacement;
	artificeModIdList: EModId[];
};

export const getDefaultModPlacements = (): ModPlacement => ({
	placement: {
		[EArmorSlotId.Head]: { armorStatModId: null, raidModId: null },
		[EArmorSlotId.Arm]: { armorStatModId: null, raidModId: null },
		[EArmorSlotId.Chest]: { armorStatModId: null, raidModId: null },
		[EArmorSlotId.Leg]: { armorStatModId: null, raidModId: null },
		[EArmorSlotId.ClassItem]: { armorStatModId: null, raidModId: null },
	},
	artificeModIdList: [],
});

export const getDefaultArmorSlotModComboPlacementWithArtificeMods =
	(): ModPlacement => {
		return {
			placement: {
				[EArmorSlotId.Head]: {
					armorStatModId: null,
					raidModId: null,
				},
				[EArmorSlotId.Arm]: {
					armorStatModId: null,
					raidModId: null,
				},
				[EArmorSlotId.Chest]: {
					armorStatModId: null,
					raidModId: null,
				},
				[EArmorSlotId.Leg]: {
					armorStatModId: null,
					raidModId: null,
				},
				[EArmorSlotId.ClassItem]: {
					armorStatModId: null,
					raidModId: null,
				},
			},
			artificeModIdList: [],
		};
	};

/***** ModComboArmorSlotMetadata *****/
export type ModComboArmorSlotMetadata = Record<
	EArmorSlotId,
	{
		minUnusedArmorEnergy: number;
		maxUnusedArmorEnergy: number;
	}
>;

/***** ModCombos *****/
export type ModCombos = {
	lowestCostPlacement: ModPlacement;
	requiredClassItemMetadataKey: RequiredClassItemMetadataKey;
	hasMasterworkedClassItem: boolean;
	// TODO: fewestWastedStatsPlacement: ModPlacement;
	// TODO: mostStatTiersPlacement: ModPlacement;
};

export const getDefaultModCombos = (): ModCombos => ({
	lowestCostPlacement: {
		artificeModIdList: [],
		placement: {
			[EArmorSlotId.Arm]: {
				armorStatModId: null,
				raidModId: null,
			},
			[EArmorSlotId.Chest]: {
				armorStatModId: null,
				raidModId: null,
			},
			[EArmorSlotId.ClassItem]: {
				armorStatModId: null,
				raidModId: null,
			},
			[EArmorSlotId.Head]: {
				armorStatModId: null,
				raidModId: null,
			},
			[EArmorSlotId.Leg]: {
				armorStatModId: null,
				raidModId: null,
			},
		},
	},
	requiredClassItemMetadataKey: null,
	hasMasterworkedClassItem: false,
});

type ProcessPotentialRaidModArmorSlotPlacmentParams = {
	placement: PotentialRaidModArmorSlotPlacement;
	sumOfSeenStats: StatList;
	allClassItemMetadata: AllClassItemMetadata;
	desiredArmorStats: ArmorStatMapping;
	useZeroWastedStats: boolean;
	seenItemCounts: ItemCounts;
	masterworkAssumption: EMasterworkAssumption;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
};

const processPotentialRaidModArmorSlotPlacement = (
	params: ProcessPotentialRaidModArmorSlotPlacmentParams
) => {
	const {
		placement,
		sumOfSeenStats,
		allClassItemMetadata,
		desiredArmorStats,
		useZeroWastedStats,
		seenItemCounts,
		masterworkAssumption,
		armorSlotMods,
		reservedArmorSlotEnergy,
	} = params;
	let canUseArtificeClassItem = false;
	let hasDefaultMasterworkedClassItem = false;
	let _sumOfSeenStats: StatList = [...sumOfSeenStats];

	const requiredClassItemMetadataKey = placement.ClassItem
		? getMod(placement.ClassItem).raidAndNightmareModTypeId
		: null;

	// We can use artifice class items if we don't need a special kind of class item
	// TODO: We need to be careful in the case where the user does not have a masterworked artifice class item
	// and they have turned off the legendary masterwork assumption. It may be more beneficial
	// to use a standard masterworked legendary class item over an unmasterworked artifice class item.
	// The current logic here is bad. We probably need to check both cases and return each
	// as a different result if both have valid mod combos.
	if (requiredClassItemMetadataKey === null) {
		canUseArtificeClassItem = allClassItemMetadata.Artifice.items.length > 0;
	} else if (
		allClassItemMetadata[requiredClassItemMetadataKey].hasMasterworkedVariant
	) {
		hasDefaultMasterworkedClassItem = true;
		_sumOfSeenStats = sumStatLists([
			sumOfSeenStats,
			EXTRA_MASTERWORK_STAT_LIST,
		]);
	}

	// This is a special edge case where all of these conditions are true
	// 1. We have a masterworked legendary class item
	// 2. We do not need to use a raid or intrinsic class item
	// 3. We have an unmasterworked artifice class item
	// 4. We have turned off the legendary masterwork assumption
	// In this case we need to check both of these cases:
	// a. The single +3 granted from the artifice class item can hit the desired stat tiers
	// b. The +2 in every stat from the masterworked legendary class item can hit the desired stat tiers
	const needsSpecialArtificeClassItemCheck =
		allClassItemMetadata.Legendary.hasMasterworkedVariant &&
		canUseArtificeClassItem &&
		!allClassItemMetadata.Artifice.hasMasterworkedVariant &&
		masterworkAssumption === EMasterworkAssumption.None;

	let defaultStatModCombosSumOfSeenStats = _sumOfSeenStats;
	let defaultStatModsSeenArtificeCount = seenItemCounts.Artifice;
	// If we don't need to check the special edge case we only care about the
	// artifice class item and can disregard the masterworked legendary class item
	// as the artifice class item is strictly better
	if (!needsSpecialArtificeClassItemCheck) {
		if (canUseArtificeClassItem) {
			defaultStatModsSeenArtificeCount++;
			if (allClassItemMetadata.Artifice.hasMasterworkedVariant) {
				hasDefaultMasterworkedClassItem = true; // TODO: Split this out for defaultStatModCombos and artificeClassItemStatModCombos
				defaultStatModCombosSumOfSeenStats = sumStatLists([
					sumOfSeenStats,
					EXTRA_MASTERWORK_STAT_LIST,
				]);
			}
		} else if (
			requiredClassItemMetadataKey === null &&
			allClassItemMetadata.Legendary.hasMasterworkedVariant
		) {
			hasDefaultMasterworkedClassItem = true;
			defaultStatModCombosSumOfSeenStats = sumStatLists([
				sumOfSeenStats,
				EXTRA_MASTERWORK_STAT_LIST,
			]);
		}
	} else if (
		requiredClassItemMetadataKey === null &&
		allClassItemMetadata.Legendary.hasMasterworkedVariant
	) {
		hasDefaultMasterworkedClassItem = true;
		defaultStatModCombosSumOfSeenStats = sumStatLists([
			_sumOfSeenStats,
			EXTRA_MASTERWORK_STAT_LIST,
		]);
	}

	// Get all the stat mod combos which get us to the desiredArmorStats
	// TODO: Cache this result
	const defaultStatModCombos = getStatModCombosFromDesiredStats({
		currentStats: defaultStatModCombosSumOfSeenStats,
		targetStats: desiredArmorStats,
		numArtificeItems: defaultStatModsSeenArtificeCount,
		useZeroWastedStats,
	});

	let artificeClassItemStatModCombos = null;
	if (needsSpecialArtificeClassItemCheck) {
		artificeClassItemStatModCombos = getStatModCombosFromDesiredStats({
			currentStats: _sumOfSeenStats,
			targetStats: desiredArmorStats,
			numArtificeItems: seenItemCounts.Artifice + 1,
			useZeroWastedStats,
		});
	}

	const allStatModCombos = [
		defaultStatModCombos,
		artificeClassItemStatModCombos,
	].filter((x) => x !== null);

	if (allStatModCombos.length === 0) {
		return null;
	}

	const result: ModCombos[] = [];
	allStatModCombos.forEach((statModCombos, i) => {
		const isSpecialArtificeClassItemCheck = i === 1;
		const lowestCostPlacement =
			getDefaultArmorSlotModComboPlacementWithArtificeMods();

		const { isValid, combo } = getFirstValidStatModCombo({
			statModComboList: statModCombos,
			// TODO: This will always be a list of 1. Refactor this
			potentialRaidModArmorSlotPlacements: [placement],
			armorSlotMods,
			reservedArmorSlotEnergy,
		});

		if (!isValid) {
			return;
		}

		if (combo) {
			const expandedCombo = convertStatModComboToExpandedStatModCombo(combo);
			// TODO: This is wrong logic. It's just placing mods with no regard for capacity
			expandedCombo.armorStatModIdList.forEach((modId, i) => {
				lowestCostPlacement.placement[
					ArmorSlotWithClassItemIdList[i]
				].armorStatModId = modId;
			});
			// placementCapacity.forEach((placement, i) => {
			// 	lowestCostPlacement.placement[
			// 		placement.armorSlotId
			// 	].armorStatModId = placement.;
			// })
			lowestCostPlacement.artificeModIdList = expandedCombo.artificeModIdList;
		}
		const seenArtificeCount = isSpecialArtificeClassItemCheck
			? seenItemCounts.Artifice + 1
			: defaultStatModsSeenArtificeCount;
		const res: ModCombos = {
			lowestCostPlacement,
			requiredClassItemMetadataKey:
				// If we don't need the artifice class item to socket an artifice mod then clear
				// the requiredClassItemMetadataKey
				(canUseArtificeClassItem &&
					requiredClassItemMetadataKey === null &&
					lowestCostPlacement.artificeModIdList.length > 0 &&
					lowestCostPlacement.artificeModIdList.length) === seenArtificeCount
					? ARTIFICE
					: requiredClassItemMetadataKey,
			hasMasterworkedClassItem: isSpecialArtificeClassItemCheck
				? false
				: hasDefaultMasterworkedClassItem,
		};
		// When the artifice class item from the special check is not needed,
		// it's effectively the exact same result as the masterworked legendary class item,
		// just worse since it doesn't have the +2 masterworked bonuses
		if (
			isSpecialArtificeClassItemCheck &&
			res.requiredClassItemMetadataKey === null
		) {
			return;
		}
		result.push(res);
	});
	// If either result provides no benefit over the other then remove one of them
	// Prefer the masterworked legedary over the unmasterworked artifice
	if (result.length === 2) {
		const comboCosts = result.map((x) => {
			return sumModCosts(
				ArmorSlotWithClassItemIdList.map((armorSlotId) => {
					return x.lowestCostPlacement.placement[armorSlotId].armorStatModId;
				})
			);
		});
		if (comboCosts[0] <= comboCosts[1]) {
			result.splice(1, 1);
		} else if (comboCosts[1] <= comboCosts[0]) {
			result.splice(0, 1);
		}
	}
	return result.length > 0 ? result : null;
};

export type GetModCombosParams = {
	sumOfSeenStats: StatList;
	desiredArmorStats: ArmorStatMapping;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	specialSeenArmorSlotItems: SeenArmorSlotItems;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	useZeroWastedStats: boolean;
	allClassItemMetadata: AllClassItemMetadata;
	masterworkAssumption: EMasterworkAssumption;
};

// This return type is a bit... misleading...
// At the moment it SHOULD only ever return a single [ModCombos] array.
// When writing this I was wrestling with how to handle masterwork assumptions
// If the user wants to reduce wasted stats or hit zero wasted stats then there
// are cases where we want to ignore the masterwork assumption and determine
// whether or not to masterwork certain pieces of unmasterworked armor. But
// That logic is just too complex for the moment. So for now we just return
// a single [ModCombos] array. If we ever need to return multiple [ModCombos]
// arrays then we'll need to refactor this.
export const getModCombos = (params: GetModCombosParams): ModCombos[] => {
	const {
		sumOfSeenStats,
		desiredArmorStats,
		potentialRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		specialSeenArmorSlotItems,
		reservedArmorSlotEnergy,
		useZeroWastedStats,
		allClassItemMetadata,
		masterworkAssumption,
	} = params;

	// First sanity check the armorSlotMods against the reserved armorSlotEnergy
	// TODO: For some reason getFirstValidStatModCombo won't catch this case
	// So as a hack I'm doing it here for now...
	for (const armorSlotId of ArmorSlotWithClassItemIdList) {
		if (
			sumModCosts(armorSlotMods[armorSlotId]) +
				reservedArmorSlotEnergy[armorSlotId] >
			10
		) {
			return null;
		}
	}

	const seenItemCounts = getItemCountsFromSeenArmorSlotItems(
		specialSeenArmorSlotItems
	);

	let filteredPotentialRaidModArmorSlotPlacements = [
		getDefaultPotentialRaidModArmorSlotPlacement(),
	];

	// TODO: Cache this result
	if (raidMods.length > 0) {
		// Filter the potential raid mod placements down to the placements that
		// have a chance at actually working for this specific armor cobmination
		filteredPotentialRaidModArmorSlotPlacements =
			filterPotentialRaidModArmorSlotPlacements({
				potentialRaidModArmorSlotPlacements,
				raidMods,
				specialSeenArmorSlotItems,
				allClassItemMetadata,
			});
		// We have nowhere to put raid mods
		if (filteredPotentialRaidModArmorSlotPlacements === null) {
			return null;
		}
	}

	const modCombos: ModCombos[] = [];
	filteredPotentialRaidModArmorSlotPlacements.forEach((placement) => {
		processPotentialRaidModArmorSlotPlacement({
			placement,
			sumOfSeenStats,
			allClassItemMetadata,
			desiredArmorStats,
			useZeroWastedStats,
			seenItemCounts,
			masterworkAssumption,
			armorSlotMods,
			reservedArmorSlotEnergy,
		})?.forEach((modCombo) => {
			modCombos.push(modCombo);
		});
	});
	return modCombos.length > 0 ? modCombos : null;
};

export type ModCombosClassItem = {
	requiredClassItemMetadataKey: RequiredClassItemMetadataKey;
	needsMasterworked: boolean;
	needsArtifice: boolean;
};

type GetFirstValidStatModComboParams = {
	statModComboList: StatModCombo[];
	potentialRaidModArmorSlotPlacements:
		| PotentialRaidModArmorSlotPlacement[]
		| null;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
};

type GetFirstValidStatModComboResult = {
	isValid: boolean;
	combo: StatModCombo;
	// placementCapacity: ArmorSlotCapacity[];
};

// Pick the first combo that has a valid placement
const getFirstValidStatModCombo = ({
	statModComboList,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	reservedArmorSlotEnergy,
}: GetFirstValidStatModComboParams): GetFirstValidStatModComboResult => {
	if (
		statModComboList.length === 0 &&
		(potentialRaidModArmorSlotPlacements === null ||
			potentialRaidModArmorSlotPlacements.length == 0)
	) {
		return { isValid: true, combo: null };
	}

	const armorSlotCapacities = getArmorSlotCapacities({
		armorSlotMods,
		potentialRaidModArmorSlotPlacements,
		reservedArmorSlotEnergy,
	});

	const allSortedCapacities: ArmorSlotCapacity[][] = [];
	for (let j = 0; j < armorSlotCapacities.length; j++) {
		const capacity = armorSlotCapacities[j];
		const sortedArmorSlotCapacities = Object.values(capacity).sort(
			// Sort by capacity then by name. By name is just for making consistent testing easier
			(a, b) =>
				b.capacity - a.capacity || a.armorSlotId.localeCompare(b.armorSlotId)
		);
		allSortedCapacities.push(sortedArmorSlotCapacities);
	}

	let _statModComboList = [...statModComboList];

	// This edge case is when we have raid mods but no stat mods are necessary
	if (_statModComboList.length === 0) {
		_statModComboList = [getDefaultStatModCombo()];
	}
	for (let i = 0; i < _statModComboList.length; i++) {
		const { armorStatModIdList } = convertStatModComboToExpandedStatModCombo(
			_statModComboList[i]
		);
		const sortedArmorStatMods = [...armorStatModIdList].sort(
			(a, b) => getMod(b).cost - getMod(a).cost
		);

		for (let j = 0; j < allSortedCapacities.length; j++) {
			const capacity = allSortedCapacities[j];
			if (
				hasValidModPlacement({
					sortedArmorStatMods,
					sortedArmorSlotCapacities: capacity,
				})
			) {
				// const placementCapacity = cloneDeep(capacity);
				// sortedArmorStatMods.forEach((modId, k) => {
				// 	placementCapacity[k].armorStatModId = modId;
				// });
				return {
					isValid: true,
					combo: _statModComboList[i],
					// placementCapacity,
				};
			}
		}
	}
	return { isValid: false, combo: null };
};

export type ExpandedStatModCombo = {
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
};

// Use the counts to generate lists of mods to permute
export const convertStatModComboToExpandedStatModCombo = (
	combo: StatModCombo
): ExpandedStatModCombo => {
	const expandedCombo: ExpandedStatModCombo = {
		armorStatModIdList: [],
		artificeModIdList: [],
	};
	ArmorStatIdList.forEach((armorStatId) => {
		if (!combo[armorStatId]) {
			return;
		}
		const { numArtificeMods, numMajorMods, numMinorMods } = combo[armorStatId];
		const split = getArmorStatModSpitFromArmorStatId(armorStatId);
		for (let i = 0; i < numArtificeMods; i++) {
			expandedCombo.artificeModIdList.push(split.artifice);
		}
		for (let i = 0; i < numMajorMods; i++) {
			expandedCombo.armorStatModIdList.push(split.major);
		}
		for (let i = 0; i < numMinorMods; i++) {
			expandedCombo.armorStatModIdList.push(split.minor);
		}
	});
	return expandedCombo;
};

type HasValidModPlacementParams = {
	sortedArmorStatMods: EModId[];
	sortedArmorSlotCapacities: ArmorSlotCapacity[];
};

// Put the highest cost mod in the highest capacity slot
// Put the second highest cost mod in the second highest capacity slot, etc...
export const hasValidModPlacement = ({
	sortedArmorStatMods,
	sortedArmorSlotCapacities,
}: HasValidModPlacementParams): boolean => {
	let isValid = true;
	for (let i = 0; i < sortedArmorStatMods.length; i++) {
		if (
			getMod(sortedArmorStatMods[i]).cost >
			sortedArmorSlotCapacities[i].capacity
		) {
			isValid = false;
			break;
		}
	}
	return isValid;
};

export type GetArmorSlotCapacitiesParams = {
	potentialRaidModArmorSlotPlacements:
		| PotentialRaidModArmorSlotPlacement[]
		| null;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
};
export const getArmorSlotCapacities = ({
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	reservedArmorSlotEnergy,
}: GetArmorSlotCapacitiesParams): Record<EArmorSlotId, ArmorSlotCapacity>[] => {
	const hasRaidMods = potentialRaidModArmorSlotPlacements?.length > 0;
	let allArmorSlotCapacities = [getArmorSlotEnergyCapacity(armorSlotMods)];
	if (hasRaidMods) {
		allArmorSlotCapacities = [];
		for (let i = 0; i < potentialRaidModArmorSlotPlacements.length; i++) {
			const armorSlotCapacities = getArmorSlotEnergyCapacity(armorSlotMods);
			const raidModPlacement = potentialRaidModArmorSlotPlacements[i];
			let isValid = true;
			// Update the armorSlotCapacities for this particular raid mod placement permutation
			for (let j = 0; j < ArmorSlotWithClassItemIdList.length; j++) {
				const armorSlotId = ArmorSlotWithClassItemIdList[j];
				const newCapacity =
					armorSlotCapacities[armorSlotId].capacity -
					(raidModPlacement[armorSlotId]
						? getMod(raidModPlacement[armorSlotId]).cost
						: 0) -
					reservedArmorSlotEnergy[armorSlotId];
				if (newCapacity < 0) {
					isValid = false;
					break;
				}
				armorSlotCapacities[armorSlotId].capacity = newCapacity;
				armorSlotCapacities[armorSlotId].raidModId =
					raidModPlacement[armorSlotId];
			}
			if (isValid) {
				allArmorSlotCapacities.push(armorSlotCapacities);
			}
		}
	} else {
		for (let i = 0; i < ArmorSlotWithClassItemIdList.length; i++) {
			const armorSlotId = ArmorSlotWithClassItemIdList[i];
			if (reservedArmorSlotEnergy[armorSlotId] === 0) {
				continue;
			}
			for (let j = 0; j < allArmorSlotCapacities.length; j++) {
				allArmorSlotCapacities[j][armorSlotId].capacity -=
					reservedArmorSlotEnergy[armorSlotId];
			}
		}
	}

	return allArmorSlotCapacities;
};
