import CustomTooltip from '@dlb/components/CustomTooltip';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import useApplyAnalyzableLoadout from '@dlb/hooks/useApplyAnalyzableLoadout';
import {
	AnalyzableLoadoutsValueState,
	selectAnalyzableLoadouts,
	setHiddenLoadoutIdList,
	setLoadoutSpecificIgnoredOptimizationTypes,
} from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import { SelectedAspects } from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import { SelectedClassAbility } from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { SelectedGrenade } from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { SelectedJump } from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import { SelectedMelee } from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import { SelectedSuperAbility } from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	ELoadoutOptimizationTypeId,
	NoneOptimization,
	getLoadoutOptimization,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	ELoadoutOptimizationCategoryId,
	ELoadoutType,
	RichAnalyzableLoadout,
	getLoadoutOptimizationCategory,
} from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import {
	ArmorSlotIdList,
	IArmorSlot,
	getArmorSlot,
} from '@dlb/types/ArmorSlot';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EDestinyClassId,
	EDestinySubclassId,
} from '@dlb/types/IdEnums';
import { getMod } from '@dlb/types/Mod';
import { IMod } from '@dlb/types/generation';
import { bungieNetPath } from '@dlb/utils/item-utils';
import EditIcon from '@mui/icons-material/Edit';
import ShowIcon from '@mui/icons-material/Visibility';
import HideIcon from '@mui/icons-material/VisibilityOff';
import {
	Box,
	Button,
	CircularProgress,
	Collapse,
	IconButton,
	styled,
	useTheme,
} from '@mui/material';
import d2Logo from '@public/d2-logo.png';
import dimLogo from '@public/dim-logo.png';
import Image from 'next/image';
import { useState } from 'react';
import Breakdown from './Breakdown';
import IconPill from './IconPill';
import { loadoutOptimizationIconMapping } from './LoadoutAnalyzer';

type ArmorSlotModListProps = {
	modList: IMod[];
	armorSlot: IArmorSlot;
};
const ArmorSlotModList = ({ modList, armorSlot }: ArmorSlotModListProps) => {
	return modList.length > 0 ? (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: '4px',
				background: 'rgba(30,30,30,0.5)',
				'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
				padding: '4px',
			}}
		>
			<Box sx={{ width: '26px', height: '26px', display: 'flex' }}>
				<BungieImage src={armorSlot.icon} width={26} height={26} />
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
				{modList.map((mod, i) => (
					<Box
						key={i}
						sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
					>
						<Box sx={{ width: '26px', height: '26px' }}>
							<BungieImage src={mod.icon} width={26} height={26} />
						</Box>
						<Box>
							{mod.name}
							{mod.isArtifactMod ? ' (Artifact)' : ''}
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	) : null;
};

const InspectingOptimizationDetailsHelp = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(0.5),
	fontSize: '14px',
	fontStyle: 'italic',
}));

type InspectingOptimizationDetailsProps = {
	loadout: RichAnalyzableLoadout;
	optimizationType: ELoadoutOptimizationTypeId;
};

