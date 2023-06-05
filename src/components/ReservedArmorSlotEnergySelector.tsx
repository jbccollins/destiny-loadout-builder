import {
	selectReservedArmorSlotEnergy,
	setReservedArmorSlotEnergy,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import { EArmorSlotId } from '@dlb/types/IdEnums';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	styled,
} from '@mui/material';
const Container = styled('div')(({ theme }) => ({
	padding: theme.spacing(1),
}));

type Option = {
	value: number;
	disabled?: boolean;
};

const getLabel = (option: Option) => option.value;

function ReservedArmorSlotEnergySelector() {
	const reservedArmorSlotEnergy = useAppSelector(selectReservedArmorSlotEnergy);
	const dispatch = useAppDispatch();

	const handleChange = (armorSlotId: EArmorSlotId, value: number) => {
		dispatch(
			setReservedArmorSlotEnergy({
				...reservedArmorSlotEnergy,
				[armorSlotId]: value,
			})
		);
	};

	return (
		<Container>
			{ArmorSlotWithClassItemIdList.map((armorSlotId) => (
				<FormControl key={armorSlotId}>
					<InputLabel
						id={`reserved-armor-slot-energy-selector-${armorSlotId}-label`}
					>
						{armorSlotId}
					</InputLabel>
					<Select
						sx={{ minWidth: 65 }}
						labelId={`reserved-armor-slot-energy-selector-${armorSlotId}-label`}
						id={`reserved-armor-slot-energy-selector-${armorSlotId}`}
						onChange={(event: SelectChangeEvent) => {
							handleChange(armorSlotId, Number(event.target.value));
						}}
						value={reservedArmorSlotEnergy[armorSlotId].toString()}
						label={armorSlotId}
					>
						{[...Array(11).keys()].map((value) => (
							<MenuItem key={value} value={value}>
								{value}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			))}
		</Container>
	);
}

export default ReservedArmorSlotEnergySelector;
