import { EModId } from '@dlb/generated/mod/EModId';

import { AllClassItemMetadata } from '@dlb/types/Armor';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import { EArmorSlotId, ERaidAndNightMareModTypeId } from '@dlb/types/IdEnums';
import { PotentialRaidModArmorSlotPlacement, getMod } from '@dlb/types/Mod';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import {
	RequiredClassItemMetadataKey,
	getExtraSocketModCategoryIdCountsFromRaidModIdList,
	getItemCountsFromSeenArmorSlotItems,
	hasValidSeenItemCounts,
	stripNonRaidSeenArmorSlotItems,
} from './utils';

export type FilterValidRaidModArmorSlotPlacementsParams = {
	seenArmorSlotItems: SeenArmorSlotItems;
	requiredClassItemMetadataKey: RequiredClassItemMetadataKey;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	raidModIdList: EModId[];
	allClassItemMetadata: AllClassItemMetadata;
};

// Filter out the placements that put a raid mod on a non-raid armor piece
export const filterRaidModArmorSlotPlacements = ({
	seenArmorSlotItems,
	requiredClassItemMetadataKey,
	potentialRaidModArmorSlotPlacements,
	raidModIdList,
	allClassItemMetadata,
}: FilterValidRaidModArmorSlotPlacementsParams): PotentialRaidModArmorSlotPlacement[] => {
	const raidSeenArmorSlotItems =
		stripNonRaidSeenArmorSlotItems(seenArmorSlotItems);

	const output: PotentialRaidModArmorSlotPlacement[] = [];

	const _armorItemsExtraModSocketCategories = {
		[EArmorSlotId.Head]: raidSeenArmorSlotItems.Head,
		[EArmorSlotId.Arm]: raidSeenArmorSlotItems.Arm,
		[EArmorSlotId.Chest]: raidSeenArmorSlotItems.Chest,
		[EArmorSlotId.Leg]: raidSeenArmorSlotItems.Leg,
		[EArmorSlotId.ClassItem]: requiredClassItemMetadataKey,
	};

	const armorItemsExtraModSocketCategoriesList = [
		_armorItemsExtraModSocketCategories,
	];

	// If there is no required class item then we must test all possible raid class items.
	// This prevents a bug where we would return no results when there are enough raid pieces
	// without the class item but those pieces don't have
	// enough capacity to slot the required raid mods.
	if (requiredClassItemMetadataKey === null) {
		// Keep track of the raid mod types that we need to test the class item against
		const seenRaidModTypes: Partial<
			Record<ERaidAndNightMareModTypeId, boolean>
		> = {};
		raidModIdList.forEach((raidModId) => {
			const mod = getMod(raidModId);
			if (!seenRaidModTypes[mod.raidAndNightmareModTypeId]) {
				seenRaidModTypes[mod.raidAndNightmareModTypeId] = true;
				// If we have a raid class item of this type then consider it
				if (
					allClassItemMetadata[mod.raidAndNightmareModTypeId].items.length > 0
				) {
					armorItemsExtraModSocketCategoriesList.push({
						..._armorItemsExtraModSocketCategories,
						[EArmorSlotId.ClassItem]: mod.raidAndNightmareModTypeId,
					});
				}
			}
		});
	}

	// TODO: Figure out if this caching of seenValidPlacements will actually work
	// I suspect it will introduce edgecase bugs with lots of mods selected.
	// Perhaps we can throw out results that have a required class item type but
	// aren't using it for that specific placement.
	const seenValidPlacementIndices: Record<number, boolean> = {};
	for (let k = 0; k < armorItemsExtraModSocketCategoriesList.length; k++) {
		const armorItemsExtraModSocketCategories =
			armorItemsExtraModSocketCategoriesList[k];

		for (let i = 0; i < potentialRaidModArmorSlotPlacements.length; i++) {
			if (seenValidPlacementIndices[i]) {
				continue;
			}
			const placement = potentialRaidModArmorSlotPlacements[i];
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
				output.push(placement);
				seenValidPlacementIndices[i] = true;
			}
		}
	}
	return output;
};

export type FilterPotentialRaidModArmorSlotPlacementsParams = {
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	raidMods: EModId[];
	specialSeenArmorSlotItems: SeenArmorSlotItems;
	allClassItemMetadata: AllClassItemMetadata;
};

export const filterPotentialRaidModArmorSlotPlacements = (
	params: FilterPotentialRaidModArmorSlotPlacementsParams
): PotentialRaidModArmorSlotPlacement[] => {
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
		potentialRaidModArmorSlotPlacements,
		requiredClassItemMetadataKey,
		raidModIdList: raidMods,
		allClassItemMetadata,
	});

	if (raidModArmorSlotPlacements.length === 0) {
		return null;
	}
	return raidModArmorSlotPlacements;
};
