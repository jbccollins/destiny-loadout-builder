"use client";

import {
	selectUseOnlyMasterworkedArmor,
	setUseOnlyMasterworkedArmor,
} from '@dlb/redux/features/useOnlyMasterworkedArmor/useOnlyMasterworkedArmorSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { Box } from '@mui/material';
import ToggleSwitch from './ToggleSwitch';

export default function UseOnlyMasterworkedArmorToggleSwitch() {
	const useOnlyMasterworkedArmor = useAppSelector(
		selectUseOnlyMasterworkedArmor
	);
	const dispatch = useAppDispatch();
	const handleChange = (value: boolean) => {
		dispatch(setUseOnlyMasterworkedArmor(value));
	};
	return (
		<Box sx={{ paddingLeft: '8px' }}>
			<ToggleSwitch
				title={'Only use masterworked armor'}
				onChange={handleChange}
				value={useOnlyMasterworkedArmor}
				helpText={
					'If enabled, builds will only use armor that has been masterworked. This will frequently lead to fewer results and lower possible stat tiers.'
				}
			/>
		</Box>
	);
}
