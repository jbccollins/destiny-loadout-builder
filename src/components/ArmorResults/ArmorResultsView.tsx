import { SmallScreenData } from '@dlb/app/page';
import {
	selectAlwaysConsiderCollectionsRolls,
	setAlwaysConsiderCollectionsRolls,
} from '@dlb/redux/features/alwaysConsiderCollectionsRolls/alwaysConsiderCollectionsRollsSlice';
import { selectArmor } from '@dlb/redux/features/armor/armorSlice';
import {
	selectDimLoadoutsFilter,
	setDimLoadoutsFilter,
} from '@dlb/redux/features/dimLoadoutsFilter/dimLoadoutsFilterSlice';
import {
	selectExcludeLockedItems,
	setExcludeLockedItems,
} from '@dlb/redux/features/excludeLockedItems/excludeLockedItemsSlice';
import {
	selectInGameLoadoutsFilter,
	setInGameLoadoutsFilter,
} from '@dlb/redux/features/inGameLoadoutsFilter/inGameLoadoutsFilterSlice';
import { selectIsRunningProcessArmorWebWorker } from '@dlb/redux/features/isRunningProcessArmorWebWorker/isRunningProcessArmorWebWorkerSlice';
import { setPerformingBatchUpdate } from '@dlb/redux/features/performingBatchUpdate/performingBatchUpdateSlice';
import { selectProcessedArmor } from '@dlb/redux/features/processedArmor/processedArmorSlice';
import {
	selectResultsPagination,
	setResultsPagination,
} from '@dlb/redux/features/resultsPagination/resultsPaginationSlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import {
	selectSelectedExoticArtificeAssumption,
	setSelectedExoticArtificeAssumption,
} from '@dlb/redux/features/selectedExoticArtificeAssumption/selectedExoticArtificeAssumptionSlice';
import {
	selectSelectedMasterworkAssumption,
	setSelectedMasterworkAssumption,
} from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import {
	selectSelectedMinimumGearTier,
	setSelectedMinimumGearTier,
} from '@dlb/redux/features/selectedMinimumGearTier/selectedMinimumGearTierSlice';
import {
	selectUseBonusResilience,
	setUseBonusResilience,
} from '@dlb/redux/features/useBonusResilience/useBonusResilienceSlice';
import {
	selectUseOnlyMasterworkedArmor,
	setUseOnlyMasterworkedArmor,
} from '@dlb/redux/features/useOnlyMasterworkedArmor/useOnlyMasterworkedArmorSlice';
import {
	selectUseZeroWastedStats,
	setUseZeroWastedStats,
} from '@dlb/redux/features/useZeroWastedStats/useZeroWastedStatsSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ArmorSlotIdList } from '@dlb/types/ArmorSlot';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDimLoadoutsFilterId,
	EExoticArtificeAssumption,
	EGearTierId,
	EInGameLoadoutsFilterId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
	Box,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TablePagination,
	styled,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import ArmorResultsList from './ArmorResultsList';
import { ResultsTableLoadout, SortableFields } from './ArmorResultsTypes';
import NoResults from './NoResults';
const Container = styled(Box)(({ theme }) => ({
	// padding: theme.spacing(1)
	position: 'relative',
	height: '100%',
	// overflowY: 'hidden',
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
	// padding: theme.spacing(1)
	height: '80px',
	display: 'flex',
	padding: theme.spacing(1.5),
	position: 'sticky',
	top: 0,
	background: 'black',
	justifyContent: 'space-between',
}));

const ArmorResultsListContainer = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'withNonDefaultSettingsBanner',
})<{ withNonDefaultSettingsBanner: boolean }>(
	({ theme, withNonDefaultSettingsBanner }) => ({
		height: withNonDefaultSettingsBanner
			? 'calc(100% - 190px)'
			: 'calc(100% - 160px)',
		overflowY: 'auto',
	})
);

const FooterContainer = styled(Box)(({ theme }) => ({
	// padding: theme.spacing(1)
	position: 'sticky',
	height: '80px',
	display: 'flex',
	padding: theme.spacing(1.5),
	bottom: 0,
	background: 'black',
	width: '100%',
	flexDirection: 'row',
	justifyContent: 'space-between',
}));

const OrderContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
}));
const PaginationContainer = styled(Box)(({ theme }) => ({
	// flex: '1',
}));

const OrderByFieldFormControl = styled(FormControl)(({ theme }) => ({
	['fieldset']: {
		borderTopRightRadius: '0px',
		borderBottomRightRadius: '0px',
		// padding: theme.spacing(1),
		// paddingRight: 0,
	},
}));

