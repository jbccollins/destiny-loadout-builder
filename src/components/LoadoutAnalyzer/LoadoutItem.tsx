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
	setSelectedFragments,
} from '@dlb/redux/features/selectedFragments/selectedFragmentsSlice';
import {
	clearSelectedGrenade,
	SelectedGrenade,
	setSelectedGrenade,
} from '@dlb/redux/features/selectedGrenade/selectedGrenadeSlice';
import { clearSelectedIntrinsicArmorPerkOrAttributeIds } from '@dlb/redux/features/selectedIntrinsicArmorPerkOrAttributeIds/selectedIntrinsicArmorPerkOrAttributeIdsSlice';
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
	GetLoadoutsThatCanBeOptimizedProgress,
	NoneOptimization,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	AnalyzableLoadout,
	ELoadoutOptimizationCategoryId,
	ELoadoutType,
	getLoadoutOptimizationCategory,
} from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { EDestinyClassId, EDestinySubclassId } from '@dlb/types/IdEnums';
import { bungieNetPath } from '@dlb/utils/item-utils';
import EditIcon from '@mui/icons-material/Edit';
import ShowIcon from '@mui/icons-material/Visibility';
import HideIcon from '@mui/icons-material/VisibilityOff';
import {
	Box,
	CircularProgress,
	Collapse,
	IconButton,
	useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import CustomTooltip from '../CustomTooltip';
import IconPill from './IconPill';
import { loadoutOptimizationIconMapping } from './LoadoutAnalyzer';

export type LoadoutItemProps = {
	loadout: AnalyzableLoadout & {
		metadata?: GetLoadoutsThatCanBeOptimizedProgress['metadata'];
	};
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
			const { elementId } = getDestinySubclass(destinySubclassId);
			if (fragmentIdList.length > 0) {
				dispatch(
					setSelectedFragments({ elementId, fragments: fragmentIdList })
				);
			}
			if (grenadeId) {
				dispatch(
					setSelectedGrenade({
						...selectedGrenade,
						[elementId]: grenadeId,
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
				padding: theme.spacing(1),
				marginBottom: theme.spacing(1),
				'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				{loadoutType === ELoadoutType.InGame && (
					<Box
						sx={{
							width: inGameLoadoutIconSize,
							height: inGameLoadoutIconSize,
							position: 'relative',
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
				<Box>{name}</Box>
			</Box>

			<Box
				sx={{
					marginTop: '8px',
					display: 'flex',
					gap: '4px',
					alignItems: 'center',
				}}
			>
				{/* This loadout has been analyzed and has optimizations */}
				{!!analysisResults[id]?.optimizationTypeList &&
					optimizationTypeList?.length > 0 && (
						<>
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
						</>
					)}
				{/* This loadout has been analyzed and has NO optimizations */}
				{!!analysisResults[id]?.optimizationTypeList &&
					optimizationTypeList?.length === 0 && (
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
						<Box sx={{ marginLeft: '8px' }}>Checking for optimizations...</Box>
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
						}}
					>
						<Box>{inspectingOptimization.name}</Box>
						<Box>{inspectingOptimization.description}</Box>
						{/* <Box>
							{inspectingOptimizationType ===
								ELoadoutOptimizationType.HigherStatTier && (
								<Box>
									{ArmorStatIdList.map((armorStatId) => {
										const armorStat = getArmorStat(armorStatId);
										const diff =
											metadata?.maxPossibleDesiredStatTiers[armorStatId] -
												loadout.desiredStatTiers[armorStatId] || 0;
										return diff > 0 ? (
											<Box key={armorStatId}>
												<Box>
													{armorStat.name}: {diff / 10}
												</Box>
											</Box>
										) : null;
									})}
								</Box>
							)}
						</Box> */}
					</Box>
				)}
			</Collapse>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
					marginTop: '4px',
				}}
			>
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
		</Box>
	);
};
