import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { EModId } from '@dlb/generated/mod/EModId';
import { ProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import { ArmorStatAndRaidModComboPlacement } from '@dlb/services/processArmor/getModCombos';
import { ArmorItem, AvailableExoticArmorItem } from '@dlb/types/Armor';
import {
	ArmorSlotWithClassItemIdList,
	getArmorSlot,
} from '@dlb/types/ArmorSlot';
import { ARTIFICE_ICON, MISSING_ICON } from '@dlb/types/globals';
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

const Container = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	flexWrap: 'wrap',
	position: 'relative',
	height: '320px',
}));

const ArmorSlotRow = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(1),
	display: 'flex',
	gap: theme.spacing(1),
}));

type SocketProps = {
	getIcon: () => string;
};

const Socket = (props: SocketProps) => {
	const { getIcon } = props;
	const icon = getIcon() || MISSING_ICON;
	return (
		<Box
			sx={{
				width: '40px',
				height: '40px',
				opacity: icon === MISSING_ICON ? 0.6 : 1,
			}}
		>
			<BungieImage src={icon} width={'40px'} height={'40px'} />
		</Box>
	);
};

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
	armorItems: ArmorItem[];
	classItem: ProcessedArmorItemMetadataClassItem;
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
				? classItem.requiredClassItemMetadataKey === 'Artifice'
				: armorItems.find((x) => x.armorSlot === armorSlotId).isArtifice;
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
	armorItems: ArmorItem[];
	classItem: ProcessedArmorItemMetadataClassItem;
	exoticArmorItem: AvailableExoticArmorItem;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
};

const ModPlacement = (props: ModPlacementProps) => {
	const { classItem, armorItems } = props;
	const finalizedModPlacement = getFinalizedModPlacement({
		modPlacement: props.modPlacement,
		artificeModIdList: props.artificeModIdList,
		armorItems: props.armorItems,
		classItem: props.classItem,
		armorSlotMods: props.armorSlotMods,
	});
	const showArtificeModSlot = ArmorSlotWithClassItemIdList.some(
		(armorSlotId) => !!finalizedModPlacement[armorSlotId].artificeModId
	);
	const showRaidModSlot = ArmorSlotWithClassItemIdList.some(
		(armorSlotId) => !!finalizedModPlacement[armorSlotId].raidModId
	);
	const exoticPerk = props.exoticArmorItem.exoticPerk;
	return (
		<Container>
			{ArmorSlotWithClassItemIdList.map((armorSlotId) => {
				const { armorStatModId, armorSlotModIdList, raidModId, artificeModId } =
					finalizedModPlacement[armorSlotId];

				const { name: raidName, icon: raidIcon } = raidModId
					? getRaidAndNightmareModType(
							getMod(raidModId).raidAndNightmareModTypeId
					  )
					: { name: null, icon: null };

				const intrinsicArmorPerkOrAttributeId =
					armorSlotId === EArmorSlotId.ClassItem
						? intrinsicArmorPerkOrAttributeIdList.includes(
								classItem.requiredClassItemMetadataKey as any
						  )
							? classItem.requiredClassItemMetadataKey
							: null
						: armorItems.find((x) => x.armorSlot === armorSlotId)
								.intrinsicArmorPerkOrAttributeId;

				const isExotic = props.exoticArmorItem.armorSlot === armorSlotId;
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
				return (
					<ArmorSlotRow className="armor-slot-row" key={armorSlotId}>
						<CustomTooltip
							title={`${isExotic ? 'Exotic ' : ''}${armorSlotName}`}
						>
							<Box
								sx={{
									// This filter comes from this site: https://codepen.io/sosuke/pen/Pjoqqp
									// Converts the image to gold (#ffd700)
									filter: isExotic
										? 'brightness(0) saturate(100%) invert(79%) sepia(19%) saturate(2242%) hue-rotate(360deg) brightness(106%) contrast(104%)'
										: 'none',
								}}
							>
								<Socket getIcon={() => armorSlotIcon} />
							</Box>
						</CustomTooltip>
						<CustomTooltip title={armorStatModName}>
							<Box className="armor-stat-mod-socket">
								<Socket getIcon={() => armorStatModIcon} />
							</Box>
						</CustomTooltip>
						{showArtificeModSlot && (
							<CustomTooltip title={artificeModName}>
								<Box className="artifice-mod-socket">
									<Socket getIcon={() => artificeModIcon} />
								</Box>
							</CustomTooltip>
						)}
						{armorSlotModIdList.map((armorSlotModId, i) => {
							const { name, icon } = armorSlotModId
								? getMod(armorSlotModId)
								: { name: null, icon: null };
							return (
								<CustomTooltip title={name} key={i}>
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
						{artificeModId && (
							<CustomTooltip title={'Artifice Armor'}>
								<Box className="artifice-badge">
									<Socket getIcon={() => ARTIFICE_ICON} />
								</Box>
							</CustomTooltip>
						)}
						{raidIcon && (
							<CustomTooltip title={`${raidName} Armor`}>
								<Box className="raid-badge">
									<Socket getIcon={() => raidIcon} />
								</Box>
							</CustomTooltip>
						)}
						{intrinsicArmorPerkOrAttributeIcon && (
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
			<Description>Stat Mods</Description>
			{showArtificeModSlot && (
				<Description sx={{ marginLeft: `${BASE_OFFSET + 48}px` }}>
					Artifice Mods
				</Description>
			)}
			<Description
				sx={{
					marginLeft: `${BASE_OFFSET + (showArtificeModSlot ? 144 : 96)}px`,
				}}
			>
				Armor Mods
			</Description>
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
