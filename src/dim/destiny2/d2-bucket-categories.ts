import type { D2BucketCategory } from '@dlb/dim/inventory/inventory-buckets';
import { BucketHashes } from '@dlb/dim/data/generated-enums';

export const D2Categories: {
	[key in D2BucketCategory]: BucketHashes[];
} = {
	Postmaster: [
		BucketHashes.Engrams,
		BucketHashes.LostItems,
		BucketHashes.Messages,
		BucketHashes.SpecialOrders
	],
	Weapons: [
		BucketHashes.KineticWeapons,
		BucketHashes.EnergyWeapons,
		BucketHashes.PowerWeapons
	],
	Armor: [
		BucketHashes.Helmet,
		BucketHashes.Gauntlets,
		BucketHashes.ChestArmor,
		BucketHashes.LegArmor,
		BucketHashes.ClassArmor
	],
	General: [
		BucketHashes.Subclass,
		BucketHashes.Ghost,
		BucketHashes.Emblems,
		BucketHashes.Ships,
		BucketHashes.Vehicle,
		BucketHashes.Emotes_Invisible,
		BucketHashes.Finishers,
		BucketHashes.SeasonalArtifact
	],
	Inventory: [BucketHashes.Consumables, BucketHashes.Modifications]
};
