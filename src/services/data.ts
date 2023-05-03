import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';

import { bungieNetPath } from '@dlb/utils/item-utils';
import {
	EArmorSlotId,
	EDestinyClassId,
	EElementId,
	EExtraSocketModCategoryId,
	EGearTierId,
	EModCategoryId,
} from '@dlb/types/IdEnums';
import {
	DestinyClassHashToDestinyClass,
	BucketHashToArmorSlot,
	DestinyArmorTypeToArmorSlotId,
	DestinyClassStringToDestinyClassId,
	ElementEnumToEElementId,
	ItemTierNameToEGearTierId,
} from '@dlb/types/External';
import {
	Armor,
	AvailableExoticArmor,
	generateArmorGroup,
	generateAvailableExoticArmorGroup,
	AvailableExoticArmorItem,
	ArmorItem,
	StatList,
	ArmorMetadata,
	getDefaultArmorMetadata,
	ArmorMaxStatsMetadata,
	getDefaultArmorCountMaxStatsMetadata,
} from '@dlb/types/Armor';
import { Character, Characters } from '@dlb/types/Character';
import {
	DestinyClassIdList,
	DestinyClassIdToDestinyClass,
} from '@dlb/types/DestinyClass';
import { ArmorStatIdList } from '@dlb/types/ArmorStat';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';

const updateMaxStatsMetadata = (
	armorItem: ArmorItem,
	maxStatsMetadata: ArmorMaxStatsMetadata
) => {
	ArmorStatIdList.forEach((armorStatId, i) => {
		const armorItemMax = armorItem.stats[i] + (armorItem.isArtifice ? 3 : 0);
		if (armorItemMax > maxStatsMetadata[armorStatId].max) {
			maxStatsMetadata[armorStatId] = {
				max: armorItemMax, // Note that this does not add in the +2 from masterworking
				withMasterwork: armorItem.isMasterworked,
			};
		}
	});
};

// If we don't have enough armor to create a loadout for any class we want to
// make sure the user can't select that class
export const getValidDestinyClassIds = (
	armorMetadata: ArmorMetadata
): EDestinyClassId[] => {
	const validDestinyClassIds: EDestinyClassId[] = [];
	DestinyClassIdList.forEach((destinyClassId) => {
		const armorMetadataItem = armorMetadata[destinyClassId];
		let hasValidLegendaryItems = true;
		let hasExoticItem = false;
		for (let i = 0; i < ArmorSlotWithClassItemIdList.length; i++) {
			const armorSlotId = ArmorSlotWithClassItemIdList[i];
			if (
				armorMetadataItem.nonExotic.legendary.items[armorSlotId].count === 0
			) {
				hasValidLegendaryItems = false;
				break;
			}
			if (armorMetadataItem.exotic.count > 0) {
				hasExoticItem = true;
			}
		}
		if (hasValidLegendaryItems && hasExoticItem) {
			validDestinyClassIds.push(destinyClassId);
		}
	});
	return validDestinyClassIds;
};

