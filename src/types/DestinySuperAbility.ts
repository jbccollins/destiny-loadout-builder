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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/022d0ea9e0ca89294bb1c9cef65273b8.png',
		name: 'Arc Staff',
		hash: 0,
		id: EDestinySuperAbilityId.ArcStaff,
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.BladeBarrage]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5178685d628a640be304950a6b7da11f.png',
		name: 'Blade Barrage',
		hash: 0,
		id: EDestinySuperAbilityId.BladeBarrage,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.BurningMaul]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/81b0c61ff8ac802d3216324028b7e835.png',
		name: 'Burning Maul',
		hash: 0,
		id: EDestinySuperAbilityId.BurningMaul,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.ChaosReach]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c1e711eb4bd8ee24a257fd83a635054c.png',
		name: 'Chaos Reach',
		hash: 0,
		id: EDestinySuperAbilityId.ChaosReach,
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.Daybreak]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ce006cb360a96d8f054e49499d924603.png',
		name: 'Daybreak',
		hash: 0,
		id: EDestinySuperAbilityId.Daybreak,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.FistsOfHavoc]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/20f5a1879f8562e3ce6c0140b0e2fd8d.png',
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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a764f6e02c1912967ea8e2b701d90cfd.png',
		name: 'Glacial Quake',
		hash: 0,
		id: EDestinySuperAbilityId.GlacialQuake,
		elementId: EElement.Stasis,
	},
	[EDestinySuperAbilityId.GoldenGunDeadshot]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/16e3aaf50ac9fa802b692af48b895886.png',
		name: 'Golden Gun: Deadshot',
		hash: 0,
		id: EDestinySuperAbilityId.GoldenGunDeadshot,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.GoldenGunMarksman]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6f3e329cf7d330f7ba0cd0f940e98110.png',
		name: 'Golden Gun: Marksman',
		hash: 0,
		id: EDestinySuperAbilityId.GoldenGunMarksman,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.HammerOfSol]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/746ed830d614d66f57d379811a57d03d.png',
		name: 'Hammer of Sol',
		hash: 0,
		id: EDestinySuperAbilityId.HammerOfSol,
		elementId: EElement.Solar,
	},
	[EDestinySuperAbilityId.NovaBombCataclysm]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fd0d80cb5f7c0f777795ab3d1b701f4f.png',
		name: 'Nova Bomb: Cataclysm',
		hash: 0,
		id: EDestinySuperAbilityId.NovaBombCataclysm,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.NovaBombVortex]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/0230272ce6d6d6ed1d1a3a951e460f34.png',
		name: 'Nova Bomb: Vortex',
		hash: 0,
		id: EDestinySuperAbilityId.NovaBombVortex,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.NovaWarp]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/82a9885b09a090770b56f21927df9d03.png',
		name: 'Nova Warp',
		hash: 0,
		id: EDestinySuperAbilityId.NovaWarp,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.SentinelShield]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f02fd0d90b8d3d7182b9c7cab1a46f64.png',
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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/af58a42be4e803d1b5a7885b13985977.png',
		name: 'Shadowshot: Moebius Quiver',
		hash: 0,
		id: EDestinySuperAbilityId.ShadowshotMoebiusQuiver,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.SilenceAndSquall]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/bac0872a1d59eb9a6f3a0ca7f349b8cc.png',
		name: 'Silence and Squall',
		hash: 0,
		id: EDestinySuperAbilityId.SilenceAndSquall,
		elementId: EElement.Stasis,
	},
	[EDestinySuperAbilityId.SpectralBlades]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a219dacf9847a5c6174d096ce394e460.png',
		name: 'Spectral Blades',
		hash: 0,
		id: EDestinySuperAbilityId.SpectralBlades,
		elementId: EElement.Void,
	},
	[EDestinySuperAbilityId.Stormtrance]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/2dd43a50e48bab5c297c8459bc125bd2.png',
		name: 'Stormtrance',
		hash: 0,
		id: EDestinySuperAbilityId.Stormtrance,
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.Thundercrash]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/4e03473a24049bdb6013badca6b61965.png',
		name: 'Thundercrash',
		hash: 0,
		id: EDestinySuperAbilityId.Thundercrash,
		elementId: EElement.Arc,
	},
	[EDestinySuperAbilityId.WardOfDawn]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/91eec50f00de84db8b666ec299859a21.png',
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
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3adf16d07aab7c46551bd1bfa9e2e283.png',
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
