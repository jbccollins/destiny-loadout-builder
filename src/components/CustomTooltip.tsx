// This is just a mui tooltip with some default props
import {
	Box,
	ClickAwayListener,
	Tooltip,
	TooltipProps,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { useState } from 'react';
type CustomTooltipProps = TooltipProps;

const defaultProps: Partial<TooltipProps> = {
	enterTouchDelay: 0,
	enterDelay: 0,
	placement: 'bottom',
	arrow: true,
};

export default function CustomTooltip(props: CustomTooltipProps) {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

	const [open, setOpen] = useState(false);

	const handleTooltipClose = () => {
		setOpen(false);
	};

	const handleTooltipOpen = () => {
		setOpen(true);
	};

	// Mobile tooltips are click away
	if (isSmallScreen) {
		return (
			<ClickAwayListener onClickAway={handleTooltipClose}>
				<div>
					<Tooltip
						{...defaultProps}
						{...props}
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
		<Tooltip {...defaultProps} {...props}>
			{props.children}
		</Tooltip>
	);
}
