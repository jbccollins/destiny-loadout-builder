// We should be able to completely populate the redux store from this config

import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EModId } from '@dlb/generated/mod/EModId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { ArmorStatMapping } from './ArmorStat';
import { EDestinyClassId, EDestinySubclassId } from './IdEnums';
import { ArmorSlotIdToModIdListMapping } from './Mod';

// We should be able to completely populate the redux store from this config
// such that using the tool "just works"
export type DLBConfig = {
	classAbilityId: EClassAbilityId;
	jumpId: EJumpId;
	superAbilityId: ESuperAbilityId;
	meleeId: EMeleeId;
	grenadeId: EGrenadeId;
	aspectIdList: EAspectId[];
	fragmentIdList: EFragmentId[];
	desiredStatTiers: ArmorStatMapping;
	destinyClassId: EDestinyClassId;
	destinySubclassId: EDestinySubclassId;
	exoticHash: number;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: [EModId, EModId, EModId, EModId];
};
