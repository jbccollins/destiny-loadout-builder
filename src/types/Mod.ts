import { EModId } from '@dlb/generated/mod/EModId';
import { ModIdToModMapping } from '@dlb/generated/mod/ModMapping';
import { IMod } from './generation';
import { EArmorSlotId, EElementId, EModSocketCategoryId } from './IdEnums';
import { EnumDictionary } from './globals';
import { permute } from '@dlb/utils/permutations';
import { ArmorSlotWithClassItemIdList } from './ArmorSlot';
import { ElementIdList } from './Element';

export const getMod = (id: EModId): IMod => ModIdToModMapping[id];

export const ModIdList = Object.values(EModId);

// export const ArmorSlotModIdList = ModIdList.filter(
// 	(id) => getMod(id)?.modSocketCategoryId === EModSocketCategoryId.ArmorSlot
// );
// TODO: Figure out a way to properly show/hide the artifact variations of mods
export const ArmorSlotModIdList = ModIdList.filter((id) => {
	const mod = getMod(id);
	return (
		mod?.modSocketCategoryId === EModSocketCategoryId.ArmorSlot &&
		!mod?.isArtifactMod
	);
});

export const CombatStyleModIdList = ModIdList.filter(
	(id) => getMod(id)?.modSocketCategoryId === EModSocketCategoryId.CombatStyle
);

export const RaidModIdList = ModIdList.filter(
	(id) => getMod(id)?.modSocketCategoryId === EModSocketCategoryId.Raid
);

export const StatModIdList = ModIdList.filter((id) => {
	const mod = getMod(id);
	return (
		mod?.modSocketCategoryId === EModSocketCategoryId.Stat &&
		!mod?.isArtifactMod
	);
});

export const MajorStatModIdList = StatModIdList.filter(
	(id) => !getMod(id)?.name.includes('Minor')
);

export const MinorStatModIdList = StatModIdList.filter((id) =>
	getMod(id)?.name.includes('Minor')
);

export const ArtifactStatModIdList = ModIdList.filter((id) => {
	const mod = getMod(id);
	return (
		mod?.modSocketCategoryId === EModSocketCategoryId.Stat && mod?.isArtifactMod
	);
});

export const ArtifactMajorStatModIdList = ArtifactStatModIdList.filter(
	(id) => !getMod(id)?.name.includes('Minor')
);

export const ArtifactMinorStatModIdList = ArtifactStatModIdList.filter((id) =>
	getMod(id)?.name.includes('Minor')
);

export const ArtificeStatModIdList = ModIdList.filter(
	(id) => getMod(id)?.modSocketCategoryId === EModSocketCategoryId.ArtificeStat
);

export const ArtificeMajorStatModIdList = ArtificeStatModIdList.filter(
	(id) => !getMod(id)?.name.includes('Minor')
);

export const ArtificeMinorStatModIdList = ArtificeStatModIdList.filter((id) =>
	getMod(id)?.name.includes('Minor')
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
		try {
			mapping[getMod(id).armorSlotId].push(id);
		} catch (e) {
			console.log('fix this error');
		}
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
		[EModSocketCategoryId.ArtificeStat]: [],
	};
	ModIdList.forEach((id) => {
		const mod = getMod(id);
		if (mod) {
			mapping[mod.modSocketCategoryId].push(id);
		}
	});
	return mapping;
};

export const ModSocketCategoryIdToModIdListMapping: EnumDictionary<
	EModSocketCategoryId,
	EModId[]
> = generateModSocketCategoryIdToModIdListMapping();

export const getModIdListFromModSocketCategory = (id: EModSocketCategoryId) =>
	ModSocketCategoryIdToModIdListMapping[id];

export type ArmorSlotIdToModIdListMapping = {
	[key in EArmorSlotId]: EModId[];
};

export const getDefaultArmorSlotIdToModIdListMapping =
	(): ArmorSlotIdToModIdListMapping =>
		ArmorSlotWithClassItemIdList.reduce((accumulator, currentValue) => {
			accumulator[currentValue] = [null, null, null];
			return accumulator;
		}, {}) as ArmorSlotIdToModIdListMapping;

type ArmorSlotCapacity = {
	armorSlotId: EArmorSlotId;
	elementId: EElementId;
	capacity: number;
};

