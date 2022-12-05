import { BucketHashes, StatHashes } from '@dlb/dim/data/d2/generated-enums';
import { DimItem } from '@dlb/dim/inventory/item-types';
import { DimStore } from '@dlb/dim/inventory/store-types';
import {
	DestinyClass,
	DestinyEnergyType,
} from 'bungie-api-ts-no-const-enum/destiny2';

import { bungieNetPath } from '@dlb/utils/item-utils';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EElementId,
	EArmorStatModId,
} from '@dlb/types/IdEnums';
import {
	DestinyClassHashToDestinyClass,
	BucketHashToArmorSlot,
	DestinyArmorTypeToArmorSlotId,
	DestinyClassStringToDestinyClassId,
} from '@dlb/types/External';
import {
	Armor,
	AvailableExoticArmor,
	generateArmorGroup,
	generateAvailableExoticArmorGroup,
	AvailableExoticArmorItem,
	ArmorItem,
	StatList,
} from '@dlb/types/Armor';
import { Character, Characters } from '@dlb/types/Character';
import {
	DestinyClassIdList,
	DestinyClassIdToDestinyClass,
} from '@dlb/types/DestinyClass';

// Convert a DimStore into our own, smaller, types and transform the data into the desired shape.
export const extractArmor = (
	stores: DimStore<DimItem>[]
): [Armor, AvailableExoticArmor] => {
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

	const seenExotics: Record<number, AvailableExoticArmorItem> = {};

	stores.forEach(({ items }) => {
		items.forEach((item) => {
			if (item.location.inArmor) {
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
					isExotic: item.isExotic,
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
				};
				if (item.isExotic) {
					armor[destinyClassName][armorSlot].exotic[item.id] = armorItem;
				} else {
					armor[destinyClassName][armorSlot].nonExotic[item.id] = armorItem;
				}
			}
		});
	});

	Object.values(seenExotics)
		// Alphabetical order
		.sort((a, b) => (a.name > b.name ? 1 : -1))
		.forEach((exotic) => {
			availableExoticArmor[exotic.destinyClassName][exotic.armorSlot].push(
				exotic
			);
		});

	return [armor, availableExoticArmor];
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
