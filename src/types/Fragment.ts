import { FragmentIdToFragmentMapping } from '@dlb/generated/fragment/FragmentMapping';
import { IFragment } from './generation';
import { EnumDictionary } from './globals';
import { EArmorStatId, EFragmentId, EElementId } from './IdEnums';

export const FragmentIdList = Object.values(EFragmentId);

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
