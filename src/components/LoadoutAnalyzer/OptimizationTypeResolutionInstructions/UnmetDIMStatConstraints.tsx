import CustomTooltip from '@dlb/components/CustomTooltip';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import { Box } from '@mui/material';
import { InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function UnmetDIMStatConstraints(
	props: ResolutionInstructionProps
) {
	const { loadout } = props;
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				This loadout must be recreated to resolve this optimization. Here are
				the discrepancies between the DIM Stat Tier Constraints (DSTC) and the
				Actual Stat Tiers (AST) that this loadout achieves:
			</InspectingOptimizationDetailsHelp>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
				<Box sx={{ width: '114px' }}>Stat</Box>
				<Box
					sx={{
						width: '60px',
						paddingLeft: '6px',
						borderLeft: '1px solid white',
					}}
				>
					DSTC
				</Box>
				<Box
					sx={{
						width: '60px',
						borderLeft: '1px solid white',
						paddingLeft: '6px',
					}}
				>
					AST
				</Box>
			</Box>
			{ArmorStatIdList.map((armorStatId) => {
				const armorStat = getArmorStat(armorStatId);
				const diff =
					loadout.dimStatTierConstraints[armorStatId] -
					loadout.achievedStatTiers[armorStatId];

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
						<Box
							sx={{
								width: '60px',
								borderLeft: '1px solid white',
								paddingLeft: '6px',
							}}
						>
							{loadout.dimStatTierConstraints[armorStatId] / 10}
						</Box>
						<Box
							sx={{
								width: '60px',
								borderLeft: '1px solid white',
								paddingLeft: '6px',
							}}
						>
							{loadout.achievedStatTiers[armorStatId] / 10}
						</Box>
					</Box>
				) : null;
			})}
		</Box>
	);
}
