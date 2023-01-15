import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectProps,
	styled,
} from '@mui/material';
import {
	selectDimLoadoutsFilter,
	setDimLoadoutsFilter,
} from '@dlb/redux/features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { EDimLoadoutsFilterId } from '@dlb/types/IdEnums';
import { getDimLoadoutsFilter } from '@dlb/types/DimLoadoutsFilter';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

const DimLoadoutsFilterSelector = () => {
	const selectedDimLoadoutsFilter = useAppSelector(selectDimLoadoutsFilter);
	const dispatch = useAppDispatch();
	const handleChange = (value: EDimLoadoutsFilterId) => {
		dispatch(setDimLoadoutsFilter(value));
	};
	return (
		<Container>
			<FormControl fullWidth>
				<InputLabel id="dim-loadouts">DIM Loadouts</InputLabel>
				<Select
					labelId="dim-loadouts"
					id="dim-loadouts"
					value={selectedDimLoadoutsFilter}
					label="DIM Loadouts"
					onChange={(e) => {
						handleChange(e.target.value as EDimLoadoutsFilterId);
					}}
				>
					<MenuItem value={EDimLoadoutsFilterId.All}>
						{getDimLoadoutsFilter(EDimLoadoutsFilterId.All).description}
					</MenuItem>
					<MenuItem value={EDimLoadoutsFilterId.None}>
						{getDimLoadoutsFilter(EDimLoadoutsFilterId.None).description}
					</MenuItem>
				</Select>
			</FormControl>
		</Container>
	);
};

export default DimLoadoutsFilterSelector;
