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
import { Button, styled, TablePagination, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { ResultsTableLoadout } from './ArmorResultsView';
import {
	EArmorStatId,
	EArmorStatModId,
	EFragmentId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	DefaultArmorStatMapping,
	getArmorStat,
	getArmorStatMappingFromMods,
	getArmorStatMappingFromFragments,
	sumArmorStatMappings,
} from '@dlb/types/ArmorStat';
import { getFragment } from '@dlb/types/Fragment';
import { selectProcessedArmor } from '@dlb/redux/features/processedArmor/processedArmorSlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { selectSelectedMasterworkAssumption } from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import MasterworkedBungieImage from '../MasterworkedBungieImage';
import { itemCanBeEquippedBy } from '@dlb/dim/utils/item-utils';
import { copyToClipboard } from '@dlb/types/globals';
import { ArmorItem, getExtraMasterworkedStats } from '@dlb/types/Armor';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import selectedCombatStyleModsSlice, {
	selectSelectedCombatStyleMods,
} from '@dlb/redux/features/selectedCombatStyleMods/selectedCombatStyleModsSlice';
import generateDimLink from '@dlb/services/dim/generateDimLoadoutLink';
import { selectDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectSelectedJump } from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { selectSelectedGrenade } from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { selectSelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { selectSelectedClassAbility } from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { selectSelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { AspectIdList } from '@dlb/types/Aspect';
import { selectSelectedAspects } from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	getArmorStatMappingFromArmorStatMods,
	getArmorStatMod,
} from '@dlb/types/ArmorStatMod';
import { selectSelectedArmorSlotMods } from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import { EModId } from '@dlb/generated/mod/EModId';
import { getMod, getStatBonusesFromMod } from '@dlb/types/Mod';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';

const calculateExtraMasterworkedStats = (
	armorItems: ArmorItem[],
	masterworkAssumption: EMasterworkAssumption
): number => {
	let extraMasterworkedStats = 0;
	armorItems.forEach((armorItem) => {
		if (!armorItem.isMasterworked) {
			extraMasterworkedStats += getExtraMasterworkedStats(
				armorItem,
				masterworkAssumption
			);
		}
	});
	return extraMasterworkedStats;
};

function descendingComparator(
	a: ResultsTableLoadout,
	b: ResultsTableLoadout,
	orderBy: EArmorStatId
) {
	if (b.sortableFields[orderBy] < a.sortableFields[orderBy]) {
		return -1;
	}
	if (b.sortableFields[orderBy] > a.sortableFields[orderBy]) {
		return 1;
	}
	return 0;
}

const LoadoutDetails = styled(Box)(({ theme }) => ({
	display: 'flex',
}));

const LoadoutOverview = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
}));

const LoadoutOverviewItem = styled(Box)(({ theme }) => ({
	display: 'flex',
}));

const StatsBreakdown = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
}));

// const StatsBreakdownItem = styled(Box)(({ theme }) => ({
// 	width: '60px',
// 	height: '35px',
// 	padding: theme.spacing(1),
// }));

const StatsBreakdownItem = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'first',
})<{ first?: boolean }>(({ theme, color, first }) => ({
	width: first ? '70px' : '40px',
	height: '22px',
	paddingLeft: theme.spacing(1),
	display: 'flex',
	lineHeight: '22px',
}));

type Order = 'asc' | 'desc';

// TODO: We'll need to support different default sort directions for
// Different columns. Wasted stats should default to ascending sort. Mobility should
// default to descending sort
function getComparator(
	order: Order,
	orderBy: EArmorStatId
): (a: ResultsTableLoadout, b: ResultsTableLoadout) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

const CustomTableCell = styled(TableCell, {
	shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, color, open }) => ({
	backgroundColor: open ? 'black' : '',
	borderBottom: 0,
}));

