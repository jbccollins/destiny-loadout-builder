import { Box, styled } from '@mui/material';
import { selectSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import IconAutocompleteDropdown from '@dlb/components/IconAutocompleteDropdown';
import DestinySubclassAndSuperAbilityOptions, {
	DestinySubclassAndSuperAbilityOption,
} from '@dlb/constants/DestinySubclassAndSuperAbilityOptions';
import {
	selectSelectedSubclassOptions,
	setSelectedSubclassOptions,
} from '@dlb/redux/features/selectedSubclassOptions/selectedSubclassOptionsSlice';

const Container = styled(Box)(({ theme }) => ({
	//color: theme.palette.primary.main,
	padding: theme.spacing(1),
	// display: 'flex',
	// justifyContent: 'left',
}));

const SubclassSelector = () => {
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);

	const selectedSubclassOptions = useAppSelector(selectSelectedSubclassOptions);
	const dispatch = useAppDispatch();

	const handleChange = (option: DestinySubclassAndSuperAbilityOption) => {
		// TODO: Don't trigger a redux dirty unless the subclass id changes, not just the super
		// An easy half measure right now would be to just return right here if the selected super
		// id didn't change but that doesn't help the subclass id not changing
		dispatch(
			setSelectedSubclassOptions({
				...selectedSubclassOptions,
				[selectedCharacterClass]: {
					...selectedSubclassOptions[selectedCharacterClass],
					destinySubclassId: option.destinySubclassId,
					superAbilityId: option.superAbilityId,
				},
			})
		);
	};

	return (
		selectedCharacterClass &&
		selectedSubclassOptions &&
		selectedSubclassOptions[selectedCharacterClass] && (
			<Container>
				<IconAutocompleteDropdown
					title={'Super Ability'}
					options={
						DestinySubclassAndSuperAbilityOptions[selectedCharacterClass]
					}
					value={DestinySubclassAndSuperAbilityOptions[
						selectedCharacterClass
					].find(
						(option) =>
							option.superAbilityId ===
							selectedSubclassOptions[selectedCharacterClass].superAbilityId
					)}
					onChange={handleChange}
					getGroupBy={(option: DestinySubclassAndSuperAbilityOption) =>
						`${option.elementName} (${option.destinySubclassName})`
					}
					getId={(option: DestinySubclassAndSuperAbilityOption) =>
						option.superAbilityId
					}
					getLabel={(option: DestinySubclassAndSuperAbilityOption) =>
						option.superAbilityName
					}
				/>
			</Container>
		)
	);
};

export default SubclassSelector;
