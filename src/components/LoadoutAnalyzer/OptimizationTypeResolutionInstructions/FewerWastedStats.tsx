import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function FewerWastedStats(props: ResolutionInstructionProps) {
	const { metadata } = props.loadout;
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				This loadout must be recreated from scratch to resolve this
				optimization. Edit this loadout in &quot;Build&quot; tab and sort the
				results by &quot;Wasted Stats&quot; to resolve this optimization.
			</InspectingOptimizationDetailsHelp>
			<Box>
				<Box>Current wasted stats: {metadata.currentWastedStats}</Box>
				<Box>Optimized wasted stats: {metadata.lowestWastedStats}</Box>
			</Box>
		</Box>
	);
}
