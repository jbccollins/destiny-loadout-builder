import { EModId } from '@dlb/generated/mod/EModId';
import { StatList } from '@dlb/types/Armor';
import { ArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EDestinyClassId,
	EExtraSocketModCategoryId,
} from '@dlb/types/IdEnums';
import {
	ValidRaidModArmorSlotPlacement,
	ArmorSlotIdToModIdListMapping,
} from '@dlb/types/Mod';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import {
	filterValidRaidModArmorSlotPlacements,
	getExtraSocketModCategoryIdCountsFromRaidModIdList,
	getItemCountsFromSeenArmorSlotItems,
	hasValidSeenItemCounts,
} from './utils';
import { getAllStatModCombos } from './getAllStatModCombos';
import { getValidArmorSlotModComboPlacements } from './getValidArmorSlotModComboPlacements';

/***** ArmorSlotModComboPlacementWithArtificeMods *****/
export type ArmorSlotModComboPlacementValue = {
	armorStatModId: EModId;
	raidModId: EModId;
};

export type ArmorSlotModComboPlacement = Record<
	EArmorSlotId,
	ArmorSlotModComboPlacementValue
>;

export type ArmorSlotModComboPlacementWithArtificeMods = {
	placement: ArmorSlotModComboPlacement;
	artificeModIdList: EModId[];
};

export const getDefaultArmorSlotModComboPlacementWithArtificeMods =
	(): ArmorSlotModComboPlacementWithArtificeMods => {
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
	sortedArmorSlotModComboPlacementList: ArmorSlotModComboPlacementWithArtificeMods[];
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
	validRaidModArmorSlotPlacements: ValidRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	specialSeenArmorSlotItems: SeenArmorSlotItems;
};

export const getModCombos = (params: GetModCombosParams): ModCombos => {
	const {
		sumOfSeenStats,
		desiredArmorStats,
		validRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		destinyClassId,
		specialSeenArmorSlotItems,
	} = params;

	const modCombos = getDefaultModCombos();

	const seenItemCounts = getItemCountsFromSeenArmorSlotItems(
		specialSeenArmorSlotItems
	);
	let seenArtificeCount = seenItemCounts.artifice;

	let requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId =
		null;

	let raidModArmorSlotPlacements: ValidRaidModArmorSlotPlacement[] = null;
	// Check to see if this combo even has enough raid pieces capable
	// of slotting the required raid mods. To do this we need to consider
	// various raid class items which is the main reason why this logic
	// is fairly lengthy/complex
	if (raidMods.length > 0) {
		// Get the counts of each raid type for this armor combo
		const seenItemCountsWithoutClassItems = getItemCountsFromSeenArmorSlotItems(
			specialSeenArmorSlotItems,
			false
		);
		// Get the counts of each raid type for our raid mods
		const raidModExtraSocketModCategoryIdCounts =
			getExtraSocketModCategoryIdCountsFromRaidModIdList(raidMods);
		// Given that class item stats are interchangeable, we need to check if we need
		// any specific raid class item to socket the required raid mods. This is
		// very common to need to do
		const {
			isValid,
			requiredClassItemExtraModSocketCategoryId:
				_requiredClassItemExtraModSocketCategoryId,
		} = hasValidSeenItemCounts(
			seenItemCountsWithoutClassItems,
			raidModExtraSocketModCategoryIdCounts,
			specialSeenArmorSlotItems.ClassItems
		);
		if (!isValid) {
			return modCombos;
		}

		requiredClassItemExtraModSocketCategoryId =
			_requiredClassItemExtraModSocketCategoryId;
		// We can't use artifice class items now...
		if (
			requiredClassItemExtraModSocketCategoryId !== null &&
			specialSeenArmorSlotItems.ClassItems.artifice &&
			seenArtificeCount > 0
		) {
			seenArtificeCount--;
		}
		// Ensure that we have enough raid pieces to slot the required raid mods
		// This does not check that there is enough space to slot them mods, just
		// that we have enough raid pieces to slot them.
		raidModArmorSlotPlacements = filterValidRaidModArmorSlotPlacements({
			seenArmorSlotItems: specialSeenArmorSlotItems,
			validRaidModArmorSlotPlacements,
			requiredClassItemExtraModSocketCategoryId,
		});

		if (raidModArmorSlotPlacements.length === 0) {
			return modCombos;
		}
	}

	// Extrapolate all stat mod combos
	const allStatModCombos = getAllStatModCombos({
		desiredArmorStats,
		stats: sumOfSeenStats,
		destinyClassId,
		numSeenArtificeArmorItems: seenArtificeCount,
	});

	const validComboPlacements = getValidArmorSlotModComboPlacements({
		armorSlotMods,
		statModCombos: allStatModCombos,
		validRaidModArmorSlotPlacements,
	});

	// TODO: Sort this
	modCombos.sortedArmorSlotModComboPlacementList = validComboPlacements;
	return modCombos;
};
