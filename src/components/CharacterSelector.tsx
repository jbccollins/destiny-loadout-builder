import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { EDestinyClass } from '@dlb/services/data';
import { Box, styled, Card, capitalize, Typography } from '@mui/material';
import {
	selectSelectedCharacterClass,
	setSelectedCharacterClass
} from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { selectCharacters } from '@dlb/redux/features/characters/charactersSlice';
import IconDropdown from './IconDropdown';
const Container = styled('div')(({ theme }) => ({
	// padding: theme.spacing(1),
	// paddingRight: 0
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	['.demo-simple-select']: {
		['.character-class-name']: {
			display: 'none'
		}
	}
}));

type Option = {
	label: string;
	id: string;
	disabled: boolean;
	icon: string;
};

function CharacterSelector() {
	const options: Option[] = useMemo(
		() => [
			{
				label: EDestinyClass.Hunter,
				id: EDestinyClass.Hunter,
				disabled: true,
				icon: 'https://www.bungie.net/common/destiny2_content/icons/57f35a636ef455069d04231d4a564013.jpg'
			},
			{
				label: EDestinyClass.Warlock,
				id: EDestinyClass.Warlock,
				disabled: true,
				icon: 'https://www.bungie.net/common/destiny2_content/icons/67f7bbf158f84c33802b178e463b7037.jpg'
			},
			{
				label: EDestinyClass.Titan,
				id: EDestinyClass.Titan,
				disabled: true,
				icon: 'https://www.bungie.net/common/destiny2_content/icons/84fcf9589ae5320f282abe89bd0c5fff.jpg'
			}
			// // Testing the 'disabled' option locally lol
			// {
			// 	label: 'moose',
			// 	id: 'asdfsdfdsf',
			// 	disabled: true,
			// 	icon: 'https://bungie.net//common/destiny2_content/icons/dded5f2f4730ea8515e71dbb36111393.jpg'
			// }
		],
		[]
	);

	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const characters = useAppSelector(selectCharacters);
	const dispatch = useAppDispatch();

	const setDefaultCharacterClass = useCallback(() => {
		if (
			characters &&
			characters.length > 0 &&
			selectedCharacterClass === null
		) {
			// TODO: A fringe case could be someone who has a bunch of armor for a class
			// that they don't have. Probably not worth the effort right now to determine
			// that but maybe a "nice to have" later on.
			characters.forEach((character) => {
				const optionIndex = options.findIndex(
					(option) => option.id === character.destinyClass
				);
				if (optionIndex >= 0) {
					options[optionIndex] = { ...options[optionIndex], disabled: false };
				}
			});
			dispatch(setSelectedCharacterClass(characters[0].destinyClass));
		}
	}, [characters, selectedCharacterClass, dispatch, options]);

	useEffect(() => {
		setDefaultCharacterClass();
	}, [setDefaultCharacterClass]);

	const getLabel = (option: Option) => option.label;

	const handleChange = (characterClass: EDestinyClass) => {
		if (selectedCharacterClass && selectedCharacterClass === characterClass) {
			// Don't trigger a redux dirty
			return;
		}
		dispatch(setSelectedCharacterClass(characterClass));
	};

	return (
		<>
			<Container>
				<IconDropdownContainer>
					<IconDropdown
						options={options}
						getLabel={getLabel}
						value={selectedCharacterClass || ''}
						onChange={handleChange}
					/>
				</IconDropdownContainer>
				{/* {characters.map((character) => (
					<Item
						key={character.id}
						onClick={() => handleCharacterClick(character.className)}
					>
						<EmblemImage src={character.background} />
						<CharacterText variant="h5">
							{character.genderRace} {capitalize(character.className)}
						</CharacterText>
					</Item>
				))} */}
			</Container>
		</>
	);
}

export default CharacterSelector;
