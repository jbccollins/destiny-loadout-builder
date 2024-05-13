import mutuallyExclusiveMods from '@dlb/dim/data/d2/mutually-exclusive-mods.json';
import unstackableMods from '@dlb/dim/data/d2/unstackable-mods.json';
import { EModId } from '@dlb/generated/mod/EModId';
import { ModIdToModMapping } from '@dlb/generated/mod/ModMapping';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { permute } from '@dlb/utils/permutations';
import {
	normalToReducedMod,
	reducedToNormalMod,
} from '@dlb/utils/reduced-cost-mod-mapping';
import { ArmorSlotWithClassItemIdList } from './ArmorSlot';
import {
	EArmorSlotId,
	EArmorStatId,
	EModCategoryId,
	EModSocketCategoryId,
} from './IdEnums';
import { getActiveSeasonArtifactModIdList } from './ModCategory';
import { IMod } from './generation';
import { EnumDictionary } from './globals';

export const getMod = (id: EModId): IMod => ModIdToModMapping[id];

const ModHashToModIdMapping = generateHashToIdMapping(ModIdToModMapping);

export const getModByHash = (hash: number): IMod => {
	return ModIdToModMapping[ModHashToModIdMapping[hash]];
};

export const ModIdList = Object.values(EModId);

export const ArmorSlotModIdList = ModIdList.filter((id) => {
	const mod = getMod(id);
	return mod?.modSocketCategoryId === EModSocketCategoryId.ArmorSlot;
});

export const NonArtifactArmorSlotModIdList = ArmorSlotModIdList.filter(
	(id) => !getMod(id)?.isArtifactMod
);

export const ActiveSeasonReducedCostVariantModIdList =
	ArmorSlotModIdList.filter((id) => {
		const mod = getMod(id);
		return (
			getActiveSeasonArtifactModIdList().includes(mod.id) &&
			!!reducedToNormalMod[mod.hash]
		);
	});

export const AlternateSeasonReducedCostVariantModIdList =
	ArmorSlotModIdList.filter((id) => {
		const mod = getMod(id);
		return (
			mod.isArtifactMod &&
			mod.modCategoryId === EModCategoryId.AlternateSeasonalArtifact &&
			!!reducedToNormalMod[mod.hash]
		);
	});

export const ActiveSeasonFullCostVariantModIdList =
	NonArtifactArmorSlotModIdList.filter((x) => {
		const mod = getMod(x);
		const reducedCostModHash = normalToReducedMod[mod.hash];
		if (reducedCostModHash) {
			const reducedCostMod = getModByHash(reducedCostModHash);
			if (reducedCostMod) {
				return ActiveSeasonReducedCostVariantModIdList.includes(
					reducedCostMod.id
				);
			}
		}
		return false;
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

export const MaxStatModCost = StatModIdList.reduce(
	(accumulator, currentValue) => {
		const mod = getMod(currentValue);
		if (mod.cost > accumulator) {
			return mod.cost;
		}
		return accumulator;
	},
	0
);

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

const fontModIdList = ModIdList.filter((id) => {
	const mod = getMod(id);
	return (
		mod?.modCategoryId === EModCategoryId.ArmorCharge &&
		mod?.name.startsWith('Font of')
	);
});

// If we have no way to spend armor charge, then we don't care about acquiring it
const armorChargeAcquisitionModIdList = [
	// Head
	EModId.PowerfulFriends,
	EModId.RadiantLight,
	// Arms
	EModId.ShieldBreakCharge,
	// Chest
	EModId.ChargedUp,
	// Legs
	EModId.ElementalCharge,
	EModId.StacksOnStacks,
	// Class Item
	EModId.EmpoweredFinish,
	EModId.TimeDilation,
];

// If we are spending armor charge then we want to be careful about spending it in ways that we don't want to
const armorChargeSpendModIdList = [
	// Head
	// Arms
	EModId.GrenadeKickstart,
	EModId.MeleeKickstart,
	// Chest
	EModId.EmergencyReinforcement,
	// Legs
	// Class Item
	EModId.BenevolentFinisher,
	EModId.BulwarkFinisher,
	EModId.ExplosiveFinisher,
	EModId.HealthyFinisher,
	EModId.OneTwoFinisher,
	EModId.RestorativeFinisher,
	EModId.SnaploadFinisher,
	EModId.SpecialFinisher,
	EModId.UtilityFinisher,
	EModId.UtilityKickstart,
];

const getReducedCostModIdListFromModIdList = (
	modIdList: EModId[]
): EModId[] => {
	const result: EModId[] = [];
	modIdList.forEach((modId) => {
		const mod = getMod(modId);
		const reducedCostModHash = normalToReducedMod[mod.hash];
		if (reducedCostModHash) {
			result.push(ModHashToModIdMapping[reducedCostModHash]);
		}
	});
	return result;
};

export const FontModIdList = [
	...fontModIdList,
	...getReducedCostModIdListFromModIdList(fontModIdList),
];
export const ArmorChargeAcquisitionModIdList = [
	...armorChargeAcquisitionModIdList,
	...getReducedCostModIdListFromModIdList(armorChargeAcquisitionModIdList),
];
export const ArmorChargeSpendModIdList = [
	...armorChargeSpendModIdList,
	...getReducedCostModIdListFromModIdList(armorChargeSpendModIdList),
];

export const AllStatModHashes = [
	...ArtificeStatModIdList,
	...StatModIdList,
].map((id) => getMod(id)?.hash);

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

export type ArmorSlotCapacity = {
	armorSlotId: EArmorSlotId;
	capacity: number;
	raidModId: EModId;
	armorStatModId: EModId;
};

export const getDefaultPotentialRaidModArmorSlotPlacement =
	(): PotentialRaidModArmorSlotPlacement => {
		return {
			[EArmorSlotId.Head]: null,
			[EArmorSlotId.Arm]: null,
			[EArmorSlotId.Chest]: null,
			[EArmorSlotId.Leg]: null,
			[EArmorSlotId.ClassItem]: null,
		};
	};

export const getArmorSlotEnergyCapacity = (
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

		armorSlotCapacities[armorSlotId] = {
			capacity,
			armorSlotId,
			raidModId: null,
			armorStatModId: null,
		};
	});
	return armorSlotCapacities as Record<EArmorSlotId, ArmorSlotCapacity>;
};

