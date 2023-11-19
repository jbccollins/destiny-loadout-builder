"use client";

import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import {
	selectDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectMaxPossibleStats } from '@dlb/redux/features/maxPossibleStats/maxPossibleStatsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import { EArmorStatId } from '@dlb/types/IdEnums';
import { Box, styled } from '@mui/material';
import StatSelectorRow from './StatSelectorRow';

type StatSelectionProps = {
	//
};

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
		label: '1',
	},
	{
		value: 20,
		label: '2',
	},
	{
		value: 30,
		label: '3',
	},
	{
		value: 40,
		label: '4',
	},
	{
		value: 50,
		label: '5',
	},
	{
		value: 60,
		label: '6',
	},
	{
		value: 70,
		label: '7',
	},
	{
		value: 80,
		label: '8',
	},
	{
		value: 90,
		label: '9',
	},
	{
		value: 100,
		label: '10',
	},
];

function StatSelection(props: StatSelectionProps) {
	const dispatch = useAppDispatch();
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);
	const maxPossibleStats = useAppSelector(selectMaxPossibleStats);

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
						<StatSelectorRow
							maxPossible={maxPossibleStats[armorStatId]}
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
