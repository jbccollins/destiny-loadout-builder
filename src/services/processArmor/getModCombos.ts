import { EModId } from '@dlb/generated/mod/EModId';
import { StatList } from '@dlb/types/Armor';
import { ArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
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
import { getModPlacements } from './getModPlacements';
import { getMaximumSingleStatValues } from './getMaximumSingleStatValues';

/***** ArmorSlotModComboPlacementWithArtificeMods *****/
export type ArmorStatAndRaidModComboPlacementValue = {
	armorStatModId: EModId;
	raidModId: EModId;
};

export type ArmorStatAndRaidModComboPlacement = Record<
	EArmorSlotId,
	ArmorStatAndRaidModComboPlacementValue
>;

export type ModPlacements = {
	placement: ArmorStatAndRaidModComboPlacement;
	artificeModIdList: EModId[];
};

export const getDefaultArmorSlotModComboPlacementWithArtificeMods =
	(): ModPlacements => {
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
	metadata: {
		minTotalArmorStatModCost: number;
		maxTotalArmorStatModCost: number;
		minUsedArtificeMods: number;
		maxUsedArtificeMods: number;
		minUnusedArmorEnergy: number;
		maxUnusedArmorEnergy: number;
		armorSlotMetadata: ModComboArmorSlotMetadata;
	};
	sortedArmorSlotModComboPlacementList: ModPlacements[];
};

export const getDefaultModCombos = (): ModCombos => ({
	metadata: {
		minTotalArmorStatModCost: 0,
		maxTotalArmorStatModCost: Infinity,
		minUsedArtificeMods: 0,
		maxUsedArtificeMods: Infinity,
		minUnusedArmorEnergy: 0,
		maxUnusedArmorEnergy: Infinity,
		armorSlotMetadata: getDefaultModComboArmorSlotMetadata(),
	},
	sortedArmorSlotModComboPlacementList: [],
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

	const modPlacements = getModPlacements({
		statModCombos,
		armorSlotMods,
		potentialRaidModArmorSlotPlacements,
	});

	if (modPlacements === null) {
		return null;
	}
	const maximumSingleStatValues = getMaximumSingleStatValues({
		sumOfSeenStats,
		numArtificeItems: seenArtificeCount,
		placements: modPlacements.placements,
	});

	const modCombos = getDefaultModCombos();

	// TODO: Sort this
	// modCombos.sortedArmorSlotModComboPlacementList = validComboPlacements;
	return modCombos;
};