export type PotentialRaidModArmorSlotPlacement = Partial<
	Record<EArmorSlotId, EModId>
>;

type HasValidArmorStatModPermutationResult = {
	hasValidPermutation: boolean;
	sortedArmorSlotCapacities: ArmorSlotCapacity[];
};
export const hasValidArmorStatModPermutation = (
	armorSlotMods: ArmorSlotIdToModIdListMapping,
	armorStatMods: EModId[],
	validRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[]
): HasValidArmorStatModPermutationResult => {
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
				armorSlotCapacities[armorSlotId].raidModId =
					raidModPlacement[armorSlotId];
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
				sortedArmorSlotCapacities[i].armorStatModId = sortedArmorStatMods[i];
				isValid = false;
				break;
			}
		}
		if (isValid) {
			return {
				hasValidPermutation: true,
				sortedArmorSlotCapacities: sortedArmorSlotCapacities,
			};
		}
	}
	return { hasValidPermutation: false, sortedArmorSlotCapacities: null };
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
): PotentialRaidModArmorSlotPlacement[] => {
	if (raidModIdList.filter((modId) => modId !== null).length === 0) {
		return [getDefaultPotentialRaidModArmorSlotPlacement()];
	}
	const validPlacements: PotentialRaidModArmorSlotPlacement[] = [];
	// Sort by armor slots with the most remaining energy capacity to the least remaining capacity.

	// 5 Slots, Even though the exotic armor piece can't support it we still
	// need this padding to make sure we get all the permutations
	const paddedRaidModIdList = [null, null, null, null, null];
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
		const validPlacement: PotentialRaidModArmorSlotPlacement =
			getDefaultPotentialRaidModArmorSlotPlacement();
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
	// console.log('>>>>>>>>+ valid placements:', validPlacements);
	return validPlacements.length > 0
		? validPlacements
		: [getDefaultPotentialRaidModArmorSlotPlacement()];
};

/**
 * Some mods form a group of which only one mod can be equipped,
 * which is enforced by game servers. DIM must respect this when building
 * loadouts or applying mods.
 */
export function getModExclusionGroup(mod: IMod): string | undefined {
	return mutuallyExclusiveMods[mod.hash];
}

export function hasMutuallyExclusiveMods(mods: IMod[]): [boolean, string[]] {
	const exclusionGroups: string[] = [];
	let _hasMutuallyExclusiveMods = false;
	for (let i = 0; i < mods.length; i++) {
		const group = getModExclusionGroup(mods[i]);
		if (!group) {
			continue;
		}
		if (!exclusionGroups.includes(group)) {
			exclusionGroups.push(group);
			continue;
		}
		_hasMutuallyExclusiveMods = true;
	}
	if (_hasMutuallyExclusiveMods) {
		return [true, exclusionGroups];
	}
	return [false, []];
}

export function hasUnstackableMods(mods: IMod[]): [boolean, EModId[]] {
	let _hasUnstackableMods = false;
	const unstackableModIdList: EModId[] = [];
	const uniqueModIdList = [...new Set(mods.map((mod) => mod.id))];
	uniqueModIdList.forEach((modId) => {
		const mod = getMod(modId);
		if (
			unstackableMods.includes(mod.hash) &&
			mods.filter((x) => x.id === modId).length > 1
		) {
			_hasUnstackableMods = true;
			unstackableModIdList.push(modId);
		}
	});
	return [_hasUnstackableMods, unstackableModIdList];
}

