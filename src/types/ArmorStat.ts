import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EModId } from '@dlb/generated/mod/EModId';
import { getDestinyClassAbilityStat } from './DestinyClass';
import { getFragment } from './Fragment';
import { EArmorStatId, EDestinyClassId } from './IdEnums';
import { getMod } from './Mod';
import {
	EnumDictionary,
	IHash,
	IIcon,
	IIdentifiableName,
	StatBonusStat,
	ValidateEnumList,
} from './globals';

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
	index: number;
}

const ArmorStatIdToArmorStatMapping: EnumDictionary<EArmorStatId, IArmorStat> =
	{
		[EArmorStatId.Mobility]: {
			id: EArmorStatId.Mobility,
			name: 'Mobility',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/e26e0e93a9daf4fdd21bf64eb9246340.png',
			hash: 2996146975,
			index: 0,
		},
		[EArmorStatId.Resilience]: {
			id: EArmorStatId.Resilience,
			name: 'Resilience',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/202ecc1c6febeb6b97dafc856e863140.png',
			hash: 392767087,
			index: 1,
		},
		[EArmorStatId.Recovery]: {
			id: EArmorStatId.Recovery,
			name: 'Recovery',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/128eee4ee7fc127851ab32eac6ca91cf.png',
			hash: 1943323491,
			index: 2,
		},
		[EArmorStatId.Discipline]: {
			id: EArmorStatId.Discipline,
			name: 'Discipline',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/79be2d4adef6a19203f7385e5c63b45b.png',
			hash: 1735777505,
			index: 3,
		},
		[EArmorStatId.Intellect]: {
			id: EArmorStatId.Intellect,
			name: 'Intellect',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/d1c154469670e9a592c9d4cbdcae5764.png',
			hash: 144602215,
			index: 4,
		},
		[EArmorStatId.Strength]: {
			id: EArmorStatId.Strength,
			name: 'Strength',
			icon: 'https://www.bungie.net/common/destiny2_content/icons/ea5af04ccd6a3470a44fd7bb0f66e2f7.png',
			hash: 4244567218,
			index: 5,
		},
	};

// export const ArmorStatIdToArmorStat: Mapping<EArmorStatId, IArmorStat> = {
// 	get: (key: EArmorStatId) => ArmorStatIdToArmorStatMapping[key],
// };
export const getArmorStat = (id: EArmorStatId): IArmorStat =>
	ArmorStatIdToArmorStatMapping[id];

// TODO Move this to the ArmorStatMod file
export type ArmorStatModSplit = {
	major: EModId;
	minor: EModId;
	artifice: EModId;
};

/***** Extra  *****/
const ArmorStatIdToArmorStatModSplitMapping: EnumDictionary<
	EArmorStatId,
	ArmorStatModSplit
> = {
	[EArmorStatId.Mobility]: {
		minor: EModId.MinorMobilityMod,
		major: EModId.MobilityMod,
		artifice: EModId.MobilityForged,
	},
	[EArmorStatId.Resilience]: {
		minor: EModId.MinorResilienceMod,
		major: EModId.ResilienceMod,
		artifice: EModId.ResilienceForged,
	},
	[EArmorStatId.Recovery]: {
		minor: EModId.MinorRecoveryMod,
		major: EModId.RecoveryMod,
		artifice: EModId.RecoveryForged,
	},
	[EArmorStatId.Discipline]: {
		minor: EModId.MinorDisciplineMod,
		major: EModId.DisciplineMod,
		artifice: EModId.DisciplineForged,
	},
	[EArmorStatId.Intellect]: {
		minor: EModId.MinorIntellectMod,
		major: EModId.IntellectMod,
		artifice: EModId.IntellectForged,
	},
	[EArmorStatId.Strength]: {
		minor: EModId.MinorStrengthMod,
		major: EModId.StrengthMod,
		artifice: EModId.StrengthForged,
	},
};

export const getArmorStatModSpitFromArmorStatId = (armorStatId: EArmorStatId) =>
	ArmorStatIdToArmorStatModSplitMapping[armorStatId];

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

export const getDefaultArmorStatMapping = (): ArmorStatMapping => ({
	[EArmorStatId.Mobility]: 0,
	[EArmorStatId.Resilience]: 0,
	[EArmorStatId.Recovery]: 0,
	[EArmorStatId.Discipline]: 0,
	[EArmorStatId.Intellect]: 0,
	[EArmorStatId.Strength]: 0,
});

export const getStat = (
	stat: StatBonusStat,
	destinyClassId: EDestinyClassId
) => {
	// TODO: Can we compare this to a non-literal string?
	if (stat === 'ClassAbilityStat') {
		return getArmorStat(getDestinyClassAbilityStat(destinyClassId));
	}
	return getArmorStat(stat);
};

export const getArmorStatMappingFromFragments = (
	fragmentIds: EFragmentId[],
	destinyClassId: EDestinyClassId
): ArmorStatMapping => {
	const armorStatMapping = getDefaultArmorStatMapping();
	fragmentIds.forEach((id) => {
		const { bonuses } = getFragment(id);
		bonuses.map((bonus) => {
			const armorStatId = getStat(bonus.stat, destinyClassId).id;
			armorStatMapping[armorStatId] += bonus.value;
		});
	});
	return armorStatMapping;
};

export const getArmorStatMappingFromMods = (
	modIds: EModId[],
	destinyClassId: EDestinyClassId
): ArmorStatMapping => {
	const armorStatMapping = getDefaultArmorStatMapping();
	modIds
		.filter((modId) => modId !== null)
		.forEach((id) => {
			const { bonuses } = getMod(id);
			if (bonuses !== null) {
				bonuses.forEach((bonus) => {
					const armorStatId = getStat(bonus.stat, destinyClassId).id;
					armorStatMapping[armorStatId] += bonus.value;
				});
			}
		});
	return armorStatMapping;
};

// Add up an arbitrary number of ArmorStatMappings
export const sumArmorStatMappings = (
	armorStatMappings: ArmorStatMapping[]
): ArmorStatMapping => {
	const res: ArmorStatMapping = {
		[EArmorStatId.Mobility]: 0,
		[EArmorStatId.Resilience]: 0,
		[EArmorStatId.Recovery]: 0,
		[EArmorStatId.Discipline]: 0,
		[EArmorStatId.Intellect]: 0,
		[EArmorStatId.Strength]: 0,
	};
	ArmorStatIdList.forEach((armorStatId) => {
		armorStatMappings.forEach((armorStatMapping) => {
			res[armorStatId] = res[armorStatId] + armorStatMapping[armorStatId];
		});
	});
	return res;
};

// This should only be used by generation. If it's needed somewhere else then refactor this
export const getArmorStatIdFromBungieHash = (hash: number): EArmorStatId => {
	const armorStatId = ArmorStatIdList.find(
		(id) => getArmorStat(id).hash === hash
	);
	return armorStatId ?? null;
};
