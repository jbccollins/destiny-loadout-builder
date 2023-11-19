"use client";

import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { MISSING_ICON } from '@dlb/types/globals';
import { Box } from '@mui/material';

type SocketProps = {
	getIcon: () => string;
};

export const Socket = (props: SocketProps) => {
	const { getIcon } = props;
	const icon = getIcon() || MISSING_ICON;
	return (
		<Box
			sx={{
				width: '40px',
				height: '40px',
				opacity: icon === MISSING_ICON ? 0.6 : 1,
			}}
		>
			<BungieImage src={icon} width={40} height={40} />
		</Box>
	);
};
