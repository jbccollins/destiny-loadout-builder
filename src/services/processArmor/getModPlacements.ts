import { EModId } from '@dlb/generated/mod/EModId';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
} from '@dlb/types/ArmorSlot';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	PotentialRaidModArmorSlotPlacement,
	getMod,
	getArmorSlotEnergyCapacity,
} from '@dlb/types/Mod';
import {
	ModPlacements,
	getDefaultArmorSlotModComboPlacementWithArtificeMods,
} from './getModCombos';
import { StatModCombo } from './getStatModCombosFromDesiredStats';
import { ExpandedStatModCombo } from './getAllStatModCombos';
import {
	ArmorStatIdList,
	getArmorStatModSpitFromArmorStatId,
} from '@dlb/types/ArmorStat';
import { permute } from '@dlb/utils/permutations';
import { cloneDeep } from 'lodash';

// Use the counts to generate lists of mods to permute
const convertStatModComboToExpandedStatModCombo = (
	combo: StatModCombo
): ExpandedStatModCombo => {
	const expandedCombo: ExpandedStatModCombo = {
		armorStatModIdList: [],
		artificeModIdList: [],
	};
	ArmorStatIdList.forEach((armorStatId) => {
		if (!combo[armorStatId]) {
			return;
		}
		const { numArtificeMods, numMajorMods, numMinorMods } = combo[armorStatId];
		const split = getArmorStatModSpitFromArmorStatId(armorStatId);
		for (let i = 0; i < numArtificeMods; i++) {
			expandedCombo.artificeModIdList.push(split.artifice);
		}
		for (let i = 0; i < numMajorMods; i++) {
			expandedCombo.armorStatModIdList.push(split.major);
		}
		for (let i = 0; i < numMinorMods; i++) {
			expandedCombo.armorStatModIdList.push(split.minor);
		}
	});
	return expandedCombo;
};

// This function filters out redundant results where redundancy
// is defined as having the same remaining energy capacity
// for each armor slot
export const filterRedundantPlacements = (
	placements: ModPlacements[]
): ModPlacements[] => {
	const _placements = [...placements];
	for (let i = 0; i < _placements.length; i++) {
		for (let j = i; j < _placements.length; j++) {
			if (i === j) {
				continue;
			}
			const placementA = _placements[i];
			const placementB = _placements[j];

			let redundant = true;
			for (let k = 0; k < ArmorSlotIdList.length; k++) {
				const armorSlotId = ArmorSlotIdList[k];
				let aCost = 0;
				let bCost = 0;
				if (placementA.placement[armorSlotId].armorStatModId) {
					aCost += getMod(
						placementA.placement[armorSlotId].armorStatModId
					).cost;
				}
				if (placementA.placement[armorSlotId].raidModId) {
					aCost += getMod(placementA.placement[armorSlotId].raidModId).cost;
				}
				if (placementB.placement[armorSlotId].armorStatModId) {
					bCost += getMod(
						placementB.placement[armorSlotId].armorStatModId
					).cost;
				}
				if (placementB.placement[armorSlotId].raidModId) {
					bCost += getMod(placementB.placement[armorSlotId].raidModId).cost;
				}
				if (aCost !== bCost) {
					redundant = false;
					break;
				}
			}

			if (redundant) {
				_placements.splice(j, 1);
				j--;
			}
		}
	}
	console.log(
		`Removed ${
			placements.length - _placements.length
		} redundant placements out of ${placements.length} total placements`
	);
	return _placements;
};

type CapacityRange = {
	min: number;
	max: number;
};

type ArmorSlotCapacityRangeMapping = Record<EArmorSlotId, CapacityRange>;

export const getDefaultArmorSlotCapacityRangeMapping =
	(): ArmorSlotCapacityRangeMapping => ({
		[EArmorSlotId.Head]: {
			min: Infinity,
			max: -Infinity,
		},
		[EArmorSlotId.Arm]: {
			min: Infinity,
			max: -Infinity,
		},
		[EArmorSlotId.Chest]: {
			min: Infinity,
			max: -Infinity,
		},
		[EArmorSlotId.Leg]: {
			min: Infinity,
			max: -Infinity,
		},
		[EArmorSlotId.ClassItem]: {
			min: Infinity,
			max: -Infinity,
		},
	});
export type GetModPlacementsParams = {
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	statModCombos: StatModCombo[];
	potentialRaidModArmorSlotPlacements:
		| PotentialRaidModArmorSlotPlacement[]
		| null;
};

