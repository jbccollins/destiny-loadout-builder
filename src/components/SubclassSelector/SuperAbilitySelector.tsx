import IconDropdown from '@dlb/components/IconDropdown';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import {
	selectSelectedSuperAbility,
	setSelectedSuperAbility,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getSuperAbility } from '@dlb/types/SuperAbility';
import { styled } from '@mui/material';
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

function SuperAbilitySelector() {
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const dispatch = useAppDispatch();

	const getLabel = (option: Option) => option.label;

	const getDescription = (option: Option) => option.description;

	const selectedDestinySubclassId =
		selectedDestinySubclass[selectedDestinyClass];

	const handleChange = (superAbilityId: ESuperAbilityId) => {
		dispatch(
			setSelectedSuperAbility({
				...selectedSuperAbility,
				[selectedDestinySubclassId]: superAbilityId,
			})
		);
	};

	let options: Option[] = [];
	if (selectedDestinySubclassId) {
		// TODO: Memoize these options
		options = [
			...getDestinySubclass(selectedDestinySubclassId).superAbilityIdList.map(
				(superAbilityId) => {
					const { name, id, icon, description } =
						getSuperAbility(superAbilityId);
					return {
						label: name,
						icon: icon,
						id: id,
						description: description,
					};
				}
			),
		];
	}
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
						value={selectedSuperAbility[selectedDestinySubclassId] || ''}
						onChange={handleChange}
						title="Super"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default SuperAbilitySelector;
