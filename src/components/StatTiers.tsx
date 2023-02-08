import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStat,
} from '@dlb/types/ArmorStat';
import { EArmorStatId } from '@dlb/types/IdEnums';
import { Box, styled } from '@mui/material';

type StatTiersProps = {
	armorStatMapping: ArmorStatMapping;
};
type StatTierProps = {
	armorStatId: EArmorStatId;
	value: number;
};

const TierBlock = styled(Box, {
	shouldForwardProp: (prop) =>
		!['filled', 'first', 'last'].includes(prop as string),
})<{ filled?: boolean; first: boolean; last: boolean }>(
	({ filled, first, last }) => ({
		flex: '1 1 0px', //Ensure all the same width
		width: 0,
		paddingLeft: '3px',
		paddingRight: '3px',
		paddingTop: '6px',
		paddingBottom: '6px',
		textAlign: 'center',
		background: filled ? 'white' : 'black',
		borderTop: '1px solid',
		borderBottom: '1px solid',
		borderLeft: first ? '1px solid' : '',
		borderRight: '1px solid',
		borderColor: filled ? 'white' : 'rgb(128, 128, 128)',
		color: filled ? 'black' : '',
		borderRightColor: filled && !last ? 'black' : '',
		height: 24,
	})
);

const Container = styled(Box)(({ theme }) => ({
	//paddingLeft: theme.spacing(1),
	marginBottom: theme.spacing(2),
	display: 'flex',
	flexDirection: 'column',
	// borderLeft: `1px solid rgb(128, 128, 128)`,
}));

const TierContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	paddingLeft: '6px',
	width: '300px',
}));

const StatTierContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	paddingBottom: '2px',
}));

let tiers = [...Array(11).keys()].map((t) => t * 10);
tiers = tiers.slice(1); // Delete the "0" tier

function StatTier({ armorStatId, value }: StatTierProps) {
	const armorStat = getArmorStat(armorStatId);
	return (
		<StatTierContainer>
			<BungieImage src={armorStat.icon} width={'24px'} height={'24px'} />
			<TierContainer>
				{tiers.map((t, i) => {
					return (
						<TierBlock
							first={i === 0}
							last={i === tiers.length - 1}
							filled={t <= value}
							key={t}
						/>
					);
				})}
			</TierContainer>
			<Box sx={{ lineHeight: '24px', paddingLeft: '6px' }}>
				{armorStat.name}:
			</Box>
			<Box
				sx={{
					lineHeight: '24px',
					paddingLeft: '6px',
					flex: 1,
					textAlign: 'right',
				}}
			>
				{value}
			</Box>
		</StatTierContainer>
	);
}

function StatTiers({ armorStatMapping }: StatTiersProps) {
	return (
		<Container>
			{ArmorStatIdList.map((armorStatId) => (
				<StatTier
					key={armorStatId}
					armorStatId={armorStatId}
					value={armorStatMapping[armorStatId]}
				/>
			))}
		</Container>
	);
}

export default StatTiers;
