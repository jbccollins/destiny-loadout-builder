import type { NextPage } from 'next';
import Head from 'next/head';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	styled
} from '@mui/material';
import { useState } from 'react';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';

// const CharacterClassAndExoticContainer = styled(Box)(({ theme }) => ({
// 	color: theme.palette.primary.main,
// 	padding: theme.spacing(4),
// 	display: 'flex',
// 	justifyContent: 'left',
// 	['.demo-simple-select']: {
// 		['.character-class-name']: {
// 			display: 'none'
// 		}
// 	},
// 	['.exotic-selector-text-field fieldset']: {
// 		borderTopLeftRadius: '0px',
// 		borderBottomLeftRadius: '0px',
// 		borderLeftColor: 'transparent'
// 	}
// }));

const MenuItemContent = styled('div')(({ theme }) => ({
	display: 'flex',
	// justifyContent: 'center',
	alignItems: 'center'
}));

const MenuItemText = styled('div')(({ theme }) => ({
	// position: 'absolute'
	marginLeft: theme.spacing(1),
	textTransform: 'capitalize'
}));

interface IconDropdownOption {
	icon: string;
	id: string | number;
	disabled: boolean;
}

type IconDropdownProps = {
	options: IconDropdownOption[];
	getLabel: (option: IconDropdownOption) => string;
	onChange: (value: string) => void;
	value: string;
};

const IconDropdown = ({
	options,
	getLabel,
	onChange,
	value
}: IconDropdownProps) => {
	const handleChange = (value: string) => {
		console.log('>>>>>>>>>>>> selected character class <<<<<<<<<<<<<<', value);
		onChange(value);
	};
	return (
		<FormControl fullWidth>
			<InputLabel id="demo-simple-select-label">Class</InputLabel>
			<Select
				sx={{
					maxWidth: 100,
					borderTopRightRadius: 0,
					borderBottomRightRadius: 0
				}}
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				className="demo-simple-select"
				value={value}
				label="Class"
				onChange={(e) => {
					handleChange(e.target.value as string);
				}}
			>
				{options.map((option) => {
					const label = getLabel(option);
					return (
						<MenuItem key={option.id} value={label} disabled={option.disabled}>
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
