import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { SuperAbilityIdToSuperAbilityMapping } from '@dlb/generated/superAbility/SuperAbilityMapping';
import { ISuperAbility } from './generation';

// Order does not matter here
export const SuperAbilityIdList = Object.values(ESuperAbilityId);

export const getSuperAbility = (id: ESuperAbilityId): ISuperAbility =>
	SuperAbilityIdToSuperAbilityMapping[id];

export const getSuperAbilityByHash = (hash: number): ISuperAbility => {
	return Object.values(SuperAbilityIdToSuperAbilityMapping).find(
		(x) => x.hash === hash
	);
};
