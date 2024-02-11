import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, IconButton } from '@mui/material';
import { useState } from 'react';
import AssumedStatValues from './AssumedStatValues';

export default function AdvancedOptions() {
	const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Box
				onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
				sx={{
					cursor: 'pointer',
					// position: 'absolute',
					// left: '50%',
					// transform: 'translate(-50%, 0)',
				}}
			>
				Advanced Stat Selection Options
				<IconButton aria-label="expand row" size="small">
					{advancedOptionsOpen ? (
						<KeyboardArrowUpIcon />
					) : (
						<KeyboardArrowDownIcon />
					)}
				</IconButton>
			</Box>
			<Box>
				<Collapse in={advancedOptionsOpen} timeout="auto" unmountOnExit>
					<Box sx={{ marginBottom: '30px' }}>
						<AssumedStatValues />
					</Box>
				</Collapse>
			</Box>
		</Box>
	);
}
