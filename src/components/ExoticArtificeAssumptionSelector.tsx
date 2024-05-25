import {
	selectSelectedExoticArtificeAssumption,
	setSelectedExoticArtificeAssumption,
} from '@dlb/redux/features/selectedExoticArtificeAssumption/selectedExoticArtificeAssumptionSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { EExoticArtificeAssumption } from '@dlb/types/IdEnums';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	styled,
} from '@mui/material';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
}));

const ExoticArtificeAssumptionSelector = () => {
	const selectedExoticArtificeAssumption = useAppSelector(
		selectSelectedExoticArtificeAssumption
	);
	const dispatch = useAppDispatch();
	const handleChange = (value: EExoticArtificeAssumption) => {
		dispatch(setSelectedExoticArtificeAssumption(value));
	};
	return (
		<Container>
			<FormControl fullWidth>
				<InputLabel id="exoticArtifice-assumption">
					Exotic Artifice Assumption
				</InputLabel>
				<Select
					labelId="exoticArtifice-assumption"
					id="exoticArtifice-assumption"
					value={selectedExoticArtificeAssumption}
					label="Exotic Artifice Assumption"
					onChange={(e) => {
						handleChange(e.target.value as EExoticArtificeAssumption);
					}}
				>
					<MenuItem value={EExoticArtificeAssumption.All}>
						{EExoticArtificeAssumption.All}
					</MenuItem>
					<MenuItem value={EExoticArtificeAssumption.Masterworked}>
						{EExoticArtificeAssumption.Masterworked}
					</MenuItem>
					<MenuItem value={EExoticArtificeAssumption.None}>
						{EExoticArtificeAssumption.None}
					</MenuItem>
				</Select>
			</FormControl>
		</Container>
	);
};

export default ExoticArtificeAssumptionSelector;
