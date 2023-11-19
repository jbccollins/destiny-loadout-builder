import {
	selectExcludeLockedItems,
	setExcludeLockedItems,
} from '@dlb/redux/features/excludeLockedItems/excludeLockedItemsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { Box } from '@mui/material';
import ToggleSwitch from './ToggleSwitch';

export default function ExcludeLockedItemsToggleSwitch() {
	const excludeLockedItems = useAppSelector(selectExcludeLockedItems);
	const dispatch = useAppDispatch();
	const handleChange = (value: boolean) => {
		dispatch(setExcludeLockedItems(value));
	};
	return (
		<Box sx={{ paddingLeft: '8px' }}>
			<ToggleSwitch
				title={'Exclude locked items'}
				onChange={handleChange}
				value={excludeLockedItems}
				helpText={
					'If enabled, items that are locked in-game will be excluded from results.'
				}
			/>
		</Box>
	);
}
