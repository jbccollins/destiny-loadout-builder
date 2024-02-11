import {
	selectUseBetaDimLinks,
	setUseBetaDimLinks,
} from '@dlb/redux/features/useBetaDimLinks/useBetaDimLinksSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { Box } from '@mui/material';
import ToggleSwitch from './ToggleSwitch';

export default function UseBetaDimLinksToggleSwitch() {
	const useBetaDimLinks = useAppSelector(selectUseBetaDimLinks);
	const dispatch = useAppDispatch();
	const handleChange = (value: boolean) => {
		dispatch(setUseBetaDimLinks(value));
	};
	return (
		<Box sx={{ paddingLeft: '8px' }}>
			<ToggleSwitch
				title={'Use Beta DIM links'}
				onChange={handleChange}
				value={useBetaDimLinks}
				helpText={
					'If enabled, links to DIM will use the beta version of DIM. If disabled, links to DIM will use the stable version of DIM.'
				}
			/>
		</Box>
	);
}
