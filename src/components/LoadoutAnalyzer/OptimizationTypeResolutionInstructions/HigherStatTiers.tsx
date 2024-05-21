import CustomTooltip from '@dlb/components/CustomTooltip';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function HigherStatTiers(props: ResolutionInstructionProps) {
	const { loadout } = props;
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				Use the &quot;Desired Stat Tiers&quot; selector to resolve this
				optimization:
			</InspectingOptimizationDetailsHelp>
			{ArmorStatIdList.map((armorStatId) => {
				const armorStat = getArmorStat(armorStatId);
				const diff =
					loadout.metadata?.maxPossibleDesiredStatTiers[armorStatId] -
						loadout.desiredStatTiers[armorStatId] || 0;
				return diff > 0 ? (
					<Box
						key={armorStatId}
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: '4px',
							background: 'rgba(30,30,30,0.5)',
							'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
							padding: '4px',
						}}
					>
						<CustomTooltip title={armorStat.name}>
							<Box sx={{ width: '26px', height: '26px' }}>
								<BungieImage src={armorStat.icon} width={26} height={26} />
							</Box>
						</CustomTooltip>
						<Box sx={{ width: '80px' }}>{armorStat.name}: </Box>
						<Box>
							(+{diff / 10} tier{diff > 10 ? 's' : ''})
						</Box>
					</Box>
				) : null;
			})}
		</Box>
	);
}
