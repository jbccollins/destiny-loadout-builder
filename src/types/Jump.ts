import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { JumpIdToJumpMapping } from '@dlb/generated/jump/JumpMapping';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { EDestinySubclassId } from './IdEnums';
import { IJump } from './generation';
import { EnumDictionary } from './globals';

export const JumpIdList = Object.values(EJumpId);

export const getJump = (id: EJumpId): IJump => JumpIdToJumpMapping[id];

const JumpHashToJumpIdMapping = generateHashToIdMapping(JumpIdToJumpMapping);

export const getJumpByHash = (hash: number): IJump => {
	return JumpIdToJumpMapping[JumpHashToJumpIdMapping[hash]];
};

/****** Extra *****/
// TODO: Move this right on to the subclass object
const DestinySubclassIdToJumpIdListMapping: EnumDictionary<
	EDestinySubclassId,
	EJumpId[]
> = {
	// Hunter
	[EDestinySubclassId.Revenant]: [
		EJumpId.HighJumpStasis,
		EJumpId.TripleJumpStasis,
		EJumpId.StrafeJumpStasis,
	],
	[EDestinySubclassId.Nightstalker]: [
		EJumpId.HighJumpVoid,
		EJumpId.TripleJumpVoid,
		EJumpId.StrafeJumpVoid,
	],
	[EDestinySubclassId.Gunslinger]: [
		EJumpId.HighJumpSolar,
		EJumpId.TripleJumpSolar,
		EJumpId.StrafeJumpSolar,
	],
	[EDestinySubclassId.Arcstrider]: [
		EJumpId.HighJumpArc,
		EJumpId.TripleJumpArc,
		EJumpId.StrafeJumpArc,
		EJumpId.BlinkArc,
	],
	[EDestinySubclassId.Threadrunner]: [
		EJumpId.HighJumpStrand,
		EJumpId.TripleJumpStrand,
		EJumpId.StrafeJumpStrand,
	],
	[EDestinySubclassId.PrismHunter]: [
		EJumpId.HighJumpPrismHunter,
		EJumpId.TripleJumpPrismHunter,
		EJumpId.StrafeJumpPrismHunter,
		EJumpId.BlinkPrismHunter
	],

	//Warlock
	[EDestinySubclassId.Shadebinder]: [
		EJumpId.BurstGlideStasis,
		EJumpId.StrafeGlideStasis,
		EJumpId.BalancedGlideStasis,
	],
	[EDestinySubclassId.Voidwalker]: [
		EJumpId.BurstGlideVoid,
		EJumpId.StrafeGlideVoid,
		EJumpId.BalancedGlideVoid,
		EJumpId.BlinkVoid,
	],
	[EDestinySubclassId.Dawnblade]: [
		EJumpId.BurstGlideSolar,
		EJumpId.StrafeGlideSolar,
		EJumpId.BalancedGlideSolar,
	],
	[EDestinySubclassId.Stormcaller]: [
		EJumpId.BurstGlideArc,
		EJumpId.StrafeGlideArc,
		EJumpId.BalancedGlideArc,
	],
	[EDestinySubclassId.Broodweaver]: [
		EJumpId.BurstGlideStrand,
		EJumpId.StrafeGlideStrand,
		EJumpId.BalancedGlideStrand,
	],
	[EDestinySubclassId.PrismWarlock]: [
		EJumpId.BurstGlidePrismWarlock,
		EJumpId.StrafeGlidePrismWarlock,
		EJumpId.BalancedGlidePrismWarlock,
		EJumpId.BlinkPrismWarlock,
	],

	// Titan
	[EDestinySubclassId.Behemoth]: [
		EJumpId.HighLiftStasis,
		EJumpId.CatapultLiftStasis,
		EJumpId.StrafeLiftStasis,
	],
	[EDestinySubclassId.Sentinel]: [
		EJumpId.HighLiftVoid,
		EJumpId.CatapultLiftVoid,
		EJumpId.StrafeLiftVoid,
	],
	[EDestinySubclassId.Sunbreaker]: [
		EJumpId.HighLiftSolar,
		EJumpId.CatapultLiftSolar,
		EJumpId.StrafeLiftSolar,
	],
	[EDestinySubclassId.Striker]: [
		EJumpId.HighLiftArc,
		EJumpId.CatapultLiftArc,
		EJumpId.StrafeLiftArc,
	],
	[EDestinySubclassId.Berserker]: [
		EJumpId.HighLiftStrand,
		EJumpId.CatapultLiftStrand,
		EJumpId.StrafeLiftStrand,
	],
	[EDestinySubclassId.PrismTitan]: [
		EJumpId.HighLiftPrismTitan,
		EJumpId.CatapultLiftPrismTitan,
		EJumpId.StrafeLiftPrismTitan,
	],
};

export const getJumpIdsByDestinySubclassId = (
	id: EDestinySubclassId
): EJumpId[] => DestinySubclassIdToJumpIdListMapping[id];
