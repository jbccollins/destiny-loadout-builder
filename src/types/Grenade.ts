import {
	IIdentifiableName,
	IIcon,
	IHash,
	EnumDictionary,
	StatBonus,
	MISSING_ICON,
} from './globals';
import { EElementId, EGrenadeId } from './IdEnums';

export const GrenadeIdList = Object.values(EGrenadeId);

export interface IGrenade extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
}

const GrenadeIdToGrenadeMapping: EnumDictionary<EGrenadeId, IGrenade> = {
	// Stasis
	[EGrenadeId.Glacier]: {
		id: EGrenadeId.Glacier,
		name: 'Glacier Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Stasis,
	},
	[EGrenadeId.Coldsnap]: {
		id: EGrenadeId.Coldsnap,
		name: 'Coldsnap Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Stasis,
	},
	[EGrenadeId.Duskfield]: {
		id: EGrenadeId.Duskfield,
		name: 'Duskfield Grenad',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Stasis,
	},
	// Void
	[EGrenadeId.Vortex]: {
		id: EGrenadeId.Vortex,
		name: 'Vortex Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Void,
	},
	[EGrenadeId.VoidSpike]: {
		id: EGrenadeId.VoidSpike,
		name: 'Void Spike',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Void,
	},
	[EGrenadeId.VoidWall]: {
		id: EGrenadeId.VoidWall,
		name: 'Void Wall',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Void,
	},
	[EGrenadeId.Supressor]: {
		id: EGrenadeId.Supressor,
		name: 'Supressor Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Void,
	},
	[EGrenadeId.Scatter]: {
		id: EGrenadeId.Scatter,
		name: 'Scatter Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Void,
	},
	[EGrenadeId.AxionBolt]: {
		id: EGrenadeId.AxionBolt,
		name: 'Axion Bolt',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Void,
	},
	[EGrenadeId.Magnetic]: {
		id: EGrenadeId.Magnetic,
		name: 'Magnetic Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Void,
	},
	// Solar
	[EGrenadeId.Thermite]: {
		id: EGrenadeId.Thermite,
		name: 'Thermite Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Solar,
	},
	[EGrenadeId.Swarm]: {
		id: EGrenadeId.Swarm,
		name: 'Swarm Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Solar,
	},
	[EGrenadeId.Solar]: {
		id: EGrenadeId.Solar,
		name: 'Solar Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Solar,
	},
	[EGrenadeId.Incendiary]: {
		id: EGrenadeId.Incendiary,
		name: 'Incendiary Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Solar,
	},
	[EGrenadeId.Tripmine]: {
		id: EGrenadeId.Tripmine,
		name: 'Tripmine Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Solar,
	},
	[EGrenadeId.Fusion]: {
		id: EGrenadeId.Fusion,
		name: 'Fusion Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Solar,
	},
	[EGrenadeId.Firebolt]: {
		id: EGrenadeId.Firebolt,
		name: 'Firebolt Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Solar,
	},
	[EGrenadeId.Healing]: {
		id: EGrenadeId.Healing,
		name: 'Healing Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Solar,
	},
	// Arc
	[EGrenadeId.Pulse]: {
		id: EGrenadeId.Pulse,
		name: 'Pulse Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Arc,
	},
	[EGrenadeId.Skip]: {
		id: EGrenadeId.Skip,
		name: 'Skip Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Arc,
	},
	[EGrenadeId.Flashbang]: {
		id: EGrenadeId.Flashbang,
		name: 'Flashbang Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Arc,
	},
	[EGrenadeId.Storm]: {
		id: EGrenadeId.Storm,
		name: 'Storm Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Arc,
	},
	[EGrenadeId.Lightning]: {
		id: EGrenadeId.Lightning,
		name: 'Lightning Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Arc,
	},
	[EGrenadeId.Flux]: {
		id: EGrenadeId.Flux,
		name: 'Flux Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Arc,
	},
	[EGrenadeId.Arcbolt]: {
		id: EGrenadeId.Arcbolt,
		name: 'Arcbolt Grenade',
		hash: 12345,
		description: 'asdf',
		icon: MISSING_ICON,
		elementId: EElementId.Arc,
	},
};

export const getGrenade = (id: EGrenadeId): IGrenade =>
	GrenadeIdToGrenadeMapping[id];

/****** Extra *****/
const ElementIdToGrenadeIdListMapping: EnumDictionary<
	EElementId,
	EGrenadeId[]
> = {
	[EElementId.Stasis]: [
		EGrenadeId.Glacier,
		EGrenadeId.Coldsnap,
		EGrenadeId.Duskfield,
	],
	[EElementId.Void]: [
		EGrenadeId.Vortex,
		EGrenadeId.VoidSpike,
		EGrenadeId.VoidWall,
		EGrenadeId.Supressor,
		EGrenadeId.Scatter,
		EGrenadeId.AxionBolt,
		EGrenadeId.Magnetic,
	],
	[EElementId.Solar]: [
		EGrenadeId.Thermite,
		EGrenadeId.Swarm,
		EGrenadeId.Solar,
		EGrenadeId.Incendiary,
		EGrenadeId.Tripmine,
		EGrenadeId.Fusion,
		EGrenadeId.Firebolt,
		EGrenadeId.Healing,
	],
	[EElementId.Arc]: [
		EGrenadeId.Pulse,
		EGrenadeId.Skip,
		EGrenadeId.Flashbang,
		EGrenadeId.Storm,
		EGrenadeId.Lightning,
		EGrenadeId.Flux,
		EGrenadeId.Arcbolt,
	],
	// TODO: Refactor this type so that we don't need to include the "Any" id here. It makes
	// no sense for grenades
	[EElementId.Any]: [],
};

export const getGrenadeIdsByElementId = (id: EElementId): EGrenadeId[] =>
	ElementIdToGrenadeIdListMapping[id];

// export const ElementIdToGrenadetMapping: EnumDictionary<
// 	EElementId,
// 	IGrenade[]
// > = {
// 	[EElementId.Stasis]: getGrenadeIdsByElementId(EElementId.Stasis).map((id) =>
// 		getGrenade(id)
// 	),
// 	[EElementId.Void]: getGrenadeIdsByElementId(EElementId.Void).map((id) =>
// 		getGrenade(id)
// 	),
// 	[EElementId.Solar]: getGrenadeIdsByElementId(EElementId.Solar).map((id) =>
// 		getGrenade(id)
// 	),
// 	[EElementId.Arc]: getGrenadeIdsByElementId(EElementId.Any).map((id) =>
// 		getGrenade(id)
// 	),
// 	// TODO: Refactor this type so that we don't need to include the "Any" id here. It makes
// 	// no sense for grenades
// 	[EElementId.Any]: [],
// };
