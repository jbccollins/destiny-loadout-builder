import { EModId } from '@dlb/generated/mod/EModId';
import { StatList } from '@dlb/types/Armor';
import { ArmorStatIdList, ArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EExtraSocketModCategoryId,
} from '@dlb/types/IdEnums';
import {
	PotentialRaidModArmorSlotPlacement,
	ArmorSlotIdToModIdListMapping,
} from '@dlb/types/Mod';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import { getItemCountsFromSeenArmorSlotItems } from './utils';
import { filterPotentialRaidModArmorSlotPlacements } from './getPotentialRaidModArmorSlotPlacements';
import { getStatModCombosFromDesiredStats } from './getStatModCombosFromDesiredStats';
import {
	convertStatModComboToExpandedStatModCombo,
	getModPlacements,
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
		destinyClassId,
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
		if (potentialRaidModPlacements.potentialPlacements === null) {
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
		// TODO: This is bad logic. If the user has no artifice class items
		// but has other artifice armor then this combination will have inncorrect
		// results
		if (requiredClassItemExtraModSocketCategoryId !== null) {
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

	// const modPlacements = getModPlacements({
	// 	statModCombos,
	// 	armorSlotMods,
	// 	potentialRaidModArmorSlotPlacements:
	// 		filteredPotentialRaidModArmorSlotPlacements,
	// });

	// if (modPlacements === null) {
	// 	return null;
	// }

	// const maximumSingleStatValues = getMaximumSingleStatValues({
	// 	sumOfSeenStats,
	// 	numArtificeItems: seenArtificeCount,
	// 	placements: modPlacements.placements,
	// 	armorSlotMods,
	// });

	// // TODO: This is wrong. We need to get the lowest cost placement
	// // by sorting the placements by cost and then getting the first one
	// const lowestCostPlacement =
	// 	modPlacements.placements.length > 0 ? modPlacements.placements[0] : null;

	// const result: ModCombos = {
	// 	maximumSingleStatValues,
	// 	armorSlotMetadata: getDefaultModComboArmorSlotMetadata(),
	// 	lowestCostPlacement,
	// 	requiredClassItemExtraModSocketCategoryId,
	// };

	// return result;

	// ArmorStatIdList.forEach((armorStatId) => {
	// 	const statModId = statModCombos[0][armorStatId].numMajorMods;
	// 	if (modId) {
	// 		statMods.push(statModId);
	// 	}
	// });

	const lowestCostPlacement =
		getDefaultArmorSlotModComboPlacementWithArtificeMods();
	if (statModCombos.length > 0) {
		const derp = convertStatModComboToExpandedStatModCombo(statModCombos[0]);
		derp.armorStatModIdList.forEach((modId, i) => {
			lowestCostPlacement.placement[
				ArmorSlotWithClassItemIdList[i]
			].armorStatModId = modId;
		});
		lowestCostPlacement.artificeModIdList = derp.artificeModIdList;
	}

	const result: ModCombos = {
		maximumSingleStatValues: null,
		armorSlotMetadata: getDefaultModComboArmorSlotMetadata(),
		lowestCostPlacement,
		requiredClassItemExtraModSocketCategoryId,
	};

	return result;
};
