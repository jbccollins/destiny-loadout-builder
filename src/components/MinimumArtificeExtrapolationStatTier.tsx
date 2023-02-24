import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	styled,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	selectSelectedMinimumArtificeExtrapolationStatTier,
	setSelectedMinimumArtificeExtrapolationStatTier,
} from '@dlb/redux/features/selectedMinimumArtificeExtrapolationStatTier/selectedMinimumArtificeExtrapolationStatTierSlice';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

const MinimumArtificeExtrapolationStatTierSelector = () => {
	const selectedMinimumArtificeExtrapolationStatTier = useAppSelector(
		selectSelectedMinimumArtificeExtrapolationStatTier
	);
	const dispatch = useAppDispatch();
	const handleChange = (value: number) => {
		dispatch(setSelectedMinimumArtificeExtrapolationStatTier(value));
	};
	return (
		<Container>
			<FormControl fullWidth>
				<InputLabel id="minimum-artifice-extrapolation-stat-tier">
					Minimum Artifice Extrapolation Stat Tier
				</InputLabel>
				<Select
					labelId="minimum-artifice-extrapolation-stat-tier"
					id="minimum-artifice-extrapolation-stat-tier"
					value={selectedMinimumArtificeExtrapolationStatTier}
					label="Minimum Artifice Extrapolation Stat Tier"
					onChange={(e) => {
						handleChange(e.target.value as number);
					}}
				>
					{Array.from(Array(11).keys()).map((x) => (
						<MenuItem key={x} value={x}>
							{x}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Container>
	);
};

export default MinimumArtificeExtrapolationStatTierSelector;
