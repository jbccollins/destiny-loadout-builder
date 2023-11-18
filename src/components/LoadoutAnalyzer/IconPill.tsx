'use client';

import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import { ReactElement } from 'react';
import CustomTooltip from '../CustomTooltip';

export default function IconPill({
	children,
	color,

	tooltipText,
}: {
	children: ReactElement;
	color: string;
	tooltipText: string;
}) {
	const theme = useTheme();
	return (
		<CustomTooltip title={tooltipText} hideOnMobile>
			<Box
				sx={{
					background: '#585858',
					display: 'inline-flex',
					//padding: theme.spacing(0.5),
					borderRadius: '16px',
					// paddingTop: '10px',
					height: '32px',
					width: '32px',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
				}}
			>
				<Box sx={{ color: color || 'white', marginTop: '6px' }}>{children}</Box>
			</Box>
		</CustomTooltip>
	);
}
