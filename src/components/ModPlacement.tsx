import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { EModId } from '@dlb/generated/mod/EModId';
import { selectSelectedArmorSlotMods } from '@dlb/redux/features/selectedArmorSlotMods/selectedArmorSlotModsSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { ProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import { ArmorStatAndRaidModComboPlacement } from '@dlb/services/processArmor/getModCombos';
import { ArmorItem } from '@dlb/types/Armor';
import {
	ArmorSlotWithClassItemIdList,
	getArmorSlot,
} from '@dlb/types/ArmorSlot';
import { ARTIFICE_ICON, MISSING_ICON } from '@dlb/types/globals';
import {
	EArmorSlotId,
	EGearTierId,
	EIntrinsicArmorPerkOrAttributeId,
} from '@dlb/types/IdEnums';
import {
	getIntrinsicArmorPerkOrAttribute,
	intrinsicArmorPerkOrAttributeIdList,
} from '@dlb/types/IntrinsicArmorPerkOrAttribute';
import { getMod } from '@dlb/types/Mod';
import { getRaidAndNightmareModType } from '@dlb/types/RaidAndNightmareModType';
import { styled } from '@mui/material';
import { Box } from '@mui/system';

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

type ModPlacementProps = {
	modPlacement: ArmorStatAndRaidModComboPlacement;
	artificeModIdList: EModId[];
	armorItems: ArmorItem[];
	classItem: ProcessedArmorItemMetadataClassItem;
};

const ModPlacement = (props: ModPlacementProps) => {
	const armorSlotMods = useAppSelector(selectSelectedArmorSlotMods);
	const { modPlacement, artificeModIdList, armorItems, classItem } = props;
	const showArtificeModSlot = artificeModIdList.length > 0;
	const showRaidModSlot = Object.values(modPlacement).some(
		(x) => x.raidModId !== null
	);
	let numRenderedArtificeMods = 0;
	return (
		<Container>
			{ArmorSlotWithClassItemIdList.map((armorSlotId) => {
				const { armorStatModId, raidModId } = modPlacement[armorSlotId];
				const raidIcon = raidModId
					? getRaidAndNightmareModType(
							getMod(raidModId).raidAndNightmareModTypeId
					  ).icon
					: null;

				const intrinsicArmorPerkOrAttributeId =
					armorSlotId === EArmorSlotId.ClassItem
						? intrinsicArmorPerkOrAttributeIdList.includes(
								classItem.requiredClassItemMetadataKey as any
						  )
							? classItem.requiredClassItemMetadataKey
							: null
						: armorItems.find((x) => x.armorSlot === armorSlotId)
								.intrinsicArmorPerkOrAttributeId;

				const intrinsicArmorPerkOrAttributeIcon =
					intrinsicArmorPerkOrAttributeId
						? getIntrinsicArmorPerkOrAttribute(
								intrinsicArmorPerkOrAttributeId as EIntrinsicArmorPerkOrAttributeId
						  ).icon
						: null;

				const isExotic =
					armorSlotId === EArmorSlotId.ClassItem
						? false
						: armorItems.find((x) => x.armorSlot === armorSlotId).gearTierId ===
						  EGearTierId.Exotic;

				const isArtificeArmorSlot =
					armorSlotId === EArmorSlotId.ClassItem
						? classItem.requiredClassItemMetadataKey === 'Artifice'
						: armorItems.find((x) => x.armorSlot === armorSlotId).isArtifice;
				const artificeModId = isArtificeArmorSlot
					? artificeModIdList.slice(numRenderedArtificeMods)[0] ?? null
					: null;
				if (isArtificeArmorSlot) {
					numRenderedArtificeMods++;
				}
				const armorSlotModIdList = armorSlotMods[armorSlotId];
				return (
					<ArmorSlotRow className="armor-slot-row" key={armorSlotId}>
						<Box
							sx={{
								// This filter comes from this site: https://codepen.io/sosuke/pen/Pjoqqp
								// Converts the image to gold (#ffd700)
								filter: isExotic
									? 'brightness(0) saturate(100%) invert(79%) sepia(19%) saturate(2242%) hue-rotate(360deg) brightness(106%) contrast(104%)'
									: 'none',
							}}
						>
							<Socket getIcon={() => getArmorSlot(armorSlotId).icon} />
						</Box>
						<Box className="armor-stat-mod-socket">
							<Socket
								getIcon={() =>
									armorStatModId ? getMod(armorStatModId).icon : null
								}
							/>
						</Box>
						{showArtificeModSlot && (
							<Box className="artifice-mod-socket">
								<Socket
									getIcon={() =>
										artificeModId ? getMod(artificeModId).icon : null
									}
								/>
							</Box>
						)}
						{armorSlotModIdList.map((armorSlotModId, i) => {
							return (
								<Box className={`armor-slot-mod-socket$-${i}`} key={i}>
									<Socket
										getIcon={() =>
											armorSlotModId ? getMod(armorSlotModId).icon : null
										}
									/>
								</Box>
							);
						})}
						{showRaidModSlot && (
							<Box className="raid-mod-socket">
								<Socket
									getIcon={() => (raidModId ? getMod(raidModId).icon : null)}
								/>
							</Box>
						)}
						{isArtificeArmorSlot && (
							<Box className="artifice-badge">
								<Socket getIcon={() => ARTIFICE_ICON} />
							</Box>
						)}
						{raidIcon && (
							<Box className="raid-badge">
								<Socket getIcon={() => raidIcon} />
							</Box>
						)}
						{intrinsicArmorPerkOrAttributeIcon && (
							<Box className="intrinsic-armor-perk-or-attribute-badge">
								<Socket getIcon={() => intrinsicArmorPerkOrAttributeIcon} />
							</Box>
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
