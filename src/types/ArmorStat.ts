import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
	Mapping,
} from './globals';
import { EArmorStatId, EArmorStatModId } from './IdEnums';

export const ArmorStatIdList = ValidateEnumList(Object.values(EArmorStatId), [
	EArmorStatId.Mobility,
	EArmorStatId.Resilience,
	EArmorStatId.Recovery,
	EArmorStatId.Discipline,
	EArmorStatId.Intellect,
	EArmorStatId.Strength,
]);

export interface IArmorStat extends IIdentifiableName, IIcon {}

const ArmorStatIdToArmorStatMapping: EnumDictionary<EArmorStatId, IArmorStat> =
	{
		[EArmorStatId.Mobility]: {
			id: EArmorStatId.Mobility,
			name: 'Mobility',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
		[EArmorStatId.Resilience]: {
			id: EArmorStatId.Resilience,
			name: 'Resilience',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
		[EArmorStatId.Recovery]: {
			id: EArmorStatId.Recovery,
			name: 'Recovery',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
		[EArmorStatId.Discipline]: {
			id: EArmorStatId.Discipline,
			name: 'Discipline',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
		[EArmorStatId.Intellect]: {
			id: EArmorStatId.Intellect,
			name: 'Intellect',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
		[EArmorStatId.Strength]: {
			id: EArmorStatId.Strength,
			name: 'Strength',
			icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		},
	};

// export const ArmorStatIdToArmorStat: Mapping<EArmorStatId, IArmorStat> = {
// 	get: (key: EArmorStatId) => ArmorStatIdToArmorStatMapping[key],
// };
export const getArmorStat = (id: EArmorStatId): IArmorStat =>
	ArmorStatIdToArmorStatMapping[id];

// TODO Move this to the ArmorStatMod file
export type ArmorStatModSplit = {
	major: EArmorStatModId;
	minor: EArmorStatModId;
};

/***** Extra  *****/
const ArmorStatIdToArmorStatModSplitMapping: EnumDictionary<
	EArmorStatId,
	ArmorStatModSplit
> = {
	[EArmorStatId.Mobility]: {
		minor: EArmorStatModId.MinorMobility,
		major: EArmorStatModId.MajorMobility,
	},
	[EArmorStatId.Resilience]: {
		minor: EArmorStatModId.MinorResilience,
		major: EArmorStatModId.MajorResilience,
	},
	[EArmorStatId.Recovery]: {
		minor: EArmorStatModId.MinorRecovery,
		major: EArmorStatModId.MajorRecovery,
	},
	[EArmorStatId.Discipline]: {
		minor: EArmorStatModId.MinorDiscipline,
		major: EArmorStatModId.MajorDiscipline,
	},
	[EArmorStatId.Intellect]: {
		minor: EArmorStatModId.MinorIntellect,
		major: EArmorStatModId.MajorIntellect,
	},
	[EArmorStatId.Strength]: {
		minor: EArmorStatModId.MinorStrength,
		major: EArmorStatModId.MajorStrength,
	},
};

export const ArmorStatIdToArmorStatModSplit: Mapping<
	EArmorStatId,
	ArmorStatModSplit
> = {
	get: (key: EArmorStatId) => ArmorStatIdToArmorStatModSplitMapping[key],
};

/***** Extra *****/
export type ArmorStatMapping = {
	[EArmorStatId.Mobility]: number;
	[EArmorStatId.Resilience]: number;
	[EArmorStatId.Recovery]: number;
	[EArmorStatId.Discipline]: number;
	[EArmorStatId.Intellect]: number;
	[EArmorStatId.Strength]: number;
};
