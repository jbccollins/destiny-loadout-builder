import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { EModId } from '@dlb/generated/mod/EModId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { SelectedAspects } from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { SelectedClassAbility } from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { SelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { SelectedGrenade } from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { SelectedJump } from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { SelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { SelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import {
	ArmorStatMapping,
	getArmorStatMappingFromFragments,
} from '@dlb/types/ArmorStat';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getFragment } from '@dlb/types/Fragment';
import {
	EDestinyClassId,
	EDestinySubclassId,
	EElementId,
} from '@dlb/types/IdEnums';
import { ArmorSlotIdToModIdListMapping } from '@dlb/types/Mod';

export type GetDlbLoadoutConfigurationParams = {
	desiredArmorStats: ArmorStatMapping;
	selectedDestinyClass: EDestinyClassId;
	selectedFragments: SelectedFragments;
	selectedDestinySubclass: Record<EDestinyClassId, EDestinySubclassId>;
	selectedArmorSlotMods: ArmorSlotIdToModIdListMapping;
	selectedRaidMods: EModId[];
	selectedExoticArmor: Record<EDestinyClassId, AvailableExoticArmorItem>;
	selectedJump: SelectedJump;
	selectedMelee: SelectedMelee;
	selectedGrenade: SelectedGrenade;
	selectedClassAbility: SelectedClassAbility;
	selectedSuperAbility: SelectedSuperAbility;
	selectedAspects: SelectedAspects;
	sharedLoadoutConfigStatPriorityOrder: number[];
};
export const getDlbLoadoutConfiguration = ({
	desiredArmorStats,
	selectedDestinyClass,
	selectedFragments,
	selectedDestinySubclass,
	selectedArmorSlotMods,
	selectedRaidMods,
	selectedExoticArmor,
	selectedJump,
	selectedMelee,
	selectedGrenade,
	selectedClassAbility,
	selectedSuperAbility,
	selectedAspects,
	sharedLoadoutConfigStatPriorityOrder,
}: GetDlbLoadoutConfigurationParams): DlbLoadoutConfiguration | null => {
	try {
		const exoticArmor = selectedExoticArmor[selectedDestinyClass];
		const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
		let elementId: EElementId = EElementId.Any;
		if (destinySubclassId) {
			elementId = getDestinySubclass(destinySubclassId).elementId;
		}
		const aspectIds: EAspectId[] = destinySubclassId
			? selectedAspects[destinySubclassId]
			: [];

		// TODO: Having to do this cast sucks
		const fragmentIds =
			elementId !== EElementId.Any
				? (selectedFragments[elementId] as EFragmentId[])
				: [];

		const fragmentArmorStatMappings: Partial<
			Record<EFragmentId, ArmorStatMapping>
		> = {};
		fragmentIds.forEach((id) => {
			const { bonuses } = getFragment(id);
			if (bonuses.length > 0) {
				fragmentArmorStatMappings[id] = getArmorStatMappingFromFragments(
					[id],
					selectedDestinyClass
				);
			}
		});
		return {
			rml: selectedRaidMods,
			asm: selectedArmorSlotMods,
			fl: fragmentIds,
			al: aspectIds,
			e: exoticArmor.hash,
			dsc: destinySubclassId,
			dc: selectedDestinyClass,
			j: selectedJump[destinySubclassId],
			m: selectedMelee[destinySubclassId],
			s: selectedSuperAbility[destinySubclassId],
			c: selectedClassAbility[destinySubclassId],
			g: selectedGrenade[elementId],
			das: desiredArmorStats,
			spo: sharedLoadoutConfigStatPriorityOrder,
		};
	} catch (e) {
		console.error(e);
		return null;
	}
};

export type DlbLoadoutConfiguration = {
	dc: EDestinyClassId; // destinyClassId
	dsc: EDestinySubclassId; // destinySubclassId
	al: EAspectId[]; // aspectIdList
	fl: EFragmentId[]; // fragmentIdList
	s: ESuperAbilityId; // superAbilityId
	j: EJumpId; // jumpId
	g: EGrenadeId; // grenadeId
	m: EMeleeId; // meleeId
	c: EClassAbilityId; // classAbilityId
	e: number; // exoticArmorHash
	rml: EModId[]; // raidModIdList
	asm: ArmorSlotIdToModIdListMapping; // armorSlotMods
	das: ArmorStatMapping; // desiredArmorStats
	spo: number[]; // sharedLoadoutConfigStatPriorityOrder
};

const generateDlbLink = (configuration: DlbLoadoutConfiguration): string => {
	const url = `${window.location.origin}/?loadout=${encodeURIComponent(
		JSON.stringify(configuration)
	)}`;
	return url;
};

export default generateDlbLink;
