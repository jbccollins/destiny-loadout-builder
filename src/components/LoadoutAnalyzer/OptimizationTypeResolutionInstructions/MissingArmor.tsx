import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';

export default function MissingArmor() {
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				This loadout is missing armor and must be recreated from scratch to
				resolve this optimization.
			</InspectingOptimizationDetailsHelp>
		</Box>
	);
}
