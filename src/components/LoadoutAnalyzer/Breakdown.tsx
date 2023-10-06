import ModPlacement from '@dlb/components/ModPlacement';
import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { ProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import { RichAnalyzableLoadout } from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { EArmorSlotId, EGearTierId } from '@dlb/types/IdEnums';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, IconButton } from '@mui/material';
import { useState } from 'react';
type BreakdownProps = {
	loadout: RichAnalyzableLoadout;
};

const BreakdownContent = (props: BreakdownProps) => {
	const { metadata } = props.loadout;
	const { modPlacement } = metadata ? metadata : { modPlacement: null };
	const availableExoticArmor = useAppSelector(selectAvailableExoticArmor);
	const exoticArmor = props.loadout.armor.find(
		(x) => x.gearTierId === EGearTierId.Exotic
	);

	let exoticArmorItem = null;
	if (exoticArmor) {
		exoticArmorItem = availableExoticArmor[props.loadout.destinyClassId][
			exoticArmor.armorSlot
		].find(
			(x: AvailableExoticArmorItem) => x.hash === props.loadout.exoticHash
		);
	}

	const _classItem = props.loadout.armor.find(
		(x) => x.armorSlot === EArmorSlotId.ClassItem
	);
	let classItem: ProcessedArmorItemMetadataClassItem = null;
	if (_classItem) {
		let requiredClassItemMetadataKey = null;
		if (_classItem.isArtifice) {
			requiredClassItemMetadataKey = 'Artifice';
		} else if (_classItem.intrinsicArmorPerkOrAttributeId) {
			requiredClassItemMetadataKey = _classItem.intrinsicArmorPerkOrAttributeId;
		} else if (_classItem.socketableRaidAndNightmareModTypeId) {
			requiredClassItemMetadataKey =
				_classItem.socketableRaidAndNightmareModTypeId;
		} else {
			requiredClassItemMetadataKey = 'Legendary';
		}
		classItem = {
			requiredClassItemMetadataKey,
			hasMasterworkedVariant: _classItem.isMasterworked,
		};
	}

	// TODO: only show this when the loadout has finished processing
	const useModPlacementView =
		!!modPlacement && !!classItem && !!exoticArmorItem;
	return (
		<Box>
			<Box>
				{useModPlacementView && (
					<ModPlacement
						exoticArmorItem={exoticArmorItem}
						modPlacement={modPlacement}
						artificeModIdList={props.loadout.artificeModIdList}
						armorItems={props.loadout.armor}
						classItem={classItem}
						armorSlotMods={props.loadout.armorSlotMods}
					/>
				)}
				{!useModPlacementView && (
					<Box>
						Mod Placement View Not Available. Alternative view coming soon
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default function Breakdown(props: BreakdownProps) {
	const [open, setOpen] = useState(false);
	return (
		<Box>
			<Box
				onClick={() => setOpen(!open)}
				sx={{
					cursor: 'pointer',
					marginTop: '16px',
					display: 'inline-block',
				}}
			>
				Show Loadout Details
				<IconButton aria-label="expand row" size="small">
					{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</Box>
			<Box>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<BreakdownContent {...props} />
				</Collapse>
			</Box>
		</Box>
	);
}
