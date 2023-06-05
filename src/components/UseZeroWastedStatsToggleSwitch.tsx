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
				title={'Only show builds with zero wasted stats'}
				onChange={handleChange}
				value={useZeroWastedStats}
			/>
		</Box>
	);
}