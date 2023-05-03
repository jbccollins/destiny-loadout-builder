import {
	MinorStatModIdList,
	getArmorSlotEnergyCapacity,
	getMod,
} from '@dlb/types/Mod';
import { ModPlacements } from './getModCombos';
import { EArmorStatId } from '@dlb/types/IdEnums';
import {
	ARTIFICE_MOD_BONUS_VALUE,
	MAJOR_MOD_BONUS_VALUE,
	MINOR_MOD_BONUS_VALUE,
} from '@dlb/utils/item-utils';
import {
	ArmorStatIdList,
	getArmorStatModSpitFromArmorStatId,
} from '@dlb/types/ArmorStat';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import { StatList } from '@dlb/types/Armor';

type GetMaximumSingleStatRemainingBonusParams = {
	placements: ModPlacements[];
	numArtificeItems: number;
	sumOfSeenStats: StatList;
};

export const getMaximumSingleStatValues = ({
	placements,
	numArtificeItems,
	sumOfSeenStats,
}: GetMaximumSingleStatRemainingBonusParams): Record<EArmorStatId, number> => {
	const result: Record<EArmorStatId, number> = {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	};
	placements.forEach((placement) => {
		const bonusArtificeValue =
			(numArtificeItems - placement.artificeModIdList.length) *
			ARTIFICE_MOD_BONUS_VALUE;
		ArmorStatIdList.forEach((armorStatId) => {
			result[armorStatId] = Math.max(result[armorStatId], bonusArtificeValue);
		});
		ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
			const armorStatModId = placement.placement[armorSlotId].armorStatModId;

			const raidModId = placement.placement[armorSlotId].raidModId;
			const armorSlotCapacity =
				10 -
				(armorStatModId ? getMod(armorStatModId).cost : 0) -
				(raidModId ? getMod(raidModId).cost : 0);
			// If this slot has no armor stat mod id then check if we can apply any stat mods here
			if (!armorStatModId && armorSlotCapacity > 0) {
				ArmorStatIdList.forEach((armorStatId) => {
					const split = getArmorStatModSpitFromArmorStatId(armorStatId);
					const majorCost = getMod(split.major).cost;
					const minorCost = getMod(split.minor).cost;
					if (armorSlotCapacity >= majorCost) {
						result[armorStatId] = Math.max(
							result[armorStatId],
							MAJOR_MOD_BONUS_VALUE + bonusArtificeValue
						);
					} else if (armorSlotCapacity >= minorCost) {
						result[armorStatId] = Math.max(
							result[armorStatId],
							MINOR_MOD_BONUS_VALUE + bonusArtificeValue
						);
					}
				});
			}
			// Else check if we have space to swap a minor mod for a major mod
			else if (
				armorStatModId &&
				armorSlotCapacity > 0 &&
				MinorStatModIdList.includes(armorStatModId)
			) {
				const armorStatId = getMod(armorStatModId).bonuses[0]
					.stat as EArmorStatId;
				const split = getArmorStatModSpitFromArmorStatId(armorStatId);
				const majorCost = getMod(split.major).cost;
				if (armorSlotCapacity >= majorCost) {
					result[armorStatId] = Math.max(
						result[armorStatId],
						MAJOR_MOD_BONUS_VALUE + bonusArtificeValue
					);
				}
			}
		});
	});
	// Add the base stat value
	ArmorStatIdList.forEach((armorStatId, i) => {
		result[armorStatId] += sumOfSeenStats[i];
	});
	return result;
};
