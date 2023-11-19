import { Box } from '@mui/material';
import LoadoutTypeFilter from './LoadoutTypeFilter';
import OptimizationTypeFilter from './OptimizationTypeFilter';

export default function Filters() {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
				border: '1px solid rgb(50, 50, 50)',
				background: 'rgb(50, 50, 50)',
				marginLeft: '-8px',
				width: 'calc(100% + 16px)',
				padding: '8px',
				borderRadius: '4px',
				position: 'relative',
			}}
		>
			<OptimizationTypeFilter />
			<LoadoutTypeFilter />
		</Box>
	);
}