type GetModPlacementsResult = {
	placements: ModPlacements[];
	armorSlotCapacityRangeMapping: ArmorSlotCapacityRangeMapping;
};
// Places stat mods and raid mods
export const getModPlacements = ({
	armorSlotMods,
	statModCombos,
	potentialRaidModArmorSlotPlacements,
}: GetModPlacementsParams): GetModPlacementsResult | null => {
	let results: ModPlacements[] = [];
	const armorSlotCapacityRangeMapping =
		getDefaultArmorSlotCapacityRangeMapping();
	const hasRaidMods = potentialRaidModArmorSlotPlacements?.length > 0;

	// Generate the capaciteis for each armor slot
	let allArmorSlotCapacities = [getArmorSlotEnergyCapacity(armorSlotMods)];
	if (hasRaidMods) {
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

	statModCombos.forEach((statModCombo) => {
		const { artificeModIdList, armorStatModIdList } =
			convertStatModComboToExpandedStatModCombo(statModCombo);
		const sortedArmorStatMods = [...armorStatModIdList].sort(
			(a, b) => getMod(b).cost - getMod(a).cost
		);

		allArmorSlotCapacities.forEach((armorSlotCapacities, j) => {
			const sortedArmorSlotCapacities = Object.values(armorSlotCapacities).sort(
				// Sort by capacity then by name. By name is just for making consistent testing easier
				(a, b) =>
					b.capacity - a.capacity || a.armorSlotId.localeCompare(b.armorSlotId)
			);

			const comboPlacement: ModPlacements =
				getDefaultArmorSlotModComboPlacementWithArtificeMods();

			// Place the raid mods
			if (hasRaidMods) {
				const raidModPlacements: Partial<Record<EArmorSlotId, EModId>> =
					potentialRaidModArmorSlotPlacements[j];
				for (const armorSlotId in raidModPlacements) {
					comboPlacement.placement[armorSlotId].raidModId =
						raidModPlacements[armorSlotId];
				}
			}

			comboPlacement.artificeModIdList = artificeModIdList;
			let isValid = true;

			// Before checking all permutations of armorStatMods we
			// ensure that at least one permutation works
			// Check if the highest cost armor stat mod can fit into the highest capacity slot
			// Check if the second highest cost armor stat mod can fit in to the second highest capacity slot, etc...
			for (let i = 0; i < sortedArmorStatMods.length; i++) {
				if (
					getMod(sortedArmorStatMods[i]).cost >
					sortedArmorSlotCapacities[i].capacity
				) {
					isValid = false;
					break;
				}
				// comboPlacement.placement[
				// 	sortedArmorSlotCapacities[i].armorSlotId
				// ].armorStatModId = sortedArmorStatMods[i];
			}
			if (!isValid) {
				results = null;
				return;
			}

			// TODO: We could probably re-instate this in some form
			// If we have no armor slot mods or raid mods
			// we can return here and not check all permutations

			// // If we have no armor slot mods or raid mods
			// // we can return here and not check all permutations
			// // Since there is no possible affect on the desired stat tier preview
			// // And no armor slot mod costs more than 5 energy.
			// // TODO: This is fragile and assumes that no mod will ever cost more than 5 energy
			// // ... or is it... it's only fragile if we rely on the desired stat preview to
			// // disable armor slot mods which I don't think we do
			// let hasArmorSlotMods = false;
			// for (let i = 0; i < ArmorSlotIdList.length; i++) {
			// 	if (armorSlotMods[i] && armorSlotMods[i].length > 0) {
			// 		hasArmorSlotMods = true;
			// 		break;
			// 	}
			// }
			// if (!hasRaidMods && !hasArmorSlotMods) {
			// 	results.push(comboPlacement);
			// 	return;
			// }

			// Pad the stat mods in preparation for permutation
			// TODO: This permuting is less than ideal. We should be
			// permuting based on mod cost, not mod id
			const paddedArmorStatMods = Array(5).fill(null);
			for (let i = 0; i < sortedArmorStatMods.length; i++) {
				paddedArmorStatMods[i] = sortedArmorStatMods[i];
			}

			const permutedArmorStatModsList = permute(paddedArmorStatMods);
			permutedArmorStatModsList.forEach((permutation) => {
				const placement = cloneDeep(comboPlacement);
				let isValid = true;
				const capacities: number[] = [];
				for (let i = 0; i < ArmorSlotWithClassItemIdList.length; i++) {
					const modId = permutation[i];
					const remainingCapacity = modId
						? armorSlotCapacities[ArmorSlotWithClassItemIdList[i]].capacity -
						  getMod(modId).cost
						: 10;
					if (modId && remainingCapacity < 0) {
						isValid = false;
						break;
					}
					placement.placement[ArmorSlotWithClassItemIdList[i]].armorStatModId =
						modId;
					capacities.push(remainingCapacity);
				}
				if (isValid) {
					results.push(placement);
					capacities.forEach((capacity, i) => {
						const existingCapacityRange =
							armorSlotCapacityRangeMapping[ArmorSlotWithClassItemIdList[i]];
						existingCapacityRange.min = Math.min(
							existingCapacityRange.min,
							capacity
						);
						existingCapacityRange.max = Math.max(
							existingCapacityRange.max,
							capacity
						);
					});
				}
			});
		});
	});
	return results === null
		? null
		: {
				placements: filterRedundantPlacements(results),
				armorSlotCapacityRangeMapping,
		  };
};