const InspectingOptimizationDetails = (
	props: InspectingOptimizationDetailsProps
) => {
	const { loadout, optimizationType } = props;
	const { metadata } = loadout;
	const dispatch = useAppDispatch();

	const {
		loadoutSpecificIgnoredOptimizationTypes,
		buggedAlternateSeasonModIdList,
	} = useAppSelector(selectAnalyzableLoadouts);
	const ignoredOptimizationTypes =
		loadoutSpecificIgnoredOptimizationTypes[loadout.dlbGeneratedId] || [];

	const isIgnored = ignoredOptimizationTypes.includes(optimizationType);

	const hide = () => {
		dispatch(
			setLoadoutSpecificIgnoredOptimizationTypes({
				loadoutSpecificIgnoredOptimizationTypes: {
					...loadoutSpecificIgnoredOptimizationTypes,
					[loadout.dlbGeneratedId]: [
						...ignoredOptimizationTypes,
						optimizationType,
					],
				},
				validate: true,
			})
		);
	};

	const show = () => {
		dispatch(
			setLoadoutSpecificIgnoredOptimizationTypes({
				loadoutSpecificIgnoredOptimizationTypes: {
					...loadoutSpecificIgnoredOptimizationTypes,
					[loadout.dlbGeneratedId]: ignoredOptimizationTypes.filter(
						(x) => x !== optimizationType
					),
				},
				validate: true,
			})
		);
	};

	return (
		<Box>
			<Box sx={{ fontSize: '18px', fontWeight: 'bold' }}>
				Resolution Instructions:
			</Box>
			{optimizationType === ELoadoutOptimizationTypeId.HigherStatTier && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						Use the &quot;Desired Stat Tiers&quot; selector to resolve this
						optimization:
					</InspectingOptimizationDetailsHelp>
					{ArmorStatIdList.map((armorStatId) => {
						const armorStat = getArmorStat(armorStatId);
						const diff =
							metadata?.maxPossibleDesiredStatTiers[armorStatId] -
								loadout.desiredStatTiers[armorStatId] || 0;
						return diff > 0 ? (
							<Box
								key={armorStatId}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: '4px',
									background: 'rgba(30,30,30,0.5)',
									'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
									padding: '4px',
								}}
							>
								<CustomTooltip title={armorStat.name}>
									<Box sx={{ width: '26px', height: '26px' }}>
										<BungieImage src={armorStat.icon} width={26} height={26} />
									</Box>
								</CustomTooltip>
								<Box sx={{ width: '80px' }}>{armorStat.name}: </Box>
								<Box>
									(+{diff / 10} tier{diff > 10 ? 's' : ''})
								</Box>
							</Box>
						) : null;
					})}
				</Box>
			)}
			{(optimizationType === ELoadoutOptimizationTypeId.UnusableMods ||
				optimizationType === ELoadoutOptimizationTypeId.Doomed ||
				optimizationType ===
					ELoadoutOptimizationTypeId.ManuallyCorrectableDoomed) && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						{(optimizationType === ELoadoutOptimizationTypeId.UnusableMods ||
							optimizationType === ELoadoutOptimizationTypeId.Doomed) && (
							<Box>
								Remove the following mods from the loadout to resolve this
								optimization:
							</Box>
						)}
						{optimizationType ===
							ELoadoutOptimizationTypeId.ManuallyCorrectableDoomed && (
							<Box>
								Replace the following mods from the loadout with their
								respective full cost variants to resolve this optimization:
							</Box>
						)}
					</InspectingOptimizationDetailsHelp>
					{ArmorSlotIdList.map((armorSlotId) => {
						const armorSlot = getArmorSlot(armorSlotId);
						// TODO: Is this actually the right logic? Won't this render the
						// current season artifact mods as well? Which is wrong for "Unusable Mods"
						const artifactModList = loadout.armorSlotMods[armorSlotId]
							.filter((x) => x !== null)
							.map((modId) => getMod(modId))
							.filter(
								(mod) =>
									mod.isArtifactMod &&
									!buggedAlternateSeasonModIdList.includes(mod.id)
							);
						return (
							<ArmorSlotModList
								key={armorSlotId}
								modList={artifactModList}
								armorSlot={armorSlot}
							/>
						);
					})}
				</Box>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.LowerCost && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						Sort the results by &quot;Total Mod Cost&quot; to resolve this
						optimization.
					</InspectingOptimizationDetailsHelp>
					<Box>Current cost: {metadata.currentCost}</Box>
					<Box>Optimized cost: {metadata.lowestCost}</Box>
				</Box>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.FewerWastedStats && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						Sort the results by &quot;Wasted Stats&quot; to resolve this
						optimization.
					</InspectingOptimizationDetailsHelp>
					<Box>
						<Box>Current wasted stats: {metadata.currentWastedStats}</Box>
						<Box>Optimized wasted stats: {metadata.lowestWastedStats}</Box>
					</Box>
				</Box>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.UnusedModSlots && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						Add mods to available mod slots to resolve this optimization.
					</InspectingOptimizationDetailsHelp>
					<Box>
						{Object.keys(metadata.unusedModSlots).map((armorSlotId) => {
							const value = metadata.unusedModSlots[armorSlotId];
							const armorSlot = getArmorSlot(armorSlotId as EArmorSlotId);
							return (
								<Box
									key={armorSlotId}
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: '4px',
										background: 'rgba(30,30,30,0.5)',
										'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
										padding: '4px',
									}}
								>
									<CustomTooltip title={armorSlot.name}>
										<Box sx={{ width: '26px', height: '26px' }}>
											<BungieImage
												src={armorSlot.icon}
												width={26}
												height={26}
											/>
										</Box>
									</CustomTooltip>
									<Box>Any mod costing {value} or less</Box>
								</Box>
							);
						})}
					</Box>
				</Box>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.DeprecatedMods && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						The symptom of this will be empty mod sockets in the &quot;Armor
						Mods&quot; section. Add any mods in such sockets to resolve this
						optimization.
					</InspectingOptimizationDetailsHelp>
				</Box>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.Error && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						This should never happen. Please report this bug in the Discord.
					</InspectingOptimizationDetailsHelp>
				</Box>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.UnusedFragmentSlots && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						Add more fragments to resolve this optimization.
					</InspectingOptimizationDetailsHelp>
				</Box>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.UnspecifiedAspect && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						Select a second aspect to resolve this optimization.
					</InspectingOptimizationDetailsHelp>
				</Box>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.UnmasterworkedArmor && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						Masterwork all armor in this loadout to resolve this optimization.
					</InspectingOptimizationDetailsHelp>
				</Box>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.MissingArmor && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						This loadout is missing armor and must be recreated from scratch to
						resolve this optimization.
					</InspectingOptimizationDetailsHelp>
				</Box>
			)}
			{optimizationType ===
				ELoadoutOptimizationTypeId.UnmetDIMStatConstraints && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						This loadout must be recreated to resolve this optimization. Here
						are the discrepancies between the DIM Stat Tier Constraints (DSTC)
						and the Actual Stat Tiers (AST) that this loadout achieves:
					</InspectingOptimizationDetailsHelp>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
						<Box sx={{ width: '114px' }}>Stat</Box>
						<Box
							sx={{
								width: '60px',
								paddingLeft: '6px',
								borderLeft: '1px solid white',
							}}
						>
							DSTC
						</Box>
						<Box
							sx={{
								width: '60px',
								borderLeft: '1px solid white',
								paddingLeft: '6px',
							}}
						>
							AST
						</Box>
					</Box>
					{ArmorStatIdList.map((armorStatId) => {
						const armorStat = getArmorStat(armorStatId);
						const diff =
							loadout.dimStatTierConstraints[armorStatId] -
							loadout.achievedStatTiers[armorStatId];

						return diff > 0 ? (
							<Box
								key={armorStatId}
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: '4px',
									background: 'rgba(30,30,30,0.5)',
									'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
									padding: '4px',
								}}
							>
								<CustomTooltip title={armorStat.name}>
									<Box sx={{ width: '26px', height: '26px' }}>
										<BungieImage src={armorStat.icon} width={26} height={26} />
									</Box>
								</CustomTooltip>
								<Box sx={{ width: '80px' }}>{armorStat.name}: </Box>
								<Box
									sx={{
										width: '60px',
										borderLeft: '1px solid white',
										paddingLeft: '6px',
									}}
								>
									{loadout.dimStatTierConstraints[armorStatId] / 10}
								</Box>
								<Box
									sx={{
										width: '60px',
										borderLeft: '1px solid white',
										paddingLeft: '6px',
									}}
								>
									{loadout.achievedStatTiers[armorStatId] / 10}
								</Box>
							</Box>
						) : null;
					})}
				</Box>
			)}
			{optimizationType ===
				ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						Follow the troubleshooting guide in the &quot;No Results&quot;
						section to resolve this optimization.
					</InspectingOptimizationDetailsHelp>
				</Box>
			)}
			{optimizationType ===
				ELoadoutOptimizationTypeId.MutuallyExclusiveMods && (
				<InspectingOptimizationDetailsHelp>
					This loadout contains mutually exclusive{' '}
					{loadout.metadata.mutuallyExclusiveModGroups.join(' and ')} mods.
					Remove mutually exclusive mods to resolve this optimization.
				</InspectingOptimizationDetailsHelp>
			)}
			{optimizationType === ELoadoutOptimizationTypeId.UnstackableMods && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						Remove redundant copies of the following mods to resolve this
						optimization:
					</InspectingOptimizationDetailsHelp>
					{ArmorSlotIdList.map((armorSlotId) => {
						const armorSlot = getArmorSlot(armorSlotId);
						const modIdList = metadata.unstackableModIdList
							.filter((x) => x !== null)
							.map((modId) => getMod(modId))
							.filter((mod) => mod.armorSlotId === armorSlotId);
						return (
							<ArmorSlotModList
								key={armorSlotId}
								modList={modIdList}
								armorSlot={armorSlot}
							/>
						);
					})}
				</Box>
			)}
			{optimizationType == ELoadoutOptimizationTypeId.NoExoticArmor && (
				<InspectingOptimizationDetailsHelp>
					This loadout must be recreated from scratch. Select an exotic armor
					piece to resolve this optimization.
				</InspectingOptimizationDetailsHelp>
			)}
			{optimizationType == ELoadoutOptimizationTypeId.StatsOver100 && (
				<InspectingOptimizationDetailsHelp>
					This may or may not be something that can be resolved given obtained
					armor and selected mods. Play around with the &quot;Desired Stat
					Tiers&quot; selector to try and resolve this optimization.
				</InspectingOptimizationDetailsHelp>
			)}
			{optimizationType ==
				ELoadoutOptimizationTypeId.BuggedAlternateSeasonMod && (
				<Box>
					<InspectingOptimizationDetailsHelp>
						There is nothing you can do to resolve this. This is a bug on
						Bungie&apos;s end. Bungie may fix this at any time. Here are the
						mods that are affected:
					</InspectingOptimizationDetailsHelp>
					{ArmorSlotIdList.map((armorSlotId) => {
						const armorSlot = getArmorSlot(armorSlotId);
						const artifactModList = loadout.armorSlotMods[armorSlotId]
							.filter((x) => x !== null)
							.map((modId) => getMod(modId))
							.filter((mod) => buggedAlternateSeasonModIdList.includes(mod.id));

						// TODO: This does not include artifact mods that are armor slot agnostic
						return (
							<ArmorSlotModList
								key={armorSlotId}
								modList={artifactModList}
								armorSlot={armorSlot}
							/>
						);
					})}
				</Box>
			)}
			<Box
				sx={{
					marginTop: '8px',
				}}
			>
				<CustomTooltip
					title={
						isIgnored
							? 'This optimization is ignored for this specific loadout. Click this button to stop ignoring this optimization.'
							: 'This optimization is recognized (AKA "Not Ignored") for this specific loadout. Click this button to ignore this optimization.'
					}
				>
					<Button
						variant="text"
						onClick={() => (isIgnored ? show() : hide())}
						startIcon={isIgnored ? <ShowIcon /> : <HideIcon />}
					>
						{isIgnored ? 'Stop Ignoring' : 'Ignore'}
					</Button>
				</CustomTooltip>
			</Box>
		</Box>
	);
};

