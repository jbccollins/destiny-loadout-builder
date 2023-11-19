"use client";

import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { MISSING_ICON } from '@dlb/types/globals';
import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectProps,
	styled,
} from '@mui/material';
import { StaticImageData } from 'next/image';

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
	icon: string | StaticImageData;
	id: string | number;
	disabled?: boolean;
}

type IconDropdownProps = {
	options: IconDropdownOption[];
	getLabel: (option: IconDropdownOption) => string;
	getDescription?: (option: IconDropdownOption) => string | JSX.Element;
	onChange: (value: string) => void;
	value: string;
	title?: string;
	selectComponentProps?: SelectProps;
	hideSelectedOptionText?: boolean;
	allowNoSelection?: boolean;
	disabled?: boolean;
};

const PLACEHOLDER_OPTION = 'None Selected...';
const DISABLED_TEXT = 'Subclass Selection Required...';
const IconDropdown = ({
	options,
	getLabel,
	onChange,
	value,
	title,
	selectComponentProps,
	getDescription,
	hideSelectedOptionText,
	allowNoSelection,
	disabled,
}: IconDropdownProps) => {
	const handleChange = (value: string) => {
		let v = null;
		if (value !== '') {
			v = value;
		}
		onChange(v);
	};
	return (
		<Container hideSelectedOptionText={hideSelectedOptionText}>
			<FormControl fullWidth>
				<InputLabel shrink id="icon-dropdown-select-label">
					{title || ''}
				</InputLabel>
				<Select
					disabled={disabled}
					notched
					displayEmpty={allowNoSelection}
					{...selectComponentProps}
					labelId="icon-dropdown-select-label"
					id="icon-dropdown-select"
					className="icon-dropdown-select"
					value={allowNoSelection ? (value ? value : '') : value}
					label={title || ''}
					onChange={(e) => {
						handleChange(e.target.value as string);
					}}
				>
					{allowNoSelection && (
						<MenuItem className="icon-dropdown-menu-item" value={''}>
							<MenuItemContent className="icon-dropdown-menu-item-content">
								<BungieImage width={40} height={40} src={MISSING_ICON} />
								<MenuItemText className="icon-dropdown-menu-item-text">
									{disabled ? DISABLED_TEXT : PLACEHOLDER_OPTION}
								</MenuItemText>
							</MenuItemContent>
						</MenuItem>
					)}
					{options.map((option) => {
						const label = getLabel(option);
						let description: string | JSX.Element | null = null;
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
