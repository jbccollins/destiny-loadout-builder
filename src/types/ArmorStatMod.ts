import { ArmorStatIdList, ArmorStatMapping } from './ArmorStat';
import {
	EnumDictionary,
	IHash,
	IIcon,
	IIdentifiableName,
	Mapping,
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
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 0,
		statBonus: 0,
		hash: 0,
		armorStatId: null,
	},
	[EArmorStatModId.MajorMobility]: {
		id: EArmorStatModId.MajorMobility,
		name: 'Major Mobility',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 3,
		statBonus: 10,
		hash: 3961599962,
		armorStatId: EArmorStatId.Mobility,
	},
	[EArmorStatModId.MinorMobility]: {
		id: EArmorStatModId.MinorMobility,
		name: 'Minor Mobility',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 1,
		statBonus: 5,
		hash: 204137529,
		armorStatId: EArmorStatId.Mobility,
	},
	[EArmorStatModId.MajorResilience]: {
		id: EArmorStatModId.MajorResilience,
		name: 'Major Resilience',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 3,
		statBonus: 10,
		hash: 2850583378,
		armorStatId: EArmorStatId.Resilience,
	},
	[EArmorStatModId.MinorResilience]: {
		id: EArmorStatModId.MinorResilience,
		name: 'Minor Resilience',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 1,
		statBonus: 5,
		hash: 3682186345,
		armorStatId: EArmorStatId.Resilience,
	},
	[EArmorStatModId.MajorRecovery]: {
		id: EArmorStatModId.MajorRecovery,
		name: 'Major Recovery',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 4,
		statBonus: 10,
		hash: 2645858828,
		armorStatId: EArmorStatId.Recovery,
	},
	[EArmorStatModId.MinorRecovery]: {
		id: EArmorStatModId.MinorRecovery,
		name: 'Minor Recovery',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 2,
		statBonus: 5,
		hash: 555005975,
		armorStatId: EArmorStatId.Recovery,
	},
	[EArmorStatModId.MajorDiscipline]: {
		id: EArmorStatModId.MajorDiscipline,
		name: 'Major Discipline',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 3,
		statBonus: 10,
		hash: 4048838440,
		armorStatId: EArmorStatId.Discipline,
	},
	[EArmorStatModId.MinorDiscipline]: {
		id: EArmorStatModId.MinorDiscipline,
		name: 'Minor Discipline',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 1,
		statBonus: 5,
		hash: 2623485440,
		armorStatId: EArmorStatId.Discipline,
	},
	[EArmorStatModId.MajorIntellect]: {
		id: EArmorStatModId.MajorIntellect,
		name: 'Major Intellect',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 5,
		statBonus: 10,
		hash: 3355995799,
		armorStatId: EArmorStatId.Intellect,
	},
	[EArmorStatModId.MinorIntellect]: {
		id: EArmorStatModId.MinorIntellect,
		name: 'Minor Intellect',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 2,
		statBonus: 5,
		hash: 1227870362,
		armorStatId: EArmorStatId.Intellect,
	},
	[EArmorStatModId.MajorStrength]: {
		id: EArmorStatModId.MajorStrength,
		name: 'Major Strength',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		cost: 3,
		statBonus: 10,
		hash: 3253038666,
		armorStatId: EArmorStatId.Strength,
	},
	[EArmorStatModId.MinorStrength]: {
		id: EArmorStatModId.MinorStrength,
		name: 'Minor Strength',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
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
	const res: ArmorStatMapping = {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	};
	armorStatModIds.forEach((armorStatModId) => {
		const { statBonus, armorStatId } = getArmorStatMod(armorStatModId);
		res[armorStatId] = res[armorStatId] + statBonus;
	});
	return res;
};
