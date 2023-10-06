import { AnalyzableLoadout } from '@dlb/types/AnalyzableLoadout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, IconButton } from '@mui/material';
import { useState } from 'react';
type BreakdownProps = {
	loadout: AnalyzableLoadout;
};

const BreakdownContent = (props: BreakdownProps) => {
	return <Box>Content</Box>;
};

export default function Breakdown(props: BreakdownProps) {
	const [open, setOpen] = useState(false);
	return (
		<Box>
			<Box
				onClick={() => setOpen(!open)}
				sx={{
					cursor: 'pointer',
					marginTop: '16px',
					// position: 'absolute',
					// left: '50%',
					// transform: 'translate(-50%, 0)',
				}}
			>
				Show Loadout Details
				<IconButton aria-label="expand row" size="small">
					{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</Box>
			<Box>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<BreakdownContent {...props} />
				</Collapse>
			</Box>
		</Box>
	);
}
