import MasterworkedBungieImage from '@dlb/components/MasterworkedBungieImage';
import StatTiers from '@dlb/components/StatTiers';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { EModId } from '@dlb/generated/mod/EModId';
import { DimIcon } from '@dlb/public/dim_logo.svgicon';
import { selectAllClassItemMetadata } from '@dlb/redux/features/allClassItemMetadata/allClassItemMetadataSlice';
import { selectDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { selectSelectedArmorSlotMods } from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import { selectSelectedAspects } from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { selectSelectedClassAbility } from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { selectSelectedGrenade } from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { selectSelectedJump } from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { selectSelectedMasterworkAssumption } from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import { selectSelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { selectSelectedRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import { selectSelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { useAppSelector } from '@dlb/redux/hooks';
import {
	generateDimLink,
	generateDimQuery,
} from '@dlb/services/links/generateDimLoadoutLink';
import { ProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import {
	ArmorItem,
	getDefaultArmorItem,
	getExtraMasterworkedStats,
} from '@dlb/types/Armor';
import {
	ArmorSlotWithClassItemIdList,
	getArmorSlot,
} from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStat,
	getArmorStatMappingFromFragments,
	getArmorStatMappingFromMods,
	getDefaultArmorStatMapping,
	sumArmorStatMappings,
} from '@dlb/types/ArmorStat';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getFragment } from '@dlb/types/Fragment';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EElementId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import { getMod } from '@dlb/types/Mod';
import { MISSING_ICON } from '@dlb/types/globals';
import { copyToClipboard } from '@dlb/utils/copy-to-clipboard';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, Collapse, IconButton, styled } from '@mui/material';
import React from 'react';
import { ResultsTableLoadout, getClassItemText } from './ArmorResultsTypes';
import {
	SortableFieldsDisplayOrder,
	getSortableFieldDisplayName,
} from './ArmorResultsView';

type ArmorResultsListProps = {
	items: ResultsTableLoadout[];
};

type ResultsItemProps = {
	item: ResultsTableLoadout;
	destinyClassId: EDestinyClassId;
	masterworkAssumption: EMasterworkAssumption;
	fragmentArmorStatMappings: Partial<Record<EFragmentId, ArmorStatMapping>>;
	armorSlotModArmorStatMappings: Partial<
		Record<EModId, { armorStatMapping: ArmorStatMapping; count: number }>
	>;
	dimLink: string;
	dimQuery: string;
	isRecommendedLoadout: boolean;
};

const ResultsContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
}));

const ResultsItemContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	padding: theme.spacing(1),
	flexWrap: 'wrap',
	'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
	flexBasis: '100%',
	alignContent: 'flex-start',
}));

const ResultsSection = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'fullWidth',
})<{ fullWidth?: boolean }>(({ theme, color, fullWidth }) => ({
	display: 'flex',
	flexDirection: fullWidth ? 'row' : 'column',
	alignItems: 'stretch',
	padding: theme.spacing(1),
	minWidth: '350px',
	flexBasis: fullWidth ? '100%' : '',
	flexWrap: fullWidth ? 'wrap' : 'initial',
}));

const IconTextContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	paddingBottom: theme.spacing(1),
}));

const IconText = styled(Box)(({ theme }) => ({
	lineHeight: `40px`,
	paddingLeft: `6px`,
}));
const Title = styled(Box)(({ theme }) => ({
	fontSize: `1.15rem`,
	fontWeight: '500',
	paddingBottom: theme.spacing(1),
}));

const SubTitle = styled(Box)(({ theme }) => ({
	fontSize: `1.05rem`,
	fontWeight: '500',
	paddingBottom: theme.spacing(1),
}));
const Description = styled(Box)(({ theme }) => ({
	transform: `rotate(-35deg)`,
	transformOrigin: 'top right',
	minWidth: '300px',
	marginLeft: '-298px',
	textAlign: 'right',
}));

const StatsBreakdown = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
}));

const StatsBreakdownItem = styled(Box, {
	shouldForwardProp: (prop) => !['first', 'isZero'].includes(prop as string),
})<{ first?: boolean; isZero?: boolean }>(
	({ theme, color, first, isZero }) => ({
		width: first ? '75px' : '40px',
		height: '22px',
		paddingLeft: theme.spacing(1),
		display: 'flex',
		lineHeight: '22px',
		color: isZero ? 'rgba(255, 255, 255, 0.5)' : 'white',
		'&:nth-of-type(even)': {
			background: 'rgba(9, 9, 9, 0.5)',
		},
		'&:last-child': {
			background: 'none',
		},
	})
);

