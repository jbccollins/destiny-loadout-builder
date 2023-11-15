"use client";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, IconButton, styled } from '@mui/material';
import { noop } from 'lodash';
const Container = styled(Box)(({ theme }) => ({
	//paddingLeft: theme.spacing(1),
	marginBottom: theme.spacing(2),
	// borderLeft: `1px solid rgb(128, 128, 128)`,
}));

const Title = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(1),
	paddingLeft: theme.spacing(1),
	fontSize: theme.typography.h6.fontSize,
	fontWeight: theme.typography.h6.fontWeight,
	display: 'flex',
}));

type SelectionControlGroupProps = {
	children: React.ReactNode;
	title: React.ReactNode;
	withCollapse?: boolean;
	open?: boolean;
	handleCollapseToggle?: () => void;
	clearHandler?: () => void;
};

function SelectionControlGroup({
	children,
	title,
	clearHandler,
	withCollapse,
	handleCollapseToggle,
	open,
}: SelectionControlGroupProps) {
	return (
		<Container>
			<Title>
				<Box
					onClick={withCollapse ? handleCollapseToggle : noop}
					sx={{ cursor: withCollapse ? 'pointer' : 'initial' }}
				>
					{title}
				</Box>
				{withCollapse && (
					<Box
						onClick={handleCollapseToggle}
						sx={{ cursor: 'pointer', marginLeft: '4px' }}
					>
						<IconButton aria-label="expand row" size="small">
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</Box>
				)}
				{/* Spacer box */}
				<Box sx={{ flex: 1 }}></Box>
				{clearHandler && (
					<Button
						size="small"
						variant="outlined"
						onClick={clearHandler}
						sx={{ height: '30px', marginRight: '9px' }}
					>
						Clear
					</Button>
				)}
			</Title>
			{children}
		</Container>
	);
}

export default SelectionControlGroup;
