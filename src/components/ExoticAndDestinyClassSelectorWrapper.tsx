import { Box, styled } from '@mui/material';
import DestinyClassSelector from './DestinyClassSelector';
import ExoticSelector from './ExoticSelector';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(1),
	display: 'flex',
	flexWrap: 'wrap',
	flexDirection: 'column',
}));
const ExoticSelectorWrapper = styled('div')(({ theme }) => ({
	marginTop: '-1px',
	// flexGrow: 1,
	// minWidth: 0,
}));

const ExoticAndDestinyClassSelectorWrapper = () => {
	return (
		<Container>
			<DestinyClassSelector />
			<ExoticSelectorWrapper>
				<ExoticSelector />
			</ExoticSelectorWrapper>
		</Container>
	);
};

export default ExoticAndDestinyClassSelectorWrapper;
