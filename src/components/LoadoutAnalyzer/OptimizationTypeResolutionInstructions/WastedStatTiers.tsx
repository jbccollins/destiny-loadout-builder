import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';

export default function WastedStatTiers() {
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				This may or may not be something that can be resolved given obtained
				armor and selected mods. Play around with the &quot;Desired Stat
				Tiers&quot; selector to try and resolve this optimization.
			</InspectingOptimizationDetailsHelp>
		</Box>
	);
}
