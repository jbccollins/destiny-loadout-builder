import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { Box, styled } from '@mui/material';

interface IDecoratedBungieIconProps {
	icon: string;
	elementOverlayIcon?: string;
	getCost?: () => number;
}

// TODO: The styling for this component is very messy and fragile. Pls fix
const Container = styled(Box)(({ theme }) => ({
	position: 'relative',
	width: '40px',
	height: '40px',
}));

const ElementOverlay = styled(Box)(({ theme }) => ({
	position: 'absolute',
	width: '40px',
	height: '40px',
	top: 0,
	left: 0,
}));

const CostOverlay = styled(Box)(({ theme }) => ({
	position: 'absolute',
	width: '40px',
	height: '40px',
	top: 0,
	left: 0,

	textAlign: 'right',
	fontSize: '7px',
	verticalAlign: 'top',
	lineHeight: '15px',
	paddingRight: '5px',
}));

function DecoratedBungieIcon({
	icon,
	elementOverlayIcon,
	getCost,
}: IDecoratedBungieIconProps) {
	return (
		<Container>
			<BungieImage width={40} height={40} src={icon} />
			{elementOverlayIcon && (
				<ElementOverlay>
					<BungieImage width={40} height={40} src={elementOverlayIcon} />
				</ElementOverlay>
			)}
			{getCost && getCost() > 0 && <CostOverlay>{getCost()}</CostOverlay>}
		</Container>
	);
}

export default DecoratedBungieIcon;
