import { EModId } from '@dlb/generated/mod/EModId';
import { ModIdToModMapping } from '@dlb/generated/mod/ModMapping';
import { IMod } from './generation';
import {
	EArmorSlotId,
	EArmorStatId,
	EElementId,
	EModSocketCategoryId,
} from './IdEnums';
import { EnumDictionary } from './globals';
import { permute } from '@dlb/utils/permutations';
import { ArmorSlotWithClassItemIdList } from './ArmorSlot';

export const getMod = (id: EModId): IMod => ModIdToModMapping[id];

export const ModIdList = Object.values(EModId);

// export const ArmorSlotModIdList = ModIdList.filter(
// 	(id) => getMod(id)?.modSocketCategoryId === EModSocketCategoryId.ArmorSlot
// );
// TODO: Figure out a way to properly show/hide the artifact variations of mods
export const ArmorSlotModIdList = ModIdList.filter((id) => {
	const mod = getMod(id);
	return (
		mod?.modSocketCategoryId === EModSocketCategoryId.ArmorSlot // &&
		// !mod?.isArtifactMod
	);
});

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

const ArmorStatIdToArtificeStatModIdMapping: EnumDictionary<
	EArmorStatId,
	EModId
> = {
	[EArmorStatId.Mobility]: EModId.MobilityForged,
	[EArmorStatId.Resilience]: EModId.ResilienceForged,
	[EArmorStatId.Recovery]: EModId.RecoveryForged,
	[EArmorStatId.Discipline]: EModId.DisciplineForged,
	[EArmorStatId.Intellect]: EModId.IntellectForged,
	[EArmorStatId.Strength]: EModId.StrengthForged,
};

export const getArtificeStatModIdFromArmorStatId = (
	armorStatId: EArmorStatId
): EModId => ArmorStatIdToArtificeStatModIdMapping[armorStatId];

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
	capacity: number;
};

export const getDefaultValidRaidModArmorSlotPlacement =
	(): ValidRaidModArmorSlotPlacement => {
		return {
			[EArmorSlotId.Head]: null,
			[EArmorSlotId.Arm]: null,
			[EArmorSlotId.Chest]: null,
			[EArmorSlotId.Leg]: null,
			[EArmorSlotId.ClassItem]: null,
		};
	};

const getArmorSlotEnergyCapacity = (
	armorSlotMods: ArmorSlotIdToModIdListMapping
): Record<EArmorSlotId, ArmorSlotCapacity> => {
	const armorSlotCapacities: Partial<Record<EArmorSlotId, ArmorSlotCapacity>> =
		{};
	ArmorSlotWithClassItemIdList.forEach((armorSlotId: EArmorSlotId) => {
		const modIdList: EModId[] = armorSlotMods[armorSlotId];
		let capacity = 10;
		modIdList.forEach((id) => {
			if (id === null) {
				return;
			}
			const { cost } = getMod(id);
			capacity -= cost;
		});

		armorSlotCapacities[armorSlotId] = { capacity, armorSlotId };
	});
	return armorSlotCapacities as Record<EArmorSlotId, ArmorSlotCapacity>;
};

// export type ValidRaidModArmorSlotPlacementValue = {
// 	modId: EModId;
// 	unusedArmorEnergyCapacity: number;
// };

export type ValidRaidModArmorSlotPlacement = Partial<
	Record<EArmorSlotId, EModId>
>;

