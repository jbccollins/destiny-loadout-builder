import useIsSmallScreen from '@dlb/hooks/useIsSmallScreen';
import { selectIsRunningProcessArmorWebWorker } from '@dlb/redux/features/isRunningProcessArmorWebWorker/isRunningProcessArmorWebWorkerSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { Box } from '@mui/material';

export default function IsRunningWebWorkerMessage() {
	const isRunningProcessArmorWebWorker = useAppSelector(
		selectIsRunningProcessArmorWebWorker
	);

	const isSmallScreen = useIsSmallScreen();

	if (!isRunningProcessArmorWebWorker || !isSmallScreen) {
		return null;
	}

	return (
		<Box
			sx={{
				zIndex: 1000,
				padding: '10px',
				position: 'fixed',
				top: '8px',
				left: '50%',
				paddingLeft: '16px',
				paddingRight: '16px',
				transform: 'translateX(-50%)',
				backgroundColor: '#2b2b2b',
				borderRadius: '5px',
				border: '1px solid white',
			}}
		>
			Processing...
		</Box>
	);
}
