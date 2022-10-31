import { BucketHashes } from '@dlb/dim/data/d2/generated-enums';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import { DestinyClass } from 'bungie-api-ts-no-const-enum/destiny2';

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
): StructuredStoreData[] => {
	const titanArmor = generateStructuredStoreDataClass(DestinyClass.Titan);
	const hunterArmor = generateStructuredStoreDataClass(DestinyClass.Hunter);
	const warlockArmor = generateStructuredStoreDataClass(DestinyClass.Warlock);

	const armor: DimItem[] = [];
	const nonArmor: DimItem[] = [];
	stores.forEach(({ items }) => {
		for (const item of items) {
			if (item.location.inArmor) {
				let armorStore: StructuredStoreDataClass = null;
				switch (item.classType) {
					case DestinyClass.Titan: {
						armorStore = titanArmor;
						break;
					}
					case DestinyClass.Hunter: {
						armorStore = hunterArmor;
						break;
					}
					case DestinyClass.Warlock: {
						armorStore = warlockArmor;
						break;
					}
				}
				if (armorStore === null) {
					continue;
				}
				switch (item.bucket.hash) {
					case BucketHashes.Helmet: {
						armorStore.helmet.push(item);
						break;
					}
					case BucketHashes.Gauntlets: {
						armorStore.gauntlets.push(item);
						break;
					}
					case BucketHashes.ChestArmor: {
						armorStore.chestArmor.push(item);
						break;
					}
					case BucketHashes.LegArmor: {
						armorStore.legArmor.push(item);
						break;
					}
					case BucketHashes.ClassArmor: {
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
	// [titanArmor, hunterArmor, warlockArmor].forEach((armorStore) => {
	// 	armorStore.helmet = armorStore.helmet.sort((a, b) =>
	// 		a.name > b.name ? 1 : 0
	// 	);
	// 	armorStore.gauntlets = armorStore.gauntlets.sort((a, b) =>
	// 		a.name > b.name ? 1 : 0
	// 	);
	// 	armorStore.chestArmor = armorStore.chestArmor.sort((a, b) =>
	// 		a.name > b.name ? 1 : 0
	// 	);
	// 	armorStore.legArmor = armorStore.legArmor.sort((a, b) =>
	// 		a.name > b.name ? 1 : 0
	// 	);
	// 	armorStore.classArmor = armorStore.classArmor.sort((a, b) =>
	// 		a.name > b.name ? 1 : 0
	// 	);
	// });
	const structuredStoreData: StructuredStoreData = [
		titanArmor,
		hunterArmor,
		warlockArmor
	];
	return [structuredStoreData];
};