export const hasAlternateSeasonReducedCostVariantMods = (
	modIdList: EModId[]
): boolean => {
	return modIdList.some((modId) => {
		const mod = getMod(modId);
		if (!mod) {
			return false;
		}
		return (
			!getActiveSeasonArtifactModIdList().includes(mod.id) &&
			!!reducedToNormalMod[mod.hash]
		);
	});
};

export const hasAlternateSeasonArtifactMods = (
	modIdList: EModId[]
): boolean => {
	return modIdList.some((modId) => {
		const mod = getMod(modId);
		if (!mod) {
			return false;
		}
		return (
			mod.isArtifactMod &&
			mod.modCategoryId === EModCategoryId.AlternateSeasonalArtifact &&
			!getActiveSeasonArtifactModIdList().includes(mod.id)
		);
	});
};

export const hasNonBuggedAlternateSeasonMods = (
	modIdList: EModId[],
	buggedAlternateSeasonModIdList: EModId[]
): boolean => {
	return modIdList.some((x) => {
		const mod = getMod(x);
		return (
			mod.isArtifactMod &&
			mod.modCategoryId === EModCategoryId.AlternateSeasonalArtifact &&
			!getActiveSeasonArtifactModIdList().includes(x) &&
			!buggedAlternateSeasonModIdList.includes(x)
		);
	});
};

export const hasActiveSeasonArtifactMods = (modIdList: EModId[]): boolean =>
	getActiveSeasonArtifactModIdList().some((x) => modIdList.includes(x));

export const hasActiveSeasonArtifactModsWithNoFullCostVariant = (
	modIdList: EModId[]
): boolean =>
	getActiveSeasonArtifactModIdList().some(
		(x) => modIdList.includes(x) && !reducedToNormalMod[getMod(x).hash]
	);

export const hasActiveSeasonReducedCostVariantMods = (
	modIdList: EModId[]
): boolean => {
	return modIdList.some((modId) => {
		const mod = getMod(modId);
		if (!mod) {
			return false;
		}
		return (
			getActiveSeasonArtifactModIdList().includes(modId) &&
			!!reducedToNormalMod[mod.hash]
		);
	});
};

const doReplace = (
	mapping: Record<number, number>
): ((mod: IMod) => IMod | null) => {
	return (mod: IMod) => {
		const newModHash = mapping[mod.hash];
		if (!newModHash) {
			// This means we need to update the generated files and the reducedToNormalMod/normalToReduced mapping
			return null;
		}
		return getModByHash(newModHash);
	};
};

const modReplacer = (
	modIdList: EModId[],
	shouldReplace: (mod: IMod) => boolean,
	doReplace: (mod: IMod) => IMod | null
): EModId[] => {
	const newModIdList: EModId[] = [];
	modIdList.forEach((modId) => {
		const mod = getMod(modId);
		if (!mod) {
			return;
		}
		if (shouldReplace(mod)) {
			const newMod = doReplace(mod);
			if (newMod) {
				newModIdList.push(newMod.id);
			}
		} else {
			newModIdList.push(modId);
		}
	});

	return newModIdList;
};

const isActiveSeasonFullCostVariantMod = (mod: IMod): boolean => {
	return ActiveSeasonFullCostVariantModIdList.includes(mod.id);
};
const isActiveSeasonReducedCostVariantMod = (mod: IMod): boolean => {
	return ActiveSeasonReducedCostVariantModIdList.includes(mod.id);
};

export const isAlternateSeasonReducedCostVariantMod = (mod: IMod): boolean => {
	return AlternateSeasonReducedCostVariantModIdList.includes(mod.id);
};

const isReducedCostVariantMod = (mod: IMod): boolean => {
	return !!reducedToNormalMod[mod.hash];
};

export const replaceActiveSeasonFullCostVariantMods = (modIdList: EModId[]) => {
	return modReplacer(
		modIdList,
		isActiveSeasonFullCostVariantMod,
		doReplace(normalToReducedMod)
	);
};

export const replaceActiveSeasonReducedCostVariantMods = (
	modIdList: EModId[]
) => {
	return modReplacer(
		modIdList,
		isActiveSeasonReducedCostVariantMod,
		doReplace(reducedToNormalMod)
	);
};

export const replaceAlternateSeasonReducedCostVariantMods = (
	modIdList: EModId[]
) => {
	return modReplacer(
		modIdList,
		isAlternateSeasonReducedCostVariantMod,
		doReplace(reducedToNormalMod)
	);
};

export const replaceAllReducedCostVariantMods = (modIdList: EModId[]) => {
	return modReplacer(
		modIdList,
		isReducedCostVariantMod,
		doReplace(reducedToNormalMod)
	);
};

// Replace active full cost variants with active reduced cost variants
// Replace out-of-season reduced cost variants with active full cost variants
// In-season reduced cost variants are left alone
export const replaceAllModsThatDimWillReplace = (modIdList: EModId[]) => {
	return replaceAlternateSeasonReducedCostVariantMods(
		replaceActiveSeasonFullCostVariantMods(modIdList)
	);
};
