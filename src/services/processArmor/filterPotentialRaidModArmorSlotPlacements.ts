import { EModId } from '@dlb/generated/mod/EModId';

import { AllClassItemMetadata } from '@dlb/types/Armor';
import { PotentialRaidModArmorSlotPlacement } from '@dlb/types/Mod';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import {
	RequiredClassItemMetadataKey,
	filterRaidModArmorSlotPlacements,
	getExtraSocketModCategoryIdCountsFromRaidModIdList,
	getItemCountsFromSeenArmorSlotItems,
	hasValidSeenItemCounts,
} from './utils';

export type FilterPotentialRaidModArmorSlotPlacementsParams = {
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	raidMods: EModId[];
	specialSeenArmorSlotItems: SeenArmorSlotItems;
	allClassItemMetadata: AllClassItemMetadata;
};

type FilterPotentialRaidModArmorSlotPlacementsOutput = {
	potentialPlacements: PotentialRaidModArmorSlotPlacement[];
	requiredClassItemMetadataKey: RequiredClassItemMetadataKey;
};

export const filterPotentialRaidModArmorSlotPlacements = (
	params: FilterPotentialRaidModArmorSlotPlacementsParams
): FilterPotentialRaidModArmorSlotPlacementsOutput => {
	const {
		potentialRaidModArmorSlotPlacements,
		raidMods,
		specialSeenArmorSlotItems,
		allClassItemMetadata,
	} = params;

	let requiredClassItemMetadataKey: RequiredClassItemMetadataKey = null;

	let raidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[] = null;
	// Check to see if this combo even has enough raid pieces capable
	// of slotting the required raid mods. To do this we need to consider
	// various raid class items which is the main reason why this logic
	// is fairly lengthy/complex

	// Get the counts of each raid type for this armor combo
	const seenItemCounts = getItemCountsFromSeenArmorSlotItems(
		specialSeenArmorSlotItems
		// , false
	);
	// Get the counts of each raid type for our raid mods
	const raidModExtraSocketModCategoryIdCounts =
		getExtraSocketModCategoryIdCountsFromRaidModIdList(raidMods);
	// Given that class item stats are interchangeable, we need to check if we need
	// any specific raid class item to socket the required raid mods. This is
	// very common to need to do
	const {
		isValid,
		requiredClassItemMetadataKey: _requiredClassItemMetadataKey,
	} = hasValidSeenItemCounts({
		seenItemCounts,
		raidModExtraSocketModCategoryIdCounts,
		allClassItemMetadata,
	});
	if (!isValid) {
		return null;
	}

	requiredClassItemMetadataKey = _requiredClassItemMetadataKey;

	// Ensure that we have enough raid pieces to slot the required raid mods
	// This does not check that there is enough space to slot them mods, just
	// that we have enough raid pieces to slot them.
	raidModArmorSlotPlacements = filterRaidModArmorSlotPlacements({
		seenArmorSlotItems: specialSeenArmorSlotItems,
		validRaidModArmorSlotPlacements: potentialRaidModArmorSlotPlacements,
		requiredClassItemMetadataKey,
	});

	if (raidModArmorSlotPlacements.length === 0) {
		return null;
	}
	return {
		potentialPlacements: raidModArmorSlotPlacements,
		requiredClassItemMetadataKey,
	};
};