// { [EArmorSlotId.Head]: {modId: EModId.ArgentOrdinance, remainingCapacity: 5, elementId: EElementId.Solar}}

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
	validRaidModArmorSlotPlacements: ValidRaidModArmorSlotPlacement[]
): boolean => {
	const sortedArmorStatMods = [...armorStatMods].sort(
		(a, b) => getMod(b).cost - getMod(a).cost
	);
	for (let i = 0; i < validRaidModArmorSlotPlacements.length; i++) {
		const armorSlotCapacities = getArmorSlotEnergyCapacity(armorSlotMods);
		const raidModPlacement = validRaidModArmorSlotPlacements[i];
		// Update the armorSlotCapacities for this particular raid mod placement permutation
		for (let j = 0; j < ArmorSlotWithClassItemIdList.length; j++) {
			const armorSlotId = ArmorSlotWithClassItemIdList[j];
			if (raidModPlacement[armorSlotId]) {
				armorSlotCapacities[armorSlotId].capacity -= getMod(
					raidModPlacement[armorSlotId]
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

// Determine if there is at least one valid raid mod permutation
/*
	// 1. Get the element and capacity for each slot. The capacity is 10 - the sum of the cost for all the armorSlotMods in that slot
	// 2. Group slots into arrays by element that are sorted from lowest to highest capacity
	// 3. For each raid mod pick the lowest capacity armorSlot with a matching element to insert that mod.
	// 4. If no matching element armor slot exists then pick the the lowest capacity armorSlot from the "any" element slots
	
	make sure to do all of this by first processing the raid mods that require a specific element. do the any element
	raid mods last.
*/
/*
TODO: This just checks if raid mods can fit based on their cost. It doesn't check if the armor
in the combination actually has the appropriate raid mod sockets. Write a differnt function for that.
*/
export const hasValidRaidModPermutation = (
	armorSlotMods: ArmorSlotIdToModIdListMapping,
	raidModIdList: EModId[]
): boolean => {
	const raidMods = raidModIdList
		.filter((x) => x !== null)
		.map((modId) => getMod(modId));
	if (raidMods.length === 0) {
		return true;
	}
	const armorSlotCapacities = getArmorSlotEnergyCapacity(armorSlotMods);
	// TODO: We probably want to pre-calculate the sortedArmorSlotCapacities and pass that in as a param
	const sortedArmorSlotCapacities = Object.values(armorSlotCapacities).sort(
		(a, b) => a.capacity - b.capacity
	);

	return placeRaidMods(sortedArmorSlotCapacities, raidMods);
};

const placeRaidMods = (
	sortedArmorSlotCapacities: ArmorSlotCapacity[],
	mods: IMod[]
): boolean => {
	const _sortedArmorSlotCapacities = [...sortedArmorSlotCapacities];
	let isValid = true;
	for (const mod of mods) {
		const { cost } = mod;
		if (_sortedArmorSlotCapacities.length > 0) {
			let _isValid = false;
			for (let i = 0; i < _sortedArmorSlotCapacities.length; i++) {
				if (_sortedArmorSlotCapacities[i].capacity >= cost) {
					_sortedArmorSlotCapacities.splice(i, 1);
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

// TODO: Probably have a valid placement look like
// { [EArmorSlotId.Head]: {modId: EModId.ArgentOrdinance, remainingCapacity: 5, elementId: EElementId.Solar}}
// Just for the sake of making the next step of figuring out where to place
// stat mods a bit easier to reason about.

// Get a list of all the valid placements for the selected raid mods
// Note that this is just checking "can this raid mod fit in this armor slot given the
// other armor slot mods that are already selected". It does NOT do anything
// to check if a specific armor combination actually has the raid armor pieces
// capable of slotting these mods. That is a separate check. We don't
// want to do this placement check for each armmor combination because
// that would be pretty expensive. Instead we can check if an armor combination
// can even slot the required raid mods and then iterate over each of these
// potential placements to see if they work.
export const getValidRaidModArmorSlotPlacements = (
	armorSlotMods: ArmorSlotIdToModIdListMapping,
	raidModIdList: EModId[]
): ValidRaidModArmorSlotPlacement[] => {
	if (raidModIdList.filter((modId) => modId !== null).length === 0) {
		return [getDefaultValidRaidModArmorSlotPlacement()];
	}
	const validPlacements: ValidRaidModArmorSlotPlacement[] = [];
	// const armorSlotElementMapping: Record<EArmorSlotId, EElementId> = {};
	// Sort by armor slots with the most remaining energy capacity to the least remaining capacity.

	const paddedRaidModIdList = [null, null, null, null];
	for (let i = 0; i < raidModIdList.length; i++) {
		paddedRaidModIdList[i] = raidModIdList[i];
	}

	const armorSlotCapacities = getArmorSlotEnergyCapacity(armorSlotMods);
	const raidModIdListPermutations = permute(paddedRaidModIdList);
	let raidModIdListPermutation: EModId[] = [];
	let mod: IMod = null;
	let armorSlotCapacity: ArmorSlotCapacity = null;
	let isValidPermutation = false;

	for (let i = 0; i < raidModIdListPermutations.length; i++) {
		raidModIdListPermutation = raidModIdListPermutations[i];
		isValidPermutation = true;
		const validPlacement: ValidRaidModArmorSlotPlacement =
			getDefaultValidRaidModArmorSlotPlacement();
		for (let j = 0; j < raidModIdListPermutation.length; j++) {
			armorSlotCapacity = armorSlotCapacities[ArmorSlotWithClassItemIdList[j]];
			if (raidModIdListPermutation[j] !== null) {
				mod = getMod(raidModIdListPermutation[j]);
				const unusedArmorEnergyCapacity = armorSlotCapacity.capacity - mod.cost;
				if (unusedArmorEnergyCapacity < 0) {
					isValidPermutation = false;
					break;
				}
				validPlacement[armorSlotCapacity.armorSlotId] = mod.id;
			} else {
				validPlacement[armorSlotCapacity.armorSlotId] = null;
			}
		}

		if (isValidPermutation) {
			validPlacements.push(validPlacement);
		}
	}
	console.log('>>>>>>>>+ valid placements:', validPlacements);
	return validPlacements.length > 0
		? validPlacements
		: [getDefaultValidRaidModArmorSlotPlacement()];
};
