import {
	ArmorSlotIdToModIdListMapping,
	MinorStatModIdList,
	getArmorSlotEnergyCapacity,
	getMod,
} from '@dlb/types/Mod';
import { ModPlacement, getDefaultModPlacements } from './getModCombos';
import { EArmorSlotId, EArmorStatId } from '@dlb/types/IdEnums';
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
	placements: ModPlacement[];
	numArtificeItems: number;
	sumOfSeenStats: StatList;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
};

export const getMaximumSingleStatValues = ({
	placements,
	numArtificeItems,
	sumOfSeenStats,
	armorSlotMods,
}: GetMaximumSingleStatRemainingBonusParams): Record<EArmorStatId, number> => {
	const result: Record<EArmorStatId, number> = {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	};
	const armorSlotEnergyCapacity = getArmorSlotEnergyCapacity(armorSlotMods);
	const _placements =
		placements.length > 0 ? placements : [getDefaultModPlacements()];
	_placements.forEach((placement) => {
		const placementResult: Record<EArmorStatId, number> = {
			[EArmorStatId.Mobility]: 0,
			[EArmorStatId.Resilience]: 0,
			[EArmorStatId.Recovery]: 0,
			[EArmorStatId.Discipline]: 0,
			[EArmorStatId.Intellect]: 0,
			[EArmorStatId.Strength]: 0,
		};
		// Unused artifice bonuses
		const bonusArtificeValue =
			(numArtificeItems - placement.artificeModIdList.length) *
			ARTIFICE_MOD_BONUS_VALUE;
		ArmorStatIdList.forEach((armorStatId) => {
			placementResult[armorStatId] = Math.max(
				placementResult[armorStatId],
				bonusArtificeValue
			);
		});
		// Used artifice bonuses
		placement.artificeModIdList.forEach((artificeModId) => {
			const armorStatId = getMod(artificeModId).bonuses[0].stat as EArmorStatId;
			placementResult[armorStatId] += ARTIFICE_MOD_BONUS_VALUE;
		});
		ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
			const armorStatModId = placement.placement[armorSlotId].armorStatModId;

			const raidModId = placement.placement[armorSlotId].raidModId;
			const armorSlotCapacity =
				armorSlotEnergyCapacity[armorSlotId].capacity -
				(armorStatModId ? getMod(armorStatModId).cost : 0) -
				(raidModId ? getMod(raidModId).cost : 0);
			// If this slot has no armor stat mod id then check if we can apply any stat mods here
			if (!armorStatModId && armorSlotCapacity > 0) {
				ArmorStatIdList.forEach((armorStatId) => {
					const split = getArmorStatModSpitFromArmorStatId(armorStatId);
					const majorCost = getMod(split.major).cost;
					const minorCost = getMod(split.minor).cost;
					if (armorSlotCapacity >= majorCost) {
						placementResult[armorStatId] += MAJOR_MOD_BONUS_VALUE;
					} else if (armorSlotCapacity >= minorCost) {
						placementResult[armorStatId] += MINOR_MOD_BONUS_VALUE;
					}
					result[armorStatId] = Math.max(
						result[armorStatId],
						placementResult[armorStatId]
					);
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
					placementResult[armorStatId] += MAJOR_MOD_BONUS_VALUE;
					result[armorStatId] = Math.max(
						result[armorStatId],
						placementResult[armorStatId]
					);
				}
			}
			// Else just add the existing mod value
			else if (armorStatModId) {
				const mod = getMod(armorStatModId);
				const armorStatId = mod.bonuses[0].stat as EArmorStatId;
				placementResult[armorStatId] += mod.bonuses[0].value;
				result[armorStatId] = Math.max(
					result[armorStatId],
					placementResult[armorStatId]
				);
			}
		});
	});
	// Add the base stat value
	ArmorStatIdList.forEach((armorStatId, i) => {
		result[armorStatId] += sumOfSeenStats[i];
	});
	return result;
};
