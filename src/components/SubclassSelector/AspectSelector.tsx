import { EAspectId } from '@dlb/types/IdEnums';
import { styled } from '@mui/material';
import {
	selectSelectedCharacterClass,
	setSelectedCharacterClass,
} from '@dlb/redux/features/selectedCharacterClass/selectedCharacterClassSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import IconDropdown from '@dlb/components/IconDropdown';
import {
	AspectIdList,
	getAspect,
	getAspectIdsByDestinySubclassId,
	getAspectsByDestinySubclassId,
} from '@dlb/types/Aspect';
import {
	selectSelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { selectSelectedSubclassOptions } from '@dlb/redux/features/selectedSubclassOptions/selectedSubclassOptionsSlice';
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
	const selectedDestinyClass = useAppSelector(selectSelectedCharacterClass);
	const selectedSubclassOptions = useAppSelector(selectSelectedSubclassOptions);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.name;
	const getDescription = (option: Option) => option.description;

	const { destinySubclassId } = selectedSubclassOptions[selectedDestinyClass];
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