function Row(props: { row: ResultsTableLoadout }) {
	const { row } = props;
	const [open, setOpen] = React.useState(false);

	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);
	const masterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);

	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedMasterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);

	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const exoticArmor = selectedExoticArmor[selectedDestinyClass];
	const selectedCombatStyleMods = useAppSelector(selectSelectedCombatStyleMods);
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const selectedJump = useAppSelector(selectSelectedJump);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];
	const { elementId } = getDestinySubclass(destinySubclassId);
	const aspectIds = selectedAspects[destinySubclassId];
	// TODO: Having to do this cast sucks
	const fragmentIds = selectedFragments[elementId] as EFragmentId[];
	const fragmentArmorStatMappings: Partial<
		Record<EFragmentId, ArmorStatMapping>
	> = {};
	fragmentIds.forEach((id) => {
		const { bonuses } = getFragment(id);
		if (bonuses.length > 0) {
			fragmentArmorStatMappings[id] = getArmorStatMappingFromFragments(
				[id],
				selectedDestinyClass
			);
		}
	});

	const armorStatModArmorStatMappings: Partial<
		Record<
			EArmorStatModId,
			{ armorStatMapping: ArmorStatMapping; count: number }
		>
	> = {};
	const modCounts: Partial<Record<EArmorStatModId, number>> = {};
	row.sortableFields.requiredStatModIdList.forEach((id) => {
		if (!modCounts[id]) {
			modCounts[id] = 1;
		} else {
			modCounts[id] += 1;
		}
	});
	Object.keys(modCounts).forEach((armorStatModId: EArmorStatModId) => {
		const statModIds: EArmorStatModId[] = [];
		const count = modCounts[armorStatModId];
		for (let i = 0; i < count; i++) {
			statModIds.push(armorStatModId);
			armorStatModArmorStatMappings[armorStatModId] = {
				count,
				armorStatMapping: getArmorStatMappingFromArmorStatMods(statModIds),
			};
		}
	});
	const combatStyleModArmorStatMapping: Partial<
		Record<EModId, ArmorStatMapping>
	> = {};
	selectedCombatStyleMods.forEach((id) => {
		const bonuses = getStatBonusesFromMod(id);
		if (bonuses && bonuses.length > 0) {
			if (combatStyleModArmorStatMapping[id]) {
				console.log('>>>>> SUMMING');
				combatStyleModArmorStatMapping[id] = sumArmorStatMappings([
					combatStyleModArmorStatMapping[id],
					getArmorStatMappingFromMods([id], selectedDestinyClass),
				]);
			} else {
				combatStyleModArmorStatMapping[id] = getArmorStatMappingFromMods(
					[id],
					selectedDestinyClass
				);
			}
		}
	});

	const armorSlotModArmorStatMappping: Partial<
		Record<EModId, ArmorStatMapping>
	> = {};
	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		selectedArmorSlotMods[armorSlotId].forEach((id: EModId) => {
			const bonuses = getStatBonusesFromMod(id);
			if (bonuses && bonuses.length > 0) {
				if (armorSlotModArmorStatMappping[id]) {
					console.log('>>>>> SUMMING');
					armorSlotModArmorStatMappping[id] = sumArmorStatMappings([
						armorSlotModArmorStatMappping[id],
						getArmorStatMappingFromMods([id], selectedDestinyClass),
					]);
				} else {
					armorSlotModArmorStatMappping[id] = getArmorStatMappingFromMods(
						[id],
						selectedDestinyClass
					);
				}
			}
		});
	});
	// selectedCombatStyleMods.forEach((id) => {
	// 	const bonuses = getStatBonusesFromMod(id);
	// 	if (bonuses && bonuses.length > 0) {
	// 		combatStyleModArmorStatMapping[id] = getArmorStatMappingFromMods(
	// 			[id],
	// 			selectedDestinyClass
	// 		);
	// 	}
	// });

	const getExtraMasterworkedStatsBreakdown = () => {
		const extraMasterworkedStats = calculateExtraMasterworkedStats(
			row.armorItems,
			selectedMasterworkAssumption
		);
		return (
			extraMasterworkedStats > 0 && (
				<StatsBreakdown className="stats-breakdown">
					<StatsBreakdownItem>E</StatsBreakdownItem>
					{ArmorStatIdList.map((armorStatId) => (
						<StatsBreakdownItem key={armorStatId} className="stats-breakdown">
							{extraMasterworkedStats}
						</StatsBreakdownItem>
					))}
				</StatsBreakdown>
			)
		);
	};

	// TODO: Figure this out from the initial ingestion of armor and store in redux
	const hasMasterworkedClassItem = true;

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
				<CustomTableCell>{row.sortableFields.Mobility}</CustomTableCell>
				<CustomTableCell>{row.sortableFields.Resilience}</CustomTableCell>
				<CustomTableCell>{row.sortableFields.Recovery}</CustomTableCell>
				<CustomTableCell>{row.sortableFields.Discipline}</CustomTableCell>
				<CustomTableCell>{row.sortableFields.Intellect}</CustomTableCell>
				<CustomTableCell>{row.sortableFields.Strength}</CustomTableCell>
				<CustomTableCell>{row.sortableFields.totalStatTiers}</CustomTableCell>
				<CustomTableCell>{row.sortableFields.totalModCost}</CustomTableCell>
				<CustomTableCell>{row.sortableFields.wastedStats}</CustomTableCell>
			</TableRow>
			<TableRow>
				<TableCell
					sx={{ '& > *': { borderBottom: 'unset' }, padding: 0 }}
					colSpan={10}
				>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<LoadoutOverview>
							{row.armorItems.map((armorItem) => (
								<LoadoutOverviewItem
									key={armorItem.id}
									className="stats-breakdown"
								>
									<MasterworkedBungieImage
										isMasterworked={armorItem.isMasterworked}
										width={'20px'}
										height={'20px'}
										src={armorItem.icon}
									/>
									<Box>{armorItem.name}</Box>
								</LoadoutOverviewItem>
							))}
							{/* <Button
								sx={{ width: 200, margin: 2 }}
								variant="contained"
								onClick={() => {
									copyToClipboard(
										row.armorItems.map((x) => `id:'${x.id}'`).join(' or ')
									);
								}}
							>
								Copy DIM Query
							</Button> */}

							<Button
								sx={{ width: 200, margin: 2 }}
								variant="contained"
								target={'_blank'}
								href={`${generateDimLink({
									combatStyleModIdList: selectedCombatStyleMods,
									armorStatModIdList: row.sortableFields.requiredStatModIdList,
									armorSlotMods: selectedArmorSlotMods,
									armorList: row.armorItems,
									fragmentIdList: fragmentIds,
									aspectIdList: aspectIds,
									exoticArmor: exoticArmor,
									stats: desiredArmorStats,
									masterworkAssumption: masterworkAssumption,
									destinySubclassId,
									destinyClassId: selectedDestinyClass,
									jumpId: selectedJump[destinySubclassId],
									meleeId: selectedMelee[destinySubclassId],
									superAbilityId: selectedSuperAbility[destinySubclassId],
									classAbilityId: selectedClassAbility[destinySubclassId],
									grenadeId: selectedGrenade[elementId],
								})}`}
							>
								Open loadout in DIM
							</Button>
						</LoadoutOverview>

						<LoadoutDetails className="loadout-details">
							<StatsBreakdown className="stats-breakdown">
								<StatsBreakdownItem first>Total</StatsBreakdownItem>
								{ArmorStatIdList.map((id) => {
									return (
										<StatsBreakdownItem
											first
											className="stats-breakdown-item"
											key={id}
										>
											<BungieImage
												width={20}
												height={20}
												src={getArmorStat(id).icon}
											/>
											<div style={{ marginLeft: '2px' }}>
												{row.sortableFields[id]} =
											</div>
										</StatsBreakdownItem>
									);
								})}
							</StatsBreakdown>
							{row.armorItems.map((armorItem) => (
								<StatsBreakdown key={armorItem.id} className="stats-breakdown">
									<StatsBreakdownItem>
										<MasterworkedBungieImage
											isMasterworked={armorItem.isMasterworked}
											width={'20px'}
											height={'20px'}
											src={armorItem.icon}
										/>
									</StatsBreakdownItem>
									{armorItem.stats.map((stat, i) => (
										<StatsBreakdownItem
											key={ArmorStatIdList[i]}
											className="stats-breakdown"
										>
											{stat + (armorItem.isMasterworked ? 2 : 0)}
										</StatsBreakdownItem>
									))}
								</StatsBreakdown>
							))}
							{hasMasterworkedClassItem && (
								<StatsBreakdown className="stats-breakdown">
									<StatsBreakdownItem>C</StatsBreakdownItem>
									{ArmorStatIdList.map((armorStatId) => (
										<StatsBreakdownItem
											key={armorStatId}
											className="stats-breakdown"
										>
											2
										</StatsBreakdownItem>
									))}
								</StatsBreakdown>
							)}
							{getExtraMasterworkedStatsBreakdown()}

							{Object.keys(fragmentArmorStatMappings).map(
								(fragmentId: EFragmentId) => {
									return (
										<StatsBreakdown
											key={fragmentId}
											className="stats-breakdown"
										>
											<StatsBreakdownItem>
												<BungieImage
													width={20}
													height={20}
													src={getFragment(fragmentId).icon}
												/>
											</StatsBreakdownItem>
											{ArmorStatIdList.map((armorStatId) => (
												<StatsBreakdownItem
													key={armorStatId}
													className="stats-breakdown"
												>
													{fragmentArmorStatMappings[fragmentId][armorStatId]}
												</StatsBreakdownItem>
											))}
										</StatsBreakdown>
									);
								}
							)}
							{Object.keys(armorStatModArmorStatMappings).map(
								(armorStatModId: EArmorStatModId) => {
									return (
										<StatsBreakdown
											key={armorStatModId}
											className="stats-breakdown"
										>
											<StatsBreakdownItem>
												<BungieImage
													width={20}
													height={20}
													src={getArmorStatMod(armorStatModId).icon}
												/>
												({armorStatModArmorStatMappings[armorStatModId].count})
											</StatsBreakdownItem>
											{ArmorStatIdList.map((armorStatId) => (
												<StatsBreakdownItem
													key={armorStatId}
													className="stats-breakdown"
												>
													{
														armorStatModArmorStatMappings[armorStatModId]
															.armorStatMapping[armorStatId]
													}
												</StatsBreakdownItem>
											))}
										</StatsBreakdown>
									);
								}
							)}
							{Object.keys(armorSlotModArmorStatMappping).map((modId) => {
								return (
									<StatsBreakdown key={modId} className="stats-breakdown">
										<StatsBreakdownItem>
											<BungieImage
												width={20}
												height={20}
												src={getMod(modId as EModId).icon}
											/>
										</StatsBreakdownItem>
										{ArmorStatIdList.map((armorStatId) => (
											<StatsBreakdownItem
												key={armorStatId}
												className="stats-breakdown"
											>
												{armorSlotModArmorStatMappping[modId][armorStatId]}
											</StatsBreakdownItem>
										))}
									</StatsBreakdown>
								);
							})}
							{Object.keys(combatStyleModArmorStatMapping).map((modId) => {
								return (
									<StatsBreakdown key={modId} className="stats-breakdown">
										<StatsBreakdownItem>
											<BungieImage
												width={20}
												height={20}
												src={getMod(modId as EModId).icon}
											/>
										</StatsBreakdownItem>
										{ArmorStatIdList.map((armorStatId) => (
											<StatsBreakdownItem
												key={armorStatId}
												className="stats-breakdown"
											>
												{combatStyleModArmorStatMapping[modId][armorStatId]}
											</StatsBreakdownItem>
										))}
									</StatsBreakdown>
								);
							})}
						</LoadoutDetails>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

interface HeadCell {
	disablePadding: boolean;
	id: string;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = ArmorStatIdList.map((armorStat) => {
	return {
		id: armorStat as string,
		numeric: true,
		disablePadding: false,
		label: getArmorStat(armorStat).name,
	};
}).concat([
	{
		id: 'totalStatTiers',
		numeric: true,
		disablePadding: false,
		label: 'Tiers',
	},
	{
		id: 'totalModCost',
		numeric: true,
		disablePadding: false,
		label: 'Cost',
	},
	{
		id: 'wastedStats',
		numeric: true,
		disablePadding: false,
		label: 'Wasted',
	},
]);

interface EnhancedTableProps {
	onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler =
		(property: string) => (event: React.MouseEvent<unknown>) => {
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
	items: ResultsTableLoadout[];
};

export default function CollapsibleTable(props: ArmorResultsTableProps) {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [order, setOrder] = React.useState<Order>('desc');
	const [orderBy, setOrderBy] = React.useState<EArmorStatId>(
		EArmorStatId.Mobility
	);

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: EArmorStatId
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
