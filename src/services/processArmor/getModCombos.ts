import { EModId } from '@dlb/generated/mod/EModId';
import { StatList } from '@dlb/types/Armor';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatModSpitFromArmorStatId,
} from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EExtraSocketModCategoryId,
} from '@dlb/types/IdEnums';
import {
	PotentialRaidModArmorSlotPlacement,
	ArmorSlotIdToModIdListMapping,
	getMod,
	ArmorSlotCapacity,
} from '@dlb/types/Mod';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import { getItemCountsFromSeenArmorSlotItems } from './utils';
import { filterPotentialRaidModArmorSlotPlacements } from './getPotentialRaidModArmorSlotPlacements';
import {
	StatModCombo,
	getStatModCombosFromDesiredStats,
} from './getStatModCombosFromDesiredStats';
import {
	convertStatModComboToExpandedStatModCombo,
	getArmorSlotCapacities,
	getModPlacements,
	hasValidModPlacement,
} from './getModPlacements';
import { getMaximumSingleStatValues } from './getMaximumSingleStatValues';
import combinations from '@dlb/utils/combinations';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
} from '@dlb/types/ArmorSlot';

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

export const getDefaultModComboArmorSlotMetadata =
	(): ModComboArmorSlotMetadata => {
		const metadata: ModComboArmorSlotMetadata = {
			[EArmorSlotId.Head]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
			[EArmorSlotId.Arm]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
			[EArmorSlotId.Chest]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
			[EArmorSlotId.Leg]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
			[EArmorSlotId.ClassItem]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
		};
		return metadata;
	};

/***** ModCombos *****/
export type ModCombos = {
	maximumSingleStatValues: Record<EArmorStatId, number>;
	armorSlotMetadata: ModComboArmorSlotMetadata;
	lowestCostPlacement: ModPlacement;
	requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId;
	// TODO: fewestWastedStatsPlacement: ModPlacement;
	// TODO: mostStatTiersPlacement: ModPlacement;
};

export const getDefaultModCombos = (): ModCombos => ({
	maximumSingleStatValues: {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	},
	armorSlotMetadata: getDefaultModComboArmorSlotMetadata(),
	lowestCostPlacement: null,
	requiredClassItemExtraModSocketCategoryId: null,
});

export type GetModCombosParams = {
	sumOfSeenStats: StatList;
	desiredArmorStats: ArmorStatMapping;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	specialSeenArmorSlotItems: SeenArmorSlotItems;
};

export const getModCombos = (params: GetModCombosParams): ModCombos => {
	const {
		sumOfSeenStats,
		desiredArmorStats,
		potentialRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		specialSeenArmorSlotItems,
	} = params;

	const seenItemCounts = getItemCountsFromSeenArmorSlotItems(
		specialSeenArmorSlotItems
	);
	let seenArtificeCount = seenItemCounts.artifice;

	let requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId =
		null;

	let filteredPotentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[] =
		null;

	// TODO: Cache this result
	if (raidMods.length > 0) {
		// Filter the potential raid mod placemnts down to the placements that
		// have a chance at actually working for this specific armor cobmination
		const potentialRaidModPlacements =
			filterPotentialRaidModArmorSlotPlacements({
				potentialRaidModArmorSlotPlacements,
				raidMods,
				specialSeenArmorSlotItems,
			});
		// We have nowhere to put raid mods
		if (!potentialRaidModPlacements?.potentialPlacements) {
			return null;
		}
		const {
			potentialPlacements: _raidModArmorSlotPlacements,
			requiredClassItemExtraModSocketCategoryId:
				_requiredClassItemExtraModSocketCategoryId,
		} = potentialRaidModPlacements;

		if (_raidModArmorSlotPlacements.length === 0) {
			return null;
		}

		filteredPotentialRaidModArmorSlotPlacements = _raidModArmorSlotPlacements;
		requiredClassItemExtraModSocketCategoryId =
			_requiredClassItemExtraModSocketCategoryId;

		// We can't use artifice class items now
		if (
			requiredClassItemExtraModSocketCategoryId !== null &&
			specialSeenArmorSlotItems.ClassItems.artifice
		) {
			seenArtificeCount -= 1;
		}
	}

	// Get all the stat mod combos which get us to the desiredArmorStats
	// TODO: Cache this result
	const statModCombos = getStatModCombosFromDesiredStats({
		currentStats: sumOfSeenStats,
		targetStats: desiredArmorStats,
		numArtificeItems: seenArtificeCount,
	});

	if (statModCombos === null) {
		return null;
	}

	const lowestCostPlacement =
		getDefaultArmorSlotModComboPlacementWithArtificeMods();

	const { isValid, combo } = getFirstValidStatModCombo({
		statModComboList: statModCombos,
		potentialRaidModArmorSlotPlacements:
			filteredPotentialRaidModArmorSlotPlacements,
		armorSlotMods,
	});

	if (!isValid) {
		return null;
	}

	if (combo) {
		const expandedCombo = convertStatModComboToExpandedStatModCombo(combo);
		expandedCombo.armorStatModIdList.forEach((modId, i) => {
			lowestCostPlacement.placement[
				ArmorSlotWithClassItemIdList[i]
			].armorStatModId = modId;
		});
		lowestCostPlacement.artificeModIdList = expandedCombo.artificeModIdList;
	}

	// TODO: Two more steps
	// 1. Get the desired stat preview. Binary search increased desired stat tiers for each stat
	//    Make sure to cache the highest seen natural stat tier for each stat to make
	//    this faster
	// 2. Get the armor slot mod preview. Use existing desired stat tiers
	//    to binary search reserved armor energy for each armor slot

	const result: ModCombos = {
		maximumSingleStatValues: null,
		armorSlotMetadata: getDefaultModComboArmorSlotMetadata(),
		lowestCostPlacement,
		requiredClassItemExtraModSocketCategoryId,
	};

	return result;
};

type GetFirstValidStatModComboParams = {
	statModComboList: StatModCombo[];
	potentialRaidModArmorSlotPlacements:
		| PotentialRaidModArmorSlotPlacement[]
		| null;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
};

type GetFirstValidStatModComboResult = {
	isValid: boolean;
	combo: StatModCombo;
};

// Pick the first combo that has a valid placement
const getFirstValidStatModCombo = ({
	statModComboList,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
}: GetFirstValidStatModComboParams): GetFirstValidStatModComboResult => {
	if (statModComboList.length === 0) {
		return { isValid: true, combo: null };
	}

	if (armorSlotMods[EArmorSlotId.Arm].filter((x) => x !== null).length === 3) {
		console.log('>>> three', armorSlotMods);
	}

	const armorSlotCapacities = getArmorSlotCapacities({
		armorSlotMods,
		potentialRaidModArmorSlotPlacements,
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

	for (let i = 0; i < statModComboList.length; i++) {
		const { armorStatModIdList } = convertStatModComboToExpandedStatModCombo(
			statModComboList[i]
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
				return { isValid: true, combo: statModComboList[i] };
			}
		}
	}
	return { isValid: false, combo: null };
};
