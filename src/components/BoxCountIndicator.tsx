'use client';

import { Box } from '@mui/material';

type BoxCountIndicatorProps = {
	max: number;
	count: number;
	prefix?: string;
};

function BoxCountIndicator({ max, count, prefix }: BoxCountIndicatorProps) {
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					height: '10px',
					marginTop: '4px',
				}}
			>
				{prefix && (
					<Box
						sx={{
							fontSize: '12px',
							fontWeight: 400,
							marginTop: '-4px',
							marginRight: '4px',
							color: 'rgba(255, 255, 255, 0.7)',
						}}
					>
						{prefix}
					</Box>
				)}
				{[...Array(max).keys()].reverse().map((x, i) => {
					return (
						<Box
							key={x}
							sx={{
								marginRight: i === max - 1 ? '0px' : '4px',
								border: '1px solid grey',
								background: x < count ? 'white' : '',
								width: '10px',
							}}
						/>
					);
				})}
			</Box>
		</>
	);
}

export default BoxCountIndicator;
