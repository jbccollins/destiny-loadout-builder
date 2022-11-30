import {
	selectDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import { EArmorStatId } from '@dlb/types/IdEnums';
import { styled, Card, Box } from '@mui/material';
import { useEffect } from 'react';
import StatSelectorRow from './StatSelectorRow';
import StatSlider from './StatSlider';

type StatSelectionProps = {
	locked: boolean;
};

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(1),
}));

const SliderWrapper = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
}));
const SliderTitle = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
}));

function valuetext(value: number) {
	return `Tier ${value}`;
}

export type Mark = {
	value: number;
	label: string;
};

const marks: Mark[] = [
	{
		value: 0,
		label: '0',
	},
	{
		value: 10,
		label: '10',
	},
	{
		value: 20,
		label: '20',
	},
	{
		value: 30,
		label: '30',
	},
	{
		value: 40,
		label: '40',
	},
	{
		value: 50,
		label: '50',
	},
	{
		value: 60,
		label: '60',
	},
	{
		value: 70,
		label: '70',
	},
	{
		value: 80,
		label: '80',
	},
	{
		value: 90,
		label: '90',
	},
	{
		value: 100,
		label: '100',
	},
];

function StatSelection(props: StatSelectionProps) {
	const dispatch = useAppDispatch();
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);

	function handleChange(statName: EArmorStatId, value: number) {
		if (desiredArmorStats && desiredArmorStats[statName] === value) {
			// Don't trigger a redux dirty
			return;
		}
		dispatch(setDesiredArmorStats({ ...desiredArmorStats, [statName]: value }));
	}

	return (
		<Container>
			{ArmorStatIdList.map((armorStatId) => {
				const { name } = getArmorStat(armorStatId);
				return (
					<SliderWrapper key={armorStatId}>
						<SliderTitle>{name}</SliderTitle>
						{/* <StatSlider
							onChange={(_, value) =>
								handleChange(armorStatId, value as number)
							}
							locked
							aria-label="Tier"
							getAriaValueText={valuetext}
							valueLabelDisplay="off"
							value={desiredArmorStats[armorStatId]}
							step={10}
							size="medium"
							marks={marks}
							min={0}
							max={100}
						/> */}
						<StatSelectorRow
							value={desiredArmorStats[armorStatId]}
							marks={marks}
							onChange={(value) => handleChange(armorStatId, value)}
						/>
					</SliderWrapper>
				);
			})}
		</Container>
	);
}

export default StatSelection;
