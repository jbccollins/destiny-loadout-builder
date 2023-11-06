import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import d2Logo from '@dlb/public/d2-logo.png';
import dimLogo from '@dlb/public/dim-logo.png';
import {
	AnalyzableLoadoutsValueState,
	setHiddenLoadoutIdList,
} from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import {
	clearDesiredArmorStats,
	setDesiredArmorStats,
} from '@dlb/redux/features/desiredArmorStats/desiredArmorStatsSlice';
import { setPerformingBatchUpdate } from '@dlb/redux/features/performingBatchUpdate/performingBatchUpdateSlice';
import { clearReservedArmorSlotEnergy } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	clearArmorSlotMods,
	setSelectedArmorSlotMods,
} from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import {
	clearSelectedAspects,
	SelectedAspects,
	setSelectedAspects,
} from '@dlb/redux/features/selectedAspects/selectedAspectsSlice';
import {
	clearSelectedClassAbility,
	SelectedClassAbility,
	setSelectedClassAbility,
} from '@dlb/redux/features/selectedClassAbility/selectedClassAbilitySlice';
import { setSelectedDestinyClass } from '@dlb/redux/features/selectedDestinyClass/selectedDestinyClassSlice';
import {
	clearSelectedDestinySubclass,
	setSelectedDestinySubclass,
} from '@dlb/redux/features/selectedDestinySubclass/selectedDestinySubclassSlice';
import { setSelectedExoticArmor } from '@dlb/redux/features/selectedExoticArmor/selectedExoticArmorSlice';
import {
	clearSelectedFragments,
	setSelectedFragmentsForDestinySubclass,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import {
	clearSelectedGrenade,
	SelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import {
	clearSelectedIntrinsicArmorPerkOrAttributeIds,
	getDefaultIntrinsicArmorPerkOrAttributeIdList,
	setSelectedIntrinsicArmorPerkOrAttributeIds,
} from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
import {
	clearSelectedJump,
	SelectedJump,
	setSelectedJump,
} from '@dlb/redux/features/selectedJump/selectedJumpSlice';
import {
	clearSelectedMelee,
	SelectedMelee,
	setSelectedMelee,
} from '@dlb/redux/features/selectedMelee/selectedMeleeSlice';
import {
	clearSelectedRaidMods,
	setSelectedRaidMods,
} from '@dlb/redux/features/selectedRaidMods/selectedRaidModsSlice';
import {
	clearSelectedSuperAbility,
	SelectedSuperAbility,
	setSelectedSuperAbility,
} from '@dlb/redux/features/selectedSuperAbility/selectedSuperAbilitySlice';
import { setTabIndex } from '@dlb/redux/features/tabIndex/tabIndexSlice';
import { setUseBonusResilience } from '@dlb/redux/features/useBonusResilience/useBonusResilienceSlice';
import { useAppDispatch } from '@dlb/redux/hooks';
import {
	ELoadoutOptimizationTypeId,
	getLoadoutOptimization,
	NoneOptimization,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	AnalyzableLoadout,
	ELoadoutOptimizationCategoryId,
	ELoadoutType,
	getLoadoutOptimizationCategory,
	RichAnalyzableLoadout,
} from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { ArmorSlotIdList, getArmorSlot } from '@dlb/types/ArmorSlot';
import { ArmorStatIdList, getArmorStat } from '@dlb/types/ArmorStat';
import {
	EArmorSlotId,
	EDestinyClassId,
	EDestinySubclassId,
	EIntrinsicArmorPerkOrAttributeId,
} from '@dlb/types/IdEnums';
import { getMod } from '@dlb/types/Mod';
import { bungieNetPath } from '@dlb/utils/item-utils';
import EditIcon from '@mui/icons-material/Edit';
import ShowIcon from '@mui/icons-material/Visibility';
import HideIcon from '@mui/icons-material/VisibilityOff';
import {
	Box,
	CircularProgress,
	Collapse,
	IconButton,
	styled,
	useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import CustomTooltip from '../CustomTooltip';
import Breakdown from './Breakdown';
import IconPill from './IconPill';
import { loadoutOptimizationIconMapping } from './LoadoutAnalyzer';

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
						{optimizationType === ELoadoutOptimizationTypeId.UnusableMods ||
							(optimizationType === ELoadoutOptimizationTypeId.Doomed && (
								<Box>
									Remove the following mods from the loadout to resolve this
									optimization:
								</Box>
							))}
						{optimizationType ===
							ELoadoutOptimizationTypeId.ManuallyCorrectableDoomed && (
							<Box>
								Replace the following mods from the loadout with their
								respective full cost variants to resolve this optimization:
							</Box>
						)}
					</InspectingOptimizationDetailsHelp>
					{ArmorSlotIdList.map((armorSlotId, i) => {
						const armorSlot = getArmorSlot(armorSlotId);
						const artifactModList = loadout.armorSlotMods[armorSlotId]
							.filter((x) => x !== null)
							.map((modId) => getMod(modId))
							.filter((mod) => mod.isArtifactMod);
						return artifactModList.length > 0 ? (
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
								<Box sx={{ width: '26px', height: '26px', display: 'flex' }}>
									<BungieImage src={armorSlot.icon} width={26} height={26} />
								</Box>

								<Box
									sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
								>
									{artifactModList.map((mod, i) => (
										<Box
											key={i}
											sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
										>
											<Box sx={{ width: '26px', height: '26px' }}>
												<BungieImage src={mod.icon} width={26} height={26} />
											</Box>
											<Box>
												{mod.name} {'(Artifact)'}
											</Box>
										</Box>
									))}
								</Box>
							</Box>
						) : null;
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
};
export const LoadoutItem = (props: LoadoutItemProps) => {
	const {
		loadout,
		isHidden,
		selectedExoticArmor,
		flatAvailableExoticArmor,
		selectedDestinySubclass,
		selectedSuperAbility,
		selectedAspects,
		selectedGrenade,
		selectedMelee,
		selectedClassAbility,
		selectedJump,
		analyzeableLoadouts,
	} = props;
	const {
		loadoutType,
		id,
		icon,
		name,
		optimizationTypeList,
		iconColorImage,
		index,
		metadata,
	} = loadout;
	const { analysisResults, hiddenLoadoutIdList } = analyzeableLoadouts;
	const [inspectingOptimizationType, setInspectingOptimizationType] =
		useState<ELoadoutOptimizationTypeId | null>(null);
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const clearApplicationState = () => {
		dispatch(clearDesiredArmorStats());
		dispatch(clearArmorSlotMods());
		dispatch(clearSelectedRaidMods());
		dispatch(clearSelectedIntrinsicArmorPerkOrAttributeIds());
		dispatch(clearReservedArmorSlotEnergy());
		dispatch(clearSelectedDestinySubclass());
		dispatch(clearSelectedSuperAbility());
		dispatch(clearSelectedAspects());
		dispatch(clearSelectedFragments());
		dispatch(clearSelectedGrenade());
		dispatch(clearSelectedMelee());
		dispatch(clearSelectedClassAbility());
		dispatch(clearSelectedJump());
		dispatch(setTabIndex(0));
	};
	const setApplicationState = (loadout: AnalyzableLoadout) => {
		if (!loadout) {
			throw new Error('wtf');
		}
		dispatch(setPerformingBatchUpdate(true));
		clearApplicationState();
		const {
			exoticHash,
			destinyClassId,
			destinySubclassId,
			aspectIdList,
			fragmentIdList,
			superAbilityId,
			classAbilityId,
			jumpId,
			grenadeId,
			meleeId,
			desiredStatTiers,
			armorSlotMods,
			raidMods,
			armor,
		} = loadout;

		const newSelectedExoticArmor = { ...selectedExoticArmor };
		if (exoticHash) {
			newSelectedExoticArmor[destinyClassId] = flatAvailableExoticArmor.find(
				(x) => x.hash === exoticHash
			);
			dispatch(setSelectedExoticArmor(newSelectedExoticArmor));
		}
		dispatch(setSelectedDestinyClass(destinyClassId));
		dispatch(setDesiredArmorStats(desiredStatTiers));
		dispatch(setSelectedArmorSlotMods(armorSlotMods));
		dispatch(setSelectedRaidMods(raidMods));

		if (destinySubclassId) {
			dispatch(
				setSelectedDestinySubclass({
					...selectedDestinySubclass,
					[destinyClassId]: destinySubclassId,
				})
			);
			if (superAbilityId) {
				dispatch(
					setSelectedSuperAbility({
						...selectedSuperAbility,
						[destinySubclassId]: superAbilityId,
					})
				);
			}
			if (aspectIdList.length > 0) {
				dispatch(
					setSelectedAspects({
						...selectedAspects,
						[destinySubclassId]: [0, 1].map((i) => aspectIdList[i] || null),
					})
				);
			}
			if (fragmentIdList.length > 0) {
				dispatch(
					setSelectedFragmentsForDestinySubclass({
						destinySubclassId,
						fragments: fragmentIdList,
					})
				);
			}
			if (grenadeId) {
				dispatch(
					setSelectedGrenade({
						...selectedGrenade,
						[destinySubclassId]: grenadeId,
					})
				);
			}
			if (meleeId) {
				dispatch(
					setSelectedMelee({
						...selectedMelee,
						[destinySubclassId]: meleeId,
					})
				);
			}
			if (classAbilityId) {
				dispatch(
					setSelectedClassAbility({
						...selectedClassAbility,
						[destinySubclassId]: classAbilityId,
					})
				);
			}
			if (jumpId) {
				dispatch(
					setSelectedJump({
						...selectedJump,
						[destinySubclassId]: jumpId,
					})
				);
			}
		}

		if (loadout.hasBonusResilienceOrnament) {
			dispatch(setUseBonusResilience(true));
		}
		if (loadout.hasHalloweenMask) {
			const newSelectedIntrinsicArmorPerkOrAttributeIds =
				getDefaultIntrinsicArmorPerkOrAttributeIdList();
			newSelectedIntrinsicArmorPerkOrAttributeIds[0] =
				EIntrinsicArmorPerkOrAttributeId.HalloweenMask;
			dispatch(
				setSelectedIntrinsicArmorPerkOrAttributeIds(
					newSelectedIntrinsicArmorPerkOrAttributeIds
				)
			);
		}
		dispatch(setTabIndex(0));
		dispatch(setPerformingBatchUpdate(false));
	};

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

	const inGameLoadoutIconSize = 40;
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
								height="20px"
								width="20px"
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
								alt="Loadout Icon"
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
								alt="Loadout Icon"
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
					<IconButton onClick={() => setApplicationState(loadout)} size="small">
						<EditIcon />
					</IconButton>
				</CustomTooltip>
				{!isHidden && (
					<CustomTooltip
						title="Hide this loadout from the list of loadouts that can be optimized."
						hideOnMobile
					>
						<IconButton
							onClick={() => hideAnalyzableLoadout(id)}
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
							onClick={() => unHideAnalyzableLoadout(id)}
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
				{!!analysisResults[id]?.optimizationTypeList &&
					optimizationTypeList?.length > 0 && (
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
								{optimizationTypeList?.map((x, i) => {
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
				{!!analysisResults[id]?.optimizationTypeList &&
					optimizationTypeList?.length === 0 && (
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
							</Box>
						</Box>
					)}
				{/* This loadout has not been analyzed yet */}
				{!analysisResults[id]?.optimizationTypeList && (
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
				{inspectingOptimization && (
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

			<Breakdown loadout={loadout} />
		</Box>
	);
};
