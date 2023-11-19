import {
	selectUseZeroWastedStats,
	setUseZeroWastedStats,
} from '@dlb/redux/features/useZeroWastedStats/useZeroWastedStatsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { Box } from '@mui/material';
import ToggleSwitch from './ToggleSwitch';

export default function UseZeroWastedStatsToggleSwitch() {
	const useZeroWastedStats = useAppSelector(selectUseZeroWastedStats);
	const dispatch = useAppDispatch();
	const handleChange = (value: boolean) => {
		dispatch(setUseZeroWastedStats(value));
	};
	return (
		<Box sx={{ paddingLeft: '8px' }}>
			<ToggleSwitch
				title={'Force zero wasted stats'}
				onChange={handleChange}
				value={useZeroWastedStats}
				helpText={
					'If enabled, only builds where every stat ends in 0 will be considered. This will frequently lead to fewer results and lower possible stat tiers. This is an aesthetic choice that some players like.'
				}
			/>
		</Box>
	);
}
