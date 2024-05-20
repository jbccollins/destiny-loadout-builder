import CustomTooltip from '@dlb/components/CustomTooltip';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { getArmorSlot } from '@dlb/types/ArmorSlot';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function UnusedModSlots(props: ResolutionInstructionProps) {
	const { metadata } = props.loadout;

	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				Add mods to available mod slots to resolve this optimization.
			</InspectingOptimizationDetailsHelp>
			<Box>
				{Object.keys(metadata.unusedModSlots).map((armorSlotId) => {
					const value = metadata.unusedModSlots[armorSlotId];
					const armorSlot = getArmorSlot(armorSlotId as EArmorSlotId);
					return (
						<Box
							key={armorSlotId}
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: '4px',
								background: 'rgba(30,30,30,0.5)',
								'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
								padding: '4px',
							}}
						>
							<CustomTooltip title={armorSlot.name}>
								<Box sx={{ width: '26px', height: '26px' }}>
									<BungieImage src={armorSlot.icon} width={26} height={26} />
								</Box>
							</CustomTooltip>
							<Box>Any mod costing {value} or less</Box>
						</Box>
					);
				})}
			</Box>
		</Box>
	);
}
