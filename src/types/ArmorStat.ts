import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EModId } from '@dlb/generated/mod/EModId';
import { getDestinyClassAbilityStat } from './DestinyClass';
import { getFragment } from './Fragment';
import {
	EnumDictionary,
	IHash,
	IIcon,
	IIdentifiableName,
	StatBonusStat,
	ValidateEnumList,
} from './globals';
import { EArmorStatId, EDestinyClassId } from './IdEnums';
import { getMod } from './Mod';

export const ArmorStatIdList = ValidateEnumList(Object.values(EArmorStatId), [
	EArmorStatId.Health,
	EArmorStatId.Grenade,
	EArmorStatId.Class,
	EArmorStatId.Super,
	EArmorStatId.Weapons,
	EArmorStatId.Melee,
]);

export interface IArmorStat extends IIdentifiableName, IIcon, IHash {
	id: EArmorStatId;
	index: number;
}

export const ArmorStatIndices: Record<EArmorStatId, number> = {
	[EArmorStatId.Health]: 0,
	[EArmorStatId.Grenade]: 1,
	[EArmorStatId.Class]: 2,
	[EArmorStatId.Super]: 3,
	[EArmorStatId.Weapons]: 4,
	[EArmorStatId.Melee]: 5,
};

// TODO: Remove the index from these items and just rely on the ArmorStatIndices
const ArmorStatIdToArmorStatMapping: EnumDictionary<EArmorStatId, IArmorStat> =
{
	[EArmorStatId.Health]: {
		id: EArmorStatId.Health,
		name: 'Health',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/717b8b218cc14325a54869bef21d2964.png',
		hash: 392767087,
		index: 0,
	},
	[EArmorStatId.Grenade]: {
		id: EArmorStatId.Grenade,
		name: 'Grenade',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/065cdaabef560e5808e821cefaeaa22c.png',
		hash: 1735777505,
		index: 1,
	},
	[EArmorStatId.Class]: {
		id: EArmorStatId.Class,
		name: 'Class',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/7eb845acb5b3a4a9b7e0b2f05f5c43f1.png',
		hash: 1943323491,
		index: 2,
	},
	[EArmorStatId.Super]: {
		id: EArmorStatId.Super,
		name: 'Super',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/585ae4ede9c3da96b34086fccccdc8cd.png',
		hash: 144602215,
		index: 3,
	},
	[EArmorStatId.Weapons]: {
		id: EArmorStatId.Weapons,
		name: 'Weapons',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/bc69675acdae9e6b9a68a02fb4d62e07.png',
		hash: 2996146975,
		index: 4,
	},
	[EArmorStatId.Melee]: {
		id: EArmorStatId.Melee,
		name: 'Melee',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fa534aca76d7f2d7e7b4ba4df4271b42.png',
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
	[EArmorStatId.Weapons]: {
		minor: EModId.MinorWeaponsMod,
		major: EModId.WeaponsMod,
		artifice: EModId.WeaponsForged,
	},
	[EArmorStatId.Health]: {
		minor: EModId.MinorHealthMod,
		major: EModId.HealthMod,
		artifice: EModId.HealthForged,
	},
	[EArmorStatId.Class]: {
		minor: EModId.MinorClassMod,
		major: EModId.ClassMod,
		artifice: EModId.ClassForged,
	},
	[EArmorStatId.Grenade]: {
		minor: EModId.MinorGrenadeMod,
		major: EModId.GrenadeMod,
		artifice: EModId.GrenadeForged,
	},
	[EArmorStatId.Super]: {
		minor: EModId.MinorSuperMod,
		major: EModId.SuperMod,
		artifice: EModId.SuperForged,
	},
	[EArmorStatId.Melee]: {
		minor: EModId.MinorMeleeMod,
		major: EModId.MeleeMod,
		artifice: EModId.MeleeForged,
	},
};

export const getArmorStatModSpitFromArmorStatId = (armorStatId: EArmorStatId) =>
	ArmorStatIdToArmorStatModSplitMapping[armorStatId];

/***** Extra *****/
export type ArmorStatMapping = {
	[EArmorStatId.Weapons]: number;
	[EArmorStatId.Health]: number;
	[EArmorStatId.Class]: number;
	[EArmorStatId.Grenade]: number;
	[EArmorStatId.Super]: number;
	[EArmorStatId.Melee]: number;
};

export const DefaultArmorStatMapping: ArmorStatMapping = {
	[EArmorStatId.Weapons]: 0,
	[EArmorStatId.Health]: 0,
	[EArmorStatId.Class]: 0,
	[EArmorStatId.Grenade]: 0,
	[EArmorStatId.Super]: 0,
	[EArmorStatId.Melee]: 0,
};

export const getDefaultArmorStatMapping = (): ArmorStatMapping => ({
	[EArmorStatId.Weapons]: 0,
	[EArmorStatId.Health]: 0,
	[EArmorStatId.Class]: 0,
	[EArmorStatId.Grenade]: 0,
	[EArmorStatId.Super]: 0,
	[EArmorStatId.Melee]: 0,
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
		[EArmorStatId.Weapons]: 0,
		[EArmorStatId.Health]: 0,
		[EArmorStatId.Class]: 0,
		[EArmorStatId.Grenade]: 0,
		[EArmorStatId.Super]: 0,
		[EArmorStatId.Melee]: 0,
	};
	ArmorStatIdList.forEach((armorStatId) => {
		armorStatMappings.forEach((armorStatMapping) => {
			res[armorStatId] = res[armorStatId] + armorStatMapping[armorStatId];
		});
	});
	return res;
};

export const getArmorStatIdFromBungieHash = (hash: number): EArmorStatId => {
	const armorStatId = ArmorStatIdList.find(
		(id) => getArmorStat(id).hash === hash
	);
	return armorStatId ?? null;
};
