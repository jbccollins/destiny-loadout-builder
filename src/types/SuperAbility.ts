import {
	EnumDictionary,
	IHash,
	IIcon,
	IIdentifiableName,
	Mapping,
} from './globals';
import { EElementId, ESuperAbilityId } from './IdEnums';

// Order does not matter here
export const SuperAbilityIdList = Object.values(ESuperAbilityId);

export interface ISuperAbility extends IIdentifiableName, IIcon, IHash {
	elementId: EElementId;
}

export const SuperAbilityIdToDestinySuperAbilityMapping: EnumDictionary<
	ESuperAbilityId,
	ISuperAbility
> = {
	[ESuperAbilityId.ArcStaff]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/022d0ea9e0ca89294bb1c9cef65273b8.png',
		name: 'Arc Staff',
		hash: 0,
		id: ESuperAbilityId.ArcStaff,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.BladeBarrage]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5178685d628a640be304950a6b7da11f.png',
		name: 'Blade Barrage',
		hash: 0,
		id: ESuperAbilityId.BladeBarrage,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.BurningMaul]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/81b0c61ff8ac802d3216324028b7e835.png',
		name: 'Burning Maul',
		hash: 0,
		id: ESuperAbilityId.BurningMaul,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.ChaosReach]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c1e711eb4bd8ee24a257fd83a635054c.png',
		name: 'Chaos Reach',
		hash: 0,
		id: ESuperAbilityId.ChaosReach,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.Daybreak]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ce006cb360a96d8f054e49499d924603.png',
		name: 'Daybreak',
		hash: 0,
		id: ESuperAbilityId.Daybreak,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.FistsOfHavoc]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/20f5a1879f8562e3ce6c0140b0e2fd8d.png',
		name: 'Fists of Havoc',
		hash: 0,
		id: ESuperAbilityId.FistsOfHavoc,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.GatheringStorm]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5919e3e43ab455cee03ff23cdaa23080.png',
		name: 'Gathering Storm',
		hash: 0,
		id: ESuperAbilityId.GatheringStorm,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.GlacialQuake]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a764f6e02c1912967ea8e2b701d90cfd.png',
		name: 'Glacial Quake',
		hash: 0,
		id: ESuperAbilityId.GlacialQuake,
		elementId: EElementId.Stasis,
	},
	[ESuperAbilityId.GoldenGunDeadshot]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/16e3aaf50ac9fa802b692af48b895886.png',
		name: 'Golden Gun: Deadshot',
		hash: 0,
		id: ESuperAbilityId.GoldenGunDeadshot,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.GoldenGunMarksman]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6f3e329cf7d330f7ba0cd0f940e98110.png',
		name: 'Golden Gun: Marksman',
		hash: 0,
		id: ESuperAbilityId.GoldenGunMarksman,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.HammerOfSol]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/746ed830d614d66f57d379811a57d03d.png',
		name: 'Hammer of Sol',
		hash: 0,
		id: ESuperAbilityId.HammerOfSol,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.NovaBombCataclysm]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fd0d80cb5f7c0f777795ab3d1b701f4f.png',
		name: 'Nova Bomb: Cataclysm',
		hash: 0,
		id: ESuperAbilityId.NovaBombCataclysm,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.NovaBombVortex]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/0230272ce6d6d6ed1d1a3a951e460f34.png',
		name: 'Nova Bomb: Vortex',
		hash: 0,
		id: ESuperAbilityId.NovaBombVortex,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.NovaWarp]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/82a9885b09a090770b56f21927df9d03.png',
		name: 'Nova Warp',
		hash: 0,
		id: ESuperAbilityId.NovaWarp,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.SentinelShield]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f02fd0d90b8d3d7182b9c7cab1a46f64.png',
		name: 'Sentinel Shield',
		hash: 0,
		id: ESuperAbilityId.SentinelShield,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.ShadowshotDeadfall]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a30563f95eea66ef729a4e65a7152fa7.png',
		name: 'Shadowshot: Deadfall',
		hash: 0,
		id: ESuperAbilityId.ShadowshotDeadfall,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.ShadowshotMoebiusQuiver]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/af58a42be4e803d1b5a7885b13985977.png',
		name: 'Shadowshot: Moebius Quiver',
		hash: 0,
		id: ESuperAbilityId.ShadowshotMoebiusQuiver,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.SilenceAndSquall]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/bac0872a1d59eb9a6f3a0ca7f349b8cc.png',
		name: 'Silence and Squall',
		hash: 0,
		id: ESuperAbilityId.SilenceAndSquall,
		elementId: EElementId.Stasis,
	},
	[ESuperAbilityId.SpectralBlades]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a219dacf9847a5c6174d096ce394e460.png',
		name: 'Spectral Blades',
		hash: 0,
		id: ESuperAbilityId.SpectralBlades,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.Stormtrance]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/2dd43a50e48bab5c297c8459bc125bd2.png',
		name: 'Stormtrance',
		hash: 0,
		id: ESuperAbilityId.Stormtrance,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.Thundercrash]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/4e03473a24049bdb6013badca6b61965.png',
		name: 'Thundercrash',
		hash: 0,
		id: ESuperAbilityId.Thundercrash,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.WardOfDawn]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/91eec50f00de84db8b666ec299859a21.png',
		name: 'Ward of Dawn',
		hash: 0,
		id: ESuperAbilityId.WardOfDawn,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.WellOfRadiance]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5dbb9a2f285df3ee20fe37d073350a37.png',
		name: 'Well of Radiance',
		hash: 0,
		id: ESuperAbilityId.WellOfRadiance,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.WintersWrath]: {
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3adf16d07aab7c46551bd1bfa9e2e283.png',
		name: "Winter's Wrath",
		hash: 0,
		id: ESuperAbilityId.WintersWrath,
		elementId: EElementId.Stasis,
	},
};

export const SuperAbilityIdToDestinySuperAbility: Mapping<
	ESuperAbilityId,
	ISuperAbility
> = {
	get: (key: ESuperAbilityId) =>
		SuperAbilityIdToDestinySuperAbilityMapping[key],
};
