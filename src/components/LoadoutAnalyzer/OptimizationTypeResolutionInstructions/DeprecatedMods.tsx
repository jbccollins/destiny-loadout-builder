import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';

export default function DeprecatedMods() {
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				DLB does not render deprecated mods, but the symptom of this
				optimization type will be empty mod sockets in the &quot;Armor
				Mods&quot; section of the &quot;Build&quot; tab. Add any mods in such
				sockets to resolve this optimization.
			</InspectingOptimizationDetailsHelp>
		</Box>
	);
}
