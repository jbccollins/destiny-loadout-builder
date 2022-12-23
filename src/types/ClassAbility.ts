import { ClassAbilityIdToClassAbilityMapping } from '@dlb/generated/classAbility/ClassAbilityMapping';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { IClassAbility } from './generation';
import { EnumDictionary } from './globals';
import { EDestinySubclassId } from './IdEnums';

export const ClassAbilityIdList = Object.values(EClassAbilityId);

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
		EClassAbilityId.AcrobatsDodgeSolar,
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
		EClassAbilityId.PhoenixDiveSolar,
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
		EClassAbilityId.ThrusterArc,
	],
};

export const getClassAbilityIdsByDestinySubclassId = (
	id: EDestinySubclassId
): EClassAbilityId[] => DestinySubclassIdToClassAbilityIdListMapping[id];
