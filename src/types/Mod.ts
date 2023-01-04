import { EModId } from '@dlb/generated/mod/EModId';
import { ModIdToModMapping } from '@dlb/generated/mod/ModMapping';
import { IMod } from './generation';
import {
	EArmorSlotId,
	EArmorStatId,
	EElementId,
	EModSocketCategoryId,
} from './IdEnums';
import { EnumDictionary, StatBonus } from './globals';
import { getDestinyClassAbilityStat } from './DestinyClass';
import { permute } from '@dlb/utils/permutations';
import { ArmorSlotWithClassItemIdList } from './ArmorSlot';
import { ElementIdList } from './Element';

export const getMod = (id: EModId): IMod => ModIdToModMapping[id];

export const ModIdList = Object.values(EModId);

export const ArmorSlotModIdList = ModIdList.filter(
	(id) => getMod(id).modSocketCategoryId === EModSocketCategoryId.ArmorSlot
);

export const CombatStyleModIdList = ModIdList.filter(
	(id) => getMod(id).modSocketCategoryId === EModSocketCategoryId.CombatStyle
);

export const RaidModIdList = ModIdList.filter(
	(id) => getMod(id).modSocketCategoryId === EModSocketCategoryId.Raid
);

export const StatModIdList = ModIdList.filter(
	(id) => getMod(id).modSocketCategoryId === EModSocketCategoryId.Stat
);

// TODO: Pre-generate this with a generation script.
const generateArmorSlotIdToArmorSlotModIdListMapping = (): EnumDictionary<
	EArmorSlotId,
	EModId[]
> => {
	const mapping: EnumDictionary<EArmorSlotId, EModId[]> = {
		[EArmorSlotId.Head]: [],
		[EArmorSlotId.Arm]: [],
		[EArmorSlotId.Chest]: [],
		[EArmorSlotId.Leg]: [],
		[EArmorSlotId.ClassItem]: [],
	};
	ArmorSlotModIdList.forEach((id) => {
		mapping[getMod(id).armorSlotId].push(id);
	});
	return mapping;
};

export const ArmorSlotIdToArmorSlotModIdListMapping: EnumDictionary<
	EArmorSlotId,
	EModId[]
> = generateArmorSlotIdToArmorSlotModIdListMapping();

// TODO: Pre-generate this with a generation script.
const generateModSocketCategoryIdToModIdListMapping = (): EnumDictionary<
	EModSocketCategoryId,
	EModId[]
> => {
	const mapping: EnumDictionary<EModSocketCategoryId, EModId[]> = {
		[EModSocketCategoryId.ArmorSlot]: [],
		[EModSocketCategoryId.CombatStyle]: [],
		[EModSocketCategoryId.Raid]: [],
		[EModSocketCategoryId.Stat]: [],
	};
	ModIdList.forEach((id) => {
		mapping[getMod(id).modSocketCategoryId].push(id);
	});
	return mapping;
};

export const ModSocketCategoryIdToModIdListMapping: EnumDictionary<
	EModSocketCategoryId,
	EModId[]
> = generateModSocketCategoryIdToModIdListMapping();

export const getModIdListFromModSocketCategory = (id: EModSocketCategoryId) =>
	ModSocketCategoryIdToModIdListMapping[id];

// TODO: This will need to be manually updated every season if bungie continues to add stat mods
// to the artifact. Figure out a way to incorporate this directly into mod generation.
// This would be much easier if some mods didn't rely on your class ability stat
const ModIdToStatBonusMapping: Partial<EnumDictionary<EModId, StatBonus[]>> = {
	// POSITIVE Mods
	[EModId.PowerfulFriends]: [{ stat: EArmorStatId.Mobility, value: 20 }],
	[EModId.RadiantLight]: [{ stat: EArmorStatId.Strength, value: 20 }],
	[EModId.ArtifactResilientRetrofit]: [
		{ stat: EArmorStatId.Resilience, value: 5 },
	],
	[EModId.ArtifactMobileRetrofit]: [{ stat: EArmorStatId.Mobility, value: 5 }],
	// NEGATIVE Mods
	[EModId.ProtectiveLight]: [{ stat: EArmorStatId.Strength, value: -10 }],
	[EModId.ExtraReserves]: [{ stat: EArmorStatId.Intellect, value: -10 }],
	[EModId.PreciselyCharged]: [{ stat: EArmorStatId.Discipline, value: -10 }],
	[EModId.StacksOnStacks]: [{ stat: EArmorStatId.Recovery, value: -10 }],
	[EModId.PrecisionCharge]: [{ stat: EArmorStatId.Strength, value: -10 }],
	[EModId.SurpriseAttack]: [{ stat: EArmorStatId.Intellect, value: -10 }],
	[EModId.EnergyConverter]: [{ stat: EArmorStatId.Discipline, value: -10 }],
	[EModId.ChargeHarvester]: [{ stat: getDestinyClassAbilityStat, value: -10 }],
};

