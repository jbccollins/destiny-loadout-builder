import { styled } from '@mui/material';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import IconDropdown from '@dlb/components/IconDropdown';
import { getAspectsByDestinySubclassId } from '@dlb/types/Aspect';
import {
	selectSelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { EAspectId } from '@dlb/generated/aspect/EAspectId';
const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
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
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.name;
	const getDescription = (option: Option) => option.description;

	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
	const aspectIds = [...selectedAspects[destinySubclassId]];

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
									disabled: aspectIds.indexOf(x.id as EAspectId) > -1,
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
									disabled: aspectIds.indexOf(x.id as EAspectId) > -1,
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
