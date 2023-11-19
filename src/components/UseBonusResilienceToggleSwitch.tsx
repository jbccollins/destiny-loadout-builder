'use client';

import {
	selectUseBonusResilience,
	setUseBonusResilience,
} from '@dlb/redux/features/useBonusResilience/useBonusResilienceSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { Box } from '@mui/material';
import ToggleSwitch from './ToggleSwitch';

export default function UseBonusResilienceToggleSwitch() {
	const useBonusResilience = useAppSelector(selectUseBonusResilience);
	const dispatch = useAppDispatch();
	const handleChange = (value: boolean) => {
		dispatch(setUseBonusResilience(value));
	};
	return (
		<Box sx={{ paddingLeft: '8px' }}>
			<ToggleSwitch
				title={'Assume +1 bonus resilience'}
				onChange={handleChange}
				value={useBonusResilience}
				helpText={
					'If enabled, builds that do not use an exotic chestpiece will have a bonus +1 resilience applied to them. To achive this bonus you must equip the blue "Solstice (Rekindled)" ornament on your chestpiece.'
				}
			/>
		</Box>
	);
}
