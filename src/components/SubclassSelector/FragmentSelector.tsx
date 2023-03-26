import { Box, styled } from '@mui/material';
import IconMultiSelectDropdown from '@dlb/components/IconMultiSelectDropdown';
import { getFragment, getFragmentIdsByElementId } from '@dlb/types/Fragment';
import React from 'react';
import {
	selectSelectedFragments,
	setSelectedFragments,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getStat } from '@dlb/types/ArmorStat';
import { StatBonusStat } from '@dlb/types/globals';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EElementId } from '@dlb/types/IdEnums';

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1),
}));

const FragmentSelector = () => {
	// const [value, setValue] = React.useState<EFragmentId[]>([FragmentIdList[0]]);

	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	let fragments: EFragmentId[] = [];
	let elementId = EElementId.Any;
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
	if (destinySubclassId) {
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
		getStat(stat, selectedDestinyClass);

	return (
		<Container>
			<IconMultiSelectDropdown
				disabled={!destinySubclassId}
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
