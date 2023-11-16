import { EnumDictionary } from './globals';
import { EArmorSlotId, EIntrinsicArmorPerkOrAttributeId } from './IdEnums';

export enum EIntrinsicArmorPerkOrAttributeGroupName {
	Event = 'Event',
	Perk = 'Perk',
	LegacyPerk = 'Legacy Perk',
}

export interface IIntrinsicArmorPerkOrAttribute {
	id: EIntrinsicArmorPerkOrAttributeId | null;
	name: string;
	armorSlotId: EArmorSlotId | null;
	groupName: EIntrinsicArmorPerkOrAttributeGroupName | null;
	icon: string;
	description?: string;
	season?: number;
	abbreviation: string | null;
}

const IntrisicArmorPerkOrAttributeIdToIntrinsicArmorPerkOrAttributeMapping: EnumDictionary<
	EIntrinsicArmorPerkOrAttributeId,
	IIntrinsicArmorPerkOrAttribute
> = {
	[EIntrinsicArmorPerkOrAttributeId.GuardianGames]: {
		id: EIntrinsicArmorPerkOrAttributeId.GuardianGames,
		name: 'Guardian Games Class Item',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEventCardDefinition_ce6c2cf855dce694bcc89803b6bc44b7.png',
		armorSlotId: EArmorSlotId.ClassItem,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.Event,
		abbreviation: 'GG',
	},
	[EIntrinsicArmorPerkOrAttributeId.HalloweenMask]: {
		id: EIntrinsicArmorPerkOrAttributeId.HalloweenMask,
		name: 'Festival of the Lost Mask',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/DestinyEventCardDefinition_1a1e3f8074c98241af80f4bee77084c3.png',
		armorSlotId: EArmorSlotId.Head,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.Event,
		abbreviation: 'FotL',
	},
	[EIntrinsicArmorPerkOrAttributeId.IronBanner]: {
		id: EIntrinsicArmorPerkOrAttributeId.IronBanner,
		name: 'Iron Banner',
		icon: 'https://bungie.net/common/destiny2_content/icons/DestinyActivityModeDefinition_fe57052d7cf971f7502daa75a2ca2437.png',
		armorSlotId: null,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.Event,
		abbreviation: 'IB',
	},
	[EIntrinsicArmorPerkOrAttributeId.ExhumedExcess]: {
		id: EIntrinsicArmorPerkOrAttributeId.ExhumedExcess,
		name: 'Exhumed Excess',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e083d8a85c2c60825204d14b9e9263b7.png',
		armorSlotId: null,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.Perk,
		season: 22,
		description:
			'Increases your chances of creating an additional offering during activities. Each piece of armor you are wearing with this perk increases this bonus, to a maximum of 4 items.',
		abbreviation: 'S22',
	},
	[EIntrinsicArmorPerkOrAttributeId.SonarAmplifier]: {
		id: EIntrinsicArmorPerkOrAttributeId.SonarAmplifier,
		name: 'Sonar Amplifier',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e083d8a85c2c60825204d14b9e9263b7.png',
		armorSlotId: null,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.Perk,
		season: 21,
		description:
			'Grants 3% additional Sonar Station vendor reputation from all sources. For each piece of armor you are wearing with this perk on it, this bonus increases to a maximum of 12% (4 items).',
		abbreviation: 'S21',
	},
	[EIntrinsicArmorPerkOrAttributeId.QueensFavor]: {
		id: EIntrinsicArmorPerkOrAttributeId.QueensFavor,
		name: "Queen's Favor",
		icon: 'https://www.bungie.net/common/destiny2_content/icons/8d844c97fa13f4cb649358404d011be7.png',
		armorSlotId: null,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.Perk,
		season: 20,
		description:
			'Generate Awoken Favors with fewer final blows. Each piece of armor you are wearing with this perk on it increases this bonus, to a maximum of 4 items.',
		abbreviation: 'S20',
	},
	[EIntrinsicArmorPerkOrAttributeId.SeraphSensorArray]: {
		id: EIntrinsicArmorPerkOrAttributeId.SeraphSensorArray,
		name: 'Seraph Sensor Array',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/7394ce8bcde3a665584b988cc133d62c.png',
		armorSlotId: null,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.LegacyPerk,
		season: 19,
		description:
			'Grants 5% reputation gains with the Exo Frame. Each piece of armor you are wearing with this perk increases this bonus, to a maximum of 4 items (20%).',
		abbreviation: 'S19',
	},
	[EIntrinsicArmorPerkOrAttributeId.PlunderersTrappings]: {
		id: EIntrinsicArmorPerkOrAttributeId.PlunderersTrappings,
		name: "Plunderer's Trappings",
		icon: 'https://www.bungie.net/common/destiny2_content/icons/7394ce8bcde3a665584b988cc133d62c.png',
		armorSlotId: null,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.LegacyPerk,
		season: 18, // TODO: Is this the right season?
		description:
			'Grants 5% additional Treasure Coordinates from all sources. Each piece of armor you are wearing with this perk on it increases this bonus, to a maximum of 4 items (20%).',
		abbreviation: 'S18',
	},
	[EIntrinsicArmorPerkOrAttributeId.VisageOfTheReaper]: {
		id: EIntrinsicArmorPerkOrAttributeId.VisageOfTheReaper,
		name: 'Visage of the Reaper',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/8b10e265736c3ca1778c3f54fdb62bad.png',
		armorSlotId: EArmorSlotId.Head,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.LegacyPerk,
		season: 17,
		description:
			'Grants 5% additional Vestiges of Dread from all sources. Each piece of armor you are wearing with this perk on it increases this bonus, to a maximum of 4 items (20%).',
		abbreviation: 'S17',
	},
	[EIntrinsicArmorPerkOrAttributeId.UniformedOfficer]: {
		id: EIntrinsicArmorPerkOrAttributeId.UniformedOfficer,
		name: 'Uniformed Officer',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b4f6064c3757f9a6725b80f88ee824c0.png',
		armorSlotId: null,
		groupName: EIntrinsicArmorPerkOrAttributeGroupName.LegacyPerk,
		season: 16, // TODO: Is this the right season?
		description:
			'Grants additional Psychogenic Intel when completing activities.', // TODO: Is this the right description?
		abbreviation: 'S16',
	},
};

export const getIntrinsicArmorPerkOrAttribute = (
	id: EIntrinsicArmorPerkOrAttributeId
): IIntrinsicArmorPerkOrAttribute =>
	IntrisicArmorPerkOrAttributeIdToIntrinsicArmorPerkOrAttributeMapping[id];

export const intrinsicArmorPerkOrAttributeIdList = Object.values(
	EIntrinsicArmorPerkOrAttributeId
).sort((a, b) => {
	const aVal = getIntrinsicArmorPerkOrAttribute(a);
	const bVal = getIntrinsicArmorPerkOrAttribute(b);
	if (aVal.season && bVal.season) {
		return bVal.season - aVal.season;
	}
	if (aVal.groupName && bVal.groupName) {
		return aVal.groupName.localeCompare(bVal.groupName);
	}
	return 0;
});
