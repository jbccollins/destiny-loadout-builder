import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { GrenadeIdToGrenadeMapping } from '@dlb/generated/grenade/GrenadeMapping';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { getDestinySubclass } from './DestinySubclass';
import { IGrenade } from './generation';
import { EnumDictionary } from './globals';
import { EDestinySubclassId, EElementId } from './IdEnums';

export const GrenadeIdList = Object.values(EGrenadeId);

export const getGrenade = (id: EGrenadeId): IGrenade =>
	GrenadeIdToGrenadeMapping[id];

const GrenadeHashToGrenadeIdMapping = generateHashToIdMapping(
	GrenadeIdToGrenadeMapping
);

export const getGrenadeByHash = (hash: number): IGrenade => {
	return GrenadeIdToGrenadeMapping[GrenadeHashToGrenadeIdMapping[hash]];
};
/****** Extra *****/
const ElementIdToGrenadeIdListMapping: EnumDictionary<
	EElementId,
	EGrenadeId[]
> = {
	[EElementId.Stasis]: [
		EGrenadeId.GlacierGrenade,
		EGrenadeId.ColdsnapGrenade,
		EGrenadeId.DuskfieldGrenade,
	],
	[EElementId.Void]: [
		EGrenadeId.VortexGrenade,
		EGrenadeId.VoidSpike,
		EGrenadeId.VoidWall,
		EGrenadeId.SuppressorGrenade,
		EGrenadeId.ScatterGrenade,
		EGrenadeId.AxionBolt,
		EGrenadeId.MagneticGrenade,
	],
	[EElementId.Solar]: [
		EGrenadeId.ThermiteGrenade,
		EGrenadeId.SwarmGrenade,
		EGrenadeId.SolarGrenade,
		EGrenadeId.IncendiaryGrenade,
		EGrenadeId.TripmineGrenade,
		EGrenadeId.FusionGrenade,
		EGrenadeId.FireboltGrenade,
		EGrenadeId.HealingGrenade,
	],
	[EElementId.Arc]: [
		EGrenadeId.PulseGrenade,
		EGrenadeId.SkipGrenade,
		EGrenadeId.FlashbangGrenade,
		EGrenadeId.StormGrenade,
		EGrenadeId.LightningGrenade,
		EGrenadeId.FluxGrenade,
		EGrenadeId.ArcboltGrenade,
	],
	[EElementId.Strand]: [
		EGrenadeId.Grapple,
		EGrenadeId.ShackleGrenade,
		EGrenadeId.ThreadlingGrenade,
	],
	// TODO: Refactor this type so that we don't need to include the "Any" id here. It makes
	// no sense for grenades
	[EElementId.Any]: [],
};

const getGrenadeIdListByElementId = (id: EElementId): EGrenadeId[] =>
	ElementIdToGrenadeIdListMapping[id];

export const getGrenadeIdListByDestinySubclassId = (
	destinySubclassId: EDestinySubclassId
): EGrenadeId[] => {
	if (!destinySubclassId) {
		return [];
	}
	const { elementId } = getDestinySubclass(destinySubclassId);
	return getGrenadeIdListByElementId(elementId);
};
