import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	PotentialRaidModArmorSlotPlacement,
	getMod,
	getArmorSlotEnergyCapacity,
} from '@dlb/types/Mod';
import { StatModComboWithMetadata } from './getAllStatModCombos';
import {
	ModPlacements,
	getDefaultArmorSlotModComboPlacementWithArtificeMods,
} from './getModCombos';

export type GetValidArmorSlotModComboPlacementsParams = {
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	statModCombos: StatModComboWithMetadata[];
	potentialRaidModArmorSlotPlacements:
		| PotentialRaidModArmorSlotPlacement[]
		| null;
};

// Places stat mods and raid mods
export const getValidArmorSlotModComboPlacements = ({
	armorSlotMods,
	statModCombos,
	potentialRaidModArmorSlotPlacements,
}: GetValidArmorSlotModComboPlacementsParams): ModPlacements[] => {
	const results: ModPlacements[] = [];
	statModCombos.forEach(({ armorStatModIdList, artificeModIdList }) => {
		const sortedArmorStatMods = [...armorStatModIdList].sort(
			(a, b) => getMod(b).cost - getMod(a).cost
		);

		let allArmorSlotCapacities = [getArmorSlotEnergyCapacity(armorSlotMods)];
		if (
			potentialRaidModArmorSlotPlacements &&
			potentialRaidModArmorSlotPlacements.length > 0
		) {
			allArmorSlotCapacities = [];
			for (let i = 0; i < potentialRaidModArmorSlotPlacements.length; i++) {
				const armorSlotCapacities = getArmorSlotEnergyCapacity(armorSlotMods);
				const raidModPlacement = potentialRaidModArmorSlotPlacements[i];
				// Update the armorSlotCapacities for this particular raid mod placement permutation
				for (let j = 0; j < ArmorSlotWithClassItemIdList.length; j++) {
					const armorSlotId = ArmorSlotWithClassItemIdList[j];
					if (raidModPlacement[armorSlotId]) {
						armorSlotCapacities[armorSlotId].capacity -= getMod(
							raidModPlacement[armorSlotId]
						).cost;
					}
				}
				allArmorSlotCapacities.push(armorSlotCapacities);
			}
		}

		allArmorSlotCapacities.forEach((armorSlotCapacities, j) => {
			const sortedArmorSlotCapacities = Object.values(armorSlotCapacities).sort(
				// Sort by capacity then by name. By name is just for making consistent testing easier
				(a, b) =>
					b.capacity - a.capacity || a.armorSlotId.localeCompare(b.armorSlotId)
			);

			const comboPlacement: ModPlacements =
				getDefaultArmorSlotModComboPlacementWithArtificeMods();

			// Place the raid mods
			if (potentialRaidModArmorSlotPlacements.length > 0) {
				const raidModPlacements: Partial<Record<EArmorSlotId, EModId>> =
					potentialRaidModArmorSlotPlacements[j];
				for (const armorSlotId in raidModPlacements) {
					comboPlacement.placement[armorSlotId].raidModId =
						raidModPlacements[armorSlotId];
				}
			}

			comboPlacement.artificeModIdList = artificeModIdList;
			let isValid = true;
			// Check if the highest cost armor stat mod can fit into the highest capacity slot
			// Check if the second highest cost armor stat mod can fit in to the second highest capacity slot, etc...
			// TODO: This won't give us every solution. If the highest cost armor stat mod can fit into the
			// lowest capacity slot that could be the difference between knowing if we can fit a larger armor stat mod or not.
			// Perhaps we need to check all permutations? Raid mods will need to be disabled as well and I think we can only
			// do that accurately if we check all permutations. Idk maybe not... Depends if we want to constrain
			// enabled raid mods to the desired stats or not. If not then I don't think raid mod disabling will rely on such permutations.
			for (let i = 0; i < sortedArmorStatMods.length; i++) {
				if (
					getMod(sortedArmorStatMods[i]).cost >
					sortedArmorSlotCapacities[i].capacity
				) {
					isValid = false;
					break;
				}
				comboPlacement.placement[
					sortedArmorSlotCapacities[i].armorSlotId
				].armorStatModId = sortedArmorStatMods[i];
			}
			if (!isValid) {
				return;
			}
			results.push(comboPlacement);
		});
	});
	return results;
};
