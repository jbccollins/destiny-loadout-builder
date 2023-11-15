"use client";

// This is just a mui tooltip with some default props
import { Box, ClickAwayListener, Tooltip, TooltipProps } from '@mui/material';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
type CustomTooltipProps = TooltipProps & {
	hideOnMobile?: boolean;
};

const defaultTooltipProps: Partial<TooltipProps> = {
	enterTouchDelay: 0,
	enterDelay: 0,
	placement: 'bottom',
	arrow: true,
	PopperProps: {
		sx: {
			'& .MuiTooltip-tooltip, .MuiTooltip-arrow:before ': {
				backgroundColor: '#2b2b2b',
			},
			fontSize: '24px',
		},
	},
};

export default function CustomTooltip(props: CustomTooltipProps) {
	const { hideOnMobile, ...otherProps } = props;
	const [open, setOpen] = useState(false);

	const handleTooltipClose = () => {
		setOpen(false);
	};

	const handleTooltipOpen = () => {
		if (hideOnMobile && isMobile) {
			return;
		}
		setOpen(true);
	};

	// Mobile tooltips are click away
	if (isMobile) {
		return (
			<ClickAwayListener onClickAway={handleTooltipClose}>
				<div>
					<Tooltip
						{...defaultTooltipProps}
						{...otherProps}
						PopperProps={{
							disablePortal: true,
						}}
						onClose={handleTooltipClose}
						open={open}
						disableFocusListener
						disableHoverListener
						disableTouchListener
					>
						<Box onClick={handleTooltipOpen}>{props.children}</Box>
					</Tooltip>
				</div>
			</ClickAwayListener>
		);
	}
	// Desktop tooltips are hover
	return (
		<Tooltip {...defaultTooltipProps} {...otherProps}>
			{props.children}
		</Tooltip>
	);
}
