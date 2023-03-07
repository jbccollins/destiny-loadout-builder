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
import { selectSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import { selectSelectedGrenade } from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { selectSelectedJump } from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { selectSelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { selectSelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { selectDesiredArmorStats } from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { MISSING_ICON } from '@dlb/types/globals';
import { EFragmentId } from '@dlb/generated/fragment/EFragmentId';
import { selectSelectedRaidMods } from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';

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
	shouldForwardProp: (prop) => !['first', 'isZero'].includes(prop as string),
})<{ first?: boolean; isZero?: boolean }>(
	({ theme, color, first, isZero }) => ({
		width: first ? '75px' : '40px',
		height: '22px',
		paddingLeft: theme.spacing(1),
		display: 'flex',
		lineHeight: '22px',
		opacity: isZero ? '0.5' : 1,
	})
);

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

// TODO: This isn't taking into consideration the possibility that the user
// Does not have a masterworked class item
const getClassItemText = (item: ResultsTableLoadout): string => {
	const artificeArmorItems = item.armorItems.filter((x) => x.isArtifice);
	if (artificeArmorItems.length < item.requiredArtificeStatModsIdList.length) {
		return 'Any Masterworked Artifice Class Item';
	}
	return 'Any Masterworked Class Item';
};

function ResultsItem({
	item,
	destinyClassId,
	masterworkAssumption,
	fragmentArmorStatMappings,
	armorSlotModArmorStatMappings,
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

	const artificeModCounts: Partial<Record<EArmorStatId, number>> = {};
	item.requiredArtificeStatModsIdList.forEach((id) => {
		if (!artificeModCounts[id]) {
			artificeModCounts[id] = 1;
		} else {
			artificeModCounts[id] += 1;
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
					{/* TODO: Pull this out into a function. Also this > 0 logic is just wrong. */}
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
			{item.requiredArtificeStatModsIdList.length > 0 && (
				<ResultsSection>
					<Title>Required Artifice Mods</Title>
					{Object.keys(artificeModCounts).map((armorStatId) => {
						const armorStat = getArmorStat(armorStatId as EArmorStatId);
						return (
							// Extra margin to account for masterworkedbungieImage border
							<IconTextContainer key={armorStatId} sx={{ margin: '1px' }}>
								<BungieImage width={40} height={40} src={armorStat.icon} />
								<IconText>
									{armorStat.name}
									{artificeModCounts[armorStatId] > 1
										? ` (x${artificeModCounts[armorStatId]})`
										: ''}
								</IconText>
							</IconTextContainer>
						);
					})}
				</ResultsSection>
			)}
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
									<Description>{getClassItemText(item)}</Description>
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
						{Object.keys(artificeModCounts).map((artificeArmorStatId) => {
							const { name, icon } = getArmorStat(
								artificeArmorStatId as EArmorStatId
							);
							const artificeModCount = artificeModCounts[artificeArmorStatId];
							return (
								<StatsBreakdown
									key={`artifice-${artificeArmorStatId}`}
									className="stats-breakdown"
								>
									<StatsBreakdownItem>
										<BungieImage width={20} height={20} src={icon} />
									</StatsBreakdownItem>
									{ArmorStatIdList.map((armorStatId) => (
										<StatsBreakdownItem
											key={armorStatId}
											className="stats-breakdown"
											isZero={armorStatId !== artificeArmorStatId}
										>
											{armorStatId === artificeArmorStatId
												? artificeModCount * 3
												: 0}
										</StatsBreakdownItem>
									))}
									<StatsBreakdownItem>
										<Description>
											Artifice {name} Mod
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
				.map((item) => {
					return (
						<ResultsItem
							key={item.id}
							item={item}
							destinyClassId={selectedDestinyClass}
							masterworkAssumption={selectedMasterworkAssumption}
							fragmentArmorStatMappings={fragmentArmorStatMappings}
							armorSlotModArmorStatMappings={armorSlotModArmorStatMapppings}
							dimLink={`${generateDimLink({
								raidModIdList: selectedRaidMods,
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
