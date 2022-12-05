import { ArmorStatMapping } from './ArmorStat';
import { getDestinyClassAbilityStat } from './DestinyClass';
import {
	IIdentifiableName,
	IIcon,
	IHash,
	EnumDictionary,
	StatBonus,
	MISSING_ICON,
} from './globals';
import {
	EArmorStatId,
	EFragmentId,
	EElementId,
	EDestinyClassId,
} from './IdEnums';

export const FragmentIdList = Object.values(EFragmentId);

export interface IFragment extends IIdentifiableName, IIcon, IHash {
	description: string;
	bonuses: StatBonus[];
	element: EElementId;
}

const FragmentIdToFragmentMapping: EnumDictionary<EFragmentId, IFragment> = {
	/*** STASIS ***/
	// POSITIVE
	[EFragmentId.WhisperOfDurance]: {
		id: EFragmentId.WhisperOfDurance,
		name: 'Whisper Of Durance',
		description:
			'Slow from your abilities lasts longer. For those abilities that linger, their duration will also increase.',
		element: EElementId.Stasis,
		bonuses: [{ stat: EArmorStatId.Strength, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/87bf9175979ee9a31ce9c233b5feb045.png',
		hash: 3469412969,
	},
	[EFragmentId.WhisperOfChains]: {
		id: EFragmentId.WhisperOfChains,
		name: 'Whisper Of Chains',
		description:
			'While you are near frozen targets or a friendly Stasis crystal, you take reduced damage from targets.',
		element: EElementId.Stasis,
		bonuses: [{ stat: EArmorStatId.Recovery, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/2c705256113eb0e8fe8e0ad572c5cad7.png',
		hash: 537774540,
	},
	[EFragmentId.WhisperOfShards]: {
		id: EFragmentId.WhisperOfShards,
		name: 'Whisper Of Shards',
		description:
			'Shattering a Stasis crystal temporarily boosts your grenade recharge rate. Shattering additional Stasis crystals increases the duration of this benefit.',
		element: EElementId.Stasis,
		bonuses: [{ stat: EArmorStatId.Resilience, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b0e2bbd933299443fb8e0c8b0950821a.png',
		hash: 3469412975,
	},
	[EFragmentId.WhisperOfConduction]: {
		id: EFragmentId.WhisperOfConduction,
		name: 'Whisper Of Conduction',
		description: 'Nearby Stasis shards track to your position.',
		element: EElementId.Stasis,
		bonuses: [
			{ stat: EArmorStatId.Resilience, value: 10 },
			{ stat: EArmorStatId.Intellect, value: 10 },
		],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/789d37b375fc999befea9341713b3009.png',
		hash: 2483898429,
	},
	// NEGATIVE
	[EFragmentId.WhisperOfBonds]: {
		id: EFragmentId.WhisperOfBonds,
		name: 'Whisper of Bonds',
		description: 'Defeating frozen targets grants you Super energy.',
		element: EElementId.Stasis,
		bonuses: [
			{ stat: EArmorStatId.Discipline, value: -10 },
			{ stat: EArmorStatId.Intellect, value: -10 },
		],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b4b3feab1addf7bfc09046412b9b8f15.png',
		hash: 3469412974,
	},
	[EFragmentId.WhisperOfHedrons]: {
		id: EFragmentId.WhisperOfHedrons,
		name: 'Whisper of Hedrons',
		description:
			'Dramatically increases weapon stability, weapon aim assist, Mobility, Resilience, and Recovery after freezing a target with Stasis.',
		element: EElementId.Stasis,
		bonuses: [{ stat: EArmorStatId.Strength, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6babcb674b6bfd511cad1e765f9c9be4.png',
		hash: 3469412970,
	},
	[EFragmentId.WhisperOfFractures]: {
		id: EFragmentId.WhisperOfFractures,
		name: 'Whisper of Fractures',
		description:
			'Your melee energy recharges faster when you are near two or more targets.',
		element: EElementId.Stasis,
		bonuses: [{ stat: EArmorStatId.Discipline, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3f0407601489c2687f5be7a31446e272.png',
		hash: 537774542,
	},
	[EFragmentId.WhisperOfHunger]: {
		id: EFragmentId.WhisperOfHunger,
		name: 'Whisper of Hunger',
		description:
			'Increases the melee energy gained from picking up Stasis shards.',
		element: EElementId.Stasis,
		bonuses: [
			{ stat: EArmorStatId.Mobility, value: -10 },
			{ stat: EArmorStatId.Recovery, value: -10 },
		],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/468994cf44d0127e341efc8f6eadd217.png',
		hash: 2483898431,
	},
	// NEUTRAL
	[EFragmentId.WhisperOfFissures]: {
		id: EFragmentId.WhisperOfFissures,
		name: 'Whisper of Fissures',
		description:
			'Increases the damage and size of the burst of Stasis when you destroy a Stasis crystal or defeat a frozen target.',
		element: EElementId.Stasis,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/d7873bd4ff3999ae933f2efbc84f75c3.png',
		hash: 3469412971, // TODO
	},
	[EFragmentId.WhisperOfImpetus]: {
		id: EFragmentId.WhisperOfImpetus,
		name: 'Whisper of Impetus',
		description:
			'Damaging targets with a Stasis melee reloads your stowed weapons and grants you a temporary boost to weapon ready speed.',
		element: EElementId.Stasis,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/488155e2c0af761888b6c9013d3df1b8.png',
		hash: 537774543, // TODO
	},
	[EFragmentId.WhisperOfRefraction]: {
		id: EFragmentId.WhisperOfRefraction,
		name: 'Whisper of Refraction',
		description:
			'Defeating slowed or frozen targets grants you class ability energy.',
		element: EElementId.Stasis,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/83f0937d1d3599a70054ef7c5cb2d372.png',
		hash: 3852198730, // TODO
	},
	[EFragmentId.WhisperOfRending]: {
		id: EFragmentId.WhisperOfRending,
		name: 'Whisper of Rending',
		description:
			'Kinetic weapons do increased damage to Stasis crystals and frozen targets.',
		element: EElementId.Stasis,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/8e53a7df5257ba6eb07608b829afc808.png',
		hash: 2483898428, // TODO
	},
	[EFragmentId.WhisperOfRime]: {
		id: EFragmentId.WhisperOfRime,
		name: 'Whisper of Rime',
		description:
			'Collecting a Stasis shard grants a small amount of overshield, which falls off after 10 seconds. Collecting additional shards adds to the overshield and refreshes the timer.',
		element: EElementId.Stasis,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/24fd250f6c23137597567b1061bb5e96.png',
		hash: 2483898430, // TODO
	},
	[EFragmentId.WhisperOfTorment]: {
		id: EFragmentId.WhisperOfTorment,
		name: 'Whisper of Torment',
		description:
			'You gain grenade energy each time you take damage from targets.',
		element: EElementId.Stasis,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/557294f02042a60ed1aca7420c5e3873.png',
		hash: 537774541, // TODO
	},

	/*** VOID ***/
	// POSITIVE
	[EFragmentId.EchoOfExpulsion]: {
		id: EFragmentId.EchoOfExpulsion,
		name: 'Echo of Expulsion',
		description: 'Void ability final blows cause targets to explode.',
		element: EElementId.Void,
		bonuses: [{ stat: EArmorStatId.Intellect, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/d6500235bb175f0fc3752cab0a170fd2.jpg',
		hash: 2272984665,
	},
	[EFragmentId.EchoOfLeeching]: {
		id: EFragmentId.EchoOfLeeching,
		name: 'Echo of Leeching',
		description:
			'Melee final blows start health regeneration for you and nearby allies.',
		element: EElementId.Void,
		bonuses: [{ stat: EArmorStatId.Resilience, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6aa22ca5ba309f264af5231969ec840a.jpg',
		hash: 2272984670,
	},
	[EFragmentId.EchoOfDomineering]: {
		id: EFragmentId.EchoOfDomineering,
		name: 'Echo of Domineering',
		description:
			'After suppressing a target, you gain greatly increased Mobility for a short duration and your equipped weapon is reloaded from reserves.',
		element: EElementId.Void,
		bonuses: [{ stat: EArmorStatId.Discipline, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/958ff340ae4ce16d7cf71c5268a13919.jpg',
		hash: 2272984657,
	},
	[EFragmentId.EchoOfDilation]: {
		id: EFragmentId.EchoOfDilation,
		name: 'Echo of Dilation',
		description:
			'While crouched, you sneak faster and gain enhanced radar resolution.',
		element: EElementId.Void,
		bonuses: [
			{ stat: EArmorStatId.Mobility, value: 10 },
			{ stat: EArmorStatId.Intellect, value: 10 },
		],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/029faa3dc0d82eefef581dec7820d643.jpg',
		hash: 2272984656,
	},
	[EFragmentId.EchoOfInstability]: {
		id: EFragmentId.EchoOfInstability,
		name: 'Echo of Instability',
		description:
			'Defeating targets with grenades grants Volatile Rounds to your Void weapons.',
		element: EElementId.Void,
		bonuses: [{ stat: EArmorStatId.Strength, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/0ad46f9c0c14535c4d5776daf48e871e.jpg',
		hash: 2661180600,
	},
	[EFragmentId.EchoOfObscurity]: {
		id: EFragmentId.EchoOfObscurity,
		name: 'Echo of Obscurity',
		description: 'Finisher final blows grant Invisibility.',
		element: EElementId.Void,
		bonuses: [{ stat: EArmorStatId.Recovery, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/7d711ce4bcfb264da29c289ff70b9876.jpg',
		hash: 2661180602,
	},
	// NEGATIVE
	[EFragmentId.EchoOfProvision]: {
		id: EFragmentId.EchoOfProvision,
		name: 'Echo of Provision',
		description: 'Damaging targets with grenades grants melee energy.',
		element: EElementId.Void,
		bonuses: [{ stat: EArmorStatId.Strength, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1c16b5205d6a648b9898cce6ac3a01b3.jpg',
		hash: 2272984664,
	},
	[EFragmentId.EchoOfPersistence]: {
		id: EFragmentId.EchoOfPersistence,
		name: 'Echo of Persistence',
		description:
			'Void buffs applied to you (Invisibility, Overshield, and Devour) have increased duration.',
		element: EElementId.Void,
		bonuses: [{ stat: getDestinyClassAbilityStat, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/914309029085289921f77d8207765150.jpg',
		hash: 2272984671,
	},
	[EFragmentId.EchoOfUndermining]: {
		id: EFragmentId.EchoOfUndermining,
		name: 'Echo of Undermining',
		description: 'Your Void grenades weaken targets.',
		element: EElementId.Void,
		bonuses: [{ stat: EArmorStatId.Discipline, value: -20 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b114e9d97c42a68b19ab7876a221b354.jpg',
		hash: 2272984668,
	},
	[EFragmentId.EchoOfHarvest]: {
		id: EFragmentId.EchoOfHarvest,
		name: 'Echo of Harvest',
		description:
			'Defeating weakened targets with precision final blows will create an Orb of Power.',
		element: EElementId.Void,
		bonuses: [{ stat: EArmorStatId.Intellect, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6bd23524f7129761043724acbe90c7b5.jpg',
		hash: 2661180601,
	},
	[EFragmentId.EchoOfStarvation]: {
		id: EFragmentId.EchoOfStarvation,
		name: 'Echo of Starvation',
		description: 'Picking up an Orb of Power grants Devour.',
		element: EElementId.Void,
		bonuses: [{ stat: EArmorStatId.Recovery, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/19219ecd56fef82e9ead65aed8fea63a.jpg',
		hash: 2661180603,
	},
	// NEUTRAL
	[EFragmentId.EchoOfExchange]: {
		id: EFragmentId.EchoOfExchange,
		name: 'Echo of Exchange',
		description: 'Melee final blows grant grenade energy.',
		element: EElementId.Void,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e5a6ac0f38df212a40dc541bb46f354f.jpg',
		hash: 2272984667,
	},
	[EFragmentId.EchoOfPersistence]: {
		id: EFragmentId.EchoOfPersistence,
		name: 'Echo of Persistence',
		description:
			'Void buffs applied to you (Invisibility, Overshield, and Devour) have increased duration.',
		element: EElementId.Void,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/914309029085289921f77d8207765150.jpg',
		hash: 2272984671,
	},
	[EFragmentId.EchoOfRemnants]: {
		id: EFragmentId.EchoOfRemnants,
		name: 'Echo of Remnants',
		description:
			'Your lingering grenade effects (Vortex Grenade, Void Wall, Void Spike, and Axion Bolt) have increased duration.',
		element: EElementId.Void,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/ce12bd0f246e834c8f7e102079814bf9.jpg',
		hash: 2272984666,
	},
	[EFragmentId.EchoOfReprisal]: {
		id: EFragmentId.EchoOfReprisal,
		name: 'Echo of Reprisal',
		description:
			'Final blows when surrounded by combatants grant Super energy.',
		element: EElementId.Void,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6a0118280ba432e796048648993d7765.jpg',
		hash: 2272984669,
	},

	/*** SOLAR ***/
	// POSITIVE
	[EFragmentId.EmberOfBeams]: {
		id: EFragmentId.EmberOfBeams,
		name: 'Ember of Beams',
		description:
			'Your Solar Super projectiles have stronger target acquisition.',
		element: EElementId.Solar,
		bonuses: [{ stat: EArmorStatId.Intellect, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/2f12ba3df56de7c0e2790f481cb29a52.jpg',
		hash: 362132295,
	},
	[EFragmentId.EmberOfCombustion]: {
		id: EFragmentId.EmberOfCombustion,
		name: 'Ember of Combustion',
		description: 'Final blows with your Solar Super cause targets to ignite.',
		element: EElementId.Solar,
		bonuses: [{ stat: EArmorStatId.Strength, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/45476d85d0e6aeded810f217a0627afb.jpg',
		hash: 362132289,
	},
	[EFragmentId.EmberOfChar]: {
		id: EFragmentId.EmberOfChar,
		name: 'Ember of Char',
		description: 'Your Solar ignitions spread scorch to affected targets.',
		element: EElementId.Solar,
		bonuses: [{ stat: EArmorStatId.Discipline, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a299dde35bfcd830923458846d7a64f3.jpg',
		hash: 362132291,
	},
	[EFragmentId.EmberOfEruption]: {
		id: EFragmentId.EmberOfEruption,
		name: 'Ember of Eruption',
		description: 'Your Solar ignitions have increased area of effect.',
		element: EElementId.Solar,
		bonuses: [{ stat: EArmorStatId.Strength, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/8734774377b5e73a84ed045a78ce232c.jpg',
		hash: 1051276348,
	},
	[EFragmentId.EmberOfWonder]: {
		id: EFragmentId.EmberOfWonder,
		name: 'Ember of Wonder',
		description:
			'Rapidly defeating multiple targets with Solar ignitions generates an Orb of Power.',
		element: EElementId.Solar,
		bonuses: [{ stat: EArmorStatId.Resilience, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/9de7766c9c9b56b75bde1054e3eefb1a.jpg',
		hash: 1051276350,
	},
	[EFragmentId.EmberOfSearing]: {
		id: EFragmentId.EmberOfSearing,
		name: 'Ember of Searing',
		description: 'Defeating scorched targets grants melee energy.',
		element: EElementId.Solar,
		bonuses: [{ stat: EArmorStatId.Recovery, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/7312346d93dc0e84d46e539a10aebb52.jpg',
		hash: 1051276351,
	},
	// NEGATIVE
	[EFragmentId.EmberOfBenevolence]: {
		id: EFragmentId.EmberOfBenevolence,
		name: 'Ember of Benevolence',
		description:
			'Applying restoration, cure, or radiant to allies grants increased grenade, melee, and class ability regeneration for a short duration.',
		element: EElementId.Solar,
		bonuses: [{ stat: EArmorStatId.Discipline, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/0b5cf537c6ad5d80cbdd3675d0e7134d.jpg',
		hash: 362132292,
	},
	[EFragmentId.EmberOfEmpyrean]: {
		id: EFragmentId.EmberOfEmpyrean,
		name: 'Ember of Empyrean',
		description:
			'Solar weapon or ability final blows extend the duration of restoration and radiant effects applied to you.',
		element: EElementId.Solar,
		bonuses: [{ stat: EArmorStatId.Resilience, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/be99d52c12f9359fc948b4563f74e712.jpg',
		hash: 362132294,
	},
	[EFragmentId.EmberOfTempering]: {
		id: EFragmentId.EmberOfTempering,
		name: 'Ember of Tempering',
		description:
			'Solar weapon final blows grant you and your allies increased recovery for a short duration. Stacks 3 times.\n' +
			'While Ember of Tempering is active, your weapons have increased airborne effectiveness.',
		element: EElementId.Solar,
		bonuses: [{ stat: EArmorStatId.Recovery, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/cddc93648f0917dc8bd6663d38d7c379.jpg',
		hash: 362132290,
	},
	// NEUTRAL
	[EFragmentId.EmberOfAshes]: {
		id: EFragmentId.EmberOfAshes,
		name: 'Ember of Ashes',
		description: 'You apply more scorch stacks to targets.',
		element: EElementId.Solar,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/82203cd4545f6dccc3b231d138664ecd.jpg',
		hash: 1051276349,
	},
	[EFragmentId.EmberOfSingeing]: {
		id: EFragmentId.EmberOfSingeing,
		name: 'Ember of Singeing',
		description: 'Your class ability recharges faster when you scorch targets.',
		element: EElementId.Solar,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c9e392abb5417ecab2dccd85fe23c00f.jpg',
		hash: 362132293,
	},
	[EFragmentId.EmberOfSolace]: {
		id: EFragmentId.EmberOfSolace,
		name: 'Ember of Solace',
		description:
			'Radiant and restoration effects applied to you have increased duration.',
		element: EElementId.Solar,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fb46711e0dff2bc2f55c21271e838fe2.jpg',
		hash: 362132300,
	},
	[EFragmentId.EmberOfTorches]: {
		id: EFragmentId.EmberOfTorches,
		name: 'Ember of Torches',
		description:
			'Powered melee attacks against combatants make you and nearby allies radiant.',
		element: EElementId.Solar,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1ef2e34dad0d52c762ed96e8c932dc38.jpg',
		hash: 362132288,
	},
	[EFragmentId.EmberOfBlistering]: {
		id: EFragmentId.EmberOfBlistering,
		name: 'Ember of Blistering',
		description:
			'Defeating targets with Solar ignitions grants grenade energy.',
		element: EElementId.Solar,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/52dc6ef9a4b0642e36551542b3a2936e.jpg',
		hash: 362132301,
	},

	/*** ARC ***/
	// POSITIVE
	[EFragmentId.SparkOfBrilliance]: {
		id: EFragmentId.SparkOfBrilliance,
		name: 'Spark of Brilliance',
		description:
			'Defeating a blinded target with precision damage creates a blinding explosion.',
		element: EElementId.Arc,
		bonuses: [{ stat: EArmorStatId.Intellect, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c96a87c59c94489d372fd952699bc221.jpg',
		hash: 3277705905,
	},
	[EFragmentId.SparkOfFeedback]: {
		id: EFragmentId.SparkOfFeedback,
		name: 'Spark of Feedback',
		description:
			'Taking melee damage briefly increases your outgoing melee damage.',
		element: EElementId.Arc,
		bonuses: [{ stat: EArmorStatId.Resilience, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/af2131cbee6e59c247ac063d89d2ab9a.jpg',
		hash: 3277705907,
	},
	[EFragmentId.SparkOfVolts]: {
		id: EFragmentId.SparkOfVolts,
		name: 'Spark of Volts',
		description: 'Finishers make you amplified.',
		element: EElementId.Arc,
		bonuses: [{ stat: EArmorStatId.Recovery, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/77e0281c6537838e182329c84ff77f1a.jpg',
		hash: 3277705904,
	},
	[EFragmentId.SparkOfResistance]: {
		id: EFragmentId.SparkOfResistance,
		name: 'Spark of Resistance',
		description:
			'While surrounded by combatants, you are more resistant to incoming damage.',
		element: EElementId.Arc,
		bonuses: [{ stat: EArmorStatId.Strength, value: 10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/30757f1ce4023d7aff2d6b7f65221916.jpg',
		hash: 1727069366,
	},
	// NEGATIVE
	[EFragmentId.SparkOfDischarge]: {
		id: EFragmentId.SparkOfDischarge,
		name: 'Spark of Discharge',
		description:
			'Arc weapon final blows have a chance to create an Ionic Trace.',
		element: EElementId.Arc,
		bonuses: [{ stat: EArmorStatId.Strength, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/bba280442340b4aaad92c0948745865e.jpg',
		hash: 1727069362,
	},
	[EFragmentId.SparkOfFocus]: {
		id: EFragmentId.SparkOfFocus,
		name: 'Spark of Focus',
		description:
			'After sprinting for a short time, your class ability regeneration is increased.',
		element: EElementId.Arc,
		bonuses: [{ stat: getDestinyClassAbilityStat, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fced4c09d825339ad7cae3e9f5e821ca.jpg',
		hash: 1727069360,
	},
	[EFragmentId.SparkOfShock]: {
		id: EFragmentId.SparkOfShock,
		name: 'Spark of Shock',
		description: 'Your Arc grenades jolt targets.',
		element: EElementId.Arc,
		bonuses: [{ stat: EArmorStatId.Discipline, value: -10 }],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/db029ae0f6a374deb0fe7de4468ec1ba.jpg',
		hash: 1727069364,
	},
	// NEUTRAL
	[EFragmentId.SparkOfAmplitude]: {
		id: EFragmentId.SparkOfAmplitude,
		name: 'Spark of Amplitude',
		description:
			'Rapidly defeating targets while you are amplified creates an Orb of Power.',
		element: EElementId.Arc,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b8f972ce6d63a48b8533652090fd9966.jpg',
		hash: 3277705906,
	},
	[EFragmentId.SparkOfBeacons]: {
		id: EFragmentId.SparkOfBeacons,
		name: 'Spark of Beacons',
		description:
			'When the player is amplified, Arc special weapon kills create a blinding explosion.',
		element: EElementId.Arc,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/70277aba7cb9f53c2771651a6d67eb6d.jpg',
		hash: 1727069367,
	},
	[EFragmentId.SparkOfFrequency]: {
		id: EFragmentId.SparkOfFrequency,
		name: 'Spark of Frequency',
		description:
			'Melee hits greatly increase your reload speed for a short duration',
		element: EElementId.Arc,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a2284206fa7f64f2b759d7a6ab0b30f2.jpg',
		hash: 1727069361,
	},
	[EFragmentId.SparkOfIons]: {
		id: EFragmentId.SparkOfIons,
		name: 'Spark of Ions',
		description: 'Defeating a jolted target creates an Ionic Trace.',
		element: EElementId.Arc,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/a5fcd930857f55a26be897ebe970876c.jpg',
		hash: 1727069363,
	},
	[EFragmentId.SparkOfMagnitude]: {
		id: EFragmentId.SparkOfMagnitude,
		name: 'Spark of Magnitude',
		description:
			'Your lingering Arc grenades (Lightning Grenade, Pulse Grenade, and Storm Grenade) have extended duration.',
		element: EElementId.Arc,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1f1bf91b93b3acddbc56ade6d48300b7.jpg',
		hash: 1727069374,
	},
	[EFragmentId.SparkOfMomentum]: {
		id: EFragmentId.SparkOfMomentum,
		name: 'Spark of Momentum',
		description:
			'Sliding over ammo will reload your weapon and grant a small amount of melee energy. Sliding over Heavy ammo increases the amount of energy granted.',
		element: EElementId.Arc,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/9d29b48dd38c57d65dc2fb38406faf37.jpg',
		hash: 1727069365,
	},
	[EFragmentId.SparkOfRecharge]: {
		id: EFragmentId.SparkOfRecharge,
		name: 'Spark of Recharge',
		description:
			'While critically wounded, your melee and grenade energy regenerates more quickly.',
		element: EElementId.Arc,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/cf0315c1051a75b37620efa79d5a8719.jpg',
		hash: 1727069375,
	},
	[EFragmentId.SparkOfVolts]: {
		id: EFragmentId.SparkOfVolts,
		name: 'Spark of Volts',
		description: 'Finishers make you amplified.',
		element: EElementId.Arc,
		bonuses: [],
		icon: 'https://www.bungie.net/common/destiny2_content/icons/77e0281c6537838e182329c84ff77f1a.jpg',
		hash: 3277705904,
	},
};

export const getFragment = (id: EFragmentId): IFragment =>
	FragmentIdToFragmentMapping[id];

/****** Extra *****/
const ElementIdToFragmentIdMapping: EnumDictionary<EElementId, EFragmentId[]> =
	{
		[EElementId.Stasis]: [
			EFragmentId.WhisperOfBonds,
			EFragmentId.WhisperOfChains,
			EFragmentId.WhisperOfConduction,
			EFragmentId.WhisperOfDurance,
			EFragmentId.WhisperOfFissures,
			EFragmentId.WhisperOfFractures,
			EFragmentId.WhisperOfHedrons,
			EFragmentId.WhisperOfHunger,
			EFragmentId.WhisperOfImpetus,
			EFragmentId.WhisperOfRefraction,
			EFragmentId.WhisperOfRending,
			EFragmentId.WhisperOfRime,
			EFragmentId.WhisperOfShards,
			EFragmentId.WhisperOfTorment,
		],
		[EElementId.Void]: [
			EFragmentId.EchoOfDilation,
			EFragmentId.EchoOfDomineering,
			EFragmentId.EchoOfExchange,
			EFragmentId.EchoOfExpulsion,
			EFragmentId.EchoOfHarvest,
			EFragmentId.EchoOfInstability,
			EFragmentId.EchoOfLeeching,
			EFragmentId.EchoOfObscurity,
			EFragmentId.EchoOfProvision,
			EFragmentId.EchoOfRemnants,
			EFragmentId.EchoOfReprisal,
			EFragmentId.EchoOfPersistence,
			EFragmentId.EchoOfStarvation,
			EFragmentId.EchoOfUndermining,
		],
		[EElementId.Solar]: [
			EFragmentId.EmberOfAshes,
			EFragmentId.EmberOfBeams,
			EFragmentId.EmberOfBenevolence,
			EFragmentId.EmberOfBlistering,
			EFragmentId.EmberOfChar,
			EFragmentId.EmberOfCombustion,
			EFragmentId.EmberOfEmpyrean,
			EFragmentId.EmberOfEruption,
			EFragmentId.EmberOfSearing,
			EFragmentId.EmberOfSingeing,
			EFragmentId.EmberOfSolace,
			EFragmentId.EmberOfTempering,
			EFragmentId.EmberOfTorches,
			EFragmentId.EmberOfWonder,
		],
		[EElementId.Arc]: [
			EFragmentId.SparkOfAmplitude,
			EFragmentId.SparkOfBeacons,
			EFragmentId.SparkOfBrilliance,
			EFragmentId.SparkOfDischarge,
			EFragmentId.SparkOfFeedback,
			EFragmentId.SparkOfFocus,
			EFragmentId.SparkOfFrequency,
			EFragmentId.SparkOfIons,
			EFragmentId.SparkOfMagnitude,
			EFragmentId.SparkOfMomentum,
			EFragmentId.SparkOfRecharge,
			EFragmentId.SparkOfResistance,
			EFragmentId.SparkOfShock,
			EFragmentId.SparkOfVolts,
		],
		// TODO: Refactor this type so that we don't need to include the "Any" id here. It makes
		// no sense for fragments
		[EElementId.Any]: [],
	};

export const getFragmentIdsByElementId = (id: EElementId): EFragmentId[] =>
	ElementIdToFragmentIdMapping[id];

export const ElementIdToFragmentMapping: EnumDictionary<
	EElementId,
	IFragment[]
> = {
	[EElementId.Stasis]: getFragmentIdsByElementId(EElementId.Stasis).map((id) =>
		getFragment(id)
	),
	[EElementId.Void]: getFragmentIdsByElementId(EElementId.Void).map((id) =>
		getFragment(id)
	),
	[EElementId.Solar]: getFragmentIdsByElementId(EElementId.Solar).map((id) =>
		getFragment(id)
	),
	[EElementId.Arc]: getFragmentIdsByElementId(EElementId.Any).map((id) =>
		getFragment(id)
	),
	// TODO: Refactor this type so that we don't need to include the "Any" id here. It makes
	// no sense for fragments
	[EElementId.Any]: [],
};
