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
	ELoadoutOptimizationCategoryId,
	ELoadoutOptimizationTypeId,
	ELoadoutType,
	NoneOptimization,
	RichAnalyzableLoadout,
	getLoadoutOptimization,
	getLoadoutOptimizationCategory,
} from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { EDestinyClassId, EDestinySubclassId } from '@dlb/types/IdEnums';
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
	useTheme,
} from '@mui/material';
import d2Logo from '@public/d2-logo.png';
import dimLogo from '@public/dim-logo.png';
import Image from 'next/image';
import { useState } from 'react';
import Breakdown from './Breakdown';
import IconPill from './IconPill';
import { loadoutOptimizationIconMapping } from './LoadoutAnalyzer';
import OptimizationTypeResolutionInstructionsMapping from './OptimizationTypeResolutionInstructions';
import { InspectingOptimizationDetailsProps } from './OptimizationTypeResolutionInstructions/types';

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

	const ResolutionInstructions =
		OptimizationTypeResolutionInstructionsMapping[optimizationType];

	return (
		<Box>
			<Box sx={{ fontSize: '18px', fontWeight: 'bold' }}>
				Resolution Instructions:
			</Box>
			<ResolutionInstructions loadout={loadout} />
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

	const loadoutIsAnalyzed =
		!!analysisResults[dlbGeneratedId]?.optimizationTypeList;

	const loadoutHasOptimizations = filteredOptimizationTypeList?.length > 0;

	const loadoutIsFullyOptimized = loadoutIsAnalyzed && !loadoutHasOptimizations;

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
				{!loadoutIsFullyOptimized && loadoutIsAnalyzed && (
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
				{!loadoutIsAnalyzed && (
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
