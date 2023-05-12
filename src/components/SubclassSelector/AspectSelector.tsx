import BoxCountIndicator from '@dlb/components/BoxCountIndicator';
import IconDropdown from '@dlb/components/IconDropdown';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import {
	selectSelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { selectSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	getAspect,
	getAspectIdsByDestinySubclassId,
	getAspectsByDestinySubclassId,
} from '@dlb/types/Aspect';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { EElementId } from '@dlb/types/IdEnums';
import { Box, styled } from '@mui/material';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
	position: 'relative',
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	//
}));

type Option = {
	name: string;
	id: string;
	disabled?: boolean;
	icon: string;
	description: string;
};

function AspectSelector() {
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.name;
	const getDescription = (option: Option) => (
		<Box>
			<Box>{option.description}</Box>
			{/* <Box>
				Fragment Slots: {getAspect(option.id as EAspectId).fragmentSlots}
			</Box> */}

			<Box
				sx={{
					position: 'absolute',
					right: '0px',
					top: '0px',
					marginRight: '16px',
					marginTop: '8px',
					// background: 'rgb(19,19,19)',
					zIndex: 1,
				}}
			>
				<BoxCountIndicator
					prefix={'Slots'}
					max={getAspect(option.id as EAspectId).fragmentSlots}
					count={getAspect(option.id as EAspectId).fragmentSlots}
				/>
			</Box>
		</Box>
	);

	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
	const aspectIds = destinySubclassId
		? [...selectedAspects[destinySubclassId]]
		: [];

	let fragments: EFragmentId[] = [];
	let elementId = EElementId.Any;

	let firstDisabledAspectIdList: EAspectId[] = [];
	let secondDisabledAspectIdList: EAspectId[] = [];
	if (destinySubclassId) {
		const { elementId: subclassElementId } =
			getDestinySubclass(destinySubclassId);
		elementId = subclassElementId;
		fragments = selectedFragments[elementId];

		const availableAspectIds =
			getAspectIdsByDestinySubclassId(destinySubclassId);

		// If an aspect cannot be combined with any other aspect to get use enough fragment slots
		// then it must be disabled
		for (let i = 0; i < availableAspectIds.length; i++) {
			const fragmentSlots = getAspect(availableAspectIds[i]).fragmentSlots;
			const otherAspectIndex = availableAspectIds
				.filter((x) => x !== availableAspectIds[i])
				.findIndex(
					(x) => getAspect(x).fragmentSlots + fragmentSlots >= fragments.length
				);
			if (otherAspectIndex < 0) {
				firstDisabledAspectIdList.push(availableAspectIds[i]);
				secondDisabledAspectIdList.push(availableAspectIds[i]);
			}
		}

		if (aspectIds[0]) {
			secondDisabledAspectIdList.push(aspectIds[0]);
			const fragmentSlots = getAspect(aspectIds[0]).fragmentSlots;
			const secondAspectSlotDisabledIds = availableAspectIds.filter(
				(x) => getAspect(x).fragmentSlots + fragmentSlots < fragments.length
			);
			secondDisabledAspectIdList = [
				...secondDisabledAspectIdList,
				...secondAspectSlotDisabledIds,
			];
		}
		if (aspectIds[1]) {
			firstDisabledAspectIdList.push(aspectIds[1]);
			const fragmentSlots = getAspect(aspectIds[1]).fragmentSlots;
			const firstAspectSlotDisabledIds = availableAspectIds.filter(
				(x) => getAspect(x).fragmentSlots + fragmentSlots < fragments.length
			);
			firstDisabledAspectIdList = [
				...firstDisabledAspectIdList,
				...firstAspectSlotDisabledIds,
			];
		}
	}
	console.log({ firstDisabledAspectIdList, secondDisabledAspectIdList });

	const handleChange = (aspectId: EAspectId, index: number) => {
		const aspectIds = [...selectedAspects[destinySubclassId]];
		aspectIds[index] = aspectId;
		dispatch(
			setSelectedAspects({
				...selectedAspects,
				[destinySubclassId]: aspectIds,
			})
		);
	};

	return (
		<>
			<Container>
				<IconDropdownContainer>
					<IconDropdown
						disabled={!destinySubclassId}
						allowNoSelection
						selectComponentProps={{
							sx: {
								// maxWidth: 100,
								borderBottomLeftRadius: 0,
								borderBottomRightRadius: 0,
							},
						}}
						options={getAspectsByDestinySubclassId(destinySubclassId).map(
							(x) => {
								return {
									...x,
									disabled: firstDisabledAspectIdList.includes(
										x.id as EAspectId
									),
								};
							}
						)}
						getDescription={getDescription}
						getLabel={getLabel}
						value={aspectIds[0] || ''}
						onChange={(aspectId: EAspectId) => handleChange(aspectId, 0)}
						title="Aspects"
					/>
					<IconDropdown
						disabled={!destinySubclassId}
						allowNoSelection
						selectComponentProps={{
							sx: {
								// maxWidth: 100,
								borderTopRightRadius: 0,
								borderTopLeftRadius: 0,
								marginTop: '-1px',
							},
						}}
						options={getAspectsByDestinySubclassId(destinySubclassId).map(
							(x) => {
								return {
									...x,
									disabled: secondDisabledAspectIdList.includes(
										x.id as EAspectId
									),
								};
							}
						)}
						getLabel={getLabel}
						getDescription={getDescription}
						value={aspectIds[1] || ''}
						onChange={(aspectId: EAspectId) => handleChange(aspectId, 1)}
						// title="Class"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default AspectSelector;
