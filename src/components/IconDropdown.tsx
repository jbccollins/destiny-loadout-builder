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

const Container = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'hideSelectedOptionText',
})<{ hideSelectedOptionText?: boolean }>(
	({ theme, hideSelectedOptionText }) => ({
		['.icon-dropdown-select']: {
			['.icon-dropdown-menu-item-text-description']: {
				display: 'none',
			},
			['.icon-dropdown-menu-item-content']: {
				alignItems: 'center ',
			},
			['.icon-dropdown-menu-item-text']: {
				display: hideSelectedOptionText ? 'none' : '',
			},
		},
	})
);

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
	selectComponentProps?: SelectProps;
	hideSelectedOptionText?: boolean;
};

const IconDropdown = ({
	options,
	getLabel,
	onChange,
	value,
	title,
	selectComponentProps,
	getDescription,
	hideSelectedOptionText,
}: IconDropdownProps) => {
	const handleChange = (value: string) => {
		onChange(value);
	};
	return (
		<Container hideSelectedOptionText={hideSelectedOptionText}>
			<FormControl fullWidth>
				<InputLabel id="icon-dropdown-select-label">{title || ''}</InputLabel>
				<Select
					{...selectComponentProps}
					labelId="icon-dropdown-select-label"
					id="icon-dropdown-select"
					className="icon-dropdown-select"
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
								className="icon-dropdown-menu-item"
								key={option.id}
								value={option.id}
								disabled={option.disabled}
							>
								<MenuItemContent
									className="icon-dropdown-menu-item-content"
									hasDescription={hasDescription}
								>
									<BungieImage width={40} height={40} src={option.icon} />
									<MenuItemText className="icon-dropdown-menu-item-text">
										{label}
										{hasDescription && (
											<Box
												className="icon-dropdown-menu-item-text-description"
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
		</Container>
	);
};

export default IconDropdown;
