import {
	IIdentifiableName,
	IIcon,
	IHash,
	EnumDictionary,
	MISSING_ICON,
} from './globals';
import {
	EDestinySubclassId,
	EClassAbilityId,
	EDestinyClassId,
} from './IdEnums';

export const ClassAbilityIdList = Object.values(EClassAbilityId);

export interface IClassAbility extends IIdentifiableName, IIcon, IHash {
	description: string;
}

const ClassAbilityIdToClassAbilityMapping: EnumDictionary<
	EClassAbilityId,
	IClassAbility
> = {
	/*** Warlock ***/
	// Stasis
	[EClassAbilityId.HealingRiftStasis]: {
		id: EClassAbilityId.HealingRiftStasis,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.EmpoweringRiftStasis]: {
		id: EClassAbilityId.EmpoweringRiftStasis,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Void
	[EClassAbilityId.HealingRiftVoid]: {
		id: EClassAbilityId.HealingRiftVoid,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.EmpoweringRiftVoid]: {
		id: EClassAbilityId.EmpoweringRiftVoid,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Solar
	[EClassAbilityId.HealingRiftSolar]: {
		id: EClassAbilityId.HealingRiftSolar,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.EmpoweringRiftSolar]: {
		id: EClassAbilityId.EmpoweringRiftSolar,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.PhonenixDive]: {
		id: EClassAbilityId.PhonenixDive,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Arc
	[EClassAbilityId.HealingRiftArc]: {
		id: EClassAbilityId.HealingRiftArc,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.EmpoweringRiftArc]: {
		id: EClassAbilityId.EmpoweringRiftArc,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	/*** Titan ***/
	// Stasis
	[EClassAbilityId.ToweringBarricadeStasis]: {
		id: EClassAbilityId.ToweringBarricadeStasis,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.RallyBarricadeStasis]: {
		id: EClassAbilityId.RallyBarricadeStasis,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Void
	[EClassAbilityId.ToweringBarricadeVoid]: {
		id: EClassAbilityId.ToweringBarricadeVoid,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.RallyBarricadeVoid]: {
		id: EClassAbilityId.RallyBarricadeVoid,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Solar
	[EClassAbilityId.ToweringBarricadeSolar]: {
		id: EClassAbilityId.ToweringBarricadeSolar,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.RallyBarricadeSolar]: {
		id: EClassAbilityId.RallyBarricadeSolar,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Arc
	[EClassAbilityId.Thruster]: {
		id: EClassAbilityId.Thruster,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.ToweringBarricadeArc]: {
		id: EClassAbilityId.ToweringBarricadeArc,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.RallyBarricadeArc]: {
		id: EClassAbilityId.RallyBarricadeArc,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	/*** Hunter ***/
	// Stasis
	[EClassAbilityId.GamblersDodgeStasis]: {
		id: EClassAbilityId.GamblersDodgeStasis,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.MarksmansDodgeStasis]: {
		id: EClassAbilityId.MarksmansDodgeStasis,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Void
	[EClassAbilityId.GamblersDodgeVoid]: {
		id: EClassAbilityId.GamblersDodgeVoid,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.MarksmansDodgeVoid]: {
		id: EClassAbilityId.MarksmansDodgeVoid,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Solar
	[EClassAbilityId.GamblersDodgeSolar]: {
		id: EClassAbilityId.GamblersDodgeSolar,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.MarksmansDodgeSolar]: {
		id: EClassAbilityId.MarksmansDodgeSolar,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	// Arc
	[EClassAbilityId.GamblersDodgeArc]: {
		id: EClassAbilityId.GamblersDodgeArc,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.MarksmansDodgeArc]: {
		id: EClassAbilityId.MarksmansDodgeArc,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
	[EClassAbilityId.AcrobatsDodge]: {
		id: EClassAbilityId.AcrobatsDodge,
		name: 'asdf',
		hash: 123345,
		description: 'asdf',
		icon: MISSING_ICON,
	},
};

export const getClassAbility = (id: EClassAbilityId): IClassAbility =>
	ClassAbilityIdToClassAbilityMapping[id];

/****** Extra *****/
const DestinySubclassIdToClassAbilityIdListMapping: EnumDictionary<
	EDestinySubclassId,
	EClassAbilityId[]
> = {
	// Hunter
	[EDestinySubclassId.Revenant]: [
		EClassAbilityId.MarksmansDodgeStasis,
		EClassAbilityId.GamblersDodgeStasis,
	],
	[EDestinySubclassId.Nightstalker]: [
		EClassAbilityId.MarksmansDodgeVoid,
		EClassAbilityId.GamblersDodgeVoid,
	],
	[EDestinySubclassId.Gunslinger]: [
		EClassAbilityId.MarksmansDodgeSolar,
		EClassAbilityId.GamblersDodgeSolar,
		EClassAbilityId.AcrobatsDodge,
	],
	[EDestinySubclassId.Arcstrider]: [
		EClassAbilityId.MarksmansDodgeArc,
		EClassAbilityId.GamblersDodgeArc,
	],

	//Warlock
	[EDestinySubclassId.Shadebinder]: [
		EClassAbilityId.HealingRiftStasis,
		EClassAbilityId.EmpoweringRiftStasis,
	],
	[EDestinySubclassId.Voidwalker]: [
		EClassAbilityId.HealingRiftVoid,
		EClassAbilityId.EmpoweringRiftVoid,
	],
	[EDestinySubclassId.Dawnblade]: [
		EClassAbilityId.HealingRiftSolar,
		EClassAbilityId.EmpoweringRiftSolar,
		EClassAbilityId.PhonenixDive,
	],
	[EDestinySubclassId.Stormcaller]: [
		EClassAbilityId.HealingRiftArc,
		EClassAbilityId.EmpoweringRiftArc,
	],

	// Titan
	[EDestinySubclassId.Behemoth]: [
		EClassAbilityId.ToweringBarricadeStasis,
		EClassAbilityId.RallyBarricadeStasis,
	],
	[EDestinySubclassId.Sentinel]: [
		EClassAbilityId.ToweringBarricadeVoid,
		EClassAbilityId.RallyBarricadeVoid,
	],
	[EDestinySubclassId.Sunbreaker]: [
		EClassAbilityId.ToweringBarricadeSolar,
		EClassAbilityId.RallyBarricadeSolar,
	],
	[EDestinySubclassId.Striker]: [
		EClassAbilityId.ToweringBarricadeArc,
		EClassAbilityId.RallyBarricadeArc,
	],
};

export const getClassAbilityIdsByDestinySubclassId = (
	id: EDestinySubclassId
): EClassAbilityId[] => DestinySubclassIdToClassAbilityIdListMapping[id];
