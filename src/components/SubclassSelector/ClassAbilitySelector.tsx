import { styled } from '@mui/material';
import {
	selectSelectedClassAbility,
	setSelectedClassAbility,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	ClassAbilityIdList,
	getClassAbility,
	getClassAbilityIdsByDestinySubclassId,
} from '@dlb/types/ClassAbility';
import IconDropdown from '@dlb/components/IconDropdown';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
	// paddingRight: 0
}));

const IconDropdownContainer = styled('div')(({ theme }) => ({
	//
}));

type Option = {
	label: string;
	id: string;
	disabled?: boolean;
	icon: string;
	description: string;
};

function ClassAbilitySelector() {
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.label;

	const getDescription = (option: Option) => option.description;

	const selectedDestinySubclassId =
		selectedDestinySubclass[selectedDestinyClass];

	const handleChange = (classAbilityId: EClassAbilityId) => {
		dispatch(
			setSelectedClassAbility({
				...selectedClassAbility,
				[selectedDestinySubclassId]: classAbilityId,
			})
		);
	};

	// TODO: Memoize these options
	const options: Option[] = selectedDestinySubclassId
		? getClassAbilityIdsByDestinySubclassId(selectedDestinySubclassId).map(
				(classAbilityId) => {
					const { name, id, icon, description } =
						getClassAbility(classAbilityId);
					return {
						label: name,
						icon: icon,
						id: id,
						description: description,
					};
				}
		  )
		: [];

	return (
		<>
			<Container>
				<IconDropdownContainer>
					<IconDropdown
						disabled={!selectedDestinySubclassId}
						allowNoSelection
						options={options}
						getLabel={getLabel}
						getDescription={getDescription}
						value={selectedClassAbility[selectedDestinySubclassId] || ''}
						onChange={handleChange}
						title="Class Ability"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default ClassAbilitySelector;
