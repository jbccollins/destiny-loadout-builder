import { EModId } from '@dlb/generated/mod/EModId';
import { ProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import { ArmorStatAndRaidModComboPlacement } from '@dlb/services/processArmor/getModCombos';
import { ArmorItem, AvailableExoticArmorItem } from '@dlb/types/Armor';
import {
	ArmorSlotWithClassItemIdList,
	getArmorSlot,
} from '@dlb/types/ArmorSlot';
import { ARTIFICE_ICON, EMPTY_SOCKET_TEXT } from '@dlb/types/globals';
import {
	EArmorSlotId,
	EIntrinsicArmorPerkOrAttributeId,
} from '@dlb/types/IdEnums';
import {
	getIntrinsicArmorPerkOrAttribute,
	intrinsicArmorPerkOrAttributeIdList,
} from '@dlb/types/IntrinsicArmorPerkOrAttribute';
import { ArmorSlotIdToModIdListMapping, getMod } from '@dlb/types/Mod';
import { getRaidAndNightmareModType } from '@dlb/types/RaidAndNightmareModType';
import { styled } from '@mui/material';
import { Box } from '@mui/system';
import CustomTooltip from './CustomTooltip';
import MasterworkedBungieImage from './MasterworkedBungieImage';
import { Socket } from './Socket';

// const Container = styled(Box)(({ theme }) => ({
// 	display: 'flex',
// 	flexDirection: 'column',
// 	flexWrap: 'wrap',
// 	position: 'relative',
// 	height: '320px',
// 	paddingLeft: '2px',
// 	paddingTop: '2px',
// }));

const Container = styled(Box, {
	shouldForwardProp: (prop) => !['showHelpText'].includes(prop as string),
})<{
	showHelpText?: boolean;
}>(({ showHelpText }) => ({
	display: 'flex',
	flexDirection: 'column',
	flexWrap: 'wrap',
	position: 'relative',
	height: showHelpText ? '320px' : '242px',
	paddingLeft: '2px',
	paddingTop: '2px',
}));

const ArmorSlotRow = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(1),
	display: 'flex',
	gap: theme.spacing(1),
}));

const BASE_OFFSET = -40;

const Description = styled(Box)(({ theme }) => ({
	transform: `rotate(-35deg)`,
	transformOrigin: 'top right',
	minWidth: '105px',
	marginLeft: BASE_OFFSET,
	textAlign: 'right',
	position: 'absolute',
	top: '240px',
}));

type FinalizedModPlacement = Record<
	EArmorSlotId,
	{
		armorStatModId: EModId;
		armorSlotModIdList: EModId[];
		raidModId: EModId;
		artificeModId: EModId;
	}
>;
type GetFinalizedModPlacementParams = {
	modPlacement: ArmorStatAndRaidModComboPlacement;
	artificeModIdList: EModId[];
	armorItems: ArmorItem[] | null;
	classItem: ProcessedArmorItemMetadataClassItem | null;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
};
const getDefaultFinalizedModPlacement = (): FinalizedModPlacement => {
	return ArmorSlotWithClassItemIdList.reduce((acc, armorSlotId) => {
		acc[armorSlotId] = {
			armorStatModId: null,
			armorSlotModIdList: [],
			raidModId: null,
			artificeModId: null,
		};
		return acc;
	}, {} as FinalizedModPlacement);
};
const getFinalizedModPlacement = (
	params: GetFinalizedModPlacementParams
): FinalizedModPlacement => {
	const {
		modPlacement,
		artificeModIdList,
		armorItems,
		classItem,
		armorSlotMods,
	} = params;
	const finalizedModPlacement = getDefaultFinalizedModPlacement();
	let numSlottedArtificeMods = 0;
	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		const armorSlotModIdList = armorSlotMods[armorSlotId];
		const { armorStatModId, raidModId } = modPlacement[armorSlotId];
		const isArtificeArmorSlot =
			armorSlotId === EArmorSlotId.ClassItem
				? classItem
					? classItem.requiredClassItemMetadataKey === 'Artifice'
					: false
				: armorItems
				? armorItems.find((x) => x.armorSlot === armorSlotId)?.isArtifice
				: false;
		const artificeModId = isArtificeArmorSlot
			? artificeModIdList.slice(numSlottedArtificeMods)[0] ?? null
			: null;
		if (isArtificeArmorSlot) {
			numSlottedArtificeMods++;
		}
		finalizedModPlacement[armorSlotId] = {
			armorStatModId,
			armorSlotModIdList,
			raidModId,
			artificeModId,
		};
	});
	return finalizedModPlacement;
};

