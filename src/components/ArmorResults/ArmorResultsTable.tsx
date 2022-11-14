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
import {
	Checkbox,
	styled,
	TablePagination,
	TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { ResultsTableArmorItem } from './ArmorResultsView';
import { ArmorStats, ArmorStatMapping, EArmorStat } from '@dlb/services/data';

// TODO: This abuses the intended purpose of ArmorStatMapping
const armorStatToOrder: ArmorStatMapping = {
	[EArmorStat.Mobility]: 0,
	[EArmorStat.Resilience]: 1,
	[EArmorStat.Recovery]: 2,
	[EArmorStat.Discipline]: 3,
	[EArmorStat.Intellect]: 4,
	[EArmorStat.Strength]: 5,
};

function descendingComparator(
	a: ResultsTableArmorItem,
	b: ResultsTableArmorItem,
	orderBy: EArmorStat
) {
	if (
		b.totalStats[armorStatToOrder[orderBy]] <
		a.totalStats[armorStatToOrder[orderBy]]
	) {
		return -1;
	}
	if (
		b.totalStats[armorStatToOrder[orderBy]] >
		a.totalStats[armorStatToOrder[orderBy]]
	) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator(
	order: Order,
	orderBy: EArmorStat
): (a: ResultsTableArmorItem, b: ResultsTableArmorItem) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

const CustomTableCell = styled(TableCell, {
	shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, color }) => ({
	backgroundColor: open ? 'black' : '',
	borderBottom: 0,
}));

function Row(props: { row: ResultsTableArmorItem }) {
	const { row } = props;
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow>
				<CustomTableCell
					open={open}
					sx={{
						width: '100px',
						height: '60px',
						borderBottom: 0,
					}}
				>
					<>
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => setOpen(!open)}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</>
				</CustomTableCell>
				<CustomTableCell>{row.totalStats[0]}</CustomTableCell>
				<CustomTableCell>{row.totalStats[1]}</CustomTableCell>
				<CustomTableCell>{row.totalStats[2]}</CustomTableCell>
				<CustomTableCell>{row.totalStats[3]}</CustomTableCell>
				<CustomTableCell>{row.totalStats[4]}</CustomTableCell>
				<CustomTableCell>{row.totalStats[5]}</CustomTableCell>
			</TableRow>
			<TableRow>
				<TableCell
					sx={{ '& > *': { borderBottom: 'unset' }, padding: 0 }}
					colSpan={7}
				>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ padding: 0, borderTop: '1px solid' }}>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<CustomTableCell sx={{ width: '100px', height: '60px' }}>
											<Shield sx={{ marginLeft: '5px', marginTop: '3px' }} />
										</CustomTableCell>
										<CustomTableCell>Mob</CustomTableCell>
										<CustomTableCell>Res</CustomTableCell>
										<CustomTableCell>Rec</CustomTableCell>
										<CustomTableCell>Dis</CustomTableCell>
										<CustomTableCell>Int</CustomTableCell>
										<CustomTableCell>Str</CustomTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.armorItems.map((armorItem) => (
										<TableRow key={armorItem.id}>
											<CustomTableCell sx={{ width: '100px', height: '60px' }}>
												<BungieImage
													width={'40px'}
													height={'40px'}
													src={armorItem.icon}
												/>
											</CustomTableCell>
											<CustomTableCell>{armorItem.stats[0]}</CustomTableCell>
											<CustomTableCell>{armorItem.stats[1]}</CustomTableCell>
											<CustomTableCell>{armorItem.stats[2]}</CustomTableCell>
											<CustomTableCell>{armorItem.stats[3]}</CustomTableCell>
											<CustomTableCell>{armorItem.stats[4]}</CustomTableCell>
											<CustomTableCell>{armorItem.stats[5]}</CustomTableCell>
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

interface HeadCell {
	disablePadding: boolean;
	id: EArmorStat;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = ArmorStats.map((armorStat) => {
	return {
		id: armorStat,
		numeric: true,
		disablePadding: false,
		label: armorStat,
	};
});

interface EnhancedTableProps {
	onRequestSort: (
		event: React.MouseEvent<unknown>,
		property: EArmorStat
	) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: EArmorStat) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				<TableCell
					sx={{
						width: '100px',
						height: '60px',
					}}
				></TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						//align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'desc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

type ArmorResultsTableProps = {
	items: ResultsTableArmorItem[];
};

export default function CollapsibleTable(props: ArmorResultsTableProps) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [order, setOrder] = React.useState<Order>('desc');
	const [orderBy, setOrderBy] = React.useState<EArmorStat>(EArmorStat.Mobility);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: EArmorStat
	) => {
		if (orderBy !== property) {
			setOrder('desc');
			setOrderBy(property);
		} else {
			setOrder(order === 'asc' ? 'desc' : 'asc');
		}
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	// // Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows =
	// 	page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.items.length) : 0;

	return (
		<Paper
			sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
			className={'table-wrapper'}
		>
			<TableContainer
				component={Box}
				sx={{
					width: '100%',
					height: `calc(100% - 52px)` /*, height: 600, maxHeight: 600*/,
				}}
			>
				<Table
					aria-label="collapsible table"
					stickyHeader
					sx={{ borderCollapse: 'collapse' }}
				>
					<EnhancedTableHead
						order={order}
						orderBy={orderBy}
						onRequestSort={handleRequestSort}
						rowCount={props.items.length}
					/>
					<TableBody>
						{props.items
							.sort(getComparator(order, orderBy))
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => (
								<Row key={row.id} row={row} />
							))}
						{/* {emptyRows > 0 && (
							<TableRow
								style={{
									height: 53 * emptyRows
								}}
							>
								<TableCell colSpan={6} />
							</TableRow>
						)} */}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				sx={{
					height: '52px',
				}}
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
