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
			raidModIdList: selectedRaidMods,
			armorSlotMods: selectedArmorSlotMods,
			fragmentIdList: fragmentIds,
			aspectIdList: aspectIds,
			exoticArmor: exoticArmor,
			destinySubclassId,
			destinyClassId: selectedDestinyClass,
			jumpId: selectedJump[destinySubclassId],
			meleeId: selectedMelee[destinySubclassId],
			superAbilityId: selectedSuperAbility[destinySubclassId],
			classAbilityId: selectedClassAbility[destinySubclassId],
			grenadeId: selectedGrenade[elementId],
			desiredArmorStats,
		};
	} catch (e) {
		console.error(e);
		return null;
	}
};

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
