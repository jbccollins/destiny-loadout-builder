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
	const armorSlotCapacities: ArmorSlotCapacity[] = [];
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
			//const e = getMod(id).elementId;
			if (e !== null && e !== EElementId.Any) {
				elementId = e;
			}
			// TODO: maybe break here
		});
		armorSlotCapacities.push({ capacity, elementId, armorSlotId });
	});

	// const nonNullCombatStyleModIdList = combatStyleModIdList.filter(
	// 	(id) => id !== null
	// );
	const paddedCombatStyleModIdList = [null, null, null, null, null];
	for (let i = 0; i < combatStyleModIdList.length; i++) {
		paddedCombatStyleModIdList[i] = combatStyleModIdList[i];
	}

	const combatStyleModIdListPermutations = permute(paddedCombatStyleModIdList);
	// if (
	// 	combatStyleModIdListPermutations.filter((modId) => modId !== null)
	// 		.length === 0
	// ) {
	// 	return [{ ...defaultValidPlacement }];
	// }
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
			armorSlotCapacity = armorSlotCapacities[j];
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
	console.log('>>>>>>>> valid placements:', validPlacements);
	return validPlacements.length > 0
		? validPlacements
		: [{ ...defaultValidPlacement }];
};
