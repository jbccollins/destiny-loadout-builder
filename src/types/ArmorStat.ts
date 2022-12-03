import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
	Mapping,
	StatBonusStat,
} from './globals';
import { EArmorStatId, EArmorStatModId, EDestinyClassId } from './IdEnums';

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
			icon: 'https://www.bungie.net/common/destiny2_content/icons/e26e0e93a9daf4fdd21bf64eb9246340.png',
		},
		[EArmorStatId.Resilience]: {
			id: EArmorStatId.Resilience,
			name: 'Resilience',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/202ecc1c6febeb6b97dafc856e863140.png',
		},
		[EArmorStatId.Recovery]: {
			id: EArmorStatId.Recovery,
			name: 'Recovery',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/128eee4ee7fc127851ab32eac6ca91cf.png',
		},
		[EArmorStatId.Discipline]: {
			id: EArmorStatId.Discipline,
			name: 'Discipline',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/ca62128071dc254fe75891211b98b237.png',
		},
		[EArmorStatId.Intellect]: {
			id: EArmorStatId.Intellect,
			name: 'Intellect',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/59732534ce7060dba681d1ba84c055a6.png',
		},
		[EArmorStatId.Strength]: {
			id: EArmorStatId.Strength,
			name: 'Strength',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/c7eefc8abbaa586eeab79e962a79d6ad.png',
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

export const getStat = (
	stat: StatBonusStat,
	destinyClassId: EDestinyClassId
) => {
	if (typeof stat === 'string') {
		return getArmorStat(stat);
	}
	return getArmorStat(stat(destinyClassId));
};
