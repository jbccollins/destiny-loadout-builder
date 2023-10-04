import DimLoadoutsFilterSelector from '@dlb/components/DimLoadoutsFilterSelector';
import InGameLoadoutsFilterSelector from '@dlb/components/InGameLoadoutsFilterSelector';
import UseZeroWastedStatsToggleSwitch from '@dlb/components/UseZeroWastedStatsToggleSwitch';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { selectAlwaysConsiderCollectionsRolls } from '@dlb/redux/features/alwaysConsiderCollectionsRolls/alwaysConsiderCollectionsRollsSlice';
import { selectDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectDimLoadoutsFilter } from '@dlb/redux/features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import { selectInGameLoadoutsFilter } from '@dlb/redux/features/inGameLoadoutsFilter/inGameLoadoutsFilterSlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { selectSelectedIntrinsicArmorPerkOrAttributeIds } from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import { selectSelectedRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { selectUseBonusResilience } from '@dlb/redux/features/useBonusResilience/useBonusResilienceSlice';
import { selectUseZeroWastedStats } from '@dlb/redux/features/useZeroWastedStats/useZeroWastedStatsSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { ArmorStatIdList } from '@dlb/types/ArmorStat';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getFragment } from '@dlb/types/Fragment';
import {
	EArmorSlotId,
	EDimLoadoutsFilterId,
	EInGameLoadoutsFilterId,
	EIntrinsicArmorPerkOrAttributeId,
} from '@dlb/types/IdEnums';
import { Box, styled } from '@mui/material';
import AlwaysConsiderCollectionsRollsToggleSwitch from '../AlwaysConsiderCollectionsRollsToggleSwitch';
import UseBonusResilienceToggleSwitch from '../UseBonusResilienceToggleSwitch';

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
	const alwaysConsiderCollectionsRolls = useAppSelector(
		selectAlwaysConsiderCollectionsRolls
	);
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
		const { elementId } = getDestinySubclass(destinySubclassId);
		const fragments: EFragmentId[] = selectedFragments[elementId];
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
		withUseBonusResilience ||
		useZeroWastedStats ||
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
								{withUseBonusResilience && (
									<li>
										<UseBonusResilienceToggleSwitch />
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
							</ul>
						</>
					)}
				</Content>
			</Container>
		</>
	);
}

export default NoResults;