// Convert a DimStore into our own, smaller, types and transform the data into the desired shape.
export const extractArmor = (
	stores: DimStore<DimItem>[]
): [Armor, AvailableExoticArmor, ArmorMetadata] => {
	const armor: Armor = {
		[EDestinyClassId.Titan]: generateArmorGroup(),
		[EDestinyClassId.Hunter]: generateArmorGroup(),
		[EDestinyClassId.Warlock]: generateArmorGroup(),
	};

	const availableExoticArmor: AvailableExoticArmor = {
		[EDestinyClassId.Titan]: generateAvailableExoticArmorGroup(),
		[EDestinyClassId.Hunter]: generateAvailableExoticArmorGroup(),
		[EDestinyClassId.Warlock]: generateAvailableExoticArmorGroup(),
	};

	const armorMetadata: ArmorMetadata = getDefaultArmorMetadata();

	const seenExotics: Record<number, AvailableExoticArmorItem> = {};

	stores.forEach(({ items }) => {
		items.forEach((item) => {
			// Filter out all items that don't have an element. These are really old armor
			// TODO: Is this element filter really safe now that armor affinity is gone?
			if (
				item.location.inArmor &&
				item.element?.enumValue &&
				!item.classified // Classified armor has no stats
			) {
				const destinyClassName = DestinyClassHashToDestinyClass[
					item.classType
				] as EDestinyClassId;
				const armorSlot = BucketHashToArmorSlot[
					item.bucket.hash
				] as EArmorSlotId;

				if (item.isExotic) {
					if (seenExotics[item.hash]) {
						seenExotics[item.hash].count++;
					} else {
						armorMetadata[destinyClassName].exotic.items[armorSlot][item.name] =
							getDefaultArmorCountMaxStatsMetadata();
						seenExotics[item.hash] = {
							hash: item.hash,
							name: item.name,
							icon: bungieNetPath(item.icon),
							armorSlot: DestinyArmorTypeToArmorSlotId[item.type],
							destinyClassName:
								DestinyClassStringToDestinyClassId[item.classTypeNameLocalized],
							count: 1,
						};
					}
				}
				const armorItem: ArmorItem = {
					name: item.name,
					icon: bungieNetPath(item.icon),
					id: item.id,
					// TODO: checking 'Stats.Total' is jank
					baseStatTotal: item.stats.find(
						(x) => x.displayProperties.name === 'Stats.Total'
					).base,
					power: item.power,
					// TODO: checking 'Stats.Total' is jank
					stats: item.stats
						.filter((x) => x.displayProperties.name !== 'Stats.Total')
						.map((x) => x.base) as StatList,
					armorSlot: DestinyArmorTypeToArmorSlotId[item.type],
					hash: item.hash,
					destinyClassName:
						DestinyClassStringToDestinyClassId[item.classTypeNameLocalized],
					isMasterworked: item.masterwork,
					gearTierId: item?.tier
						? ItemTierNameToEGearTierId[item.tier]
						: EGearTierId.Unknown,
					isArtifice: isArtificeArmor(item),
					extraSocketModCategoryId: getExtraSocketModCategoryId(item),
				};

				if (armorItem.gearTierId === EGearTierId.Exotic) {
					updateMaxStatsMetadata(
						armorItem,
						armorMetadata[destinyClassName].exotic.items[armorSlot][item.name]
							.maxStats
					);
					armorMetadata[destinyClassName].exotic.items[armorSlot][item.name]
						.count++;
					armorMetadata[destinyClassName].exotic.count++;
					armor[destinyClassName][armorSlot].exotic[item.id] = armorItem;
				} else {
					// TODO: This would need to change if there are ever more Gear Tiers than just Legendary and Rare supported
					const nonExoticTier =
						armorItem.gearTierId === EGearTierId.Legendary
							? 'legendary'
							: 'rare';
					updateMaxStatsMetadata(
						armorItem,
						armorMetadata[destinyClassName].nonExotic[nonExoticTier].items[
							armorItem.armorSlot
						].maxStats
					);
					armorMetadata[destinyClassName].nonExotic.count++;
					armorMetadata[destinyClassName].nonExotic[nonExoticTier].count++;
					armorMetadata[destinyClassName].nonExotic[nonExoticTier].items[
						armorItem.armorSlot
					].count++;
					// Set the class item metadata. Class items are all interchangeable
					if (armorItem.armorSlot === EArmorSlotId.ClassItem) {
						if (armorItem.gearTierId === EGearTierId.Legendary) {
							armorMetadata[destinyClassName].classItem.hasLegendaryClassItem =
								true;
						}
						if (armorItem.isMasterworked) {
							armorMetadata[
								destinyClassName
							].classItem.hasMasterworkedLegendaryClassItem = true;
						}
						if (armorItem.isArtifice) {
							armorMetadata[destinyClassName].classItem.hasArtificeClassItem =
								true;
							if (armorItem.isMasterworked) {
								armorMetadata[
									destinyClassName
								].classItem.hasMasterworkedArtificeClassItem = true;
							}
						}
					}
					if (armorItem.isArtifice) {
						updateMaxStatsMetadata(
							armorItem,
							armorMetadata[destinyClassName].artifice.items[
								armorItem.armorSlot
							].maxStats
						);
						armorMetadata[destinyClassName].artifice.count++;
						armorMetadata[destinyClassName].artifice.items[armorItem.armorSlot]
							.count++;
					}
					if (armorItem.extraSocketModCategoryId !== null) {
						updateMaxStatsMetadata(
							armorItem,
							armorMetadata[destinyClassName].extraSocket.items[
								armorItem.extraSocketModCategoryId
							].items[armorItem.armorSlot].maxStats
						);
						armorMetadata[destinyClassName].extraSocket.count++;
						armorMetadata[destinyClassName].extraSocket.items[
							armorItem.extraSocketModCategoryId
						].count++;
						armorMetadata[destinyClassName].extraSocket.items[
							armorItem.extraSocketModCategoryId
						].items[armorItem.armorSlot].count++;
					}

					armor[destinyClassName][armorSlot].nonExotic[armorItem.id] =
						armorItem;
				}
			}
		});
	});

	console.log('>>>>>>>>>>> [Armor] <<<<<<<<<<<', armor);
	console.log('>>>>>>>>>>> [ArmorMetadata] <<<<<<<<<<<', armorMetadata);

	Object.values(seenExotics)
		// Alphabetical order
		.sort((a, b) => (a.name > b.name ? 1 : -1))
		.forEach((exotic) => {
			availableExoticArmor[exotic.destinyClassName][exotic.armorSlot].push(
				exotic
			);
		});

	return [armor, availableExoticArmor, armorMetadata];
};

