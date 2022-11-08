import {
	selectDesiredArmorStats,
	setDesiredArmorStats
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ArmorStats, EArmorStat } from '@dlb/services/data';
import { styled, Card, Box } from '@mui/material';
import StatSlider from './StatSlider';

type StatSelectionProps = {
	locked: boolean;
};

const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3)
}));

const SliderWrapper = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main
}));
const SliderTitle = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main
}));

function valuetext(value: number) {
	return `Tier ${value}`;
}

const marks = [
	{
		value: 0,
		label: '0'
	},
	{
		value: 1,
		label: '1'
	},
	{
		value: 2,
		label: '2'
	},
	{
		value: 3,
		label: '3'
	},
	{
		value: 4,
		label: '4'
	},
	{
		value: 5,
		label: '5'
	},
	{
		value: 6,
		label: '6'
	},
	{
		value: 7,
		label: '7'
	},
	{
		value: 8,
		label: '8'
	},
	{
		value: 9,
		label: '9'
	},
	{
		value: 10,
		label: '10'
	}
];

function StatSelection(props: StatSelectionProps) {
	const dispatch = useAppDispatch();
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);

	function handleSliderChange(statName: EArmorStat, value: number) {
		dispatch(setDesiredArmorStats({ ...desiredArmorStats, [statName]: value }));
	}

	return (
		<Container>
			{ArmorStats.map((statName) => {
				return (
					<SliderWrapper key={statName}>
						<SliderTitle>{statName}</SliderTitle>
						<StatSlider
							onChange={(_, value) =>
								handleSliderChange(statName, value as number)
							}
							locked
							aria-label="Tier"
							defaultValue={2}
							getAriaValueText={valuetext}
							valueLabelDisplay="off"
							value={desiredArmorStats[statName]}
							step={1}
							size="medium"
							marks={marks}
							min={0}
							max={10}
						/>
					</SliderWrapper>
				);
			})}
		</Container>
	);
}

export default StatSelection;
