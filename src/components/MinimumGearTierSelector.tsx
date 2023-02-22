import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectProps,
	styled,
} from '@mui/material';
import {
	selectSelectedMinimumGearTier,
	setSelectedMinimumGearTier,
} from '@dlb/redux/features/selectedMinimumGearTier/selectedMinimumGearTierSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { EGearTierId } from '@dlb/types/IdEnums';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

const MinimumGearTierSelector = () => {
	const selectedMinimumGearTier = useAppSelector(selectSelectedMinimumGearTier);
	const dispatch = useAppDispatch();
	const handleChange = (value: EGearTierId) => {
		dispatch(setSelectedMinimumGearTier(value));
	};
	return (
		<Container>
			<FormControl fullWidth>
				<InputLabel id="minimum-gear-tier">Minimum Gear Tier</InputLabel>
				<Select
					labelId="minimum-gear-tier"
					id="minimum-gear-tier"
					value={selectedMinimumGearTier}
					label="Minimum Gear Tier"
					onChange={(e) => {
						handleChange(e.target.value as EGearTierId);
					}}
				>
					<MenuItem value={EGearTierId.Legendary}>
						{EGearTierId.Legendary}
					</MenuItem>
					<MenuItem value={EGearTierId.Rare}>{EGearTierId.Rare}</MenuItem>
				</Select>
			</FormControl>
		</Container>
	);
};

export default MinimumGearTierSelector;
