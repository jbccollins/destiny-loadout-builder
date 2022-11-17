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
	elementId: EElement;
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
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.BladeBarrage]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Blade Barrage',
		hash: 0,
		id: EDestinySuperAbilityId.BladeBarrage,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.BurningMaul]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Burning Maul',
		hash: 0,
		id: EDestinySuperAbilityId.BurningMaul,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.ChaosReach]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Chaos Reach',
		hash: 0,
		id: EDestinySuperAbilityId.ChaosReach,
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.Daybreak]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Daybreak',
		hash: 0,
		id: EDestinySuperAbilityId.Daybreak,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.FistsOfHavoc]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Fists of Havoc',
		hash: 0,
		id: EDestinySuperAbilityId.FistsOfHavoc,
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.GatheringStorm]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5919e3e43ab455cee03ff23cdaa23080.png',
		name: 'Gathering Storm',
		hash: 0,
		id: EDestinySuperAbilityId.GatheringStorm,
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.GlacialQuake]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Glacial Quake',
		hash: 0,
		id: EDestinySuperAbilityId.GlacialQuake,
		elementId: EElement.Stasis,
	},
	[EDestinySuperAbilityId.GoldenGunDeadshot]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Golden Gun: Deadshot',
		hash: 0,
		id: EDestinySuperAbilityId.GoldenGunDeadshot,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.GoldenGunMarksman]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Golden Gun: Marksman',
		hash: 0,
		id: EDestinySuperAbilityId.GoldenGunMarksman,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.HammerOfSol]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Hammer of Sol',
		hash: 0,
		id: EDestinySuperAbilityId.HammerOfSol,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.NovaBombCataclysm]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Nova Bomb: Cataclysm',
		hash: 0,
		id: EDestinySuperAbilityId.NovaBombCataclysm,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.NovaBombVortex]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Nova Bomb: Vortex',
		hash: 0,
		id: EDestinySuperAbilityId.NovaBombVortex,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.NovaWarp]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Nova Warp',
		hash: 0,
		id: EDestinySuperAbilityId.NovaWarp,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.SentinelShield]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Sentinel Shield',
		hash: 0,
		id: EDestinySuperAbilityId.SentinelShield,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.ShadowshotDeadfall]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a30563f95eea66ef729a4e65a7152fa7.png',
		name: 'Shadowshot: Deadfall',
		hash: 0,
		id: EDestinySuperAbilityId.ShadowshotDeadfall,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.ShadowshotMoebiusQuiver]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Shadowshot: Moebius Quiver',
		hash: 0,
		id: EDestinySuperAbilityId.ShadowshotMoebiusQuiver,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.SilenceAndSquall]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Silence and Squall',
		hash: 0,
		id: EDestinySuperAbilityId.SilenceAndSquall,
		elementId: EElement.Stasis,
	},
	[EDestinySuperAbilityId.SpectralBlades]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Spectral Blades',
		hash: 0,
		id: EDestinySuperAbilityId.SpectralBlades,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.Stormtrance]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Stormtrance',
		hash: 0,
		id: EDestinySuperAbilityId.Stormtrance,
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.Thundercrash]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Thundercrash',
		hash: 0,
		id: EDestinySuperAbilityId.Thundercrash,
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.WardOfDawn]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: 'Ward of Dawn',
		hash: 0,
		id: EDestinySuperAbilityId.WardOfDawn,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.WellOfRadiance]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5dbb9a2f285df3ee20fe37d073350a37.png',
		name: 'Well of Radiance',
		hash: 0,
		id: EDestinySuperAbilityId.WellOfRadiance,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.WintersWrath]: {
		icon: 'https://www.bungie.net/img/misc/missing_icon_d2.png',
		name: "Winter's Wrath",
		hash: 0,
		id: EDestinySuperAbilityId.WintersWrath,
		elementId: EElement.Stasis,
	},
};

export const DestinySuperAbilityIdToDestinySuperAbility: Mapping<
	EDestinySuperAbilityId,
	IDestinySuperAbility
> = {
	get: (key: EDestinySuperAbilityId) =>
		DestinySuperAbilityIdToDestinySuperAbilityMapping[key],
};