type ModPlacementProps = {
	modPlacement: ArmorStatAndRaidModComboPlacement;
	artificeModIdList: EModId[];
	armorItems: ArmorItem[] | null;
	classItem: ProcessedArmorItemMetadataClassItem;
	exoticArmorItem: AvailableExoticArmorItem | null;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	onlyShowArmorSlotMods?: boolean;
	withArmorItemIcons?: boolean;
};

const ModPlacement = (props: ModPlacementProps) => {
	const { classItem, armorItems, onlyShowArmorSlotMods, withArmorItemIcons } =
		props;
	const finalizedModPlacement = getFinalizedModPlacement({
		modPlacement: props.modPlacement,
		artificeModIdList: props.artificeModIdList,
		armorItems: props.armorItems,
		classItem: props.classItem,
		armorSlotMods: props.armorSlotMods,
	});
	const showPerkIcons = !onlyShowArmorSlotMods;
	const showArmorStatModSlot = !onlyShowArmorSlotMods;
	const showHelpText = !onlyShowArmorSlotMods;
	const showArtificeModSlot =
		!onlyShowArmorSlotMods &&
		ArmorSlotWithClassItemIdList.some(
			(armorSlotId) => !!finalizedModPlacement[armorSlotId].artificeModId
		);
	const showRaidModSlot =
		!onlyShowArmorSlotMods &&
		ArmorSlotWithClassItemIdList.some(
			(armorSlotId) => !!finalizedModPlacement[armorSlotId].raidModId
		);
	const exoticPerk = props.exoticArmorItem?.exoticPerk;
	return (
		<Container showHelpText={showHelpText}>
			{ArmorSlotWithClassItemIdList.map((armorSlotId) => {
				const { armorStatModId, armorSlotModIdList, raidModId, artificeModId } =
					finalizedModPlacement[armorSlotId];

				const { name: raidName, icon: raidIcon } = raidModId
					? getRaidAndNightmareModType(
							getMod(raidModId).raidAndNightmareModTypeId
					  )
					: { name: null, icon: null };

				const currentArmorItem = (armorItems || []).find(
					(x) => x.armorSlot === armorSlotId
				);

				const intrinsicArmorPerkOrAttributeId =
					armorSlotId === EArmorSlotId.ClassItem
						? classItem
							? intrinsicArmorPerkOrAttributeIdList.includes(
									classItem.requiredClassItemMetadataKey as any
							  )
								? classItem.requiredClassItemMetadataKey
								: null
							: null
						: currentArmorItem
						? currentArmorItem.intrinsicArmorPerkOrAttributeId
						: null;

				const isExotic = props.exoticArmorItem?.armorSlot === armorSlotId;
				const { name: armorSlotName, icon: armorSlotIcon } =
					getArmorSlot(armorSlotId);
				const { name: armorStatModName, icon: armorStatModIcon } =
					armorStatModId ? getMod(armorStatModId) : { name: null, icon: null };
				const { name: artificeModName, icon: artificeModIcon } = artificeModId
					? getMod(artificeModId)
					: { name: null, icon: null };
				const { name: raidModName, icon: raidModIcon } = raidModId
					? getMod(raidModId)
					: { name: null, icon: null };
				const {
					name: intrinsicArmorPerkOrAttributeName,
					icon: intrinsicArmorPerkOrAttributeIcon,
				} = intrinsicArmorPerkOrAttributeId
					? getIntrinsicArmorPerkOrAttribute(
							intrinsicArmorPerkOrAttributeId as EIntrinsicArmorPerkOrAttributeId
					  )
					: { name: null, icon: null };

				// Fallback icon
				const { icon: exoticIcon } = isExotic
					? props.exoticArmorItem
					: { icon: null };

				const _currentArmorItem =
					isExotic && !currentArmorItem
						? {
								...props.exoticArmorItem,
								isMasterworked: false,
						  }
						: currentArmorItem;

				const useCurrentItemArmorIcon =
					withArmorItemIcons && !!_currentArmorItem;
				return (
					<ArmorSlotRow className="armor-slot-row" key={armorSlotId}>
						<CustomTooltip
							title={
								useCurrentItemArmorIcon
									? _currentArmorItem.name
									: `${isExotic ? 'Exotic ' : ''}${armorSlotName}`
							}
						>
							<Box
								sx={{
									// This filter comes from this site: https://codepen.io/sosuke/pen/Pjoqqp
									// Converts the image to gold (#ffd700)
									filter:
										isExotic && !useCurrentItemArmorIcon
											? 'brightness(0) saturate(100%) invert(79%) sepia(19%) saturate(2242%) hue-rotate(360deg) brightness(106%) contrast(104%)'
											: 'none',
								}}
							>
								{useCurrentItemArmorIcon && (
									<Box sx={{ marginLeft: '-2px', marginTop: '-2px' }}>
										<MasterworkedBungieImage
											src={_currentArmorItem.icon}
											width={'40px'}
											height={'40px'}
											isMasterworked={_currentArmorItem.isMasterworked}
										/>
									</Box>
								)}
								{!useCurrentItemArmorIcon && (
									<Socket getIcon={() => armorSlotIcon} />
								)}
							</Box>
						</CustomTooltip>
						{showArmorStatModSlot && (
							<CustomTooltip title={armorStatModName || EMPTY_SOCKET_TEXT}>
								<Box className="armor-stat-mod-socket">
									<Socket getIcon={() => armorStatModIcon} />
								</Box>
							</CustomTooltip>
						)}
						{showArtificeModSlot && (
							<CustomTooltip title={artificeModName || EMPTY_SOCKET_TEXT}>
								<Box className="artifice-mod-socket">
									<Socket getIcon={() => artificeModIcon} />
								</Box>
							</CustomTooltip>
						)}
						{armorSlotModIdList.map((armorSlotModId, i) => {
							const { name, icon, isArtifactMod } = armorSlotModId
								? getMod(armorSlotModId)
								: { name: null, icon: null, isArtifactMod: false };
							return (
								<CustomTooltip
									title={
										name
											? `${name}${isArtifactMod ? ' (Artifact)' : ''}`
											: EMPTY_SOCKET_TEXT
									}
									key={i}
								>
									<Box className={`armor-slot-mod-socket$-${i}`}>
										<Socket getIcon={() => icon} />
									</Box>
								</CustomTooltip>
							);
						})}
						{showRaidModSlot && (
							<CustomTooltip title={raidModName}>
								<Box className="raid-mod-socket">
									<Socket getIcon={() => raidModIcon} />
								</Box>
							</CustomTooltip>
						)}
						{artificeModId && showPerkIcons && (
							<CustomTooltip title={'Artifice Armor'}>
								<Box className="artifice-badge">
									<Socket getIcon={() => ARTIFICE_ICON} />
								</Box>
							</CustomTooltip>
						)}
						{raidIcon && showPerkIcons && (
							<CustomTooltip title={`${raidName} Armor`}>
								<Box className="raid-badge">
									<Socket getIcon={() => raidIcon} />
								</Box>
							</CustomTooltip>
						)}
						{intrinsicArmorPerkOrAttributeIcon && showPerkIcons && (
							<CustomTooltip title={`${intrinsicArmorPerkOrAttributeName}`}>
								<Box className="intrinsic-armor-perk-or-attribute-badge">
									<Socket getIcon={() => intrinsicArmorPerkOrAttributeIcon} />
								</Box>
							</CustomTooltip>
						)}

						{isExotic && exoticPerk && (
							<CustomTooltip title={`${exoticPerk.name}`}>
								<Box className="exotic-badge">
									<Socket getIcon={() => exoticPerk.icon} />
								</Box>
							</CustomTooltip>
						)}
					</ArmorSlotRow>
				);
			})}
			{showHelpText && (
				<>
					{' '}
					<Box
						sx={{
							position: 'absolute',
							width: '136px',
							height: '4px',
							border: '1px solid white',
							borderTop: 'none',
							marginLeft: showArtificeModSlot ? '144px' : '96px',
							top: `236px`,
						}}
					></Box>
					<Box
						sx={{
							background: 'white',
							width: '2px',
							height: '4px',
							position: 'absolute',
							top: '240px', // `calc(100% + 1px)`,
							marginLeft: showArtificeModSlot ? '213px' : '165px',
						}}
					></Box>
				</>
			)}

			{showHelpText && <Description>Stat Mods</Description>}

			{showArtificeModSlot && (
				<Description sx={{ marginLeft: `${BASE_OFFSET + 48}px` }}>
					Artifice Mods
				</Description>
			)}
			{showHelpText && (
				<Description
					sx={{
						marginLeft: `${BASE_OFFSET + (showArtificeModSlot ? 144 : 96)}px`,
					}}
				>
					Armor Mods
				</Description>
			)}
			{showRaidModSlot && (
				<Description
					sx={{
						marginLeft: `${BASE_OFFSET + (showArtificeModSlot ? 240 : 192)}px`,
					}}
				>
					Raid Mods
				</Description>
			)}
		</Container>
	);
};

export default ModPlacement;
