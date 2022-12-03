import { Box, styled } from '@mui/material';
import IconMultiSelectDropdown from '@dlb/components/IconMultiSelectDropdown';
import { getFragment, getFragmentIdsByElementId } from '@dlb/types/Fragment';
import React from 'react';
import { EFragmentId } from '@dlb/types/IdEnums';
import {
	selectSelectedFragments,
	setSelectedFragments,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { selectSelectedCharacterClass } from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { selectSelectedSubclassOptions } from '@dlb/redux/features/selectedSubclassOptions/selectedSubclassOptionsSlice';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getStat } from '@dlb/types/ArmorStat';
import { StatBonusStat } from '@dlb/types/globals';

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1),
}));

const FragmentSelector = () => {
	// const [value, setValue] = React.useState<EFragmentId[]>([FragmentIdList[0]]);

	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedCharacterClass = useAppSelector(selectSelectedCharacterClass);
	const selectedSubclassOptions = useAppSelector(selectSelectedSubclassOptions);
	let fragments: EFragmentId[] = [];
	let elementId = null;
	if (selectedCharacterClass && selectedFragments && selectedSubclassOptions) {
		const { destinySubclassId } =
			selectedSubclassOptions[selectedCharacterClass];
		const { elementId: subclassElementId } =
			getDestinySubclass(destinySubclassId);
		elementId = subclassElementId;
		fragments = selectedFragments[elementId];
	}
	const dispatch = useAppDispatch();

	const handleChange = (fragmentIds: EFragmentId[]) => {
		// TODO: We can probably avoid triggering a redux dirty if they switch to
		// A set of fragments that has the same stat bonuses
		dispatch(setSelectedFragments({ elementId, fragments: fragmentIds }));
	};

	const getOptionValue = (id: EFragmentId) => getFragment(id);

	const getOptionStat = (stat: StatBonusStat) =>
		getStat(stat, selectedCharacterClass);

	return (
		<Container>
			<IconMultiSelectDropdown
				getOptionValue={getOptionValue}
				getOptionStat={getOptionStat}
				options={getFragmentIdsByElementId(elementId)}
				value={fragments}
				onChange={handleChange}
				title={'Fragments'}
				id={'fragment-selector'}
			/>
		</Container>
	);
};

export default FragmentSelector;
