import { ArmorStatMapping } from './ArmorStat';
import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	Mapping,
	ValidateEnumList,
} from './globals';
import { EArmorStatId, EArmorStatModId } from './IdEnums';

export const ArmorStatModIdList = Object.values(EArmorStatModId);

export interface IArmorStatMod extends IIdentifiableName, IIcon {}

const ArmorStatModIdToArmorStatModMapping: EnumDictionary<
	EArmorStatModId,
	IArmorStatMod
> = {
	[EArmorStatModId.None]: {
		id: EArmorStatModId.None,
		name: 'None',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MajorMobility]: {
		id: EArmorStatModId.MajorMobility,
		name: 'Major Mobility',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MinorMobility]: {
		id: EArmorStatModId.MinorMobility,
		name: 'Minor Mobility',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MajorResilience]: {
		id: EArmorStatModId.MajorResilience,
		name: 'Major Resilience',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MinorResilience]: {
		id: EArmorStatModId.MinorResilience,
		name: 'Major Resilience',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MajorRecovery]: {
		id: EArmorStatModId.MajorRecovery,
		name: 'Major Recovery',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MinorRecovery]: {
		id: EArmorStatModId.MinorRecovery,
		name: 'Major Recovery',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MajorDiscipline]: {
		id: EArmorStatModId.MajorDiscipline,
		name: 'Major Discipline',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MinorDiscipline]: {
		id: EArmorStatModId.MinorDiscipline,
		name: 'Major Discipline',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MajorIntellect]: {
		id: EArmorStatModId.MajorIntellect,
		name: 'Major Intellect',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MinorIntellect]: {
		id: EArmorStatModId.MinorIntellect,
		name: 'Major Intellect',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MajorStrength]: {
		id: EArmorStatModId.MajorStrength,
		name: 'Major Strength',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
	[EArmorStatModId.MinorStrength]: {
		id: EArmorStatModId.MinorStrength,
		name: 'Major Strength',
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
	},
};

export const ArmmorStatModIdToArmorStatMod: Mapping<
	EArmorStatModId,
	IArmorStatMod
> = {
	get: (key: EArmorStatModId) => ArmorStatModIdToArmorStatModMapping[key],
};

/***** Extra *****/
// TODO: Roll these into the IArmorStatMod interface
// Stat Enum, bonus, cost, mod hash
export const ArmorStatModValues: EnumDictionary<
	EArmorStatModId,
	[EArmorStatId, number, number, number]
> = {
	[EArmorStatModId.None]: [EArmorStatId.Strength, 0, 0, 0], // Lol this is fucky
	[EArmorStatModId.MinorMobility]: [EArmorStatId.Mobility, 5, 1, 204137529],
	[EArmorStatModId.MajorMobility]: [EArmorStatId.Mobility, 10, 3, 3961599962],
	[EArmorStatModId.MinorResilience]: [
		EArmorStatId.Resilience,
		5,
		1,
		3682186345,
	],
	[EArmorStatModId.MajorResilience]: [
		EArmorStatId.Resilience,
		10,
		3,
		2850583378,
	],
	[EArmorStatModId.MinorRecovery]: [EArmorStatId.Recovery, 5, 2, 555005975],
	[EArmorStatModId.MajorRecovery]: [EArmorStatId.Recovery, 10, 4, 2645858828],
	[EArmorStatModId.MinorDiscipline]: [
		EArmorStatId.Discipline,
		5,
		1,
		2623485440,
	],
	[EArmorStatModId.MajorDiscipline]: [
		EArmorStatId.Discipline,
		10,
		3,
		4048838440,
	],
	[EArmorStatModId.MinorIntellect]: [EArmorStatId.Intellect, 5, 2, 1227870362],
	[EArmorStatModId.MajorIntellect]: [EArmorStatId.Intellect, 10, 5, 3355995799],
	[EArmorStatModId.MinorStrength]: [EArmorStatId.Strength, 5, 1, 3699676109],
	[EArmorStatModId.MajorStrength]: [EArmorStatId.Strength, 10, 3, 3253038666],
};

export const getArmorStatMappingFromArmorStatMods = (
	statModifiers: EArmorStatModId[]
): ArmorStatMapping => {
	const res: ArmorStatMapping = {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	};
	statModifiers.forEach((statModifier) => {
		const [armorStat, value] = ArmorStatModValues[statModifier];
		res[armorStat] = res[armorStat] + value;
	});
	return res;
};
