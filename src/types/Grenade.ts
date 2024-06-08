import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { GrenadeIdToGrenadeMapping } from '@dlb/generated/grenade/GrenadeMapping';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { EDestinySubclassId } from './IdEnums';
import { IGrenade } from './generation';
import { EnumDictionary } from './globals';

export const GrenadeIdList = Object.values(EGrenadeId);

export const getGrenade = (id: EGrenadeId): IGrenade =>
	GrenadeIdToGrenadeMapping[id];

const GrenadeHashToGrenadeIdMapping = generateHashToIdMapping(
	GrenadeIdToGrenadeMapping
);

export const getGrenadeByHash = (hash: number): IGrenade => {
	return GrenadeIdToGrenadeMapping[GrenadeHashToGrenadeIdMapping[hash]];
};

const StasisGrenadeIdList: EGrenadeId[] = [
	EGrenadeId.GlacierGrenade,
	EGrenadeId.ColdsnapGrenade,
	EGrenadeId.DuskfieldGrenade,
];

const VoidGrenadeIdList: EGrenadeId[] = [
	EGrenadeId.VortexGrenade,
	EGrenadeId.VoidSpike,
	EGrenadeId.VoidWall,
	EGrenadeId.SuppressorGrenade,
	EGrenadeId.ScatterGrenade,
	EGrenadeId.AxionBolt,
	EGrenadeId.MagneticGrenade,
];

const SolarGrenadeIdList: EGrenadeId[] = [
	EGrenadeId.ThermiteGrenade,
	EGrenadeId.SwarmGrenade,
	EGrenadeId.SolarGrenade,
	EGrenadeId.IncendiaryGrenade,
	EGrenadeId.TripmineGrenade,
	EGrenadeId.FusionGrenade,
	EGrenadeId.FireboltGrenade,
	EGrenadeId.HealingGrenade,
];

const ArcGrenadeIdList: EGrenadeId[] = [
	EGrenadeId.PulseGrenade,
	EGrenadeId.SkipGrenade,
	EGrenadeId.FlashbangGrenade,
	EGrenadeId.StormGrenade,
	EGrenadeId.LightningGrenade,
	EGrenadeId.FluxGrenade,
	EGrenadeId.ArcboltGrenade,
];

const StrandGrenadeIdList: EGrenadeId[] = [
	EGrenadeId.Grapple,
	EGrenadeId.ShackleGrenade,
	EGrenadeId.ThreadlingGrenade,
];

/****** Extra *****/
const SubclassIdToGrenadeIdListMapping: EnumDictionary<
	EDestinySubclassId,
	EGrenadeId[]
> = {
	[EDestinySubclassId.Nightstalker]: VoidGrenadeIdList,
	[EDestinySubclassId.Voidwalker]: VoidGrenadeIdList,
	[EDestinySubclassId.Sentinel]: VoidGrenadeIdList,

	[EDestinySubclassId.Gunslinger]: SolarGrenadeIdList,
	[EDestinySubclassId.Dawnblade]: SolarGrenadeIdList,
	[EDestinySubclassId.Sunbreaker]: SolarGrenadeIdList,

	[EDestinySubclassId.Arcstrider]: ArcGrenadeIdList,
	[EDestinySubclassId.Stormcaller]: ArcGrenadeIdList,
	[EDestinySubclassId.Striker]: ArcGrenadeIdList,

	[EDestinySubclassId.Revenant]: StasisGrenadeIdList,
	[EDestinySubclassId.Shadebinder]: StasisGrenadeIdList,
	[EDestinySubclassId.Behemoth]: StasisGrenadeIdList,

	[EDestinySubclassId.Threadrunner]: StrandGrenadeIdList,
	[EDestinySubclassId.Broodweaver]: StrandGrenadeIdList,
	[EDestinySubclassId.Berserker]: StrandGrenadeIdList,

	[EDestinySubclassId.PrismHunter]: [
		EGrenadeId.ArcboltGrenadePrism,
		EGrenadeId.SwarmGrenadePrism,
		EGrenadeId.DuskfieldGrenadePrism,
		EGrenadeId.GrapplePrism,
		EGrenadeId.MagneticGrenadePrism,
	],

	[EDestinySubclassId.PrismTitan]: [
		EGrenadeId.PulseGrenadePrism,
		EGrenadeId.ThermiteGrenadePrism,
		EGrenadeId.GlacierGrenadePrism,
		EGrenadeId.ShackleGrenadePrism,
		EGrenadeId.SuppressorGrenadePrism,
	],

	[EDestinySubclassId.PrismWarlock]: [
		EGrenadeId.StormGrenadePrism,
		EGrenadeId.HealingGrenadePrism,
		EGrenadeId.ColdsnapGrenadePrism,
		EGrenadeId.ThreadlingGrenadePrism,
		EGrenadeId.VortexGrenadePrism,
	],
};

export const getGrenadeIdListByDestinySubclassId = (
	destinySubclassId: EDestinySubclassId
): EGrenadeId[] => SubclassIdToGrenadeIdListMapping[destinySubclassId];
