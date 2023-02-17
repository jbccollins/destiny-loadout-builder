import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { EModId } from '@dlb/generated/mod/EModId';
import { selectSelectedDestinySubclass } from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	DefaultArmorStatMapping,
	getArmorStat,
	getArmorStatMappingFromFragments,
	getArmorStatMappingFromMods,
	sumArmorStatMappings,
} from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EFragmentId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import generateDimLink from '@dlb/services/dim/generateDimLoadoutLink';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getMod } from '@dlb/types/Mod';
import { styled, Box, Collapse, IconButton, Button } from '@mui/material';
import React from 'react';
import MasterworkedBungieImage from '@dlb/components/MasterworkedBungieImage';
import {
	getSortableFieldDisplayName,
	ResultsTableLoadout,
	SortableFieldsDisplayOrder,
} from './ArmorResultsView';
import { useAppSelector } from '@dlb/redux/hooks';
import { selectSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import StatTiers from '@dlb/components/StatTiers';
import { ArmorItem, getExtraMasterworkedStats } from '@dlb/types/Armor';
import { selectSelectedMasterworkAssumption } from '@dlb/redux/features/selectedMasterworkAssumption/selectedMasterworkAssumptionSlice';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { selectSelectedFragments } from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import { getFragment } from '@dlb/types/Fragment';
import {
	ArmorSlotWithClassItemIdList,
	getArmorSlot,
} from '@dlb/types/ArmorSlot';
import { selectSelectedArmorSlotMods } from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import { selectSelectedAspects } from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { selectSelectedClassAbility } from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { selectSelectedCombatStyleMods } from '@dlb/redux/features/selectedCombatStyleMods/selectedCombatStyleModsSlice';
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedGrenade } from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { selectSelectedJump } from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { selectSelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { selectSelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { selectDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';

type ArmorResultsListProps = {
	items: ResultsTableLoadout[];
};

type ResultsItemProps = {
	item: ResultsTableLoadout;
	destinyClassId: EDestinyClassId;
	masterworkAssumption: EMasterworkAssumption;
	fragmentArmorStatMappings: Partial<Record<EFragmentId, ArmorStatMapping>>;
	armorSlotModArmorStatMappping: Partial<Record<EModId, ArmorStatMapping>>;
	dimLink: string;
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
	shouldForwardProp: (prop) => prop !== 'first',
})<{ first?: boolean }>(({ theme, color, first }) => ({
	width: first ? '75px' : '40px',
	height: '22px',
	paddingLeft: theme.spacing(1),
	display: 'flex',
	lineHeight: '22px',
}));

const LoadoutDetails = styled(Box)(({ theme }) => ({
	display: 'flex',
	height: '340px',
	marginLeft: '60px',
	// overflowX: 'auto',
}));

// TODO: Figure this out from the initial ingestion of armor and store in redux
const hasMasterworkedClassItem = true;

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

function ResultsItem({
	item,
	destinyClassId,
	masterworkAssumption,
	fragmentArmorStatMappings,
	armorSlotModArmorStatMappping,
	dimLink,
}: ResultsItemProps) {
	const [open, setOpen] = React.useState(false);
	const totalStatMapping = { ...DefaultArmorStatMapping };
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

	const getExtraMasterworkedStatsBreakdown = () => {
		const extraMasterworkedStats = calculateExtraMasterworkedStats(
			item.armorItems,
			masterworkAssumption
		);
		return (
			extraMasterworkedStats > 0 && (
				<StatsBreakdown className="stats-breakdown">
					<StatsBreakdownItem></StatsBreakdownItem>
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
		<ResultsItemContainer>
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
						isMasterworked={true}
						width={'40px'}
						height={'40px'}
						src={getArmorSlot(EArmorSlotId.ClassItem).icon}
					/>
					<IconText>Any Masterworked Class Item</IconText>
				</IconTextContainer>
			</ResultsSection>
			<ResultsSection>
				<Title>Achieved Stats</Title>
				<StatTiers armorStatMapping={totalStatMapping} />
				{SortableFieldsDisplayOrder.filter(
					(x) => !ArmorStatIdList.includes(x as EArmorStatId)
				).map((sortableFieldKey) => {
					return (
						<Box key={sortableFieldKey}>
							{getSortableFieldDisplayName(sortableFieldKey)}:{' '}
							{item.sortableFields[sortableFieldKey]}
						</Box>
					);
				})}
			</ResultsSection>
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
			{/* <ResultsSection>
				<Title>Metadata</Title>
				{SortableFieldsDisplayOrder.map((sortableFieldKey) => {
					return (
						<Box key={sortableFieldKey}>
							{getSortableFieldDisplayName(sortableFieldKey)}:{' '}
							{item.sortableFields[sortableFieldKey]}
						</Box>
					);
				})}
			</ResultsSection> */}
			<ResultsSection fullWidth>
				<Box sx={{ flexBasis: '100%' }}>
					<Button
						sx={{ width: 200 }}
						variant="contained"
						target={'_blank'}
						href={dimLink}
					>
						Open loadout in DIM
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
						{hasMasterworkedClassItem && (
							<StatsBreakdown className="stats-breakdown">
								<StatsBreakdownItem>
									<MasterworkedBungieImage
										isMasterworked={true}
										width={'20px'}
										height={'20px'}
										src={getArmorSlot(EArmorSlotId.ClassItem).icon}
									/>
								</StatsBreakdownItem>
								{ArmorStatIdList.map((armorStatId) => (
									<StatsBreakdownItem
										key={armorStatId}
										className="stats-breakdown"
									>
										2
									</StatsBreakdownItem>
								))}
								<StatsBreakdownItem>
									<Description>Any Masterworked Class Item</Description>
								</StatsBreakdownItem>
							</StatsBreakdown>
						)}
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
						{/* {Object.keys(combatStyleModArmorStatMapping).map((modId) => {
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
					})} */}
					</LoadoutDetails>
				</Collapse>
			</ResultsSection>
		</ResultsItemContainer>
	);
}

function ArmorResultsList({ items }: ArmorResultsListProps) {
	const desiredArmorStats = useAppSelector(selectDesiredArmorStats);

	const selectedDestinyClass = useAppSelector(selectSelectedDestinyClass);
	const selectedMasterworkAssumption = useAppSelector(
		selectSelectedMasterworkAssumption
	);
	const selectedFragments = useAppSelector(selectSelectedFragments);
	const selectedDestinySubclass = useAppSelector(selectSelectedDestinySubclass);
	const selectedArmorSlotMods = useAppSelector(selectSelectedArmorSlotMods);

	const selectedExoticArmor = useAppSelector(selectSelectedExoticArmor);
	const exoticArmor = selectedExoticArmor[selectedDestinyClass];
	const selectedCombatStyleMods = useAppSelector(selectSelectedCombatStyleMods);
	const selectedJump = useAppSelector(selectSelectedJump);
	const selectedMelee = useAppSelector(selectSelectedMelee);
	const selectedGrenade = useAppSelector(selectSelectedGrenade);
	const selectedClassAbility = useAppSelector(selectSelectedClassAbility);
	const selectedSuperAbility = useAppSelector(selectSelectedSuperAbility);
	const selectedAspects = useAppSelector(selectSelectedAspects);
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

	const armorSlotModArmorStatMappping: Partial<
		Record<EModId, ArmorStatMapping>
	> = {};
	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		selectedArmorSlotMods[armorSlotId].forEach((id: EModId) => {
			const { bonuses } = getMod(id) ?? { bonuses: [] };
			if (bonuses && bonuses.length > 0) {
				if (armorSlotModArmorStatMappping[id]) {
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

	return (
		<ResultsContainer>
			{items
				//  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
				.map((item) => {
					return (
						<ResultsItem
							key={item.id}
							item={item}
							destinyClassId={selectedDestinyClass}
							masterworkAssumption={selectedMasterworkAssumption}
							fragmentArmorStatMappings={fragmentArmorStatMappings}
							armorSlotModArmorStatMappping={armorSlotModArmorStatMappping}
							dimLink={`${generateDimLink({
								combatStyleModIdList: selectedCombatStyleMods,
								armorStatModIdList: item.requiredStatModIdList,
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
							})}`}
						/>
					);
				})}
		</ResultsContainer>
	);
}
export default ArmorResultsList;
