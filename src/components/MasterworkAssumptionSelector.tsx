import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectProps,
	styled,
} from '@mui/material';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import {
	selectSelectedMasterworkAssumption,
	setSelectedMasterworkAssumption,
} from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { EMasterworkAssumption } from '@dlb/types/IdEnums';

const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

interface MasterworkAssumptionSelectorOption {
	icon: string;
	id: string | number;
	disabled?: boolean;
}

type MasterworkAssumptionSelectorProps = {
	options: MasterworkAssumptionSelectorOption[];
	getLabel: (option: MasterworkAssumptionSelectorOption) => string;
	onChange: (value: string) => void;
	value: string;
	title?: string;
	selectComponentProps: SelectProps;
};

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
		</Container>
	);
};

export default MasterworkAssumptionSelector;
