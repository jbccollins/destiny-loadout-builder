import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectProps,
	styled,
} from '@mui/material';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';

const MenuItemContent = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
}));

const MenuItemText = styled('div')(({ theme }) => ({
	marginLeft: theme.spacing(1),
	// textTransform: 'capitalize'
}));

interface IconDropdownOption {
	icon: string;
	id: string | number;
	disabled?: boolean;
}

type IconDropdownProps = {
	options: IconDropdownOption[];
	getLabel: (option: IconDropdownOption) => string;
	onChange: (value: string) => void;
	value: string;
	title?: string;
	selectComponentProps: SelectProps;
};

const IconDropdown = ({
	options,
	getLabel,
	onChange,
	value,
	title,
	selectComponentProps,
}: IconDropdownProps) => {
	const handleChange = (value: string) => {
		console.log('>>>>>>>>>>>> change <<<<<<<<<<<<<<', value);
		onChange(value);
	};
	return (
		<FormControl fullWidth>
			<InputLabel id="demo-simple-select-label">{title || ''}</InputLabel>
			<Select
				{...selectComponentProps}
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				className="demo-simple-select"
				value={value}
				label={title || ''}
				onChange={(e) => {
					handleChange(e.target.value as string);
				}}
			>
				{options.map((option) => {
					const label = getLabel(option);
					return (
						<MenuItem
							key={option.id}
							value={option.id}
							disabled={option.disabled}
						>
							<MenuItemContent>
								<BungieImage width={40} height={40} src={option.icon} />
								<MenuItemText className="character-class-name">
									{label}
								</MenuItemText>
							</MenuItemContent>
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
};

export default IconDropdown;
