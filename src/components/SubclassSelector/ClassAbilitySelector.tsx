import {
	EDestinySubclassId,
	EElementId,
	EClassAbilityId,
} from '@dlb/types/IdEnums';
import { styled } from '@mui/material';
import {
	selectSelectedClassAbility,
	setSelectedClassAbility,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ClassAbilityIdList, getClassAbility } from '@dlb/types/ClassAbility';
import IconDropdown from '@dlb/components/IconDropdown';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
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
};

const options = ClassAbilityIdList.map((classAbilityId) => {
	const { name, id, icon } = getClassAbility(classAbilityId);
	return {
		label: name,
		icon: icon,
		id: id,
	};
});

function ClassAbilitySelector() {
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.label;
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

	return (
		<>
			<Container>
				<IconDropdownContainer>
					<IconDropdown
						options={options}
						getLabel={getLabel}
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
