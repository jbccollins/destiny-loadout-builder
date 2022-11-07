import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { Characters, DestinyClassName } from '@dlb/services/data';
import { Box, styled, Card, capitalize, Typography } from '@mui/material';
import {
	selectSelectedCharacterClass,
	setSelectedCharacterClass
} from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { useCallback, useEffect } from 'react';
type CharacterSelectorProps = Readonly<{
	characters: Characters;
}>;
const Container = styled(Card)(({ theme }) => ({
	padding: theme.spacing(3)
}));

const Item = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	display: 'flex',
	position: 'relative',
	width: '474px',
	height: '96px'
}));

const EmblemImage = styled(BungieImage)(({ theme }) => ({
	position: 'absolute'
}));

const CharacterText = styled(Typography)(({ theme }) => ({
	display: 'block',
	zIndex: 1,
	marginLeft: '20.25%' // 96 is 20.25% of 474 which is the size of the emblem icon
	// marginTop: '50%'
}));

function CharacterSelector(props: CharacterSelectorProps) {
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const dispatch = useAppDispatch();

	const handleCharacterClick = (characterClass: DestinyClassName) => {
		dispatch(setSelectedCharacterClass(characterClass));
	};

	const setDefaultCharacterClass = useCallback(() => {
		if (
			props.characters &&
			props.characters.length > 0 &&
			selectedCharacterClass === null
		) {
			dispatch(setSelectedCharacterClass(props.characters[0].className));
		}
	}, [dispatch, props.characters, selectedCharacterClass]);

	useEffect(() => {
		setDefaultCharacterClass();
	}, [setDefaultCharacterClass]);

	return (
		<>
			<Container>
				{props.characters.map((character) => (
					<Item
						key={character.id}
						onClick={() => handleCharacterClick(character.className)}
					>
						<EmblemImage src={character.background} />
						<CharacterText variant="h5">
							{character.genderRace} {capitalize(character.className)}
						</CharacterText>
					</Item>
				))}
			</Container>
		</>
	);
}

export default CharacterSelector;