const LoadoutDetails = styled(Box)(({ theme }) => ({
	display: 'flex',
	height: '340px',
	marginLeft: '80px',
	// overflowX: 'auto',
}));

const RecommendedLoadoutHeader = styled(Box)(({ theme }) => ({
	color: 'orange',
	fontSize: '1.5rem',
	fontWeight: 'bold',
	width: '100%',
	textAlign: 'center',
	marginBottom: theme.spacing(1),
}));

const calculateExtraMasterworkedStats = (
	armorItems: ArmorItem[],
	classItem: ProcessedArmorItemMetadataClassItem,
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
	if (!classItem.hasMasterworkedVariant) {
		extraMasterworkedStats += getExtraMasterworkedStats(
			getDefaultArmorItem(),
			masterworkAssumption
		);
	}
	return extraMasterworkedStats;
};

const handleCopyDimQueryClick = async (dimQuery: string) => {
	await copyToClipboard({
		value: dimQuery,
	});
};

function ResultsItem({
	item,
	destinyClassId,
	masterworkAssumption,
	fragmentArmorStatMappings,
	armorSlotModArmorStatMappings,
	dimLink,
	dimQuery,
	isRecommendedLoadout,
}: ResultsItemProps) {
	const [open, setOpen] = React.useState(false);
	const totalStatMapping = getDefaultArmorStatMapping();
	ArmorStatIdList.forEach((armorStatId) => {
		totalStatMapping[armorStatId] += item.sortableFields[armorStatId];
	});

	const armorStatModArmorStatMappings: Partial<
		Record<EModId, { armorStatMapping: ArmorStatMapping; count: number }>
	> = {};
	const modCounts: Partial<Record<EModId, number>> = {};
	item.requiredStatModIdList.forEach((id) => {
		if (!modCounts[id]) {
			modCounts[id] = 1;
		} else {
			modCounts[id] += 1;
		}
	});
	Object.keys(modCounts).forEach((armorStatModId: EModId) => {
		const statModIds: EModId[] = [];
		const count = modCounts[armorStatModId];
		for (let i = 0; i < count; i++) {
			statModIds.push(armorStatModId);
			armorStatModArmorStatMappings[armorStatModId] = {
				count,
				armorStatMapping: getArmorStatMappingFromMods(
					statModIds,
					destinyClassId
				),
			};
		}
	});

	const artificeModCounts: Partial<Record<EModId, number>> = {};
	item.requiredArtificeModIdList.forEach((id) => {
		if (!artificeModCounts[id]) {
			artificeModCounts[id] = 1;
		} else {
			artificeModCounts[id] += 1;
		}
	});

	const getExtraMasterworkedStatsBreakdown = () => {
		const extraMasterworkedStats = calculateExtraMasterworkedStats(
			item.armorItems,
			item.classItem,
			masterworkAssumption
		);
		return (
			extraMasterworkedStats > 0 && (
				<StatsBreakdown className="stats-breakdown">
					<StatsBreakdownItem>
						<MasterworkedBungieImage
							isMasterworked={true}
							width={'20px'}
							height={'20px'}
							src={MISSING_ICON}
						/>
					</StatsBreakdownItem>
					{ArmorStatIdList.map((armorStatId) => (
						<StatsBreakdownItem key={armorStatId} className="stats-breakdown">
							{extraMasterworkedStats}
						</StatsBreakdownItem>
					))}
					<StatsBreakdownItem>
						<Description>
							Masterwork Unmasterworked Armor (x
							{`${extraMasterworkedStats / 2}`})
						</Description>
					</StatsBreakdownItem>
				</StatsBreakdown>
			)
		);
	};
	return (
		<ResultsItemContainer
			sx={{
				borderTop: isRecommendedLoadout ? '2px solid orange' : 'none',
				borderBottom: isRecommendedLoadout ? '2px solid orange' : 'none',
			}}
		>
			{isRecommendedLoadout && (
				<RecommendedLoadoutHeader>Recommended Loadout</RecommendedLoadoutHeader>
			)}
			<ResultsSection>
				<Title>Armor</Title>
				{item.armorItems.map((armorItem) => {
					return (
						<IconTextContainer key={armorItem.hash}>
							<MasterworkedBungieImage
								isMasterworked={armorItem.isMasterworked}
								width={'40px'}
								height={'40px'}
								src={armorItem.icon}
							/>
							<IconText>{armorItem.name}</IconText>
						</IconTextContainer>
					);
				})}
				<IconTextContainer>
					<MasterworkedBungieImage
						isMasterworked={item.classItem.hasMasterworkedVariant}
						width={'40px'}
						height={'40px'}
						src={getArmorSlot(EArmorSlotId.ClassItem).icon}
					/>
					<IconText>{getClassItemText(item)}</IconText>
				</IconTextContainer>
			</ResultsSection>
			<ResultsSection>
				<Title>Achieved Stats</Title>
				<StatTiers armorStatMapping={totalStatMapping} />
				{SortableFieldsDisplayOrder.filter(
					(x) => !ArmorStatIdList.includes(x as EArmorStatId)
				).map((sortableFieldKey) => {
					return (
						<Box sx={{ fontWeight: '500' }} key={sortableFieldKey}>
							{getSortableFieldDisplayName(sortableFieldKey)}:{' '}
							{item.sortableFields[sortableFieldKey]}
						</Box>
					);
				})}
			</ResultsSection>
			{/* <ResultsSection>
				<Title>Metadata</Title>
				{SortableFieldsDisplayOrder.filter(
					(x) => !ArmorStatIdList.includes(x as EArmorStatId)
				).map((sortableFieldKey) => {
					return (
						<Box sx={{ fontWeight: '500' }} key={sortableFieldKey}>
							{getSortableFieldDisplayName(sortableFieldKey)}:{' '}
							{item.sortableFields[sortableFieldKey]}
						</Box>
					);
				})}
			</ResultsSection> */}

			{item.requiredStatModIdList.length > 0 && (
				<ResultsSection>
					<Title>Required Stat Mods</Title>
					{Object.keys(modCounts).map((modId) => {
						const mod = getMod(modId as EModId);
						return (
							// Extra margin to account for masterworkedbungieImage border
							<IconTextContainer key={modId} sx={{ margin: '1px' }}>
								<BungieImage width={40} height={40} src={mod.icon} />
								<IconText>
									{mod.name}
									{modCounts[modId] > 1 ? ` (x${modCounts[modId]})` : ''}
								</IconText>
							</IconTextContainer>
						);
					})}
				</ResultsSection>
			)}
			{item.requiredArtificeModIdList.length > 0 && (
				<ResultsSection>
					<Title>Required Artifice Mods</Title>
					{Object.keys(artificeModCounts).map((artificeModId) => {
						const armorStat = getMod(artificeModId as EModId);
						return (
							// Extra margin to account for masterworkedbungieImage border
							<IconTextContainer key={artificeModId} sx={{ margin: '1px' }}>
								<BungieImage width={40} height={40} src={armorStat.icon} />
								<IconText>
									{armorStat.name} Mod
									{artificeModCounts[artificeModId] > 1
										? ` (x${artificeModCounts[artificeModId]})`
										: ''}
								</IconText>
							</IconTextContainer>
						);
					})}
				</ResultsSection>
			)}
			<ResultsSection fullWidth>
				<Box
					sx={{
						flexBasis: '100%',
						display: 'flex',
						flexWrap: 'wrap',
						// justifyContent: 'space-between',
					}}
				>
					<Button
						sx={{ marginRight: '8px', marginBottom: '8px', width: 215 }}
						variant="contained"
						target={'_blank'}
						href={dimLink}
						startIcon={<DimIcon sx={{ marginTop: '-2px' }} />}
					>
						Open loadout in DIM
					</Button>
					<Button
						sx={{ width: 180, marginBottom: '8px' }}
						variant="contained"
						onClick={() => handleCopyDimQueryClick(dimQuery)}
						startIcon={<DimIcon sx={{ marginTop: '-2px' }} />}
					>
						Copy DIM Query
					</Button>
				</Box>
				<Box
					onClick={() => setOpen(!open)}
					sx={{ cursor: 'pointer', marginTop: '16px' }}
				>
					Show Detailed Stat Breakdown
					<IconButton aria-label="expand row" size="small">
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</Box>
			</ResultsSection>
			<ResultsSection fullWidth sx={{ overflowX: 'auto' }}>
				<Collapse in={open} timeout="auto" unmountOnExit>
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
										<div
											style={{
												marginLeft: '2px',
												textAlign: 'right',
												width: '100%',
											}}
										>
											{item.sortableFields[id]} =
										</div>
									</StatsBreakdownItem>
								);
							})}
						</StatsBreakdown>
						{item.armorItems.map((armorItem) => (
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
								<StatsBreakdownItem>
									<Description>{armorItem.name}</Description>
								</StatsBreakdownItem>
							</StatsBreakdown>
						))}

						<StatsBreakdown className="stats-breakdown">
							<StatsBreakdownItem>
								<MasterworkedBungieImage
									isMasterworked={item.classItem.hasMasterworkedVariant}
									width={'20px'}
									height={'20px'}
									src={getArmorSlot(EArmorSlotId.ClassItem).icon}
								/>
							</StatsBreakdownItem>
							{ArmorStatIdList.map((armorStatId) => (
								<StatsBreakdownItem
									isZero={!item.classItem.hasMasterworkedVariant}
									key={armorStatId}
									className="stats-breakdown"
								>
									{item.classItem.hasMasterworkedVariant ? 2 : 0}
								</StatsBreakdownItem>
							))}
							<StatsBreakdownItem>
								<Description>{getClassItemText(item)}</Description>
							</StatsBreakdownItem>
						</StatsBreakdown>

						{getExtraMasterworkedStatsBreakdown()}

						{Object.keys(fragmentArmorStatMappings).map(
							(fragmentId: EFragmentId) => {
								const { name, icon } = getFragment(fragmentId);
								return (
									<StatsBreakdown key={fragmentId} className="stats-breakdown">
										<StatsBreakdownItem>
											<BungieImage width={20} height={20} src={icon} />
										</StatsBreakdownItem>
										{ArmorStatIdList.map((armorStatId) => (
											<StatsBreakdownItem
												isZero={
													fragmentArmorStatMappings[fragmentId][armorStatId] ===
													0
												}
												key={armorStatId}
												className="stats-breakdown"
											>
												{fragmentArmorStatMappings[fragmentId][armorStatId]}
											</StatsBreakdownItem>
										))}
										<StatsBreakdownItem>
											<Description>{name}</Description>
										</StatsBreakdownItem>
									</StatsBreakdown>
								);
							}
						)}
						{Object.keys(armorStatModArmorStatMappings).map(
							(armorStatModId: EModId) => {
								return (
									<StatsBreakdown
										key={armorStatModId}
										className="stats-breakdown"
									>
										<StatsBreakdownItem>
											<BungieImage
												width={20}
												height={20}
												src={getMod(armorStatModId).icon}
											/>
										</StatsBreakdownItem>
										{ArmorStatIdList.map((armorStatId) => (
											<StatsBreakdownItem
												isZero={
													armorStatModArmorStatMappings[armorStatModId]
														.armorStatMapping[armorStatId] === 0
												}
												key={armorStatId}
												className="stats-breakdown"
											>
												{
													armorStatModArmorStatMappings[armorStatModId]
														.armorStatMapping[armorStatId]
												}
											</StatsBreakdownItem>
										))}
										<StatsBreakdownItem>
											<Description>
												{getMod(armorStatModId).name}
												{armorStatModArmorStatMappings[armorStatModId].count > 1
													? ` (x${armorStatModArmorStatMappings[armorStatModId].count})`
													: ''}
											</Description>
										</StatsBreakdownItem>
									</StatsBreakdown>
								);
							}
						)}
						{Object.keys(armorSlotModArmorStatMappings).map((modId) => {
							const { name, icon } = getMod(modId as EModId);
							return (
								<StatsBreakdown key={modId} className="stats-breakdown">
									<StatsBreakdownItem>
										<BungieImage width={20} height={20} src={icon} />
									</StatsBreakdownItem>
									{ArmorStatIdList.map((armorStatId) => (
										<StatsBreakdownItem
											isZero={
												armorSlotModArmorStatMappings[modId].armorStatMapping[
													armorStatId
												] === 0
											}
											key={armorStatId}
											className="stats-breakdown"
										>
											{
												armorSlotModArmorStatMappings[modId].armorStatMapping[
													armorStatId
												]
											}
										</StatsBreakdownItem>
									))}
									<StatsBreakdownItem>
										{/* TODO: This doesnt have the counts! */}
										<Description>
											{name}{' '}
											{armorSlotModArmorStatMappings[modId].count > 1
												? ` (x${armorSlotModArmorStatMappings[modId].count})`
												: ''}
										</Description>
									</StatsBreakdownItem>
								</StatsBreakdown>
							);
						})}
						{Object.keys(artificeModCounts).map((artificeModId) => {
							const { name, icon, bonuses } = getMod(artificeModId as EModId);
							const { stat, value } = bonuses[0];
							const artificeModCount = artificeModCounts[artificeModId];
							return (
								<StatsBreakdown
									key={`artifice-${artificeModId}`}
									className="stats-breakdown"
								>
									<StatsBreakdownItem>
										<BungieImage width={20} height={20} src={icon} />
									</StatsBreakdownItem>
									{ArmorStatIdList.map((armorStatId) => (
										<StatsBreakdownItem
											key={armorStatId}
											className="stats-breakdown"
											isZero={armorStatId !== stat}
										>
											{armorStatId === stat ? artificeModCount * value : 0}
										</StatsBreakdownItem>
									))}
									<StatsBreakdownItem>
										<Description>
											{name} Mod
											{artificeModCount > 1 ? ` (x${artificeModCount})` : ''}
										</Description>
									</StatsBreakdownItem>
								</StatsBreakdown>
							);
						})}
					</LoadoutDetails>
				</Collapse>
			</ResultsSection>
		</ResultsItemContainer>
	);
}

