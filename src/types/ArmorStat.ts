import { EModId } from '@dlb/generated/mod/EModId';
import { getArmorStatMod } from './ArmorStatMod';
import { getFragment } from './Fragment';
import {
	EnumDictionary,
	IIcon,
	IIdentifiableName,
	ValidateEnumList,
	Mapping,
	StatBonusStat,
	IHash,
} from './globals';
import {
	EArmorStatId,
	EArmorStatModId,
	EDestinyClassId,
	EFragmentId,
} from './IdEnums';
import { getStatBonusesFromMod } from './Mod';

export const ArmorStatIdList = ValidateEnumList(Object.values(EArmorStatId), [
	EArmorStatId.Mobility,
	EArmorStatId.Resilience,
	EArmorStatId.Recovery,
	EArmorStatId.Discipline,
	EArmorStatId.Intellect,
	EArmorStatId.Strength,
]);

export interface IArmorStat extends IIdentifiableName, IIcon, IHash {
	id: EArmorStatId;
}

const ArmorStatIdToArmorStatMapping: EnumDictionary<EArmorStatId, IArmorStat> =
	{
		[EArmorStatId.Mobility]: {
			id: EArmorStatId.Mobility,
			name: 'Mobility',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/e26e0e93a9daf4fdd21bf64eb9246340.png',
			hash: 2996146975,
		},
		[EArmorStatId.Resilience]: {
			id: EArmorStatId.Resilience,
			name: 'Resilience',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/202ecc1c6febeb6b97dafc856e863140.png',
			hash: 392767087,
		},
		[EArmorStatId.Recovery]: {
			id: EArmorStatId.Recovery,
			name: 'Recovery',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/128eee4ee7fc127851ab32eac6ca91cf.png',
			hash: 1943323491,
		},
		[EArmorStatId.Discipline]: {
			id: EArmorStatId.Discipline,
			name: 'Discipline',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/ca62128071dc254fe75891211b98b237.png',
			hash: 1735777505,
		},
		[EArmorStatId.Intellect]: {
			id: EArmorStatId.Intellect,
			name: 'Intellect',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/59732534ce7060dba681d1ba84c055a6.png',
			hash: 144602215,
		},
		[EArmorStatId.Strength]: {
			id: EArmorStatId.Strength,
			name: 'Strength',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/c7eefc8abbaa586eeab79e962a79d6ad.png',
			hash: 4244567218,
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

export const DefaultArmorStatMapping: ArmorStatMapping = {
	[EArmorStatId.Mobility]: 0,
	[EArmorStatId.Resilience]: 0,
	[EArmorStatId.Recovery]: 0,
	[EArmorStatId.Discipline]: 0,
	[EArmorStatId.Intellect]: 0,
	[EArmorStatId.Strength]: 0,
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

export const getArmorStatMappingFromFragments = (
	fragmentIds: EFragmentId[],
	destinyClassId: EDestinyClassId
): ArmorStatMapping => {
	const armorStatMapping = { ...DefaultArmorStatMapping };
	fragmentIds.forEach((id) => {
		const { bonuses } = getFragment(id);
		bonuses.map((bonus) => {
			const armorStatId = getStat(bonus.stat, destinyClassId).id;
			armorStatMapping[armorStatId] += bonus.value;
		});
	});
	return armorStatMapping;
};

// export const getArmorStatMappingFromArmorStatMods = (
// 	armorStatModIds: EArmorStatModId[]
// ): ArmorStatMapping => {
// 	const armorStatMapping = { ...DefaultArmorStatMapping };
// 	armorStatModIds.forEach((id) => {
// 		const { statBonus, armorStatId } = getArmorStatMod(id);
// 		armorStatMapping[armorStatId] += statBonus;
// 	});
// 	return armorStatMapping;
// };

export const getArmorStatMappingFromMods = (
	modIds: EModId[],
	destinyClassId: EDestinyClassId
): ArmorStatMapping => {
	const armorStatMapping = { ...DefaultArmorStatMapping };
	modIds
		.filter((modId) => modId !== null)
		.forEach((id) => {
			const bonuses = getStatBonusesFromMod(id);
			if (bonuses !== null) {
				bonuses.forEach((bonus) => {
					const armorStatId = getStat(bonus.stat, destinyClassId).id;
					armorStatMapping[armorStatId] += bonus.value;
				});
			}
		});
	return armorStatMapping;
};