export const getStatBonusesFromMod = (id: EModId): StatBonus[] => {
	return ModIdToStatBonusMapping[id] || null;
};

export type ArmorSlotIdToModIdListMapping = {
	[key in EArmorSlotId]: EModId[];
};

type ArmorSlotCapacity = {
	armorSlotId: EArmorSlotId;
	elementId: EElementId;
	capacity: number;
};

const defaultValidPlacement: Record<EArmorSlotId, EModId> = {
	[EArmorSlotId.Head]: null,
	[EArmorSlotId.Arm]: null,
	[EArmorSlotId.Chest]: null,
	[EArmorSlotId.Leg]: null,
	[EArmorSlotId.ClassItem]: null,
};

const getArmorSlotElementCapacity = (
	armorSlotMods: ArmorSlotIdToModIdListMapping
): Record<EArmorSlotId, ArmorSlotCapacity> => {
	const armorSlotCapacities: Partial<Record<EArmorSlotId, ArmorSlotCapacity>> =
		{};
	ArmorSlotWithClassItemIdList.forEach((armorSlotId: EArmorSlotId) => {
		const modIdList: EModId[] = armorSlotMods[armorSlotId];
		let elementId: EElementId = EElementId.Any;
		let capacity = 10;
		modIdList.forEach((id) => {
			if (id === null) {
				return;
			}
			const { cost, elementId: e } = getMod(id);
			capacity -= cost;
			if (e !== EElementId.Any) {
				elementId = e;
			}
			// TODO: maybe break here if the element is anything other than Any
		});
		armorSlotCapacities[armorSlotId] = { capacity, elementId, armorSlotId };
	});
	return armorSlotCapacities as Record<EArmorSlotId, ArmorSlotCapacity>;
};

// TODO: Probably have a valid placement look like
// { [EArmorSlotId.Head]: {modId: EModId.ArgentOrdinance, remainingCapacity: 5, elementId: EElementId.Solar}}
// Just for the sake of making the next step of figuring out where to place
// stat mods a bit easier to reason about. The element isn't useful right now but it will
// be useful for filtering out armor that will require an affinity change if it will be used.

// Get a list of all the valid placements for the selected combat style mods
export const getValidCombatStyleModArmorSlotPlacements = (
	armorSlotMods: ArmorSlotIdToModIdListMapping,
	combatStyleModIdList: EModId[]
): Partial<Record<EArmorSlotId, EModId>>[] => {
	if (combatStyleModIdList.filter((modId) => modId !== null).length === 0) {
		return [{ ...defaultValidPlacement }];
	}
	const validPlacements: Record<EArmorSlotId, EModId>[] = [];
	// const armorSlotElementMapping: Record<EArmorSlotId, EElementId> = {};
	// Sort by armor slots with the most remaining energy capacity to the least remaining capacity.

	const paddedCombatStyleModIdList = [null, null, null, null, null];
	for (let i = 0; i < combatStyleModIdList.length; i++) {
		paddedCombatStyleModIdList[i] = combatStyleModIdList[i];
	}

	const armorSlotCapacities = getArmorSlotElementCapacity(armorSlotMods);
	const combatStyleModIdListPermutations = permute(paddedCombatStyleModIdList);
	let modIdListPermutation: EModId[] = [];
	let mod: IMod = null;
	let armorSlotCapacity: ArmorSlotCapacity = null;
	let isValidPermutation = false;
	let validPlacement: Partial<Record<EArmorSlotId, EModId>> = {};

	for (let i = 0; i < combatStyleModIdListPermutations.length; i++) {
		modIdListPermutation = combatStyleModIdListPermutations[i];
		isValidPermutation = true;
		validPlacement = {};
		for (let j = 0; j < modIdListPermutation.length; j++) {
			armorSlotCapacity = armorSlotCapacities[ArmorSlotWithClassItemIdList[j]];
			if (modIdListPermutation[j] !== null) {
				mod = getMod(modIdListPermutation[j]);
				if (
					mod.cost > armorSlotCapacity.capacity ||
					(armorSlotCapacity.elementId !== EElementId.Any &&
						armorSlotCapacity.elementId !== mod.elementId)
				) {
					isValidPermutation = false;
					break;
				}
				validPlacement[armorSlotCapacity.armorSlotId] = mod.id;
			} else {
				validPlacement[armorSlotCapacity.armorSlotId] = null;
			}
		}

		if (isValidPermutation) {
			validPlacements.push({ ...validPlacement } as Record<
				EArmorSlotId,
				EModId
			>);
		}
	}
	console.log('>>>>>>>>+ valid placements:', validPlacements);
	return validPlacements.length > 0
		? validPlacements
		: [{ ...defaultValidPlacement }];
};

