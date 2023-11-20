import { styled } from '@mui/material';
import {
	selectSelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { getJump, getJumpIdsByDestinySubclassId } from '@dlb/types/Jump';
import IconDropdown from '@dlb/components/IconDropdown';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
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

function JumpSelector() {
	const selectedJump = useAppSelector(selectSelectedJump);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.label;

	const getDescription = (option: Option) => option.description;

	const selectedDestinySubclassId =
		selectedDestinySubclass[selectedDestinyClass];

	const handleChange = (jumpId: EJumpId) => {
		dispatch(
			setSelectedJump({
				...selectedJump,
				[selectedDestinySubclassId]: jumpId,
			})
		);
	};

	// TODO: Memoize these options
	const options: Option[] = selectedDestinySubclassId
		? getJumpIdsByDestinySubclassId(selectedDestinySubclassId).map((jumpId) => {
				const { name, id, icon, description } = getJump(jumpId);
				return {
					label: name,
					icon: icon,
					id: id,
					description: description,
				};
		  })
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
						value={selectedJump[selectedDestinySubclassId] || ''}
						onChange={handleChange}
						title="Jump"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default JumpSelector;
