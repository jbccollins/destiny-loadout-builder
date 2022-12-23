import {
	ArmorStatIdList,
	ArmorStatMapping,
	DefaultArmorStatMapping,
} from './ArmorStat';
import {
	EnumDictionary,
	IHash,
	IIcon,
	IIdentifiableName,
	Mapping,
	MISSING_ICON,
	ValidateEnumList,
} from './globals';
import { EArmorStatId, EArmorStatModId } from './IdEnums';

export const ArmorStatModIdList = Object.values(EArmorStatModId);

export interface IArmorStatMod extends IIdentifiableName, IIcon, IHash {
	cost: number;
	statBonus: number;
	armorStatId: EArmorStatId;
}

const ArmorStatModIdToArmorStatModMapping: EnumDictionary<
	EArmorStatModId,
	IArmorStatMod
> = {
	[EArmorStatModId.None]: {
		id: EArmorStatModId.None,
		name: 'None',
		icon: MISSING_ICON,
		cost: 0,
		statBonus: 0,
		hash: 0,
		armorStatId: null,
	},
	[EArmorStatModId.MajorMobility]: {
		id: EArmorStatModId.MajorMobility,
		name: 'Major Mobility',
		icon: MISSING_ICON,
		cost: 3,
		statBonus: 10,
		hash: 3961599962,
		armorStatId: EArmorStatId.Mobility,
	},
	[EArmorStatModId.MinorMobility]: {
		id: EArmorStatModId.MinorMobility,
		name: 'Minor Mobility',
		icon: MISSING_ICON,
		cost: 1,
		statBonus: 5,
		hash: 204137529,
		armorStatId: EArmorStatId.Mobility,
	},
	[EArmorStatModId.MajorResilience]: {
		id: EArmorStatModId.MajorResilience,
		name: 'Major Resilience',
		icon: MISSING_ICON,
		cost: 3,
		statBonus: 10,
		hash: 2850583378,
		armorStatId: EArmorStatId.Resilience,
	},
	[EArmorStatModId.MinorResilience]: {
		id: EArmorStatModId.MinorResilience,
		name: 'Minor Resilience',
		icon: MISSING_ICON,
		cost: 1,
		statBonus: 5,
		hash: 3682186345,
		armorStatId: EArmorStatId.Resilience,
	},
	[EArmorStatModId.MajorRecovery]: {
		id: EArmorStatModId.MajorRecovery,
		name: 'Major Recovery',
		icon: MISSING_ICON,
		cost: 4,
		statBonus: 10,
		hash: 2645858828,
		armorStatId: EArmorStatId.Recovery,
	},
	[EArmorStatModId.MinorRecovery]: {
		id: EArmorStatModId.MinorRecovery,
		name: 'Minor Recovery',
		icon: MISSING_ICON,
		cost: 2,
		statBonus: 5,
		hash: 555005975,
		armorStatId: EArmorStatId.Recovery,
	},
	[EArmorStatModId.MajorDiscipline]: {
		id: EArmorStatModId.MajorDiscipline,
		name: 'Major Discipline',
		icon: MISSING_ICON,
		cost: 3,
		statBonus: 10,
		hash: 4048838440,
		armorStatId: EArmorStatId.Discipline,
	},
	[EArmorStatModId.MinorDiscipline]: {
		id: EArmorStatModId.MinorDiscipline,
		name: 'Minor Discipline',
		icon: MISSING_ICON,
		cost: 1,
		statBonus: 5,
		hash: 2623485440,
		armorStatId: EArmorStatId.Discipline,
	},
	[EArmorStatModId.MajorIntellect]: {
		id: EArmorStatModId.MajorIntellect,
		name: 'Major Intellect',
		icon: MISSING_ICON,
		cost: 5,
		statBonus: 10,
		hash: 3355995799,
		armorStatId: EArmorStatId.Intellect,
	},
	[EArmorStatModId.MinorIntellect]: {
		id: EArmorStatModId.MinorIntellect,
		name: 'Minor Intellect',
		icon: MISSING_ICON,
		cost: 2,
		statBonus: 5,
		hash: 1227870362,
		armorStatId: EArmorStatId.Intellect,
	},
	[EArmorStatModId.MajorStrength]: {
		id: EArmorStatModId.MajorStrength,
		name: 'Major Strength',
		icon: MISSING_ICON,
		cost: 3,
		statBonus: 10,
		hash: 3253038666,
		armorStatId: EArmorStatId.Strength,
	},
	[EArmorStatModId.MinorStrength]: {
		id: EArmorStatModId.MinorStrength,
		name: 'Minor Strength',
		icon: MISSING_ICON,
		cost: 1,
		statBonus: 5,
		hash: 3699676109,
		armorStatId: EArmorStatId.Strength,
	},
};

// export const ArmmorStatModIdToArmorStatMod: Mapping<
// 	EArmorStatModId,
// 	IArmorStatMod
// > = {
// 	get: (key: EArmorStatModId) => ArmorStatModIdToArmorStatModMapping[key],
// };
// TODO: Move all types away from the ArmmorStatModIdToArmorStatMod get convention and over to this
// functional getter convention
export const getArmorStatMod = (id: EArmorStatModId): IArmorStatMod =>
	ArmorStatModIdToArmorStatModMapping[id];

/***** Extra *****/
// Get the ArmorStatMapping that represents the total stat bonuses for a list of ArmorStatMods
export const getArmorStatMappingFromArmorStatMods = (
	armorStatModIds: EArmorStatModId[]
): ArmorStatMapping => {
	const armorStatMapping: ArmorStatMapping = { ...DefaultArmorStatMapping };
	armorStatModIds.forEach((armorStatModId) => {
		const { statBonus, armorStatId } = getArmorStatMod(armorStatModId);
		armorStatMapping[armorStatId] += statBonus;
	});
	return armorStatMapping;
};
