import AlwaysConsiderCollectionsRollsToggleSwitch from '@dlb/components/AlwaysConsiderCollectionsRollsToggleSwitch';
import DimLoadoutsFilterSelector from '@dlb/components/DimLoadoutsFilterSelector';
import InGameLoadoutsFilterSelector from '@dlb/components/InGameLoadoutsFilterSelector';
import UseBonusResilienceToggleSwitch from '@dlb/components/UseBonusResilienceToggleSwitch';
import UseOnlyMasterworkedArmorToggleSwitch from '@dlb/components/UseOnlyMasterworkedArmorToggleSwitch';
import UseZeroWastedStatsToggleSwitch from '@dlb/components/UseZeroWastedStatsToggleSwitch';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { selectAlwaysConsiderCollectionsRolls } from '@dlb/redux/features/alwaysConsiderCollectionsRolls/alwaysConsiderCollectionsRollsSlice';
import { selectDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectDimLoadoutsFilter } from '@dlb/redux/features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import { selectExcludeLockedItems } from '@dlb/redux/features/excludeLockedItems/excludeLockedItemsSlice';
import { selectInGameLoadoutsFilter } from '@dlb/redux/features/inGameLoadoutsFilter/inGameLoadoutsFilterSlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedExoticArtificeAssumption } from '@dlb/redux/features/selectedExoticArtificeAssumption/selectedExoticArtificeAssumptionSlice';
import { selectSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { selectSelectedIntrinsicArmorPerkOrAttributeIds } from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import { selectSelectedMasterworkAssumption } from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import { selectSelectedRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { selectUseBonusResilience } from '@dlb/redux/features/useBonusResilience/useBonusResilienceSlice';
import { selectUseOnlyMasterworkedArmor } from '@dlb/redux/features/useOnlyMasterworkedArmor/useOnlyMasterworkedArmorSlice';
import { selectUseZeroWastedStats } from '@dlb/redux/features/useZeroWastedStats/useZeroWastedStatsSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { ArmorStatIdList } from '@dlb/types/ArmorStat';
import { getFragment } from '@dlb/types/Fragment';
import {
	EArmorSlotId,
	EDimLoadoutsFilterId,
	EExoticArtificeAssumption,
	EInGameLoadoutsFilterId,
	EIntrinsicArmorPerkOrAttributeId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import { Box, styled } from '@mui/material';
import ExcludeLockedItemsToggleSwitch from '../ExcludeLockedItemsToggleSwitch';
import ExoticArtificeAssumptionSelector from '../ExoticArtificeAssumptionSelector';
import MasterworkAssumptionSelector from '../MasterworkAssumptionSelector';

const Container = styled(Box)(({ theme }) => ({
	margin: 'auto',
	width: '100%',
	// minWidth: '300px',
	maxWidth: '475px',
	//border: '3px solid green',
	//padding: theme.spacing(3),
	height: `calc(100% - 160px)`,
	position: 'relative',
}));

const Content = styled(Box)(({ theme }) => ({
	//border: '3px solid red',
	padding: theme.spacing(3),
	height: `calc(100% - 160px)`,
	position: 'relative',
}));

const Title = styled(Box)(({ theme }) => ({
	fontSize: '2rem',
	fontWeight: 'bold',
}));
const Subtitle = styled(Box)(({ theme }) => ({
	fontSize: '1.2rem',
	fontWeight: 'bold',
}));

function NoResults() {
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const useZeroWastedStats = useAppSelector(selectUseZeroWastedStats);
	const useBonusResilience = useAppSelector(selectUseBonusResilience);
	const useOnlyMasterworkedArmor = useAppSelector(
		selectUseOnlyMasterworkedArmor
	);
	const alwaysConsiderCollectionsRolls = useAppSelector(
		selectAlwaysConsiderCollectionsRolls
	);
	const excludeLockedItems = useAppSelector(selectExcludeLockedItems);
	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const dimLoadoutsFilterId = useAppSelector(selectDimLoadoutsFilter);
	const inGameLoadoutsFilterId = useAppSelector(selectInGameLoadoutsFilter);
	const selectedIntrinsicArmorPerkOrAttributeIds = useAppSelector(
		selectSelectedIntrinsicArmorPerkOrAttributeIds
	);
	const masterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	const exoticArtificeAssumption = useAppSelector(
		selectSelectedExoticArtificeAssumption
	);

	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];

	const hasRaidMods = selectedRaidMods.some((modId) => modId !== null);
	const hasIntrinsicArmorPerkOrAttributes =
		selectedIntrinsicArmorPerkOrAttributeIds.some((id) => id !== null);
	const hasFotlMaskAndExoticHelmet =
		selectedIntrinsicArmorPerkOrAttributeIds.includes(
			EIntrinsicArmorPerkOrAttributeId.HalloweenMask
		) &&
		selectedExoticArmor[selectedDestinyClass].armorSlot === EArmorSlotId.Head;
	let hasDesiredArmorStats = false;
	for (let i = 0; i < ArmorStatIdList.length; i++) {
		const statId = ArmorStatIdList[i];
		if (desiredArmorStats[statId] > 0) {
			hasDesiredArmorStats = true;
			break;
		}
	}
	let hasFragmentsWithStatPenalties = false;
	// TODO: Memoize this stuff
	if (destinySubclassId) {
		const fragments: EFragmentId[] = selectedFragments[destinySubclassId];
		hasFragmentsWithStatPenalties = fragments.some((fragmentId) => {
			const { bonuses } = getFragment(fragmentId);
			return bonuses.some((bonus) => bonus.value < 0);
		});
	}

	const hasOptionsToModify =
		hasDesiredArmorStats ||
		hasRaidMods ||
		hasFragmentsWithStatPenalties ||
		hasIntrinsicArmorPerkOrAttributes;

	// Using +1 resilience might be bad if we also
	// want zero wasted stats
	const withUseBonusResilience = !useBonusResilience || useZeroWastedStats;

	const hasSettingsToModify =
		excludeLockedItems ||
		useOnlyMasterworkedArmor ||
		withUseBonusResilience ||
		useZeroWastedStats ||
		masterworkAssumption !== EMasterworkAssumption.All ||
		exoticArtificeAssumption !== EExoticArtificeAssumption.All ||
		dimLoadoutsFilterId === EDimLoadoutsFilterId.None ||
		inGameLoadoutsFilterId === EInGameLoadoutsFilterId.None ||
		!alwaysConsiderCollectionsRolls;

	return (
		<>
			<Container>
				<Content>
					<Title>No Results</Title>
					{hasOptionsToModify && (
						<>
							<Subtitle>Try these troubleshooting steps:</Subtitle>
							<ul>
								{hasDesiredArmorStats && (
									<li>Reduce your desired stat tiers</li>
								)}
								{hasFragmentsWithStatPenalties && (
									<li>Remove fragments with stat penalties</li>
								)}
								{hasRaidMods && <li>Remove Raid Mods</li>}
								{hasIntrinsicArmorPerkOrAttributes && (
									<li>Remove Armor Attributes</li>
								)}
							</ul>
							{hasFotlMaskAndExoticHelmet && (
								<Box sx={{ color: '#ff4f2b' }}>
									{`You have selected the "Festival of the Lost Mask" armor
										attribute and an exotic helmet. This is not supported. Either
										select a different exotic armor slot or clear the
										"Festival of the Lost Mask" armor attribute selection.`}
								</Box>
							)}
						</>
					)}
					{hasSettingsToModify && (
						<>
							<Subtitle>Try changing these settings:</Subtitle>
							<ul>
								{useZeroWastedStats && (
									<li>
										<UseZeroWastedStatsToggleSwitch />
									</li>
								)}
								{!alwaysConsiderCollectionsRolls && (
									<li>
										<AlwaysConsiderCollectionsRollsToggleSwitch />
									</li>
								)}
								{useOnlyMasterworkedArmor && (
									<li>
										<UseOnlyMasterworkedArmorToggleSwitch />
									</li>
								)}
								{withUseBonusResilience && (
									<li>
										<UseBonusResilienceToggleSwitch />
									</li>
								)}
								{excludeLockedItems && (
									<li>
										<ExcludeLockedItemsToggleSwitch />
									</li>
								)}
								{dimLoadoutsFilterId === EDimLoadoutsFilterId.None && (
									<li>
										<DimLoadoutsFilterSelector />
									</li>
								)}
								{inGameLoadoutsFilterId === EInGameLoadoutsFilterId.None && (
									<li>
										<InGameLoadoutsFilterSelector />
									</li>
								)}
								{masterworkAssumption !== EMasterworkAssumption.All && (
									<li>
										<MasterworkAssumptionSelector />
									</li>
								)}
								{exoticArtificeAssumption !== EExoticArtificeAssumption.All && (
									<li
										style={{
											paddingTop: '10px',
										}}
									>
										<ExoticArtificeAssumptionSelector />
									</li>
								)}
							</ul>
						</>
					)}
				</Content>
			</Container>
		</>
	);
}

export default NoResults;
