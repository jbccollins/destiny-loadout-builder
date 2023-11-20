import { styled } from '@mui/material';
import {
	selectSelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	MeleeIdList,
	getMelee,
	getMeleeIdsByDestinySubclassId,
} from '@dlb/types/Melee';
import IconDropdown from '@dlb/components/IconDropdown';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { Description } from '@mui/icons-material';
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

function MeleeSelector() {
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.label;
	const getDescription = (option: Option) => option.description;

	const selectedDestinySubclassId =
		selectedDestinySubclass[selectedDestinyClass];

	const handleChange = (meleeId: EMeleeId) => {
		dispatch(
			setSelectedMelee({
				...selectedMelee,
				[selectedDestinySubclassId]: meleeId,
			})
		);
	};

	// TODO: Memoize these options
	const options: Option[] = selectedDestinySubclassId
		? getMeleeIdsByDestinySubclassId(selectedDestinySubclassId).map(
				(meleeId) => {
					const { name, id, icon, description } = getMelee(meleeId);
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
						value={selectedMelee[selectedDestinySubclassId] || ''}
						onChange={handleChange}
						title="Melee"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default MeleeSelector;
