import { LoadoutItem } from '@destinyitemmanager/dim-api-types';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { itemCanBeInLoadout } from '@dlb/dim/utils/item-utils';
import { DestinyLoadoutItemComponent } from 'bungie-api-ts-no-const-enum/destiny2';
import { keyBy } from 'lodash';

/**
 * Get a mapping from item id to item. Used for looking up items from loadouts.
 * This used to be restricted to only items that could be in loadouts, but we
 * need it to be all items to make search-based loadout transfers work.
 */
export const itemsByItemId = (allItems: DimItem[]) =>
	keyBy(
		allItems.filter((i) => i.id !== '0' && itemCanBeInLoadout(i)),
		(i) => i.id
	);

/**
 * A single-pass filter and map function. Returning `undefined` from the mapping
 * function will skip the value. Falsy values are still included!
 *
 * Similar to https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.filter_map
 */
export function filterMap<In, Out>(
	list: readonly In[],
	fn: (value: In, index: number) => Out | undefined
): Out[] {
	const result: Out[] = [];
	for (let i = 0; i < list.length; i++) {
		const mapped = fn(list[i], i);
		if (mapped !== undefined) {
			result.push(mapped);
		}
	}
	return result;
}

/**
 * Once we resolve a loadout item specifier to an actual item in inventory, we
 * can pass them around together. This represents the pair of the loadout item
 * specifier and the item in inventory (or fake placeholder item) that goes
 * along with it.
 */
export interface ResolvedLoadoutItem {
	/**
	 * The actual item in inventory, wherever it is. This item will have any
	 * socketOverrides and fashion from the loadoutItem applied to it.
	 *
	 * Note: Don't use the `equipped` property of this item - use `loadoutItem.equip` instead!
	 */
	readonly item: DimItem;
	/**
	 * The original loadout item specifier which says what we want to do with
	 * this item in the loadout. Note that this loadoutItem may not have the same
	 * id or even hash as the resolved item!
	 */
	readonly loadoutItem: LoadoutItem;

	/** This item wasn't found in inventory. This means `item` is a fake placeholder. */
	readonly missing?: boolean;
}

export function getLoadoutItemIdsToItemHashesMapping(
	loadoutItems: DestinyLoadoutItemComponent[],
	allItems: DimItem[]
): Record<string, number> {
	const itemsMapping = itemsByItemId(allItems);
	const result: Record<string, number> = {};
	loadoutItems.forEach((li) => {
		const realItem =
			li.itemInstanceId !== '0' ? itemsMapping[li.itemInstanceId] : undefined;
		if (!realItem) {
			// We just skip missing items entirely - we can't find anything about them
			return;
		}
		result[li.itemInstanceId] = realItem.hash;
	});

	return result;
}
