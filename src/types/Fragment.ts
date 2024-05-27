import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { FragmentIdToFragmentMapping } from '@dlb/generated/fragment/FragmentMapping';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { getDestinySubclass } from './DestinySubclass';
import { EDestinySubclassId, EElementId } from './IdEnums';
import { IFragment } from './generation';
import { EnumDictionary } from './globals';

export const FragmentIdList = Object.values(EFragmentId);

export const getFragment = (id: EFragmentId): IFragment =>
	FragmentIdToFragmentMapping[id];

const FragmentHashToFragmentIdMapping = generateHashToIdMapping(
	FragmentIdToFragmentMapping
);

export const getFragmentByHash = (hash: number): IFragment => {
	return FragmentIdToFragmentMapping[FragmentHashToFragmentIdMapping[hash]];
};

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
			EFragmentId.EchoOfCessation,
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
			EFragmentId.EchoOfVigilance,
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
			EFragmentId.EmberOfMercy,
			EFragmentId.EmberOfResolve,
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
			EFragmentId.SparkOfHaste,
			EFragmentId.SparkOfInstinct,
			EFragmentId.SparkOfIons,
			EFragmentId.SparkOfMagnitude,
			EFragmentId.SparkOfMomentum,
			EFragmentId.SparkOfRecharge,
			EFragmentId.SparkOfResistance,
			EFragmentId.SparkOfShock,
			EFragmentId.SparkOfVolts,
		],
		[EElementId.Strand]: [
			EFragmentId.ThreadOfAscent,
			EFragmentId.ThreadOfBinding,
			EFragmentId.ThreadOfContinuity,
			EFragmentId.ThreadOfEvolution,
			EFragmentId.ThreadOfFinality,
			EFragmentId.ThreadOfFury,
			EFragmentId.ThreadOfGeneration,
			EFragmentId.ThreadOfIsolation,
			EFragmentId.ThreadOfMind,
			EFragmentId.ThreadOfPropagation,
			EFragmentId.ThreadOfRebirth,
			EFragmentId.ThreadOfTransmutation,
			EFragmentId.ThreadOfWarding,
			EFragmentId.ThreadOfWisdom,
		],
		[EElementId.Prismatic]: [EFragmentId.FakeBoi],
		// TODO: Refactor this type so that we don't need to include the "Any" id here. It makes
		// no sense for fragments
		[EElementId.Any]: [],
	};

const getFragmentIdListByElementId = (elementId: EElementId): EFragmentId[] =>
	ElementIdToFragmentIdMapping[elementId];

export const getFragmentIdListByDestinySubclassId = (
	destinySubclassId: EDestinySubclassId
): EFragmentId[] => {
	if (!destinySubclassId) {
		return [];
	}
	const { elementId } = getDestinySubclass(destinySubclassId);
	return getFragmentIdListByElementId(elementId);
};
