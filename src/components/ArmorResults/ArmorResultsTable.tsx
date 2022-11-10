import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import Shield from '@mui/icons-material/Shield';
import { TablePagination } from '@mui/material';
import { ResultsTableArmorItem } from './ArmorResultsView';

function Row(props: { row: ResultsTableArmorItem }) {
	const { row } = props;
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow
				sx={{ '& > *': { borderBottom: 'unset' }, border: '1px solid red' }}
			>
				<TableCell sx={{ width: '100px', height: '60px' }}>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell>{row.totalStats[0]}</TableCell>
				<TableCell>{row.totalStats[1]}</TableCell>
				<TableCell>{row.totalStats[2]}</TableCell>
				<TableCell>{row.totalStats[3]}</TableCell>
				<TableCell>{row.totalStats[4]}</TableCell>
				<TableCell>{row.totalStats[5]}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					style={{
						padding: 0
					}}
					colSpan={7}
				>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ padding: 2, border: '1px solid red', marginRight: 1 }}>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell sx={{ width: '100px', height: '60px' }}>
											<Shield />
										</TableCell>
										<TableCell>Mob</TableCell>
										<TableCell>Res</TableCell>
										<TableCell>Rec</TableCell>
										<TableCell>Dis</TableCell>
										<TableCell>Int</TableCell>
										<TableCell>Str</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.armorItems.map((armorItem) => (
										<TableRow key={armorItem.id}>
											<TableCell sx={{ width: '100px', height: '60px' }}>
												<BungieImage
													width={'40px'}
													height={'40px'}
													src={armorItem.icon}
												/>
											</TableCell>
											<TableCell>{armorItem.stats[0]}</TableCell>
											<TableCell>{armorItem.stats[1]}</TableCell>
											<TableCell>{armorItem.stats[2]}</TableCell>
											<TableCell>{armorItem.stats[3]}</TableCell>
											<TableCell>{armorItem.stats[4]}</TableCell>
											<TableCell>{armorItem.stats[5]}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

// const rows = [
// 	createData('1'),
// 	createData('3'),
// 	createData('4'),
// 	createData('5'),
// 	createData('6'),
// 	createData('7'),
// 	createData('8'),
// 	createData('9'),
// 	createData('10'),
// 	createData('11'),
// 	createData('12'),
// 	createData('13'),
// 	createData('14'),
// 	createData('15'),
// 	createData('16'),
// 	createData('17')
// ];

type ArmorResultsTableProps = {
	items: ResultsTableArmorItem[];
};

export default function CollapsibleTable(props: ArmorResultsTableProps) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer
				component={Paper}
				sx={{ width: '100%', height: 600, maxHeight: 600 }}
			>
				<Table aria-label="collapsible table" stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell sx={{ width: '100px', height: '60px' }}></TableCell>
							<TableCell align="left">Mob</TableCell>
							<TableCell align="left">Res</TableCell>
							<TableCell align="left">Rec</TableCell>
							<TableCell align="left">Dis</TableCell>
							<TableCell align="left">Int</TableCell>
							<TableCell align="left">Str</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{props.items
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => (
								<Row key={row.id} row={row} />
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={props.items.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
