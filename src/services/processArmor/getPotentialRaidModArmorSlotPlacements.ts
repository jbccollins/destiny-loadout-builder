import { EModId } from '@dlb/generated/mod/EModId';
import { StatList } from '@dlb/types/Armor';
import { ArmorStatMapping } from '@dlb/types/ArmorStat';
import { EDestinyClassId, EExtraSocketModCategoryId } from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	PotentialRaidModArmorSlotPlacement,
} from '@dlb/types/Mod';
import {
	filterRaidModArmorSlotPlacements,
	getExtraSocketModCategoryIdCountsFromRaidModIdList,
	getItemCountsFromSeenArmorSlotItems,
	hasValidSeenItemCounts,
} from './utils';
import { SeenArmorSlotItems } from './seenArmorSlotItems';

export type GetPotentialRaidModArmorSlotPlacementsParams = {
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	raidMods: EModId[];
	specialSeenArmorSlotItems: SeenArmorSlotItems;
};

type GetPotentialRaidModArmorSlotPlacementsOutput = {
	potentialPlacements: PotentialRaidModArmorSlotPlacement[];
	requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId;
};

export const filterPotentialRaidModArmorSlotPlacements = (
	params: GetPotentialRaidModArmorSlotPlacementsParams
): GetPotentialRaidModArmorSlotPlacementsOutput => {
	const {
		potentialRaidModArmorSlotPlacements,
		raidMods,
		specialSeenArmorSlotItems,
	} = params;

	let requiredClassItemExtraModSocketCategoryId: EExtraSocketModCategoryId =
		null;

	let raidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[] = null;
	// Check to see if this combo even has enough raid pieces capable
	// of slotting the required raid mods. To do this we need to consider
	// various raid class items which is the main reason why this logic
	// is fairly lengthy/complex

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
		return null;
	}

	requiredClassItemExtraModSocketCategoryId =
		_requiredClassItemExtraModSocketCategoryId;

	// Ensure that we have enough raid pieces to slot the required raid mods
	// This does not check that there is enough space to slot them mods, just
	// that we have enough raid pieces to slot them.
	raidModArmorSlotPlacements = filterRaidModArmorSlotPlacements({
		seenArmorSlotItems: specialSeenArmorSlotItems,
		validRaidModArmorSlotPlacements: potentialRaidModArmorSlotPlacements,
		requiredClassItemExtraModSocketCategoryId,
	});

	if (raidModArmorSlotPlacements.length === 0) {
		return null;
	}
	return {
		potentialPlacements: raidModArmorSlotPlacements,
		requiredClassItemExtraModSocketCategoryId,
	};
};
