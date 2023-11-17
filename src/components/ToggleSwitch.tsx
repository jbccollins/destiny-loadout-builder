'use client';

import { Help } from '@mui/icons-material';
import { alpha, Box, styled } from '@mui/material';
import { blue } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import * as React from 'react';
import CustomTooltip from './CustomTooltip';

const ColoredSwitch = styled(Switch)(({ theme }) => ({
	'& .MuiSwitch-switchBase.Mui-checked': {
		color: blue[600],
		'&:hover': {
			backgroundColor: alpha(blue[600], theme.palette.action.hoverOpacity),
		},
	},
	'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
		backgroundColor: blue[600],
	},
}));

type ToggleSwitchProps = {
	onChange: (value: boolean) => void;
	value: boolean;
	title: string;
	helpText?: string;
};
export default function ToggleSwitch({
	onChange,
	value,
	title,
	helpText,
}: ToggleSwitchProps) {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.checked);
	};
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ flex: 1 }}>{title}:</Box>
			<ColoredSwitch
				color="secondary"
				onChange={handleChange}
				checked={value}
			/>
			{helpText && (
				<CustomTooltip title={helpText}>
					<Help />
				</CustomTooltip>
			)}
		</Box>
	);
}
