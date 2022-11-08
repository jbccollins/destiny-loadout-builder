import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { EDestinyClass } from '@dlb/services/data';
import { Box, styled, Card, capitalize, Typography } from '@mui/material';
import {
	selectSelectedCharacterClass,
	setSelectedCharacterClass
} from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { useCallback, useEffect } from 'react';
import { selectCharacters } from '@dlb/redux/features/characters/charactersSlice';
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

// TODO: Remove props and just read from redux?
function CharacterSelector() {
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const characters = useAppSelector(selectCharacters);
	const dispatch = useAppDispatch();

	const handleCharacterClick = (characterClass: EDestinyClass) => {
		if (selectedCharacterClass && selectedCharacterClass === characterClass) {
			// Don't trigger a redux dirty
			return;
		}
		dispatch(setSelectedCharacterClass(characterClass));
	};

	const setDefaultCharacterClass = useCallback(() => {
		if (
			characters &&
			characters.length > 0 &&
			selectedCharacterClass === null
		) {
			dispatch(setSelectedCharacterClass(characters[0].className));
		}
	}, [dispatch, characters, selectedCharacterClass]);

	useEffect(() => {
		setDefaultCharacterClass();
	}, [setDefaultCharacterClass]);

	return (
		<>
			<Container>
				{characters.map((character) => (
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