export type LoadoutItemProps = {
	loadout: RichAnalyzableLoadout;
	isHidden: boolean;
	selectedExoticArmor: Record<EDestinyClassId, AvailableExoticArmorItem>;
	flatAvailableExoticArmor: AvailableExoticArmorItem[];
	selectedDestinySubclass: Record<EDestinyClassId, EDestinySubclassId>;
	selectedSuperAbility: SelectedSuperAbility;
	selectedAspects: SelectedAspects;
	selectedGrenade: SelectedGrenade;
	selectedMelee: SelectedMelee;
	selectedClassAbility: SelectedClassAbility;
	selectedJump: SelectedJump;
	analyzeableLoadouts: AnalyzableLoadoutsValueState;
	hideOptimizedLoadouts: boolean;
};
export const LoadoutItem = (props: LoadoutItemProps) => {
	const { loadout, isHidden, analyzeableLoadouts, hideOptimizedLoadouts } =
		props;
	const {
		loadoutType,
		dlbGeneratedId,
		icon,
		name,
		optimizationTypeList,
		iconColorImage,
		index,
	} = loadout;
	const { analysisResults, hiddenLoadoutIdList } = analyzeableLoadouts;
	const [inspectingOptimizationType, setInspectingOptimizationType] =
		useState<ELoadoutOptimizationTypeId | null>(null);

	const [showIgnoredOptimizationTypes, setShowIgnoredOptimizationTypes] =
		useState(false);
	const theme = useTheme();
	const dispatch = useAppDispatch();

	const { loadoutSpecificIgnoredOptimizationTypes } = useAppSelector(
		selectAnalyzableLoadouts
	);
	const loadoutSpecificIgnoredOptimizationTypeIdList =
		loadoutSpecificIgnoredOptimizationTypes[loadout.dlbGeneratedId] || [];

	const hasIgnoredOptimizations =
		loadoutSpecificIgnoredOptimizationTypeIdList.some((x) =>
			optimizationTypeList?.includes(x)
		);

	const filteredOptimizationTypeList =
		showIgnoredOptimizationTypes || !hasIgnoredOptimizations
			? optimizationTypeList
			: optimizationTypeList?.filter(
					(x) => !loadoutSpecificIgnoredOptimizationTypeIdList.includes(x)
			  );

	const applyLoadout = useApplyAnalyzableLoadout();

	const handleEditClick = () => applyLoadout(loadout, true);

	const hideAnalyzableLoadout = (loadoutId: string) => {
		dispatch(
			setHiddenLoadoutIdList({
				loadoutIdList: [...hiddenLoadoutIdList, loadoutId],
				validate: true,
			})
		);
	};

	const unHideAnalyzableLoadout = (loadoutId: string) => {
		dispatch(
			setHiddenLoadoutIdList({
				loadoutIdList: hiddenLoadoutIdList.filter((x) => x !== loadoutId),
				validate: true,
			})
		);
	};

	const handleInspectingOptimizationType = (
		type: ELoadoutOptimizationTypeId
	) => {
		if (!inspectingOptimizationType || inspectingOptimizationType !== type) {
			setInspectingOptimizationType(type);
		} else {
			setInspectingOptimizationType(null);
		}
	};

	const inspectingOptimization = inspectingOptimizationType
		? getLoadoutOptimization(inspectingOptimizationType)
		: null;

	const inspectingOptimizationIsIgnored =
		inspectingOptimizationType &&
		loadoutSpecificIgnoredOptimizationTypeIdList.includes(
			inspectingOptimizationType
		);

	const loadoutIsFullyOptimized =
		!!analysisResults[dlbGeneratedId]?.optimizationTypeList &&
		filteredOptimizationTypeList?.length === 0;

	const inGameLoadoutIconSize = 40;

	if (loadoutIsFullyOptimized && hideOptimizedLoadouts) {
		return null;
	}

	return (
		<Box
			sx={{
				padding: theme.spacing(1.5),
				marginBottom: theme.spacing(1),
				background: 'rgb(50, 50, 50)',
				//'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				<Box>
					<CustomTooltip
						title={`This is a ${
							loadoutType === ELoadoutType.DIM ? 'DIM' : 'D2'
						} loadout`}
					>
						<Box
							sx={{
								height: '20px',
								width: '20px',
								minWidth: '20px',
								minHeight: '20px',
							}}
						>
							<Image
								src={loadoutType === ELoadoutType.DIM ? dimLogo : d2Logo}
								alt="Loadout Logo"
								height={20}
								width={20}
							/>
						</Box>
					</CustomTooltip>
				</Box>
				{loadoutType === ELoadoutType.InGame && (
					<Box
						sx={{
							width: inGameLoadoutIconSize,
							height: inGameLoadoutIconSize,
							position: 'relative',
							marginLeft: '4px',
						}}
					>
						<Box
							sx={{
								width: inGameLoadoutIconSize,
								height: inGameLoadoutIconSize,
								position: 'absolute',
							}}
						>
							<BungieImage
								src={bungieNetPath(iconColorImage)}
								width={inGameLoadoutIconSize}
								height={inGameLoadoutIconSize}
							/>
						</Box>
						<Box
							sx={{
								width: inGameLoadoutIconSize,
								height: inGameLoadoutIconSize,
								position: 'absolute',
							}}
						>
							<BungieImage
								src={bungieNetPath(icon)}
								width={inGameLoadoutIconSize}
								height={inGameLoadoutIconSize}
							/>
						</Box>
						<Box
							sx={{
								position: 'absolute',
								bottom: 0,
								right: 0,
								fontSize: '12px',
								height: '14px',
								width: '14px',
								background: 'rgba(0, 0, 0, 0.5)',
								textAlign: 'right',
							}}
						>
							{index}
						</Box>
					</Box>
				)}
				<Box sx={{ fontWeight: 'bold' }}>{name}</Box>
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
					marginTop: '4px',
				}}
			>
				<CustomTooltip title="Edit this loadout" hideOnMobile>
					<IconButton onClick={handleEditClick} size="small">
						<EditIcon />
					</IconButton>
				</CustomTooltip>
				{!isHidden && (
					<CustomTooltip
						title="Hide this loadout from the list of loadouts that can be optimized."
						hideOnMobile
					>
						<IconButton
							onClick={() => hideAnalyzableLoadout(dlbGeneratedId)}
							size="small"
							sx={{ marginRight: theme.spacing(0.5) }}
						>
							<HideIcon />
						</IconButton>
					</CustomTooltip>
				)}
				{isHidden && (
					<CustomTooltip title="Show this loadout in the list of loadouts that can be optimized.">
						<IconButton
							onClick={() => unHideAnalyzableLoadout(dlbGeneratedId)}
							size="small"
							sx={{ marginRight: theme.spacing(0.5) }}
						>
							<ShowIcon />
						</IconButton>
					</CustomTooltip>
				)}
			</Box>
			<Box
				sx={{
					marginTop: '12px',
					display: 'flex',
					gap: '4px',
					alignItems: 'center',
				}}
			>
				{/* This loadout has been analyzed and has optimizations */}
				{!loadoutIsFullyOptimized && (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							// background: 'rgb(19,19,19)',
							// padding: '8px',
							width: '100%',
							// borderRadius: '4px',
						}}
					>
						<Box
							sx={{
								marginBottom: '4px',
								fontSize: '14px',
								fontStyle: 'italic',
								// verticalAlign: 'text-top',
							}}
						>
							Available optimizations:
						</Box>
						<Box sx={{ display: 'flex', gap: '4px' }}>
							{filteredOptimizationTypeList?.map((x) => {
								const { category, name } = getLoadoutOptimization(x);
								const { color } = getLoadoutOptimizationCategory(category);
								return (
									<Box
										key={x}
										sx={{
											position: 'relative',
										}}
									>
										<Box
											sx={{
												cursor: 'pointer',
												zIndex: 1,
												position: 'relative',
											}}
											onClick={() => handleInspectingOptimizationType(x)}
										>
											<IconPill key={x} color={color} tooltipText={name}>
												{loadoutOptimizationIconMapping[x]}
											</IconPill>
										</Box>
										{inspectingOptimizationType === x && (
											<Box
												sx={{
													zIndex: 0,
													position: 'absolute',
													top: '16px',
													left: '0px',
													width: '32px',
													height: '32px',
													background: '#585858',
												}}
											/>
										)}
									</Box>
								);
							})}
						</Box>
					</Box>
				)}
				{/* This loadout has been analyzed and has NO optimizations */}
				{loadoutIsFullyOptimized && (
					<Box
						sx={{
							display: 'flex',
							// background: 'rgb(19,19,19)',
							// padding: '8px',
							width: '100%',
							alignItems: 'center',
							gap: '8px',
							// borderRadius: '4px',
						}}
					>
						<IconPill
							color={
								getLoadoutOptimizationCategory(
									ELoadoutOptimizationCategoryId.NONE
								).color
							}
							tooltipText={NoneOptimization.name}
						>
							{loadoutOptimizationIconMapping[NoneOptimization.id]}
						</IconPill>
						<Box
							sx={{
								fontSize: '14px',
								fontStyle: 'italic',
								// verticalAlign: 'text-top',
							}}
						>
							This loadout is fully optimized
							{hasIgnoredOptimizations ? ' (with ignored optimizations)' : ''}
						</Box>
					</Box>
				)}
				{/* This loadout has not been analyzed yet */}
				{!analysisResults[dlbGeneratedId]?.optimizationTypeList && (
					<>
						<Box
							sx={{
								height: '32px !important',
								width: '32px !important',
							}}
						>
							<CircularProgress
								sx={{
									height: '32px !important',
									width: '32px !important',
								}}
							/>
						</Box>
						<Box
							sx={{ marginLeft: '8px', fontSize: '14px', fontStyle: 'italic' }}
						>
							Checking for optimizations...
						</Box>
					</>
				)}
			</Box>
			<Collapse in={!!inspectingOptimization}>
				{inspectingOptimization &&
					(!inspectingOptimizationIsIgnored ||
						showIgnoredOptimizationTypes) && (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '8px',
								marginTop: '8px',
								background: '#585858',
								padding: '8px',
								borderRadius: '4px',
								maxWidth: '600px',
							}}
						>
							<Box sx={{ fontSize: '20px', fontWeight: 'bold' }}>
								{inspectingOptimization.name}
							</Box>
							<Box>{inspectingOptimization.description}</Box>
							<InspectingOptimizationDetails
								loadout={loadout}
								optimizationType={inspectingOptimizationType}
							/>
						</Box>
					)}
			</Collapse>
			{hasIgnoredOptimizations && (
				<Box
					sx={{
						marginTop: '16px',
					}}
				>
					<CustomTooltip
						title={`${
							showIgnoredOptimizationTypes ? 'Hide' : 'Show'
						} the ignored optimizations for this loadout`}
					>
						<Button
							variant="text"
							onClick={() => setShowIgnoredOptimizationTypes((x) => !x)}
							startIcon={
								showIgnoredOptimizationTypes ? <HideIcon /> : <ShowIcon />
							}
						>
							{showIgnoredOptimizationTypes ? 'Hide' : 'Show'} Ignored
							Optimization Types
						</Button>
					</CustomTooltip>
				</Box>
			)}
			<Breakdown loadout={loadout} />
		</Box>
	);
};
