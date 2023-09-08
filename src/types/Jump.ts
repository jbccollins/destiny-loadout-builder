import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { JumpIdToJumpMapping } from '@dlb/generated/jump/JumpMapping';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { IJump } from './generation';
import { EnumDictionary } from './globals';
import { EDestinySubclassId } from './IdEnums';

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
};

export const getJumpIdsByDestinySubclassId = (
	id: EDestinySubclassId
): EJumpId[] => DestinySubclassIdToJumpIdListMapping[id];
