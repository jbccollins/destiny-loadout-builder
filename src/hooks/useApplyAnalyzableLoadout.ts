import {
	clearDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { setPerformingBatchUpdate } from '@dlb/redux/features/performingBatchUpdate/performingBatchUpdateSlice';
import { clearReservedArmorSlotEnergy } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	clearArmorSlotMods,
	setSelectedArmorSlotMods,
} from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import {
	clearSelectedAspects,
	selectSelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	clearSelectedClassAbility,
	selectSelectedClassAbility,
	setSelectedClassAbility,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { setSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import {
	clearSelectedDestinySubclass,
	selectSelectedDestinySubclass,
	setSelectedDestinySubclass,
} from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import {
	selectSelectedExoticArmor,
	setSelectedExoticArmor,
} from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import {
	clearSelectedFragments,
	setSelectedFragmentsForDestinySubclass,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import {
	clearSelectedGrenade,
	selectSelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import {
	clearSelectedIntrinsicArmorPerkOrAttributeIds,
	getDefaultIntrinsicArmorPerkOrAttributeIdList,
	setSelectedIntrinsicArmorPerkOrAttributeIds,
} from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import {
	clearSelectedJump,
	selectSelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import {
	clearSelectedMelee,
	selectSelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import {
	clearSelectedRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	clearSelectedSuperAbility,
	selectSelectedSuperAbility,
	setSelectedSuperAbility,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { setTabIndex } from '@dlb/redux/features/tabIndex/tabIndexSlice';
import { setUseBonusResilience } from '@dlb/redux/features/useBonusResilience/useBonusResilienceSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { AnalyzableLoadout } from '@dlb/types/AnalyzableLoadout';
import { EIntrinsicArmorPerkOrAttributeId } from '@dlb/types/IdEnums';
import useFlatAvailableExoticArmor from './useFlatAvailableExoticArmor';

export default function useApplyAnalyzableLoadout() {
	const dispatch = useAppDispatch();
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedJump = useAppSelector(selectSelectedJump);
	const flatAvailableExoticArmor = useFlatAvailableExoticArmor();

	const clearApplicationState = () => {
		dispatch(clearDesiredArmorStats());
		dispatch(clearArmorSlotMods());
		dispatch(clearSelectedRaidMods());
		dispatch(clearSelectedIntrinsicArmorPerkOrAttributeIds());
		dispatch(clearReservedArmorSlotEnergy());
		dispatch(clearSelectedDestinySubclass());
		dispatch(clearSelectedSuperAbility());
		dispatch(clearSelectedAspects());
		dispatch(clearSelectedFragments());
		dispatch(clearSelectedGrenade());
		dispatch(clearSelectedMelee());
		dispatch(clearSelectedClassAbility());
		dispatch(clearSelectedJump());
		dispatch(setTabIndex(0));
	};
	const callback = (
		loadout: AnalyzableLoadout,
		applyDesiredStatTiers: boolean
	) => {
		if (!loadout) {
			throw new Error('wtf');
		}
		dispatch(setPerformingBatchUpdate(true));
		clearApplicationState();
		const {
			exoticHash,
			destinyClassId,
			destinySubclassId,
			aspectIdList,
			fragmentIdList,
			superAbilityId,
			classAbilityId,
			jumpId,
			grenadeId,
			meleeId,
			desiredStatTiers,
			armorSlotMods,
			raidMods,
		} = loadout;

		const newSelectedExoticArmor = { ...selectedExoticArmor };

		if (exoticHash) {
			newSelectedExoticArmor[destinyClassId] = flatAvailableExoticArmor.find(
				(x) => x.hash === exoticHash
			);
			dispatch(setSelectedExoticArmor(newSelectedExoticArmor));
		}
		dispatch(setSelectedDestinyClass(destinyClassId));
		if (applyDesiredStatTiers) {
			dispatch(setDesiredArmorStats(desiredStatTiers));
		}
		dispatch(setSelectedArmorSlotMods(armorSlotMods));
		dispatch(setSelectedRaidMods(raidMods));

		if (destinySubclassId) {
			dispatch(
				setSelectedDestinySubclass({
					...selectedDestinySubclass,
					[destinyClassId]: destinySubclassId,
				})
			);
			if (superAbilityId) {
				dispatch(
					setSelectedSuperAbility({
						...selectedSuperAbility,
						[destinySubclassId]: superAbilityId,
					})
				);
			}
			if (aspectIdList.length > 0) {
				dispatch(
					setSelectedAspects({
						...selectedAspects,
						[destinySubclassId]: [0, 1].map((i) => aspectIdList[i] || null),
					})
				);
			}
			if (fragmentIdList.length > 0) {
				dispatch(
					setSelectedFragmentsForDestinySubclass({
						destinySubclassId,
						fragments: fragmentIdList,
					})
				);
			}
			if (grenadeId) {
				dispatch(
					setSelectedGrenade({
						...selectedGrenade,
						[destinySubclassId]: grenadeId,
					})
				);
			}
			if (meleeId) {
				dispatch(
					setSelectedMelee({
						...selectedMelee,
						[destinySubclassId]: meleeId,
					})
				);
			}
			if (classAbilityId) {
				dispatch(
					setSelectedClassAbility({
						...selectedClassAbility,
						[destinySubclassId]: classAbilityId,
					})
				);
			}
			if (jumpId) {
				dispatch(
					setSelectedJump({
						...selectedJump,
						[destinySubclassId]: jumpId,
					})
				);
			}
		}

		if (loadout.hasBonusResilienceOrnament) {
			dispatch(setUseBonusResilience(true));
		}
		if (loadout.hasHalloweenMask) {
			const newSelectedIntrinsicArmorPerkOrAttributeIds =
				getDefaultIntrinsicArmorPerkOrAttributeIdList();
			newSelectedIntrinsicArmorPerkOrAttributeIds[0] =
				EIntrinsicArmorPerkOrAttributeId.HalloweenMask;
			dispatch(
				setSelectedIntrinsicArmorPerkOrAttributeIds(
					newSelectedIntrinsicArmorPerkOrAttributeIds
				)
			);
		}
		dispatch(setTabIndex(0));
		dispatch(setPerformingBatchUpdate(false));
	};
	return callback;
}
