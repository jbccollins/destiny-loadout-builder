import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function MutuallyExclusiveMods(
	props: ResolutionInstructionProps
) {
	const { loadout } = props;
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				This loadout contains mutually exclusive{' '}
				{loadout.metadata.mutuallyExclusiveModGroups.join(' and ')} mods. Remove
				mutually exclusive mods to resolve this optimization.
			</InspectingOptimizationDetailsHelp>
		</Box>
	);
}
