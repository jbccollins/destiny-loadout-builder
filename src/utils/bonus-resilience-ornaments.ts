import { EDestinyClassId } from '@dlb/types/IdEnums';

const TitanBonusResilienceOrnamentHash = 4245469491;
const WarlockBonusResilienceOrnamentHash = 2287277682;
const HunterBonusResilienceOrnamentHash = 2978747767;

const BonusResilienceOrnamentsMapping = {
	[TitanBonusResilienceOrnamentHash]: 1, // Titan
	[WarlockBonusResilienceOrnamentHash]: 1, // Warlock
	[HunterBonusResilienceOrnamentHash]: 1, // Hunter
};

const DestinyClassIdToBonusResilienceOrnamentHashMapping = {
	[EDestinyClassId.Titan]: TitanBonusResilienceOrnamentHash,
	[EDestinyClassId.Warlock]: WarlockBonusResilienceOrnamentHash,
	[EDestinyClassId.Hunter]: HunterBonusResilienceOrnamentHash,
};

export const hasBonusResilienceOrnament = (hash: number) =>
	!!BonusResilienceOrnamentsMapping[hash];

export const getBonusResilienceOrnamentHashByDestinyClassId = (
	classId: EDestinyClassId
) => DestinyClassIdToBonusResilienceOrnamentHashMapping[classId];

export type BonusResilienceOrnament = {
	hash: number;
	destinyClassId: EDestinyClassId;
	icon: string;
	name: string;
};

const BonusResilienceOrnamentHashToBonusResilienceOrnamentMapping: Record<
	number,
	BonusResilienceOrnament
> = {
	[TitanBonusResilienceOrnamentHash]: {
		hash: TitanBonusResilienceOrnamentHash,
		destinyClassId: EDestinyClassId.Titan,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/90d70a3b9f6f6910a311d4f90bc23b9c.jpg',
		name: 'Solstice Plate (Rekindled)',
	},
	[WarlockBonusResilienceOrnamentHash]: {
		hash: WarlockBonusResilienceOrnamentHash,
		destinyClassId: EDestinyClassId.Warlock,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e2c5ae437a2bd6cd9d4da30f4169043a.jpg',
		name: 'Solstice Robes (Rekindled)',
	},
	[HunterBonusResilienceOrnamentHash]: {
		hash: HunterBonusResilienceOrnamentHash,
		destinyClassId: EDestinyClassId.Hunter,
		icon: 'https://www.bungie.net/common/destiny2_content/icons/bebd7e58794515d4f2196092ac43841f.jpg',
		name: 'Solstice Vest (Rekindled)',
	},
};

export const getBonusResilienceOrnamentByHash = (hash: number) =>
	BonusResilienceOrnamentHashToBonusResilienceOrnamentMapping[hash] || null;

export const getBonusResilienceOrnamentByDestinyClassId = (
	destinyClassId: EDestinyClassId
) =>
	getBonusResilienceOrnamentByHash(
		getBonusResilienceOrnamentHashByDestinyClassId(destinyClassId)
	);
