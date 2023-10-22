import WarningIcon from '@mui/icons-material/Warning';
import { Box, Button, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import CustomTooltip from './CustomTooltip';

function ResetButton() {
	const router = useRouter();
	const handleClick = () => {
		localStorage.clear();
		router.push('/login');
	};
	const theme = useTheme();
	return (
		<Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
			<Button variant="contained" color="secondary" onClick={handleClick}>
				Reset
			</Button>
			<CustomTooltip title="This will completely wipe all of your saved DLB settings, log you out, and do a hard reset on the saved application configuration. Do this if stuff is not working.">
				<WarningIcon sx={{ color: theme.palette.warning.main }} />
			</CustomTooltip>
		</Box>
	);
}

export default ResetButton;
