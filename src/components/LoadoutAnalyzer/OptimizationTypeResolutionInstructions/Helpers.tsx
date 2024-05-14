import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { IArmorSlot } from '@dlb/types/ArmorSlot';
import { IMod } from '@dlb/types/generation';
import { Box, styled } from '@mui/material';
export const InspectingOptimizationDetailsHelp = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(0.5),
	fontSize: '14px',
	fontStyle: 'italic',
}));

type ArmorSlotModListProps = {
	modList: IMod[];
	armorSlot: IArmorSlot;
};

// TODO: This does not include artifact mods that are armor slot agnostic
export const ArmorSlotModList = ({
	modList,
	armorSlot,
}: ArmorSlotModListProps) => {
	return modList.length > 0 ? (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: '4px',
				background: 'rgba(30,30,30,0.5)',
				'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
				padding: '4px',
			}}
		>
			<Box sx={{ width: '26px', height: '26px', display: 'flex' }}>
				<BungieImage src={armorSlot.icon} width={26} height={26} />
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
				{modList.map((mod, i) => (
					<Box
						key={i}
						sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
					>
						<Box sx={{ width: '26px', height: '26px' }}>
							<BungieImage src={mod.icon} width={26} height={26} />
						</Box>
						<Box>
							{mod.name}
							{mod.isArtifactMod ? ' (Artifact)' : ''}
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	) : null;
};
