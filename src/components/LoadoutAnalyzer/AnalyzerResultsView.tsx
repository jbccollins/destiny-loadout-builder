import { Box } from '@mui/material';
import AnalyzerResultsList from './AnalyzerResultsList';
export default function AnalyzerResultsView() {
	return (
		<Box sx={{ height: '100vh', overflowY: 'auto', paddingTop: '16px' }}>
			<Box
				sx={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '16px' }}
			>
				Your Loadouts
			</Box>
			<AnalyzerResultsList />
		</Box>
	);
}
