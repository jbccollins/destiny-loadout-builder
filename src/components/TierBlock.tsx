'use client';

import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const TierBlock = styled(Box, {
	shouldForwardProp: (prop) =>
		![
			'filled',
			'first',
			'last',
			'borderWidth',
			'backgroundColor',
			'withLastBorder',
			'height',
		].includes(prop as string),
})<{
	filled?: boolean;
	first: boolean;
	last: boolean;
	borderWidth?: string;
	backgroundColor?: string;
	withLastBorder?: boolean;
	height?: string;
}>(
	({
		filled,
		first,
		last,
		borderWidth,
		backgroundColor,
		withLastBorder,
		height,
	}) => ({
		flex: '1 1 0px', //Ensure all the same width
		width: 0,
		// paddingLeft: "3px",
		// paddingRight: "3px",
		// paddingTop: "6px",
		// paddingBottom: "6px",
		textAlign: 'center',
		background: filled
			? 'white'
			: `${backgroundColor ? backgroundColor : 'black'}`,
		borderTop: '1px solid',
		borderBottom: '1px solid',
		borderLeft: first ? '1px solid' : '',
		borderRight: '1px solid',
		borderColor: filled ? 'white' : 'rgb(128, 128, 128)',
		color: filled ? 'black' : '',
		borderRightColor: filled && !last ? 'black' : '',
		height: height ? height : 24,
		borderTopLeftRadius: first ? `4px` : '0px',
		borderBottomLeftRadius: first ? `4px` : '0px',
		borderTopRightRadius: last ? `4px` : '0px',
		borderBottomRightRadius: last ? `4px` : '0px',
	})
);