function ArmorResultsList({ items }: ArmorResultsListProps) {
	const urlParams = new URLSearchParams(window.location.search);
	const loadoutString = urlParams.get('loadout');
	const hasLoadoutQueryParams = loadoutString ? true : false;
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);

	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedMasterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const selectedRaidMods = useAppSelector(selectSelectedRaidMods);

	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const exoticArmor = selectedExoticArmor[selectedDestinyClass];
	const selectedJump = useAppSelector(selectSelectedJump);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedAspects = useAppSelector(selectSelectedAspects);
	const destinySubclassId = selectedDestinySubclass[selectedDestinyClass];

	const allClassItemMetadata = useAppSelector(selectAllClassItemMetadata);
	const classItemMetadata = allClassItemMetadata[selectedDestinyClass];

	let elementId: EElementId = EElementId.Any;
	if (destinySubclassId) {
		elementId = getDestinySubclass(destinySubclassId).elementId;
	}
	const aspectIds = destinySubclassId ? selectedAspects[destinySubclassId] : [];

	// TODO: Having to do this cast sucks
	const fragmentIds =
		elementId !== EElementId.Any
			? (selectedFragments[elementId] as EFragmentId[])
			: [];

	// const { elementId } = getDestinySubclass(destinySubclassId);
	// const aspectIds = selectedAspects[destinySubclassId];

	// TODO: Having to do this cast sucks
	// const fragmentIds = selectedFragments[elementId] as EFragmentId[];

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

	const armorSlotModArmorStatMapppings: Partial<
		Record<EModId, { armorStatMapping: ArmorStatMapping; count: number }>
	> = {};
	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		selectedArmorSlotMods[armorSlotId].forEach((id: EModId) => {
			const { bonuses } = getMod(id) ?? { bonuses: [] };
			if (bonuses && bonuses.length > 0) {
				if (armorSlotModArmorStatMapppings[id]) {
					armorSlotModArmorStatMapppings[id] = {
						count: armorSlotModArmorStatMapppings[id].count + 1,
						armorStatMapping: sumArmorStatMappings([
							armorSlotModArmorStatMapppings[id].armorStatMapping,
							getArmorStatMappingFromMods([id], selectedDestinyClass),
						]),
					};
				} else {
					armorSlotModArmorStatMapppings[id] = {
						count: 1,
						armorStatMapping: getArmorStatMappingFromMods(
							[id],
							selectedDestinyClass
						),
					};
				}
			}
		});
	});

	return (
		<ResultsContainer>
			{items
				//  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
				.map((item, i) => {
					return (
						<ResultsItem
							key={item.id}
							item={item}
							isRecommendedLoadout={i === 0 && hasLoadoutQueryParams}
							destinyClassId={selectedDestinyClass}
							masterworkAssumption={selectedMasterworkAssumption}
							fragmentArmorStatMappings={fragmentArmorStatMappings}
							armorSlotModArmorStatMappings={armorSlotModArmorStatMapppings}
							dimLink={`${generateDimLink({
								raidModIdList: selectedRaidMods,
								armorStatModIdList: item.requiredStatModIdList,
								artificeModIdList: item.requiredArtificeModIdList,
								armorSlotMods: selectedArmorSlotMods,
								armorList: item.armorItems,
								fragmentIdList: fragmentIds,
								aspectIdList: aspectIds,
								exoticArmor: exoticArmor,
								stats: desiredArmorStats,
								masterworkAssumption: selectedMasterworkAssumption,
								destinySubclassId,
								destinyClassId: selectedDestinyClass,
								jumpId: selectedJump[destinySubclassId],
								meleeId: selectedMelee[destinySubclassId],
								superAbilityId: selectedSuperAbility[destinySubclassId],
								classAbilityId: selectedClassAbility[destinySubclassId],
								grenadeId: selectedGrenade[elementId],
								classItem: item.classItem,
								classItemMetadata: classItemMetadata,
							})}`}
							dimQuery={`${generateDimQuery(
								item.armorItems,
								item.classItem,
								classItemMetadata
							)}`}
						/>
					);
				})}
		</ResultsContainer>
	);
}
export default ArmorResultsList;
