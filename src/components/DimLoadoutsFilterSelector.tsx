import dim_logo_image from '@/public/dim-logo.png';
import {
	selectDimLoadoutsFilter,
	setDimLoadoutsFilter,
} from '@dlb/redux/features/dimLoadoutsFilter/dimLoadoutsFilterSlice';

import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	DimLoadoutsFilterIdList,
	getDimLoadoutsFilter,
} from '@dlb/types/DimLoadoutsFilter';
import { EDimLoadoutsFilterId } from '@dlb/types/IdEnums';
import { styled } from '@mui/material';
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

const options = DimLoadoutsFilterIdList.map((dimLoadoutsFilterId) => {
	const { id, description } = getDimLoadoutsFilter(dimLoadoutsFilterId);
	return {
		label: description,
		// TODO: Change this external icon lol
		icon: dim_logo_image,
		id: id,
	};
});

const getLabel = (option: Option) => option.label;

function DimLoadoutsFilterSelector() {
	const selectedDimLoadoutsFilter = useAppSelector(selectDimLoadoutsFilter);
	const dispatch = useAppDispatch();
	const handleChange = (value: EDimLoadoutsFilterId) => {
		dispatch(setDimLoadoutsFilter(value));
	};
	return (
		<>
			<Container>
				<IconDropdownContainer>
					<IconDropdown
						options={options}
						getLabel={getLabel}
						value={selectedDimLoadoutsFilter}
						onChange={(e) => {
							handleChange(e as EDimLoadoutsFilterId);
						}}
						title="DIM Loadouts"
					/>
				</IconDropdownContainer>
			</Container>
		</>
	);
}

export default DimLoadoutsFilterSelector;
