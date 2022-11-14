import { Box, Card, styled } from '@mui/material';
import CharacterSelector from './CharacterSelector';
import ExoticSelector from './ExoticSelector';

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.primary.main,
	padding: theme.spacing(1),
	display: 'flex',
	justifyContent: 'left',
}));
const ExoticSelectorWrapper = styled('div')(({ theme }) => ({
	marginLeft: '-1px',
	flexGrow: 1,
	minWidth: 0,
}));

const ExoticAndDestinyClassSelectorWrapper = () => {
	return (
		<Container>
			<CharacterSelector />
			<ExoticSelectorWrapper>
				<ExoticSelector />
			</ExoticSelectorWrapper>
		</Container>
	);
};

export default ExoticAndDestinyClassSelectorWrapper;
