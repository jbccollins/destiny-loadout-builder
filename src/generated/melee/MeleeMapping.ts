// This file is generated by the generateMeleeMapping.ts script.
// Do not manually make changes to this file.

import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EElementId } from '@dlb/types/IdEnums';
import { IMelee } from '@dlb/types/generation';
import { EnumDictionary } from '@dlb/types/globals';

export const MeleeIdToMeleeMapping: EnumDictionary<EMeleeId, IMelee> = {
	[EMeleeId.HammerStrike]: {
		name: 'Hammer Strike',
		id: EMeleeId.HammerStrike,
		description:
			'After sprinting for a short time, use this melee ability to swing a blazing hammer that scorches your target and deals damage in a cone behind them.\n\nIf your target is defeated by Hammer Strike, they ignite.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c05584046992239cbbd0d319228058b8.jpg',
		hash: 852252788,
		elementId: EElementId.Solar,
	},
	[EMeleeId.ThrowingHammer]: {
		name: 'Throwing Hammer',
		id: EMeleeId.ThrowingHammer,
		description:
			'Throw a hammer from a distance. Picking up a thrown hammer fully recharges your melee ability. If the hammer struck a target, picking it up grants cure.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/2db60293ac428ae066a5bb2fed04f6e7.jpg',
		hash: 852252789,
		elementId: EElementId.Solar,
	},
	[EMeleeId.SnareBomb]: {
		name: 'Snare Bomb',
		id: EMeleeId.SnareBomb,
		description:
			'Throw a Smoke Bomb, which attaches to surfaces and pings enemy radar. Weakens targets on detonation.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/df5d0a9f49f37de0cb781b8d2fd70516.jpg',
		hash: 1139822081,
		elementId: EElementId.Void,
	},
	[EMeleeId.BallLightning]: {
		name: 'Ball Lightning',
		id: EMeleeId.BallLightning,
		description:
			'Fire an Arc projectile forward that releases a perpendicular lightning strike after a short time.\n\nWhile amplified, Ball Lightning releases additional lightning strikes before detonating.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5539f0c752919a84714366dcb3fe6893.jpg',
		hash: 1232050830,
		elementId: EElementId.Arc,
	},
	[EMeleeId.ChainLightning]: {
		name: 'Chain Lightning',
		id: EMeleeId.ChainLightning,
		description:
			'An extended range melee that jolts your target and chains lightning to nearby targets.\n\nWhile amplified, it creates an additional set of chains.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f07bbec19064eec2de3d02e3b700cfc2.jpg',
		hash: 1232050831,
		elementId: EElementId.Arc,
	},
	[EMeleeId.WitheringBlade]: {
		name: 'Withering Blade',
		id: EMeleeId.WitheringBlade,
		description:
			'Toss a [Stasis] Stasis Shuriken at targets to damage and slow them.  \n\nProvides multiple charges.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/d4dbdba1bbc4f102f865b14dc2ec186f.png',
		hash: 1341767667,
		elementId: EElementId.Stasis,
	},
	[EMeleeId.IncineratorSnap]: {
		name: 'Incinerator Snap',
		id: EMeleeId.IncineratorSnap,
		description:
			'Snap your fingers to create a fan of burning sparks that explode and scorch targets.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e9dee44a01ea409afe80a939b6341843.jpg',
		hash: 1470370538,
		elementId: EElementId.Solar,
	},
	[EMeleeId.CelestialFire]: {
		name: 'Celestial Fire',
		id: EMeleeId.CelestialFire,
		description:
			'Send out a spiral of three explosive Solar energy blasts, scorching targets with each hit.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fb42651d89b71d2ca952f593c09b1448.jpg',
		hash: 1470370539,
		elementId: EElementId.Solar,
	},
	[EMeleeId.ThreadedSpike]: {
		name: 'Threaded Spike',
		id: EMeleeId.ThreadedSpike,
		description:
			"Throw a rope dart that bounces between targets, damaging and severing them. The dart will return to you once it's done, returning melee energy to you for each target hit. Press [Melee] just as the dart gets back to you to catch it and increase the amount of energy returned.",
		icon: 'https://www.bungie.net/common/destiny2_content/icons/46620e1f142778a0d429be7a12c39f21.png',
		hash: 1680616210,
		elementId: EElementId.Strand,
	},
	[EMeleeId.ShiverStrike]: {
		name: 'Shiver Strike',
		id: EMeleeId.ShiverStrike,
		description:
			'Hold input to leap through the air. Releasing unleashes a powerful dash attack that knocks targets back and damages them.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1f34b1d2eb5377ac68346cb42db6f008.png',
		hash: 2028772231,
		elementId: EElementId.Stasis,
	},
	[EMeleeId.PocketSingularity]: {
		name: 'Pocket Singularity',
		id: EMeleeId.PocketSingularity,
		description:
			'Launch an unstable ball of Void energy that detonates when it nears a target, pushing them away from the blast and making them volatile.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/afd8d014a0cf2e76a73172beae7ef0ee.jpg',
		hash: 2299867342,
		elementId: EElementId.Void,
	},
	[EMeleeId.ArcaneNeedle]: {
		name: 'Arcane Needle',
		id: EMeleeId.ArcaneNeedle,
		description:
			'Sling a woven needle that will embed in your target, unraveling them. Activate your melee ability again to chain up to two additional attacks.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e996524beb9d4371b1adc1212a6accdf.png',
		hash: 2307689415,
		elementId: EElementId.Strand,
	},
	[EMeleeId.PenumbralBlast]: {
		name: 'Penumbral Blast',
		id: EMeleeId.PenumbralBlast,
		description:
			'Raise your [Stasis] Stasis staff against your foe. Send a blast of [Stasis] Stasis forward to freeze your targets.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f77faacb093918106f28b2b49e168264.png',
		hash: 2543177538,
		elementId: EElementId.Stasis,
	},
	[EMeleeId.BallisticSlam]: {
		name: 'Ballistic Slam',
		id: EMeleeId.BallisticSlam,
		description:
			'After sprinting and while airborne, activate your charged melee ability to slam to the ground, dealing damage to nearby targets.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c9e36caa03cdb0d8dfcacc57f0e01938.jpg',
		hash: 2708585276,
		elementId: EElementId.Arc,
	},
	[EMeleeId.SeismicStrike]: {
		name: 'Seismic Strike',
		id: EMeleeId.SeismicStrike,
		description:
			'After sprinting for a short time, activate your charged melee ability to slam shoulder-first into your target, damaging and blinding targets in an area around them.\n\nWhile you are amplified, the blind radius is increased.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ef72ed2a57e2cf3405e72b93f2218e50.jpg',
		hash: 2708585277,
		elementId: EElementId.Arc,
	},
	[EMeleeId.Thunderclap]: {
		name: 'Thunderclap',
		id: EMeleeId.Thunderclap,
		description:
			'[Melee] : Hold while grounded to plant your feet and begin charging your fist with Arc energy.\n\n[Melee] : Release to unleash a devastating blast in front of you, dealing damage that increases with longer charge time.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/45e77f67fbb1e12c36972cd923f7b9e0.jpg',
		hash: 2708585279,
		elementId: EElementId.Arc,
	},
	[EMeleeId.DisorientingBlow]: {
		name: 'Disorienting Blow',
		id: EMeleeId.DisorientingBlow,
		description:
			'Striking a target with this melee ability blinds them and amplifies you.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/0ac85c928868a34d47dba95dcff2da2a.jpg',
		hash: 2716335210,
		elementId: EElementId.Arc,
	},
	[EMeleeId.CombinationBlow]: {
		name: 'Combination Blow',
		id: EMeleeId.CombinationBlow,
		description:
			'A quick strike that temporarily increases your melee damage when defeating a target, stacking three times.\n\nDefeating targets with this ability also fully refills your class ability energy and restores a small amount of health.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a7ff3045c06a03649199c6b8e185d7a3.jpg',
		hash: 2716335211,
		elementId: EElementId.Arc,
	},
	[EMeleeId.KnifeTrick]: {
		name: 'Knife Trick',
		id: EMeleeId.KnifeTrick,
		description: 'Throw a fan of flaming knives that scorch targets on hit.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/d9607f7db9d1f53b16af6ee6f6bcb428.jpg',
		hash: 4016776972,
		elementId: EElementId.Solar,
	},
	[EMeleeId.ProximityExplosiveKnife]: {
		name: 'Proximity Explosive Knife',
		id: EMeleeId.ProximityExplosiveKnife,
		description:
			'Throw a knife that attaches to surfaces upon impact and explodes when it detects a nearby target.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3616d8241a759780586c0869fa1b3d1e.jpg',
		hash: 4016776973,
		elementId: EElementId.Solar,
	},
	[EMeleeId.LightweightKnife]: {
		name: 'Lightweight Knife',
		id: EMeleeId.LightweightKnife,
		description:
			'Quickly throw a knife that deals moderate damage. Precision hits with this knife make you radiant for a short duration.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c267da37ac94e991cf3ac943c2aa6601.jpg',
		hash: 4016776974,
		elementId: EElementId.Solar,
	},
	[EMeleeId.WeightedThrowingKnife]: {
		name: 'Weighted Throwing Knife',
		id: EMeleeId.WeightedThrowingKnife,
		description:
			'Throw a knife that deals extra precision damage and causes scorched targets to ignite.\n\nPrecision final blows with this knife immediately recharge your class ability.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/5875031ec666d94d7358a0c7d3a1191f.jpg',
		hash: 4016776975,
		elementId: EElementId.Solar,
	},
	[EMeleeId.FrenziedBlade]: {
		name: 'Frenzied Blade',
		id: EMeleeId.FrenziedBlade,
		description:
			'Activate your charged melee ability to dash forward, slashing at targets in front of you and severing them.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/7cccab938e8218821aed5d76740f61e9.png',
		hash: 4094417246,
		elementId: EElementId.Strand,
	},
	[EMeleeId.ShieldThrow]: {
		name: 'Shield Throw',
		id: EMeleeId.ShieldThrow,
		description:
			'Hurl your Void Shield toward a target. The shield can ricochet off targets and surfaces, granting Overshield for each target hit.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/18ba97e43f603ca3cbc1507255992d39.jpg',
		hash: 4220332374,
		elementId: EElementId.Void,
	},
	[EMeleeId.ShieldBash]: {
		name: 'Shield Bash',
		id: EMeleeId.ShieldBash,
		description:
			'After sprinting for a short time, use this melee ability to unleash a devastating Shield Bash that suppresses the target. Final blows with Shield Bash grant an Overshield.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/7a7f502312a1217de5b76e416fb85677.jpg',
		hash: 4220332375,
		elementId: EElementId.Void,
	},
};