const OrderByFormControl = styled(FormControl)(({ theme }) => ({
	['fieldset']: {
		borderTopLeftRadius: '0px',
		borderBottomLeftRadius: '0px',
		// padding: theme.spacing(1),
		// paddingRight: 0,
		marginLeft: '-1px',
	},
}));

function descendingComparator(
	a: ResultsTableLoadout,
	b: ResultsTableLoadout,
	orderBy: SortableFieldsKey
) {
	if (b.sortableFields[orderBy] < a.sortableFields[orderBy]) {
		return -1;
	}
	if (b.sortableFields[orderBy] > a.sortableFields[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(
	order: Order,
	orderBy: SortableFieldsKey
): (a: ResultsTableLoadout, b: ResultsTableLoadout) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

export type SortableFieldsKey = keyof SortableFields;

export const getSortableFieldDisplayName = (key: SortableFieldsKey) => {
	if (ArmorStatIdList.includes(key as EArmorStatId)) {
		return getArmorStat(key as EArmorStatId).name;
	}
	if (key === 'totalModCost') {
		return 'Total Mod Cost';
	}
	if (key === 'totalStatTiers') {
		return 'Total Stat Tiers';
	}
	if (key === 'wastedStats') {
		return 'Wasted Stats';
	}
	if (key === 'numSharedArmorItemsAcrossLoadouts') {
		return 'Shared Armor Across Loadouts';
	}
	return '';
};

export const SortableFieldsDisplayOrder: SortableFieldsKey[] = [
	// EArmorStatId.Mobility,
	// EArmorStatId.Resilience,
	// EArmorStatId.Recovery,
	// EArmorStatId.Discipline,
	// EArmorStatId.Intellect,
	// EArmorStatId.Strength,
	'totalModCost',
	'totalStatTiers',
	'wastedStats',
	'numSharedArmorItemsAcrossLoadouts',
];

const SortableFieldsDefaultSortOrder: Record<SortableFieldsKey, Order> = {
	Mobility: 'desc',
	Resilience: 'desc',
	Recovery: 'desc',
	Discipline: 'desc',
	Intellect: 'desc',
	Strength: 'desc',
	totalModCost: 'asc',
	totalStatTiers: 'desc',
	wastedStats: 'asc',
	numSharedArmorItemsAcrossLoadouts: 'desc',
};

export type Order = 'asc' | 'desc';

interface HeaderProps {
	handleChangeOrderDirection: (order: Order) => void;
	handleChangeOrderBy: (orderBy: SortableFieldsKey) => void;
	order: Order;
	orderBy: string;
	sortableFields: SortableFieldsKey[];
}

interface FooterProps {
	rowsPerPage: number;
	count: number;
	page: number;
	handleChangePage: (event: unknown, newPage: number) => void;
	handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
	smallScreenData: SmallScreenData;
}

function Header({
	handleChangeOrderDirection,
	handleChangeOrderBy,
	order,
	orderBy,
	sortableFields,
}: HeaderProps) {
	const [
		hasManuallyChangedOrderDirection,
		setHasManuallyChangedOrderDirection,
	] = useState(false);
	// This is just a little QoL change to set sensible defaults for
	// the sortable fields so that the user doesn't have to manually
	// do the obvious thing
	const _handleChangeOrderBy = (orderBy: SortableFieldsKey): void => {
		if (!hasManuallyChangedOrderDirection) {
			handleChangeOrderDirection(SortableFieldsDefaultSortOrder[orderBy]);
		}
		handleChangeOrderBy(orderBy);
	};
	const _handleChangeOrderDirection = (order: Order): void => {
		setHasManuallyChangedOrderDirection(true);
		handleChangeOrderDirection(order);
	};
	return (
		<HeaderContainer>
			<Box
				sx={{
					marginTop: '16px',
					fontWeight: '500',
					fontSize: '0.875rem',
					lineHeight: '1.25',
					letterSpacing: '0.02857em',
					textTransform: 'uppercase',
				}}
			>
				Results
			</Box>
			<OrderContainer>
				<OrderByFieldFormControl>
					<InputLabel id="order-by-field-select-label">Order By</InputLabel>
					<Select
						sx={{ width: '170px' }}
						labelId="order-by-field-select-label"
						label="Order By"
						id="order-by-field-select"
						value={orderBy}
						onChange={(e) =>
							_handleChangeOrderBy(e.target.value as SortableFieldsKey)
						}
					>
						{sortableFields.map((s) => (
							<MenuItem key={s} value={s}>
								{getSortableFieldDisplayName(s)}
							</MenuItem>
						))}
					</Select>
				</OrderByFieldFormControl>
				<OrderByFormControl>
					<InputLabel id="order-by-select-label">Direction</InputLabel>
					<Select
						sx={{ width: '90px' }}
						labelId="order-by-select-label"
						label="Direction"
						id="order-by-select"
						value={order}
						onChange={(e) =>
							_handleChangeOrderDirection(e.target.value as Order)
						}
					>
						<MenuItem value={'asc'}>Asc</MenuItem>
						<MenuItem value={'desc'}>Desc</MenuItem>
					</Select>
				</OrderByFormControl>
			</OrderContainer>
		</HeaderContainer>
	);
}

function Footer({
	rowsPerPage,
	count,
	page,
	handleChangePage,
	handleChangeRowsPerPage,
	smallScreenData,
}: FooterProps) {
	const { isSmallScreen, toggleSmallScreenResultsView } = smallScreenData;
	const isRunningProcessArmorWebWorker = useAppSelector(
		selectIsRunningProcessArmorWebWorker
	);
	if (isRunningProcessArmorWebWorker) {
		return null;
	}
	return (
		<FooterContainer className="FooterContainer">
			<Box>
				{' '}
				{isSmallScreen && (
					<IconButton
						aria-label="back"
						onClick={toggleSmallScreenResultsView}
						sx={{ marginTop: '8px' }}
					>
						<ArrowBackIcon />
					</IconButton>
				)}
			</Box>
			<PaginationContainer>
				<TablePagination
					sx={{
						height: '52px',
					}}
					// Hide the "Rows per page UI"
					rowsPerPageOptions={[]}
					component="div"
					count={count}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</PaginationContainer>
		</FooterContainer>
	);
}

type ArmorResultsViewProps = {
	smallScreenData: SmallScreenData;
};

function ArmorResultsView({ smallScreenData }: ArmorResultsViewProps) {
	const dispatch = useAppDispatch();
	const armor = useAppSelector(selectArmor);
	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const processedArmor = useAppSelector(selectProcessedArmor);
	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const page = useAppSelector(selectResultsPagination);
	const useBonusResilience = useAppSelector(selectUseBonusResilience);
	const useZeroWastedStats = useAppSelector(selectUseZeroWastedStats);
	const useOnlyMasterworkedArmor = useAppSelector(
		selectUseOnlyMasterworkedArmor
	);
	const excludeLockedItems = useAppSelector(selectExcludeLockedItems);
	const dimLoadoutsFilterId = useAppSelector(selectDimLoadoutsFilter);
	const inGameLoadoutsFilterId = useAppSelector(selectInGameLoadoutsFilter);
	const alwaysConsiderCollectionsRolls = useAppSelector(
		selectAlwaysConsiderCollectionsRolls
	);
	const masterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	const minimumGearTier = useAppSelector(selectSelectedMinimumGearTier);
	const isRunningProcessArmorWebWorker = useAppSelector(
		selectIsRunningProcessArmorWebWorker
	);
	const exoticArtificeAssumption = useAppSelector(
		selectSelectedExoticArtificeAssumption
	);

	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<SortableFieldsKey>('totalModCost');

	const handleChangeOrderDirection = (order: Order) => {
		setOrder(order);
	};

	const handleChangeOrderBy = (orderBy: SortableFieldsKey) => {
		setOrderBy(orderBy);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(setResultsPagination(newPage));
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value);
		handleChangePage(null, 0);
	};

	const getArmorItem = useCallback(
		(id: string, armorSlot: EArmorSlotId) => {
			const selectedExoticArmorSlot =
				selectedExoticArmor[selectedDestinyClass].armorSlot;
			if (selectedExoticArmorSlot === armorSlot) {
				return armor[selectedDestinyClass][armorSlot].exotic[id];
			}
			return armor[selectedDestinyClass][armorSlot].nonExotic[id];
		},
		[armor, selectedDestinyClass, selectedExoticArmor]
	);

	const resultsTableArmorItems: ResultsTableLoadout[] = useMemo(() => {
		console.log(
			'>>>>>>>>>>> [Memo] resultsTableArmorItems calcuated <<<<<<<<<<<'
		);
		const res: ResultsTableLoadout[] = [];

		if (isRunningProcessArmorWebWorker) {
			return res;
		}

		processedArmor.items.forEach(
			({
				armorIdList,
				armorStatModIdList,
				artificeModIdList,
				metadata,
				modPlacement,
			}) => {
				const resultLoadout: ResultsTableLoadout = {
					id: '',
					armorItems: [],
					requiredStatModIdList: armorStatModIdList,
					requiredArtificeModIdList: artificeModIdList,
					classItem: metadata.classItem,
					useExoticClassItem:
						selectedExoticArmor[selectedDestinyClass].armorSlot ===
						EArmorSlotId.ClassItem,
					exoticArtificeAssumption,
					sortableFields: {
						[EArmorStatId.Mobility]: metadata.totalArmorStatMapping.Mobility,
						[EArmorStatId.Resilience]:
							metadata.totalArmorStatMapping.Resilience,
						[EArmorStatId.Recovery]: metadata.totalArmorStatMapping.Recovery,
						[EArmorStatId.Discipline]:
							metadata.totalArmorStatMapping.Discipline,
						[EArmorStatId.Intellect]: metadata.totalArmorStatMapping.Intellect,
						[EArmorStatId.Strength]: metadata.totalArmorStatMapping.Strength,
						totalModCost: metadata.totalModCost,
						totalStatTiers: metadata.totalStatTiers,
						wastedStats: metadata.wastedStats,
						numSharedArmorItemsAcrossLoadouts:
							metadata.numSharedArmorItemsAcrossLoadouts,
					},
					modPlacement,
				};
				ArmorSlotIdList.forEach((armorSlot, i) => {
					const armorItem = getArmorItem(armorIdList[i], armorSlot);
					resultLoadout.id += `[${armorItem.id}]`;
					resultLoadout.armorItems.push(armorItem);
				});
				// if (metadata.artificeClassItemArmorStatId) {
				// 	resultLoadout.id += `[ArtificeClassItem-${metadata.artificeClassItemArmorStatId}]`;
				// 	resultLoadout.requiredArtificeModIdList.push(
				// 		metadata.artificeClassItemArmorStatId
				// 	);
				// }
				artificeModIdList.forEach((armorStatId) => {
					resultLoadout.id += `[artifice-${armorStatId}]`;
				});
				res.push(resultLoadout);
			}
		);

		return res;
	}, [processedArmor, getArmorItem, isRunningProcessArmorWebWorker]);

	const hasNonDefaultSettings = useMemo(
		() =>
			excludeLockedItems ||
			useOnlyMasterworkedArmor ||
			useBonusResilience ||
			useZeroWastedStats ||
			exoticArtificeAssumption !== EExoticArtificeAssumption.All ||
			dimLoadoutsFilterId !== EDimLoadoutsFilterId.All ||
			inGameLoadoutsFilterId !== EInGameLoadoutsFilterId.All ||
			alwaysConsiderCollectionsRolls ||
			masterworkAssumption !== EMasterworkAssumption.All ||
			minimumGearTier !== EGearTierId.Legendary,
		[
			excludeLockedItems,
			useOnlyMasterworkedArmor,
			useBonusResilience,
			useZeroWastedStats,
			exoticArtificeAssumption,
			dimLoadoutsFilterId,
			inGameLoadoutsFilterId,
			alwaysConsiderCollectionsRolls,
			masterworkAssumption,
			minimumGearTier,
		]
	);

	const handleResetSettings = () => {
		dispatch(setPerformingBatchUpdate(true));
		dispatch(setUseBonusResilience(false));
		dispatch(setUseZeroWastedStats(false));
		dispatch(setUseOnlyMasterworkedArmor(false));
		dispatch(
			setSelectedExoticArtificeAssumption(EExoticArtificeAssumption.All)
		);
		dispatch(setDimLoadoutsFilter(EDimLoadoutsFilterId.All));
		dispatch(setInGameLoadoutsFilter(EInGameLoadoutsFilterId.All));
		dispatch(setAlwaysConsiderCollectionsRolls(false));
		dispatch(setSelectedMasterworkAssumption(EMasterworkAssumption.All));
		dispatch(setSelectedMinimumGearTier(EGearTierId.Legendary));
		dispatch(setExcludeLockedItems(false));
		dispatch(setPerformingBatchUpdate(false));
	};

	return (
		<>
			{armor &&
				selectedDestinyClass &&
				processedArmor &&
				selectedExoticArmor &&
				selectedExoticArmor[selectedDestinyClass] && (
					<Container className="armor-results-view">
						<Header
							order={order}
							orderBy={orderBy}
							handleChangeOrderDirection={handleChangeOrderDirection}
							sortableFields={SortableFieldsDisplayOrder}
							handleChangeOrderBy={handleChangeOrderBy}
						/>
						{hasNonDefaultSettings && (
							<Box
								sx={{
									height: '30px',
									display: 'flex',
									alignItems: 'center',
									gap: '4px',
									background: '#b36200',
									paddingX: '8px',
								}}
							>
								Settings may affect results.
								<Box
									sx={{
										marginLeft: 'auto',
										textDecoration: 'underline',
										textUnderlineOffset: '2px',
										cursor: 'pointer',
									}}
									onClick={handleResetSettings}
								>
									Reset Settings
								</Box>
							</Box>
						)}
						{resultsTableArmorItems.length > 0 && (
							<ArmorResultsListContainer
								withNonDefaultSettingsBanner={hasNonDefaultSettings}
								className="ArmorResultsListContainer"
							>
								<ArmorResultsList
									items={resultsTableArmorItems
										.sort(getComparator(order, orderBy))
										.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
										)}
								/>
							</ArmorResultsListContainer>
						)}
						{resultsTableArmorItems.length === 0 && <NoResults />}

						<Footer
							smallScreenData={smallScreenData}
							count={resultsTableArmorItems.length}
							rowsPerPage={rowsPerPage}
							handleChangePage={handleChangePage}
							handleChangeRowsPerPage={handleChangeRowsPerPage}
							page={page}
						/>
					</Container>
				)}
		</>
	);
}

export default ArmorResultsView;

// id:'6917529338626075073' or id:'6917529314591524684' or id:'6917529339988633177' or id:'6917529582824429231'

// Raw dim loadout url
// https://beta.destinyitemmanager.com/4611686018444338689/d2/loadouts?loadout=%7B%22id%22%3A%22d2ap%22%2C%22name%22%3A%22D2ArmorPicker%20Loadout%22%2C%22classType%22%3A1%2C%22parameters%22%3A%7B%22statConstraints%22%3A%5B%7B%22statHash%22%3A2996146975%2C%22minTier%22%3A10%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A392767087%2C%22minTier%22%3A4%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A1943323491%2C%22minTier%22%3A9%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A1735777505%2C%22minTier%22%3A3%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A144602215%2C%22minTier%22%3A10%2C%22maxTier%22%3A10%7D%2C%7B%22statHash%22%3A4244567218%2C%22minTier%22%3A6%2C%22maxTier%22%3A10%7D%5D%2C%22mods%22%3A%5B2979815167%2C1484685887%2C4048838440%2C3961599962%2C3961599962%2C3682186345%5D%2C%22assumeArmorMasterwork%22%3A3%2C%22lockArmorEnergyType%22%3A1%2C%22exoticArmorHash%22%3A1734144409%7D%2C%22equipped%22%3A%5B%7B%22id%22%3A%226917529338626075073%22%2C%22hash%22%3A1496857121%7D%2C%7B%22id%22%3A%226917529314591524684%22%2C%22hash%22%3A1734144409%7D%2C%7B%22id%22%3A%226917529339988633177%22%2C%22hash%22%3A1399263478%7D%2C%7B%22id%22%3A%226917529582824429231%22%2C%22hash%22%3A3380315063%7D%2C%7B%22id%22%3A%2212345%22%2C%22hash%22%3A873720784%2C%22socketOverrides%22%3A%7B%227%22%3A537774540%2C%228%22%3A2483898429%2C%229%22%3A3469412969%2C%2210%22%3A3469412975%2C%2211%22%3A3469412970%7D%7D%5D%2C%22unequipped%22%3A%5B%5D%2C%22clearSpace%22%3Afalse%7D

// Parsed Query params
// {"id":"d2ap","name":"D2ArmorPicker Loadout","classType":1,"parameters":{"statConstraints":[{"statHash":2996146975,"minTier":10,"maxTier":10},{"statHash":392767087,"minTier":4,"maxTier":10},{"statHash":1943323491,"minTier":9,"maxTier":10},{"statHash":1735777505,"minTier":3,"maxTier":10},{"statHash":144602215,"minTier":10,"maxTier":10},{"statHash":4244567218,"minTier":6,"maxTier":10}],"mods":[2979815167,1484685887,4048838440,3961599962,3961599962,3682186345],"assumeArmorMasterwork":3,"lockArmorEnergyType":1,"exoticArmorHash":1734144409},"equipped":[{"id":"6917529338626075073","hash":1496857121},{"id":"6917529314591524684","hash":1734144409},{"id":"6917529339988633177","hash":1399263478},{"id":"6917529582824429231","hash":3380315063},{"id":"12345","hash":873720784,"socketOverrides":{"7":537774540,"8":2483898429,"9":3469412969,"10":3469412975,"11":3469412970}}],"unequipped":[],"clearSpace":false}