/*
What is the goal here...
We want to be able to answer the question "What armor slot mods am I able to insert as my next move?"
So we only care about knowing if the very next change to the set of selected mods would be valid. Nothing
beyond that.



forEach(armorSlot) { // head, arm, legs....
	forEach(modSocket in armorSlot) { // artifice and raid armor will have three sockets, others will have two
		forEach(armorSlotMod that would fit in modSocket) {
			// Check if we can create a valid permutation using all other equipped mods
			if (hasOneValidPermutation({...allOtherMods, armorSlotMod})) {
				this mod is enabled
			} else {
				this mod is disabled
			}
		}
	}
}

function hasOneValidPerumtation() {
	// 1. Get the element and cost for each slot. The cost is the sum of the cost for all the armorSlotMods in that slot
	// 2. Group slots into arrays by element that are sorted in ascending order by cost
	// 3. For each combat style mod pick the highest cost armorSlot with a matching element to insert it into.
	// 4. If no matching element armor slot exists then pick the the highest cost armorSlot from the "any" element slots
	
	make sure to do all of this by first processing the combat style mods that require a specific element. do the any element
	combat style mods last.
}

*/

// Determine if there is at least one valid mod permutation
export const hasValidModPermutation = (
	armorSlotMods: ArmorSlotIdToModIdListMapping,
	combatStyleModIdList: EModId[]
): boolean => {
	const armorSlotCapacities = getArmorSlotElementCapacity(armorSlotMods);
	// TODO: We probably want to pre-calculate the sortedArmorSlotCapacities and pass that in as a param
	const sortedArmorSlotCapacities: Partial<
		Record<EElementId, ArmorSlotCapacity[]>
	> = {};
	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		const armorSlotCapacity = armorSlotCapacities[armorSlotId];
		if (!sortedArmorSlotCapacities[armorSlotCapacity.elementId]) {
			sortedArmorSlotCapacities[armorSlotCapacity.elementId] = [];
		}
		sortedArmorSlotCapacities[armorSlotCapacity.elementId].push(
			armorSlotCapacity
		);
	});
	ElementIdList.forEach((elementId) => {
		if (sortedArmorSlotCapacities[elementId]) {
			sortedArmorSlotCapacities[elementId] = sortedArmorSlotCapacities[
				elementId
			].sort((a, b) => {
				return a.capacity - b.capacity;
			});
		}
	});
	let isValid = true;
	for (const modId of combatStyleModIdList) {
		if (modId === null) {
			continue;
		}
		const { elementId, cost } = getMod(modId);
		if (sortedArmorSlotCapacities[elementId]?.length > 0) {
			let _isValid = false;
			for (let i = 0; i < sortedArmorSlotCapacities[elementId].length; i++) {
				if (sortedArmorSlotCapacities[elementId][i].capacity >= cost) {
					sortedArmorSlotCapacities[elementId].splice(i, 1);
					_isValid = true;
					break;
				}
			}
			if (_isValid) {
				continue;
			}
		}
		if (sortedArmorSlotCapacities[EElementId.Any]?.length > 0) {
			let _isValid = false;
			for (
				let i = 0;
				i < sortedArmorSlotCapacities[EElementId.Any].length;
				i++
			) {
				if (sortedArmorSlotCapacities[EElementId.Any][i].capacity >= cost) {
					sortedArmorSlotCapacities[EElementId.Any].splice(i, 1);
					_isValid = true;
					break;
				}
			}
			if (!_isValid) {
				return false;
			}
		} else {
			isValid = false;
			break;
		}
	}
	console.log('>>>>>>>>+ isValid', isValid);
	return isValid;
};
