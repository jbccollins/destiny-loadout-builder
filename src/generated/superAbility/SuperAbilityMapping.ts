// This file is generated by the generateSuperAbilityMapping.ts script.
// Do not manually make changes to this file.

import { EnumDictionary } from '@dlb/types/globals';
import { ISuperAbility } from '@dlb/types/generation';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { EElementId } from '@dlb/types/IdEnums';

export const SuperAbilityIdToSuperAbilityMapping: EnumDictionary<
	ESuperAbilityId,
	ISuperAbility
> = {
	[ESuperAbilityId.Thundercrash]: {
		name: 'Thundercrash',
		id: ESuperAbilityId.Thundercrash,
		description:
			'Hurtle through the air like a missile and crash into targets to inflict meteoric damage.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/adb140aba83a6c14345852531d4ee2e0.png',
		hash: 119041298,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.FistsOfHavoc]: {
		name: 'Fists of Havoc',
		id: ESuperAbilityId.FistsOfHavoc,
		description:
			'Supercharge your fists and slam the ground with the force of a maelstrom. While active:\n\n[Light Attack]  : Quickly charge forward, dealing damage to any impacted targets.\n\n[Heavy Attack] : Slam your fists to the ground, blinding targets and dealing damage in an area around you, leaving aftershocks in your wake. Performing a slam from the air deals additional damage.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5bc4f4029b38fd41d0232460b4295600.png',
		hash: 119041299,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.GoldenGunMarksman]: {
		name: 'Golden Gun: Marksman',
		id: ESuperAbilityId.GoldenGunMarksman,
		description:
			'Summon a precision flaming pistol that disintegrates targets with Solar Light.\n\nYour Golden Gun deals massively increased precision damage, overpenetrates targets, and creates Orbs of Power on precision hits.\n\nBenefits from being radiant.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/52f2eb1fefa20e9c7b064c190855d588.png',
		hash: 375052468,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.GoldenGunDeadshot]: {
		name: 'Golden Gun: Deadshot',
		id: ESuperAbilityId.GoldenGunDeadshot,
		description:
			'Summon a rapid-fire flaming pistol that disintegrates targets with Solar Light.\n\nCausing Solar ignitions while your Super is active refunds a Golden Gun round.\n\nBenefits from being radiant.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e19ebe4d56d6f95d582703f6b481813f.png',
		hash: 375052469,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.BladeBarrage]: {
		name: 'Blade Barrage',
		id: ESuperAbilityId.BladeBarrage,
		description:
			'Vault into the air and unleash a volley of Solar-charged explosive knives.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/0b01a6ddceb7b0e2e86ebcb7a6a83eaa.png',
		hash: 375052471,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.Stormtrance]: {
		name: 'Stormtrance',
		id: ESuperAbilityId.Stormtrance,
		description:
			'Chain Arc Lightning from your hands to electrify targets with devastating streams of Arc Light that intensify over time. Casting Stormtrance creates a jolting shockwave underneath you.\n\n[Sprint]  : Teleport forward, consuming a small amount of Super energy.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/31a0445d352fd44b62c9a8dd2752ccdf.png',
		hash: 1081893460,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.ChaosReach]: {
		name: 'Chaos Reach',
		id: ESuperAbilityId.ChaosReach,
		description:
			'Unleash a long-range channeled beam of concentrated Arc energy. Sustained damage on a single target creates a jolting lightning strike at their position.\n\n [Super]  while active to deactivate your Super early, saving Super energy.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b54195b2d82a31ae970ca85fb7fb0be7.png',
		hash: 1081893461,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.NovaWarp]: {
		name: 'Nova Warp',
		id: ESuperAbilityId.NovaWarp,
		description:
			'Step between dimensions to subvert the laws of physics.\n\n[Super Secondary]  : Teleport a short distance.\n\n[Super Primary]  : Unleash a deadly Void eruption. A fully charged attack makes targets volatile.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/feb001db8e9776bc822007c74564c1b6.png',
		hash: 1656118680,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.NovaBombVortex]: {
		name: 'Nova Bomb: Vortex',
		id: ESuperAbilityId.NovaBombVortex,
		description:
			'Hurl an explosive bolt of Void Light at a target, disintegrating those caught within its blast.\n\nNova Bomb creates a singularity that pulls targets inward and continually damages those trapped inside.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e9dc1cc0179cda4d2445845cf8992a7e.png',
		hash: 1656118681,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.NovaBombCataclysm]: {
		name: 'Nova Bomb: Cataclysm',
		id: ESuperAbilityId.NovaBombCataclysm,
		description:
			'Hurl an explosive bolt of Void Light at a target, disintegrating those caught within its blast.\n\nNova Bomb travels slowly and seeks targets. Detonations shatter into smaller seeker projectiles.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b1efa0eaa710653d85e2fcf5321047fb.png',
		hash: 1656118682,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.NeedlestormPrism]: {
		name: 'Needlestorm',
		id: ESuperAbilityId.NeedlestormPrism,
		description:
			"[Super]  : Conjure a hail of deadly woven needles.\n\nAfter embedding themselves in the environment, the needles will re-weave into a host of Threadlings.\n\nThreadlings you create will return to you and perch if they can't find any nearby targets. Damaging targets with your weapons or melee will send out perched Threadlings to attack.",
		icon: 'https://www.bungie.net/common/destiny2_content/icons/2e486aef07bd3551c35807f416ba0b6c.png',
		hash: 1869939001,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.NovaBombCataclysmPrism]: {
		name: 'Nova Bomb: Cataclysm',
		id: ESuperAbilityId.NovaBombCataclysmPrism,
		description:
			'Hurl an explosive bolt of Void Light at a target, disintegrating those caught within its blast.\n\nNova Bomb travels slowly and seeks targets. Detonations shatter into smaller seeker projectiles.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b1efa0eaa710653d85e2fcf5321047fb.png',
		hash: 1869939004,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.SongOfFlamePrism]: {
		name: 'Song of Flame',
		id: ESuperAbilityId.SongOfFlamePrism,
		description:
			'Unleash your inner fire, making your equipped weapons radiant and enhancing your abilities.\n\n[Melee]  : Release a supercharged melee attack that launches additional projectiles.\n\n[Grenade]  : Create a sentient flame wisp that seeks out targets and detonates in a scorching explosion, then seeks out other nearby targets.\n\nWhile Song of Flame is active, you and nearby allies regenerate abilities more quickly, are more resistant to incoming damage, and your [Solar] Solar and Kinetic weapons scorch targets.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ed2e5deb9b67c0120468ee136f98f2b2.png',
		hash: 1869939005,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.WintersWrathPrism]: {
		name: "Winter's Wrath",
		id: ESuperAbilityId.WintersWrathPrism,
		description:
			'Summon a [Stasis] Stasis staff. While your Super is active:\n\n[Super Primary]  : Cast out a barrage of [Stasis] Stasis shards that freeze targets.\n\n[Super Secondary]  : Cast out a shockwave that shatters all frozen targets.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c9f25c8f6d5e647366ffc4f71a825961.png',
		hash: 1869939006,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.StormtrancePrism]: {
		name: 'Stormtrance',
		id: ESuperAbilityId.StormtrancePrism,
		description:
			'Chain Arc Lightning from your hands to electrify targets with devastating streams of Arc Light that intensify over time. Casting Stormtrance creates a jolting shockwave underneath you.\n\n[Sprint]  : Teleport forward, consuming a small amount of Super energy.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/31a0445d352fd44b62c9a8dd2752ccdf.png',
		hash: 1869939007,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.Needlestorm]: {
		name: 'Needlestorm',
		id: ESuperAbilityId.Needlestorm,
		description:
			"[Super]  : Conjure a hail of deadly woven needles.\n\nAfter embedding themselves in the environment, the needles will re-weave into a host of Threadlings.\n\nThreadlings you create will return to you and perch if they can't find any nearby targets. Damaging targets with your weapons or melee will send out perched Threadlings to attack.",
		icon: 'https://www.bungie.net/common/destiny2_content/icons/2e486aef07bd3551c35807f416ba0b6c.png',
		hash: 1885339915,
		elementId: EElementId.Strand,
	},
	[ESuperAbilityId.GlacialQuake]: {
		name: 'Glacial Quake',
		id: ESuperAbilityId.GlacialQuake,
		description:
			'Summon a [Stasis] Stasis gauntlet. While your Super is active:\n\n[Heavy Attack]  : Slam your gauntlet down to create a shockwave that freezes targets and sends out [Stasis] Stasis crystals to freeze additional ones.\n\n[Light Attack]  : Supercharge your Shiver Strike for bonus damage. Sprint through [Stasis] Stasis crystals or frozen targets to shatter them instantly.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3c522f849a7d4d86d5224d7d5d5671a4.png',
		hash: 2021620139,
		elementId: EElementId.Stasis,
	},
	[ESuperAbilityId.SongOfFlame]: {
		name: 'Song of Flame',
		id: ESuperAbilityId.SongOfFlame,
		description:
			'Unleash your inner fire, making your equipped weapons radiant and enhancing your abilities.\n\n[Melee]  : Release a supercharged melee attack that launches additional projectiles.\n\n[Grenade]  : Create a sentient flame wisp that seeks out targets and detonates in a scorching explosion, then seeks out other nearby targets.\n\nWhile Song of Flame is active, you and nearby allies regenerate abilities more quickly, are more resistant to incoming damage, and your [Solar] Solar and Kinetic weapons scorch targets.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ed2e5deb9b67c0120468ee136f98f2b2.png',
		hash: 2274196884,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.Daybreak]: {
		name: 'Daybreak',
		id: ESuperAbilityId.Daybreak,
		description:
			'Fashion Solar Light into blades and smite your foes from the sky.\n\nYour Daybreak projectiles launch a streak of deadly flames on impact.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/89b89220e92c5b363d3e105c25a21640.png',
		hash: 2274196886,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.WellOfRadiance]: {
		name: 'Well of Radiance',
		id: ESuperAbilityId.WellOfRadiance,
		description:
			'Thrust your Sword into the ground, damaging and scorching nearby targets. The sword projects a continuous aura, granting radiant effects and restoration to nearby allies, protecting them from the effects of Stasis.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/2f3615ddcd86ab7c50653d2d1847c3bf.png',
		hash: 2274196887,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.SilkstrikePrism]: {
		name: 'Silkstrike',
		id: ESuperAbilityId.SilkstrikePrism,
		description:
			'Weave a vicious rope dart and tear through your targets.\n\n[Light Attack]  : Swing the rope dart in front of you to deal damage. The tip of the dart deals bonus damage, and defeating targets with the tip causes them to explode.\n\n[Heavy Attack]  : Swing the rope dart in a circular motion to deal heavy damage all around you.\n\n[Grenade]  : Use the grapple to move forward quickly.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3da7e8684b09600e90ea5c16f1edebe0.png',
		hash: 2370269384,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.StormsEdgePrism]: {
		name: "Storm's Edge",
		id: ESuperAbilityId.StormsEdgePrism,
		description:
			'Summon an electrified dagger and throw it in your aim direction.\n\nWhen the dagger hits a surface or a target, you blink to its location and perform a powerful whirling strike, damaging any nearby targets. Can be reactivated after the strike to perform additional throws.\n\nIf the dagger flies for long enough without impacting anything, it detonates and you blink to the detonation location.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/515dafc7f95e310e26bf3189f640231c.png',
		hash: 2370269388,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.ShadowshotDeadfallPrism]: {
		name: 'Shadowshot: Deadfall',
		id: ESuperAbilityId.ShadowshotDeadfallPrism,
		description:
			'Tether foes to a Void Anchor, weakening and suppressing them for you and your allies.\n\nThe Void Anchors fired from Shadowshot pull targets toward the impact point, which then become traps and wait for prey. Void Anchors have increased range and last longer.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/61feac4f1271ba6cecc29cc50e20ab5a.png',
		hash: 2370269389,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.GoldenGunMarksmanPrism]: {
		name: 'Golden Gun: Marksman',
		id: ESuperAbilityId.GoldenGunMarksmanPrism,
		description:
			'Summon a precision flaming pistol that disintegrates targets with Solar Light.\n\nYour Golden Gun deals massively increased precision damage, overpenetrates targets, and creates Orbs of Power on precision hits.\n\nBenefits from being radiant.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/52f2eb1fefa20e9c7b064c190855d588.png',
		hash: 2370269390,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.SilenceAndSquallPrism]: {
		name: 'Silence and Squall',
		id: ESuperAbilityId.SilenceAndSquallPrism,
		description:
			'Summon two Stasis kamas, Silence and Squall, that you throw one after another.\n\nSilence : Creates a flash-freeze blast that freezes and damages targets.\n\nSquall : Creates a Stasis Storm that slows and damages targets caught inside.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a8bbee32ce8f259e7b9e112c0c8a401a.png',
		hash: 2370269391,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.Silkstrike]: {
		name: 'Silkstrike',
		id: ESuperAbilityId.Silkstrike,
		description:
			'Weave a vicious rope dart and tear through your targets.\n\n[Light Attack]  : Swing the rope dart in front of you to deal damage. The tip of the dart deals bonus damage, and defeating targets with the tip causes them to explode.\n\n[Heavy Attack]  : Swing the rope dart in a circular motion to deal heavy damage all around you.\n\n[Grenade]  : Use the grapple to move forward quickly.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3da7e8684b09600e90ea5c16f1edebe0.png',
		hash: 2463983862,
		elementId: EElementId.Strand,
	},
	[ESuperAbilityId.BladefuryPrism]: {
		name: 'Bladefury',
		id: ESuperAbilityId.BladefuryPrism,
		description:
			'[Super]  : Create two woven blades and roam the battlefield. While active:\n\n[Light Attack]  : Perform a leaping slash towards nearby targets, severing them on hit and dealing bonus damage to suspended targets. Each successful hit briefly increases your attack speed and grants energy for your heavy attack.\n\n[Heavy Attack]  : Unleash a heavy upward slash, creating two suspending projectiles that seek out targets.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/228496331415f6854ef589f33c2a2622.png',
		hash: 2529942642,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.ThundercrashPrism]: {
		name: 'Thundercrash',
		id: ESuperAbilityId.ThundercrashPrism,
		description:
			'Hurtle through the air like a missile and crash into targets to inflict meteoric damage.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/adb140aba83a6c14345852531d4ee2e0.png',
		hash: 2529942644,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.GlacialQuakePrism]: {
		name: 'Glacial Quake',
		id: ESuperAbilityId.GlacialQuakePrism,
		description:
			'Summon a [Stasis] Stasis gauntlet. While your Super is active:\n\n[Heavy Attack]  : Slam your gauntlet down to create a shockwave that freezes targets and sends out [Stasis] Stasis crystals to freeze additional ones.\n\n[Light Attack]  : Supercharge your Shiver Strike for bonus damage. Sprint through [Stasis] Stasis crystals or frozen targets to shatter them instantly.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3c522f849a7d4d86d5224d7d5d5671a4.png',
		hash: 2529942645,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.TwilightArsenalPrism]: {
		name: 'Twilight Arsenal',
		id: ESuperAbilityId.TwilightArsenalPrism,
		description:
			'[Super]  : Summon three Void axes and throw them at your foes one after another. On impact, the axes pull in nearby targets and detonate in a weakening explosion. After exploding, the axes can be picked up by you or your allies and used as a weapon for a short time.\n\nWhile carrying a Void axe:\n[Light Attack]  : Slash forward with your axe, dealing damage and weakening targets.\n[Heavy Attack]  : Throw the axe, consuming all remaining ammo.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ad8fd9cd668f4d980b29e26ade9e4369.png',
		hash: 2529942646,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.HammerOfSolPrism]: {
		name: 'Hammer of Sol',
		id: ESuperAbilityId.HammerOfSolPrism,
		description:
			'Summon a flaming hammer and wreak destruction down upon your enemies.\n\n[Light Attack]  : Throw your hammer at foes.\n\nUpon impact, your hammers shatter into explosive molten shards.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/9d1fd669f61cce4abd35dbefd22ba90c.png',
		hash: 2529942647,
		elementId: EElementId.Prism,
	},
	[ESuperAbilityId.SilenceAndSquall]: {
		name: 'Silence and Squall',
		id: ESuperAbilityId.SilenceAndSquall,
		description:
			'Summon two Stasis kamas, Silence and Squall, that you throw one after another.\n\nSilence : Creates a flash-freeze blast that freezes and damages targets.\n\nSquall : Creates a Stasis Storm that slows and damages targets caught inside.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a8bbee32ce8f259e7b9e112c0c8a401a.png',
		hash: 2625980631,
		elementId: EElementId.Stasis,
	},
	[ESuperAbilityId.ShadowshotMoebiusQuiver]: {
		name: 'Shadowshot: Moebius Quiver',
		id: ESuperAbilityId.ShadowshotMoebiusQuiver,
		description:
			'Tether foes to a Void Anchor, weakening and suppressing them for you and your allies.\n\nFire two volleys of three Void Arrows that seek nearby targets. Shadowshot makes targets volatile and deals increased damage to tethered targets. Defeating tethered targets creates Orbs of Power.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/986e8f2dd0699371d605a331bb63742a.png',
		hash: 2722573681,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.SpectralBlades]: {
		name: 'Spectral Blades',
		id: ESuperAbilityId.SpectralBlades,
		description:
			'Summon a pair of deadly Void blades and stalk the battlefield in a veil of shadows.\n\n[Light Attack]  : Perform a quick melee attack.\n\n[Heavy Attack]  : Perform a heavy attack that weakens your target, and once again vanish from sight.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1fbfacd5dfe847c5cd0262c5616653ff.png',
		hash: 2722573682,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.ShadowshotDeadfall]: {
		name: 'Shadowshot: Deadfall',
		id: ESuperAbilityId.ShadowshotDeadfall,
		description:
			'Tether foes to a Void Anchor, weakening and suppressing them for you and your allies.\n\nThe Void Anchors fired from Shadowshot pull targets toward the impact point, which then become traps and wait for prey. Void Anchors have increased range and last longer.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/61feac4f1271ba6cecc29cc50e20ab5a.png',
		hash: 2722573683,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.BurningMaul]: {
		name: 'Burning Maul',
		id: ESuperAbilityId.BurningMaul,
		description:
			'Summon a flaming maul and crush targets with the force of an earthquake.\n\n[Light Attack]  : Spin the maul in a circle around you, damaging nearby targets.\n\n[Heavy Attack]  : Slam the maul to the ground and create a cyclone of flames that seeks targets, dealing damage and scorching them.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a0391bd2a8cf73c58cec261961db0136.png',
		hash: 2747500760,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.HammerOfSol]: {
		name: 'Hammer of Sol',
		id: ESuperAbilityId.HammerOfSol,
		description:
			'Summon a flaming hammer and wreak destruction down upon your enemies.\n\n[Light Attack]  : Throw your hammer at foes.\n\nUpon impact, your hammers shatter into explosive molten shards.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/9d1fd669f61cce4abd35dbefd22ba90c.png',
		hash: 2747500761,
		elementId: EElementId.Solar,
	},
	[ESuperAbilityId.Bladefury]: {
		name: 'Bladefury',
		id: ESuperAbilityId.Bladefury,
		description:
			'[Super]  : Create two woven blades and roam the battlefield. While active:\n\n[Light Attack]  : Perform a leaping slash towards nearby targets, severing them on hit and dealing bonus damage to suspended targets. Each successful hit briefly increases your attack speed and grants energy for your heavy attack.\n\n[Heavy Attack]  : Unleash a heavy upward slash, creating two suspending projectiles that seek out targets.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/228496331415f6854ef589f33c2a2622.png',
		hash: 3574662354,
		elementId: EElementId.Strand,
	},
	[ESuperAbilityId.WintersWrath]: {
		name: "Winter's Wrath",
		id: ESuperAbilityId.WintersWrath,
		description:
			'Summon a [Stasis] Stasis staff. While your Super is active:\n\n[Super Primary]  : Cast out a barrage of [Stasis] Stasis shards that freeze targets.\n\n[Super Secondary]  : Cast out a shockwave that shatters all frozen targets.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c9f25c8f6d5e647366ffc4f71a825961.png',
		hash: 3683904166,
		elementId: EElementId.Stasis,
	},
	[ESuperAbilityId.GatheringStorm]: {
		name: 'Gathering Storm',
		id: ESuperAbilityId.GatheringStorm,
		description:
			'Hurl your Arc Staff forward, embedding it into surfaces or large targets and jolting nearby targets.\n\nAfter a short time, a devastating lightning bolt strikes the staff, overcharging it with Arc energy. While overcharged, your staff discharges lightning at nearby foes.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/edf23f2e6951efcab4c4b10630b6f7c4.png',
		hash: 3769507632,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.ArcStaff]: {
		name: 'Arc Staff',
		id: ESuperAbilityId.ArcStaff,
		description:
			'Form a staff of pure Arc energy and acrobatically take out your foes.\n\n[Block] : Hold to deflect incoming projectiles with your Arc staff.\n\nDeflecting a projectile grants you a stack of Bolt Charge.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/435489f514e2bf88d25c452a96f2dff9.png',
		hash: 3769507633,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.StormsEdge]: {
		name: "Storm's Edge",
		id: ESuperAbilityId.StormsEdge,
		description:
			'Summon an electrified dagger and throw it in your aim direction.\n\nWhen the dagger hits a surface or a target, you blink to its location and perform a powerful whirling strike, damaging any nearby targets. Can be reactivated after the strike to perform additional throws.\n\nIf the dagger flies for long enough without impacting anything, it detonates and you blink to the detonation location.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/515dafc7f95e310e26bf3189f640231c.png',
		hash: 3769507635,
		elementId: EElementId.Arc,
	},
	[ESuperAbilityId.SentinelShield]: {
		name: 'Sentinel Shield',
		id: ESuperAbilityId.SentinelShield,
		description:
			'[Super]  : Summon a shield of Void Light. \nWhile Sentinel Shield is active:\n[Light Attack]  : Attack.\n[Block]  : Block.\n[Grenade]  : Perform a Shield Throw.\n\nGuard with Sentinel Shield to create a defensive wall that draws hostile fire. Allies who shoot through the wall have increased weapon damage, and guarding allies makes the shield last longer.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a929ea604d638e5e99125e48f76989e2.png',
		hash: 4260353952,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.WardOfDawn]: {
		name: 'Ward of Dawn',
		id: ESuperAbilityId.WardOfDawn,
		description:
			'Create an indestructible dome to protect you and your allies.\n\nWhile inside or near the Ward of Dawn, you and your allies gain a Void overshield.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1caf1eccf1072969ab93bd35fde62599.png',
		hash: 4260353953,
		elementId: EElementId.Void,
	},
	[ESuperAbilityId.TwilightArsenal]: {
		name: 'Twilight Arsenal',
		id: ESuperAbilityId.TwilightArsenal,
		description:
			'[Super]  : Summon three Void axes and throw them at your foes one after another. On impact, the axes pull in nearby targets and detonate in a weakening explosion. After exploding, the axes can be picked up by you or your allies and used as a weapon for a short time.\n\nWhile carrying a Void axe:\n[Light Attack]  : Slash forward with your axe, dealing damage and weakening targets.\n[Heavy Attack]  : Throw the axe, consuming all remaining ammo.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ad8fd9cd668f4d980b29e26ade9e4369.png',
		hash: 4260353955,
		elementId: EElementId.Void,
	},
};
