import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectProps,
	styled,
} from '@mui/material';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';

// const MenuItemContent = styled('div')(({ theme }) => ({
// 	display: 'flex',
// 	alignItems: 'center',
// }));

const MenuItemContent = styled('div', {
	shouldForwardProp: (prop) => prop !== 'hasDescription',
})<{ hasDescription?: boolean }>(({ theme, hasDescription }) => ({
	display: 'flex',
	alignItems: hasDescription ? '' : 'center',
}));

const MenuItemText = styled('div')(({ theme }) => ({
	marginLeft: theme.spacing(1),

	// overflow: 'none',
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
	getDescription?: (option: IconDropdownOption) => string;
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
	getDescription,
}: IconDropdownProps) => {
	const handleChange = (value: string) => {
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
					let description: string = null;
					let hasDescription = false;
					if (getDescription) {
						description = getDescription(option);
						hasDescription = true;
					}
					return (
						<MenuItem
							key={option.id}
							value={option.id}
							disabled={option.disabled}
						>
							<MenuItemContent hasDescription={hasDescription}>
								<BungieImage width={40} height={40} src={option.icon} />
								<MenuItemText className="character-class-name">
									{label}
									{hasDescription && (
										<Box
											className="icon-dropdown-description"
											sx={{
												maxWidth: 300,
												whiteSpace: 'break-spaces',
												wordWrap: 'wrap',
											}}
										>
											{description}
										</Box>
									)}
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
