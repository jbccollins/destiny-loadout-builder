import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { SuperAbilityIdToSuperAbilityMapping } from '@dlb/generated/superAbility/SuperAbilityMapping';
import { ISuperAbility } from './generation';
import { EnumDictionary } from './globals';
import { EDestinySubclassId } from './IdEnums';

// Order does not matter here
export const SuperAbilityIdList = Object.values(ESuperAbilityId);

export const getSuperAbility = (id: ESuperAbilityId): ISuperAbility =>
	SuperAbilityIdToSuperAbilityMapping[id];
