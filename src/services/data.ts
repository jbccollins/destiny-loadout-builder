import { BucketHashes } from '@dlb/dim/data/d2/generated-enums';
import { DimItem, DimSocket } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import {
	getSocketsWithStyle,
	socketContainsIntrinsicPlug
} from '@dlb/dim/utils/socket-utils';
import { DestinyClass } from 'bungie-api-ts-no-const-enum/destiny2';

// /**
//  * Gets all sockets that have a plug which doesn't get grouped in the Reusable socket category.
//  * The reusable socket category is used in armor 1.0 for perks and stats.
//  */
//  function getNonReuseableModSockets(item: DimItem) {
//   if (!item.sockets) {
//     return [];
//   }

//   return item.sockets.allSockets.filter(
//     (s) =>
//       !s.isPerk &&
//       !socketContainsIntrinsicPlug(s) &&
//       !s.plugged?.plugDef.plug.plugCategoryIdentifier.includes('masterwork') &&
//       _.intersection(s.plugged?.plugDef.itemCategoryHashes || [], modItemCategoryHashes).length > 0
//   );
// }

// function breakDownTotalValue(
//   baseTotalValue: number,
//   item: DimItem,
//   masterworkSockets: DimSocket[]
// ) {
//   const modSockets = getNonReuseableModSockets(item);

//   // Armor 1.0 doesn't increase stats when masterworked
//   const totalModsValue = getTotalPlugEffects(modSockets, armorStats, item);
//   const totalMasterworkValue = masterworkSockets
//     ? getTotalPlugEffects(masterworkSockets, armorStats, item)
//     : 0;
//   return { baseTotalValue, totalModsValue, totalMasterworkValue };
// }

export type StructuredStoreDataClass = {
	classType: DestinyClass;
	helmet: DimItem[];
	gauntlets: DimItem[];
	chestArmor: DimItem[];
	legArmor: DimItem[];
	classArmor: DimItem[];
};

export type StructuredStoreData = StructuredStoreDataClass[];

const generateStructuredStoreDataClass = (
	classType: DestinyClass
): StructuredStoreDataClass => {
	return {
		classType,
		helmet: [],
		gauntlets: [],
		chestArmor: [],
		legArmor: [],
		classArmor: []
	};
};

export const structureStoreData = (
	stores: DimStore<DimItem>[]
): DimItem[][] => {
	const hunterArmor = generateStructuredStoreDataClass(DestinyClass.Hunter);
	const warlockArmor = generateStructuredStoreDataClass(DestinyClass.Warlock);
	const titanArmor = generateStructuredStoreDataClass(DestinyClass.Titan);

	const armor: DimItem[] = [];
	const nonArmor: DimItem[] = [];
	stores.forEach(({ items }) => {
		for (const item of items) {
			if (item.location.inArmor) {
				let armorStore: StructuredStoreDataClass = null;
				switch (item.classType) {
					case DestinyClass.Hunter: {
						console.log('hunter');
						armorStore = hunterArmor;
						break;
					}
					case DestinyClass.Warlock: {
						console.log('warlock');
						armorStore = warlockArmor;
						break;
					}
					case DestinyClass.Titan: {
						console.log('titan');
						armorStore = titanArmor;
						break;
					}
				}
				if (armorStore === null) {
					console.warn('null armorStore for item:', item);
					continue;
				}
				switch (item.bucket.hash) {
					case BucketHashes.Helmet: {
						console.log('helmet');
						armorStore.helmet.push(item);
						break;
					}
					case BucketHashes.Gauntlets: {
						console.log('gauntlets');
						armorStore.gauntlets.push(item);
						break;
					}
					case BucketHashes.ChestArmor: {
						console.log('chestArmor');
						armorStore.chestArmor.push(item);
						break;
					}
					case BucketHashes.LegArmor: {
						console.log('legArmor');
						armorStore.legArmor.push(item);
						break;
					}
					case BucketHashes.ClassArmor: {
						console.log('classArmor');
						armorStore.classArmor.push(item);
						break;
					}
				}
				armor.push(item);
			} else {
				nonArmor.push(item);
			}
		}
	});
	console.log('>>>>> hunter, warlock, titan');
	console.log(hunterArmor, warlockArmor, titanArmor);
	const structuredStoreData: StructuredStoreData = [
		hunterArmor,
		warlockArmor,
		titanArmor
	];
	return [armor, nonArmor];
};
