import {
	EnumDictionary,
	IHash,
	IIcon,
	IIdentifiableName,
	Mapping,
} from './globals';
import { EElement, EDestinySuperAbilityId } from './IdEnums';

// Order does not matter here
export const DestinySuperAbilityIdList = Object.values(EDestinySuperAbilityId);

export interface IDestinySuperAbility extends IIdentifiableName, IIcon, IHash {
	elementalAffinity: EElement;
}

export const DestinySuperAbilityIdToDestinySuperAbilityMapping: EnumDictionary<
	EDestinySuperAbilityId,
	IDestinySuperAbility
> = {
	[EDestinySuperAbilityId.ArcStaff]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.BladeBarrage]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.BurningMaul]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Burning Maul',
		hash: 0,
		id: EDestinySuperAbilityId.BurningMaul,
		elementalAffinity: EElement.Solar,
	},
	[EDestinySuperAbilityId.ChaosReach]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.Daybreak]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.FistsOfHavoc]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.GatheringStorm]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.GlacialQuake]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.GoldenGunDeadshot]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.GoldenGunMarksman]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.HammerOfSol]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.NovaBombCataclysm]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.NovaBombVortex]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.NovaWarp]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.SentinelShield]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.ShadowshotDeadfall]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.ShadowshotMoebiusQuiver]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.SilenceAndSquall]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.SpectralBlades]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.Stormtrance]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.Thundercrash]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.WardOfDawn]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.WellOfRadiance]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
	[EDestinySuperAbilityId.WintersWrath]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementalAffinity: EElement.Arc,
	},
};

export const DestinySuperAbilityIdToDestinySuperAbility: Mapping<
	EDestinySuperAbilityId,
	IDestinySuperAbility
> = {
	get: (key: EDestinySuperAbilityId) =>
		DestinySuperAbilityIdToDestinySuperAbilityMapping[key],
};
