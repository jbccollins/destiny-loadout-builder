import BoxCountIndicator from '@dlb/components/BoxCountIndicator';
import IconMultiSelectDropdown from '@dlb/components/IconMultiSelectDropdown';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { selectSelectedAspects } from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import {
	selectSelectedFragments,
	setSelectedFragments,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { getStat } from '@dlb/types/ArmorStat';
import {
	getAspect,
	getAspectIdsByDestinySubclassId,
	getMaximumFragmentSlotsByDestinySubclassId,
} from '@dlb/types/Aspect';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getFragment, getFragmentIdsByElementId } from '@dlb/types/Fragment';
import { EElementId } from '@dlb/types/IdEnums';
import { StatBonusStat } from '@dlb/types/globals';
import { Box, styled } from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1),
	position: 'relative',
}));

const FragmentSelector = () => {
	// const [value, setValue] = React.useState<EFragmentId[]>([FragmentIdList[0]]);

	const selectedAspects = useAppSelector(selectSelectedAspects);
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	let fragments: EFragmentId[] = [];
	let elementId = EElementId.Any;
	let maxFragments = 0;
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
	// TODO: Memoize this stuff
	if (destinySubclassId) {
		const { elementId: subclassElementId } =
			getDestinySubclass(destinySubclassId);
		elementId = subclassElementId;
		fragments = selectedFragments[elementId];
		const _selectedAspects = selectedAspects[destinySubclassId].filter(
			(x) => x !== null
		);
		if (_selectedAspects.length === 0) {
			maxFragments =
				getMaximumFragmentSlotsByDestinySubclassId(destinySubclassId);
		} else if (_selectedAspects.length === 1) {
			const aspectIds = getAspectIdsByDestinySubclassId(
				destinySubclassId
			).filter((x) => x !== _selectedAspects[0]);
			aspectIds.forEach((aspectId) => {
				maxFragments = Math.max(
					getAspect(_selectedAspects[0]).fragmentSlots +
						getAspect(aspectId).fragmentSlots,
					maxFragments
				);
			});
		} else {
			maxFragments =
				getAspect(_selectedAspects[0]).fragmentSlots +
				getAspect(_selectedAspects[1]).fragmentSlots;
		}
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
			{destinySubclassId && (
				<Box
					sx={{
						position: 'absolute',
						right: '0px',
						top: '0px',
						marginRight: '16px',
						paddingLeft: '4px',
						paddingRight: '4px',
						background: 'rgb(19,19,19)',
						zIndex: 1,
					}}
				>
					<BoxCountIndicator
						prefix={'Fragment Slots'}
						max={maxFragments}
						count={fragments.length}
					/>
				</Box>
			)}
			<IconMultiSelectDropdown
				disabled={!destinySubclassId}
				getOptionValue={getOptionValue}
				getOptionStat={getOptionStat}
				options={getFragmentIdsByElementId(elementId)}
				value={fragments}
				onChange={handleChange}
				title={'Fragments'}
				id={'fragment-selector'}
				maxSelectionCount={maxFragments}
			/>
		</Container>
	);
};

export default FragmentSelector;
