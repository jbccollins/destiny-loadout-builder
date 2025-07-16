import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import {
	selectDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectIsRunningProcessArmorWebWorker } from '@dlb/redux/features/isRunningProcessArmorWebWorker/isRunningProcessArmorWebWorkerSlice';
import { selectMaxPossibleStats } from '@dlb/redux/features/maxPossibleStats/maxPossibleStatsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import { EArmorStatId } from '@dlb/types/IdEnums';
import { Box, styled } from '@mui/material';
import StatSelectorSlider from './StatSelectorSlider';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(1),
}));

const SliderWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'noMargin',
})<{ noMargin?: boolean }>(({ theme, noMargin }) => ({
	marginTop: noMargin ? '' : '4px',
	color: theme.palette.secondary.main,
	display: 'flex',
}));

const SliderTitle = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	marginRight: '4px',
	paddingTop: '6px',
}));

export type Mark = {
	value: number;
	label: string;
};

// ...marks removed, not needed for StatSelectorSlider

function StatSelection() {
	const dispatch = useAppDispatch();
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);
	const maxPossibleStats = useAppSelector(selectMaxPossibleStats);
	const isRunningProcessArmorWebWorker = useAppSelector(
		selectIsRunningProcessArmorWebWorker
	);

	function handleChange(statName: EArmorStatId, value: number) {
		if (desiredArmorStats && desiredArmorStats[statName] === value) {
			// Don't trigger a redux dirty
			return;
		}
		dispatch(setDesiredArmorStats({ ...desiredArmorStats, [statName]: value }));
	}

	return (
		<Container>
			{ArmorStatIdList.map((armorStatId, i) => {
				const { icon } = getArmorStat(armorStatId);
				return (
					<SliderWrapper noMargin={i === 0} key={armorStatId}>
						<SliderTitle>
							<BungieImage src={icon} width={26} height={26} />
						</SliderTitle>
						<StatSelectorSlider
							maxPossible={
								isRunningProcessArmorWebWorker
									? desiredArmorStats[armorStatId]
									: maxPossibleStats[armorStatId]
							}
							value={desiredArmorStats[armorStatId]}
							onChange={(value) => handleChange(armorStatId, value)}
						/>
					</SliderWrapper>
				);
			})}
		</Container>
	);
}

export default StatSelection;