const isArtificeArmor = (item: DimItem): boolean => {
	return (item.perks || []).filter((p) => p.perkHash == 229248542).length > 0;
};

// TODO: It may make more sense to just extract character classes. Like if you have
// two warlocks who cares which warlock you select for a build?
// In fact it may make sense to be able to make a build for a character that you don't have,
// so long as you have enough armor to make such a build. Can DIM support a loadout without
// specifying a character???
export const extractCharacters = (stores: DimStore<DimItem>[]): Characters => {
	const characters: Characters = [];
	stores
		.filter((store) => store.id !== 'vault')
		.forEach((store) => {
			const character: Character = {
				background: store.background,
				destinyClassId: DestinyClassStringToDestinyClassId[store.className],
				// TODO: This name is probably wrong.
				name: DestinyClassIdToDestinyClass.get(
					DestinyClassStringToDestinyClassId[store.className]
				).name,
				genderRace: store.genderRace,
				icon: store.icon,
				id: store.id,
				// lastPlayed: store.lastPlayed.toISOString()
			};
			characters.push(character);
		});
	return characters;
};

// export const sumStatLists = (a: StatList, b: StatList): StatList => {
// 	return a.map((x, i) => x + b[i]) as StatList;
// };

const KINGS_FALL_SOCKET_HASH = 1728096240;
const LAST_WISH_SOCKET_HASH = 1679876242;
const VAULT_OF_GLASS_SOCKET_HASH = 3738398030;
const GARDEN_OF_SALVATION_SOCKET_HASH = 706611068;
const DEEP_STONE_CRYPT_SOCKET_HASH = 4055462131;
const VOW_OF_THE_DISCIPLE_SOCKET_HASH = 2447143568;
const ROOT_OF_NIGHTMARES_SOCKET_HASH = 4144354978;
const NIGHTMARE_SOCKET_HASH = 1180997867;

const hasSocket = (item: DimItem, hash: number): boolean =>
	(item.sockets?.allSockets.filter((d) => d.emptyPlugItemHash == hash) || [])
		.length > 0;

const getExtraSocketModCategoryId = (
	item: DimItem
): EExtraSocketModCategoryId => {
	if (hasSocket(item, KINGS_FALL_SOCKET_HASH)) {
		return EExtraSocketModCategoryId.KingsFall;
	}
	if (hasSocket(item, LAST_WISH_SOCKET_HASH)) {
		return EExtraSocketModCategoryId.LastWish;
	}
	if (hasSocket(item, VAULT_OF_GLASS_SOCKET_HASH)) {
		return EExtraSocketModCategoryId.VaultOfGlass;
	}
	if (hasSocket(item, GARDEN_OF_SALVATION_SOCKET_HASH)) {
		return EExtraSocketModCategoryId.GardenOfSalvation;
	}
	if (hasSocket(item, DEEP_STONE_CRYPT_SOCKET_HASH)) {
		return EExtraSocketModCategoryId.DeepStoneCrypt;
	}
	if (hasSocket(item, VOW_OF_THE_DISCIPLE_SOCKET_HASH)) {
		return EExtraSocketModCategoryId.VowOfTheDisciple;
	}
	if (hasSocket(item, ROOT_OF_NIGHTMARES_SOCKET_HASH)) {
		return EExtraSocketModCategoryId.RootOfNightmares;
	}
	if (hasSocket(item, NIGHTMARE_SOCKET_HASH)) {
		return EExtraSocketModCategoryId.Nightmare;
	}
	// if ((v.sockets?.socketEntries.filter(d => d.singleInitialItemHash == 2472875850) || []).length > 0)
	// 	return ArmorPerkOrSlot.PerkIronBanner;
	// if ((v.sockets?.socketEntries.filter(d => d.singleInitialItemHash == 2392155347) || []).length > 0)
	// 	return ArmorPerkOrSlot.PerkUniformedOfficer;
	// if ((v.sockets?.socketEntries.filter(d => d.singleInitialItemHash == 400659041) || []).length > 0)
	// 	return ArmorPerkOrSlot.PerkPlunderersTrappings;

	return null;
};
