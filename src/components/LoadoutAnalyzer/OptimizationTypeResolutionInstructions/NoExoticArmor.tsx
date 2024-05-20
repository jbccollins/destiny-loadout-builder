import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';

export default function NoExoticArmor() {
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				This loadout must be recreated from scratch. Select an exotic armor
				piece to resolve this optimization.
			</InspectingOptimizationDetailsHelp>
		</Box>
	);
}
