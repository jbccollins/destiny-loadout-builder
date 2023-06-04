import DimLoadoutsFilterSelector from '@dlb/components/DimLoadoutsFilterSelector';
import InGameLoadoutsFilterSelector from '@dlb/components/InGameLoadoutsFilterSelector';
import UseZeroWastedStatsToggleSwitch from '@dlb/components/UseZeroWastedStatsToggleSwitch';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { selectDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectDimLoadoutsFilter } from '@dlb/redux/features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import { selectInGameLoadoutsFilter } from '@dlb/redux/features/inGameLoadoutsFilter/inGameLoadoutsFilterSlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { selectSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { selectSelectedRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { selectUseZeroWastedStats } from '@dlb/redux/features/useZeroWastedStats/useZeroWastedStatsSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { ArmorStatIdList } from '@dlb/types/ArmorStat';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getFragment } from '@dlb/types/Fragment';
import {
	EDimLoadoutsFilterId,
	EInGameLoadoutsFilterId,
} from '@dlb/types/IdEnums';
import { Box, styled } from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
	margin: 'auto',
	width: '50%',
	minWidth: '300px',
	maxWidth: '550px',
	//border: '3px solid green',
	padding: theme.spacing(3),
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
	const useZeroWastedStats = useAppSelector(selectUseZeroWastedStats);
	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const dimLoadoutsFilterId = useAppSelector(selectDimLoadoutsFilter);
	const inGameLoadoutsFilterId = useAppSelector(selectInGameLoadoutsFilter);
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];

	const hasRaidMods = selectedRaidMods.some((modId) => modId !== null);
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
		hasDesiredArmorStats || hasRaidMods || hasFragmentsWithStatPenalties;

	const hasSettingsToModify =
		useZeroWastedStats ||
		dimLoadoutsFilterId === EDimLoadoutsFilterId.None ||
		inGameLoadoutsFilterId === EInGameLoadoutsFilterId.None;

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
								{hasRaidMods && <li>Remove raid mods</li>}
							</ul>
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
