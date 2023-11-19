import {
	selectInGameLoadoutsFilter,
	setInGameLoadoutsFilter,
} from '@dlb/redux/features/inGameLoadoutsFilter/inGameLoadoutsFilterSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { EInGameLoadoutsFilterId } from '@dlb/types/IdEnums';
import {
	getInGameLoadoutsFilter,
	InGameLoadoutsFilterIdList,
} from '@dlb/types/InGameLoadoutsFilter';
import { styled } from '@mui/material';
import d2_logo_image from '@public/d2-logo.png';
import IconDropdown from './IconDropdown';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
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

const options = InGameLoadoutsFilterIdList.map((inGameLoadoutsFilterId) => {
	const { id, description } = getInGameLoadoutsFilter(inGameLoadoutsFilterId);
	return {
		label: description,
		icon: d2_logo_image,
		id: id,
	};
});

const getLabel = (option: Option) => option.label;

function InGameLoadoutsFilterSelector() {
	const selectedInGameLoadoutsFilter = useAppSelector(
		selectInGameLoadoutsFilter
	);
	const dispatch = useAppDispatch();
	const handleChange = (value: EInGameLoadoutsFilterId) => {
		dispatch(setInGameLoadoutsFilter(value));
	};
	return (
		<>
			<Container>
				<IconDropdownContainer>
					<IconDropdown
						options={options}
						getLabel={getLabel}
						value={selectedInGameLoadoutsFilter}
						onChange={(e) => {
							handleChange(e as EInGameLoadoutsFilterId);
						}}
						title="D2 Loadouts"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default InGameLoadoutsFilterSelector;
