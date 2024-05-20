import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function LowerCost(props: ResolutionInstructionProps) {
	const { metadata } = props.loadout;
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				Sort the results by &quot;Total Mod Cost&quot; to resolve this
				optimization.
			</InspectingOptimizationDetailsHelp>
			<Box>Current cost: {metadata.currentCost}</Box>
			<Box>Optimized cost: {metadata.lowestCost}</Box>
		</Box>
	);
}
