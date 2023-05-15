import { EModId } from '@dlb/generated/mod/EModId';

import { ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';
import { PotentialRaidModArmorSlotPlacement } from '@dlb/types/Mod';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import {
	filterRaidModArmorSlotPlacements,
	getExtraSocketModCategoryIdCountsFromRaidModIdList,
	getItemCountsFromSeenArmorSlotItems,
	hasValidSeenItemCounts,
} from './utils';

export type filterPotentialRaidModArmorSlotPlacementsParams = {
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	raidMods: EModId[];
	specialSeenArmorSlotItems: SeenArmorSlotItems;
};

type filterPotentialRaidModArmorSlotPlacementsOutput = {
	potentialPlacements: PotentialRaidModArmorSlotPlacement[];
	requiredClassItemExtraModSocketCategoryId: ERaidAndNightMareModTypeId;
};

export const filterPotentialRaidModArmorSlotPlacements = (
	params: filterPotentialRaidModArmorSlotPlacementsParams
): filterPotentialRaidModArmorSlotPlacementsOutput => {
	const {
		potentialRaidModArmorSlotPlacements,
		raidMods,
		specialSeenArmorSlotItems,
	} = params;

	let requiredClassItemExtraModSocketCategoryId: ERaidAndNightMareModTypeId =
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
