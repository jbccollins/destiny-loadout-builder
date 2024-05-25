import {
	selectAnalyzerExoticArtificeAssumption,
	setAnalyzerExoticArtificeAssumption,
} from '@dlb/redux/features/analyzerExoticArtificeAssumption/analyzerExoticArtificeAssumption';
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
	const analyzerExoticArtificeAssumption = useAppSelector(
		selectAnalyzerExoticArtificeAssumption
	);
	const dispatch = useAppDispatch();
	const handleChange = (value: EExoticArtificeAssumption) => {
		dispatch(setAnalyzerExoticArtificeAssumption(value));
	};
	return (
		<Container>
			<FormControl fullWidth>
				<InputLabel id="exoticArtifice-assumption">
					Anaylzer Exotic Artifice Assumption
				</InputLabel>
				<Select
					labelId="exoticArtifice-assumption"
					id="exoticArtifice-assumption"
					value={analyzerExoticArtificeAssumption}
					label="Analyzer Exotic Artifice Assumption"
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
					'Changing this setting will require a full page reload to take effect.'
				}
			>
				<HelpIcon />
			</CustomTooltip>
		</Container>
	);
};

export default ExoticArtificeAssumptionSelector;
