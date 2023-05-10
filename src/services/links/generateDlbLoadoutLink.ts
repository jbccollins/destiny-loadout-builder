import { Loadout, LoadoutParameters } from '@destinyitemmanager/dim-api-types';
import {
	EArmorStatId,
	EDestinyClassId,
	EDestinySubclassId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import { getFragment } from '@dlb/types/Fragment';
import { ArmorStatMapping, getArmorStat } from '@dlb/types/ArmorStat';
import { DestinyClassIdToDestinyClassHash } from '@dlb/types/External';
import { ArmorItem, AvailableExoticArmorItem } from '@dlb/types/Armor';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getAspect } from '@dlb/types/Aspect';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { getClassAbility } from '@dlb/types/ClassAbility';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { getSuperAbility } from '@dlb/types/SuperAbility';
import { getJump } from '@dlb/types/Jump';
import { getMelee } from '@dlb/types/Melee';
import { getGrenade } from '@dlb/types/Grenade';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import { ArmorSlotIdToModIdListMapping, getMod } from '@dlb/types/Mod';
import { EModId } from '@dlb/generated/mod/EModId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';

export type DlbLoadoutConfiguration = {
	destinyClassId: EDestinyClassId;
	destinySubclassId: EDestinySubclassId;
	aspectIdList: EAspectId[];
	fragmentIdList: EFragmentId[];
	superAbilityId: ESuperAbilityId;
	jumpId: EJumpId;
	grenadeId: EGrenadeId;
	meleeId: EMeleeId;
	classAbilityId: EClassAbilityId;

	exoticArmor: AvailableExoticArmorItem;

	raidModIdList: EModId[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	desiredArmorStats: ArmorStatMapping;
};

const generateDlbLink = (configuration: DlbLoadoutConfiguration): string => {
	const url = `${window.location.origin}/?loadout=${encodeURIComponent(
		JSON.stringify(configuration)
	)}`;
	return url;
};

export default generateDlbLink;
