import {
	selectDesiredArmorStats,
	setDesiredArmorStats
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ArmorStats, EArmorStat } from '@dlb/services/data';
import { styled, Card, Box } from '@mui/material';
import { useEffect } from 'react';
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
		value: 10,
		label: '10'
	},
	{
		value: 20,
		label: '20'
	},
	{
		value: 30,
		label: '30'
	},
	{
		value: 40,
		label: '40'
	},
	{
		value: 50,
		label: '50'
	},
	{
		value: 60,
		label: '60'
	},
	{
		value: 70,
		label: '70'
	},
	{
		value: 80,
		label: '80'
	},
	{
		value: 90,
		label: '90'
	},
	{
		value: 100,
		label: '100'
	}
];

function StatSelection(props: StatSelectionProps) {
	const dispatch = useAppDispatch();
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);

	function handleSliderChange(statName: EArmorStat, value: number) {
		if (desiredArmorStats && desiredArmorStats[statName] === value) {
			// Don't trigger a redux dirty
			return;
		}
		dispatch(setDesiredArmorStats({ ...desiredArmorStats, [statName]: value }));
	}

	// This is a bit hacky but it's just here to ensure that we dirty the uuid for desiredArmorStats
	useEffect(() => {
		dispatch(setDesiredArmorStats(desiredArmorStats));
	}, []);

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
							getAriaValueText={valuetext}
							valueLabelDisplay="off"
							value={desiredArmorStats[statName]}
							step={10}
							size="medium"
							marks={marks}
							min={0}
							max={100}
						/>
					</SliderWrapper>
				);
			})}
		</Container>
	);
}

export default StatSelection;
