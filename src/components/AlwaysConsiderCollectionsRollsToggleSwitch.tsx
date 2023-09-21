import {
	selectAlwaysConsiderCollectionsRolls,
	setAlwaysConsiderCollectionsRolls,
} from '@dlb/redux/features/alwaysConsiderCollectionsRolls/alwaysConsiderCollectionsRollsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { Box } from '@mui/material';
import ToggleSwitch from './ToggleSwitch';

export default function AlwaysConsiderCollectionsRollsToggleSwitch() {
	const alwaysConsiderCollectionsRolls = useAppSelector(
		selectAlwaysConsiderCollectionsRolls
	);
	const dispatch = useAppDispatch();
	const handleChange = (value: boolean) => {
		dispatch(setAlwaysConsiderCollectionsRolls(value));
	};
	return (
		<Box sx={{ paddingLeft: '8px' }}>
			<ToggleSwitch
				title={'Always consider collections rolls'}
				onChange={handleChange}
				value={alwaysConsiderCollectionsRolls}
				helpText={
					'If enabled, exotic armor collections rolls will always be considered in the results. If disabled, exotic armor collections rolls will only be considered if you do not have a copy of that exotic in your inventory, vault or postmaster. This can be useful to enable when forcing zero wasted stats, or if you just have a particularly bad roll of an exotic and want to see if the collections roll is better.'
				}
			/>
		</Box>
	);
}
