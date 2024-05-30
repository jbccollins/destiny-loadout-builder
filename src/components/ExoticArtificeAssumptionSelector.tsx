import {
	selectSelectedExoticArtificeAssumption,
	setSelectedExoticArtificeAssumption,
} from '@dlb/redux/features/selectedExoticArtificeAssumption/selectedExoticArtificeAssumptionSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { EExoticArtificeAssumption } from '@dlb/types/IdEnums';
import HelpIcon from '@mui/icons-material/Help';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	styled,
} from '@mui/material';
import CustomTooltip from './CustomTooltip';

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
			<CustomTooltip
				title={
					'Exotic Class Items will only be treated as having an artifice modslot if this setting is set to "All". Put another way: Exotic Class Items that already have an artifice modslot WILL NOT be treated as having an artifice modslot UNLESS this setting is set to "All".'
				}
			>
				<HelpIcon />
			</CustomTooltip>
		</Container>
	);
};

export default ExoticArtificeAssumptionSelector;
