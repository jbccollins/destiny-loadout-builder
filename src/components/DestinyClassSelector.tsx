import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import { Box, styled, Card, capitalize, Typography } from '@mui/material';
import {
	selectSelectedCharacterClass,
	setSelectedCharacterClass,
} from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { selectCharacters } from '@dlb/redux/features/characters/charactersSlice';
import IconDropdown from './IconDropdown';
import {
	DestinyClassIdList,
	DestinyClassIdToDestinyClass,
} from '@dlb/types/DestinyClass';
const Container = styled('div')(({ theme }) => ({
	// padding: theme.spacing(1),
	// paddingRight: 0
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	['.demo-simple-select']: {
		['.character-class-name']: {
			display: 'none',
		},
	},
}));

type Option = {
	label: string;
	id: string;
	disabled?: boolean;
	icon: string;
};

const options = DestinyClassIdList.map((destinyClassId) => {
	const { name, id, icon } = DestinyClassIdToDestinyClass.get(destinyClassId);
	return {
		label: name,
		icon: icon,
		id: id,
	};
});

function DestinyClassSelector() {
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.label;

	const handleChange = (characterClass: EDestinyClassId) => {
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
						selectComponentProps={{
							sx: {
								maxWidth: 100,
								borderTopRightRadius: 0,
								borderBottomRightRadius: 0,
							},
						}}
						options={options}
						getLabel={getLabel}
						value={selectedCharacterClass || ''}
						onChange={handleChange}
						title="Class"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default DestinyClassSelector;
