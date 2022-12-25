import { EModId } from '@dlb/generated/mod/EModId';
import { ModIdToModMapping } from '@dlb/generated/mod/ModMapping';
import { IMod } from './generation';
import { EArmorSlotId, EArmorStatId, EModSocketCategoryId } from './IdEnums';
import { EnumDictionary, StatBonus } from './globals';
import { getDestinyClassAbilityStat } from './DestinyClass';

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
