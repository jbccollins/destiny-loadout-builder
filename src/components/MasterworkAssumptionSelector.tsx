import {
	selectSelectedMasterworkAssumption,
	setSelectedMasterworkAssumption,
} from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { EMasterworkAssumption } from '@dlb/types/IdEnums';
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

const MasterworkAssumptionSelector = () => {
	const selectedMasterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	const dispatch = useAppDispatch();
	const handleChange = (value: EMasterworkAssumption) => {
		dispatch(setSelectedMasterworkAssumption(value));
	};
	return (
		<Container>
			<FormControl fullWidth>
				<InputLabel id="masterwork-assumption">
					Masterwork Assumption
				</InputLabel>
				<Select
					labelId="masterwork-assumption"
					id="masterwork-assumption"
					value={selectedMasterworkAssumption}
					label="Masterwork Assumption"
					onChange={(e) => {
						handleChange(e.target.value as EMasterworkAssumption);
					}}
				>
					<MenuItem value={EMasterworkAssumption.All}>
						{EMasterworkAssumption.All}
					</MenuItem>
					<MenuItem value={EMasterworkAssumption.Legendary}>
						{EMasterworkAssumption.Legendary}
					</MenuItem>
					<MenuItem value={EMasterworkAssumption.None}>
						{EMasterworkAssumption.None}
					</MenuItem>
				</Select>
			</FormControl>
			<CustomTooltip
				title={
					'Class items are always assumed to be masterworked regardless of this setting.'
				}
			>
				<HelpIcon />
			</CustomTooltip>
		</Container>
	);
};

export default MasterworkAssumptionSelector;
