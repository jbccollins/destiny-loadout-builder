import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EModId } from '@dlb/generated/mod/EModId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { ELoadoutOptimizationType } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import { ArmorItem } from './Armor';
import { ArmorStatMapping, getDefaultArmorStatMapping } from './ArmorStat';
import { EDestinyClassId, EDestinySubclassId } from './IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	getDefaultArmorSlotIdToModIdListMapping,
} from './Mod';

export enum ELoadoutType {
	DIM = 'DIM',
	InGame = 'InGame',
}

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
};

export type AnalysisResults = Record<
	string,
	{
		optimizationTypes: ELoadoutOptimizationType[];
	}
>;

export type AnalyzableLoadout = {
	armor: ArmorItem[];
	id: string;
	loadoutType: ELoadoutType;
	icon: string;
	name?: string;
	armorStatMods: EModId[];
} & DLBConfig;

export type AnalyzableLoadoutMapping = Record<string, AnalyzableLoadout>;

export type AnalyzableLoadoutBreakdown = {
	validLoadouts: AnalyzableLoadoutMapping;
	invalidLoadouts: AnalyzableLoadoutMapping;
};

export const getDefaultAnalyzableLoadout = (): AnalyzableLoadout => ({
	exoticHash: 0,
	armor: [],
	desiredStatTiers: getDefaultArmorStatMapping(),
	armorSlotMods: getDefaultArmorSlotIdToModIdListMapping(),
	id: null,
	name: null,
	loadoutType: ELoadoutType.DIM,
	icon: null,
	destinyClassId: null,
	destinySubclassId: null,
	classAbilityId: null,
	jumpId: null,
	superAbilityId: null,
	meleeId: null,
	grenadeId: null,
	aspectIdList: [],
	fragmentIdList: [],
	armorStatMods: [],
});

export const getDefaultAnalyzableLoadoutBreakdown =
	(): AnalyzableLoadoutBreakdown => ({
		validLoadouts: {},
		invalidLoadouts: {},
	});