export const DefaultValidPlacement: Record<EArmorSlotId, EModId> = {
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

export type ValidCombatStyleModPlacements = Partial<
	Record<EArmorSlotId, EModId>
>[];

// TODO: Probably have a valid placement look like
// { [EArmorSlotId.Head]: {modId: EModId.ArgentOrdinance, remainingCapacity: 5, elementId: EElementId.Solar}}
// Just for the sake of making the next step of figuring out where to place
// stat mods a bit easier to reason about. The element isn't useful right now but it will
// be useful for filtering out armor that will require an affinity change if it will be used.

// Get a list of all the valid placements for the selected combat style mods
export const getValidCombatStyleModArmorSlotPlacements = (
	armorSlotMods: ArmorSlotIdToModIdListMapping,
	combatStyleModIdList: EModId[]
): ValidCombatStyleModPlacements => {
	if (combatStyleModIdList.filter((modId) => modId !== null).length === 0) {
		return [{ ...DefaultValidPlacement }];
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
					(mod.elementId !== EElementId.Any &&
						armorSlotCapacity.elementId !== EElementId.Any &&
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
		: [{ ...DefaultValidPlacement }];
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
*/

export const hasValidArmorStatModPermutation = (
	armorSlotMods: ArmorSlotIdToModIdListMapping,
	armorStatMods: EModId[],
	validCombatStyleModArmorSlotPlacements: ValidCombatStyleModPlacements
): boolean => {
	const sortedArmorStatMods = [...armorStatMods].sort(
		(a, b) => getMod(b).cost - getMod(a).cost
	);
	for (let i = 0; i < validCombatStyleModArmorSlotPlacements.length; i++) {
		const armorSlotCapacities = getArmorSlotElementCapacity(armorSlotMods);
		const combatStyleModPlacement = validCombatStyleModArmorSlotPlacements[i];
		// Update the armorSlotCapacities for this particular combat style mod placement permutation
		for (let j = 0; j < ArmorSlotWithClassItemIdList.length; j++) {
			const armorSlotId = ArmorSlotWithClassItemIdList[j];
			if (combatStyleModPlacement[armorSlotId]) {
				armorSlotCapacities[armorSlotId].capacity -= getMod(
					combatStyleModPlacement[armorSlotId]
				).cost;
			}
		}
		const sortedArmorSlotCapacities = Object.values(armorSlotCapacities).sort(
			(a, b) => b.capacity - a.capacity
		);
		let isValid = true;
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
		}
		if (isValid) {
			return true;
		}
	}
	return false;
};

// Determine if there is at least one valid combat style mod permutation
/*
	// 1. Get the element and capacity for each slot. The capacity is 10 - the sum of the cost for all the armorSlotMods in that slot
	// 2. Group slots into arrays by element that are sorted from lowest to highest capacity
	// 3. For each combat style mod pick the lowest capacity armorSlot with a matching element to insert that mod.
	// 4. If no matching element armor slot exists then pick the the lowest capacity armorSlot from the "any" element slots
	
	make sure to do all of this by first processing the combat style mods that require a specific element. do the any element
	combat style mods last.
*/
export const hasValidCombatStyleModPermutation = (
	armorSlotMods: ArmorSlotIdToModIdListMapping,
	combatStyleModIdList: EModId[]
): boolean => {
	const _combatStyleMods = combatStyleModIdList
		.filter((x) => x !== null)
		.map((modId) => getMod(modId));
	if (_combatStyleMods.length === 0) {
		return true;
	}
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
	const elementalCombatStyleMods = _combatStyleMods.filter(
		(x) => x.elementId !== EElementId.Any
	);
	const nonElementalCombatStyleMods = _combatStyleMods.filter(
		(x) => x.elementId === EElementId.Any
	);
	const hasValidElementalCombatStyleModPermutation = placeCombatStyleMods(
		sortedArmorSlotCapacities,
		elementalCombatStyleMods
	);
	if (!hasValidElementalCombatStyleModPermutation) {
		return false;
	}

	// Group all of the unused armor slots under the any element now, regardless of what element
	// the armor slot has. Combat style mods with any element can go in a solar armor slot, for example,
	// so at this point the slot element does not matter
	let remainingArmorSlotCapacities = [];
	Object.values(sortedArmorSlotCapacities).forEach(
		(x) =>
			(remainingArmorSlotCapacities = remainingArmorSlotCapacities.concat(x))
	);
	const remainingSortedArmorSlotCapacities: Partial<
		Record<EElementId, ArmorSlotCapacity[]>
	> = {
		[EElementId.Any]: remainingArmorSlotCapacities.sort((a, b) => {
			return a.capacity - b.capacity;
		}),
	};
	return placeCombatStyleMods(
		remainingSortedArmorSlotCapacities,
		nonElementalCombatStyleMods
	);
};

const placeCombatStyleMods = (
	sortedArmorSlotCapacities: Partial<Record<EElementId, ArmorSlotCapacity[]>>,
	mods: IMod[]
): boolean => {
	let isValid = true;
	for (const mod of mods) {
		const { elementId, cost } = mod;
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
		if (
			// We already checked any above if the mod element was any
			elementId !== EElementId.Any &&
			sortedArmorSlotCapacities[EElementId.Any]?.length > 0
		) {
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
	return isValid;
};
