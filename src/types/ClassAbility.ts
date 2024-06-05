import { ClassAbilityIdToClassAbilityMapping } from '@dlb/generated/classAbility/ClassAbilityMapping';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { EDestinySubclassId } from './IdEnums';
import { IClassAbility } from './generation';
import { EnumDictionary } from './globals';

export const ClassAbilityIdList = Object.values(EClassAbilityId);

export const getClassAbility = (id: EClassAbilityId): IClassAbility =>
	ClassAbilityIdToClassAbilityMapping[id];

const ClassAbilityHashToClassAbilityIdMapping = generateHashToIdMapping(
	ClassAbilityIdToClassAbilityMapping
);

export const getClassAbilityByHash = (hash: number): IClassAbility => {
	return ClassAbilityIdToClassAbilityMapping[
		ClassAbilityHashToClassAbilityIdMapping[hash]
	];
};

/****** Extra *****/
// TODO: Move this into the actual subclass defs like super is
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
	[EDestinySubclassId.Threadrunner]: [
		EClassAbilityId.MarksmansDodgeStrand,
		EClassAbilityId.GamblersDodgeStrand,
	],
	[EDestinySubclassId.PrismHunter]: [
		EClassAbilityId.MarksmansDodgePrism,
		EClassAbilityId.GamblersDodgePrism,
		EClassAbilityId.AcrobatsDodgePrism,
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
	[EDestinySubclassId.Broodweaver]: [
		EClassAbilityId.HealingRiftStrand,
		EClassAbilityId.EmpoweringRiftStrand,
	],
	[EDestinySubclassId.PrismWarlock]: [
		EClassAbilityId.HealingRiftPrism,
		EClassAbilityId.EmpoweringRiftPrism,
		EClassAbilityId.PhoenixDivePrism,
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
	[EDestinySubclassId.Berserker]: [
		EClassAbilityId.ToweringBarricadeStrand,
		EClassAbilityId.RallyBarricadeStrand,
	],
	[EDestinySubclassId.PrismTitan]: [
		EClassAbilityId.ToweringBarricadePrism,
		EClassAbilityId.RallyBarricadePrism,
		EClassAbilityId.ThrusterPrism,
	],
};

export const getClassAbilityIdsByDestinySubclassId = (
	id: EDestinySubclassId
): EClassAbilityId[] => DestinySubclassIdToClassAbilityIdListMapping[id];
