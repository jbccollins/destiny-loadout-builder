import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import {
	CheckCircleRounded,
	ImportantDevices,
	Scale
} from '@mui/icons-material';
import { Box, styled, Checkbox, Card, CircularProgress } from '@mui/material';
import {
	DestinyCharacterComponent,
	DestinyProfileResponse,
	DictionaryComponentResponse
} from 'bungie-api-ts-no-const-enum/destiny2';

type CharacterSelectorProps = Readonly<{
	characters: DictionaryComponentResponse<DestinyCharacterComponent>;
}>;
const Container = styled(Card)(({ theme }) => ({
	color: theme.palette.secondary.main,
	padding: theme.spacing(3)
}));

const Item = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	display: 'flex'
}));

function CharacterSelector(props: CharacterSelectorProps) {
	return (
		<>
			<Container>
				{Object.values(props.characters.data).map((character) => (
					<Item key={character.characterId}>
						<BungieImage src={character.emblemBackgroundPath} />
					</Item>
				))}
			</Container>
		</>
	);
}

export default CharacterSelector;
