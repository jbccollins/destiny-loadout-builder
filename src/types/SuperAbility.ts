import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { SuperAbilityIdToSuperAbilityMapping } from '@dlb/generated/superAbility/SuperAbilityMapping';
import generateHashToIdMapping from '@dlb/utils/generateHashToIdMapping';
import { ISuperAbility } from './generation';

// Order does not matter here
export const SuperAbilityIdList = Object.values(ESuperAbilityId);

export const getSuperAbility = (id: ESuperAbilityId): ISuperAbility =>
	SuperAbilityIdToSuperAbilityMapping[id];

const SuperAbilityHashToSuperAbilityIdMapping = generateHashToIdMapping(
	SuperAbilityIdToSuperAbilityMapping
);

export const getSuperAbilityByHash = (hash: number): ISuperAbility => {
	return SuperAbilityIdToSuperAbilityMapping[
		SuperAbilityHashToSuperAbilityIdMapping[hash]
	];
};
