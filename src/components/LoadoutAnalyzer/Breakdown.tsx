import ModPlacement from '@dlb/components/ModPlacement';
import { selectAvailableExoticArmor } from '@dlb/redux/features/availableExoticArmor/availableExoticArmorSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { ELoadoutOptimizationTypeId } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import { ProcessedArmorItemMetadataClassItem } from '@dlb/services/processArmor';
import { RichAnalyzableLoadout } from '@dlb/types/AnalyzableLoadout';
import { AvailableExoticArmorItem } from '@dlb/types/Armor';
import { ArmorSlotIdList } from '@dlb/types/ArmorSlot';
import { EArmorSlotId, EGearTierId } from '@dlb/types/IdEnums';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Collapse, IconButton } from '@mui/material';
import { useState } from 'react';
import ModDetails from './ModDetails';
import SubclassSummary from './SubclassSummary';
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

	if (props.loadout.name === 'GP Void Contraverse (WIP LS)') {
		console.log('props.loadout', props.loadout);
	}

	let exoticArmorItem: AvailableExoticArmorItem = null;
	if (exoticArmor) {
		exoticArmorItem = availableExoticArmor[props.loadout.destinyClassId][
			exoticArmor.armorSlot
		].find(
			(x: AvailableExoticArmorItem) => x.hash === props.loadout.exoticHash
		);
	} else if (props.loadout.exoticHash) {
		for (const armorSlotId of ArmorSlotIdList) {
			exoticArmorItem = availableExoticArmor[props.loadout.destinyClassId][
				armorSlotId
			].find(
				(x: AvailableExoticArmorItem) => x.hash === props.loadout.exoticHash
			);
			if (exoticArmorItem) {
				break;
			}
		}
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
		!!modPlacement && // No mod placment means we can't render raid mods in their correct slots
		!!classItem && // No class item means we can't render raid mods in their correct slots
		// !!exoticArmorItem && //
		// Invalid loadouts and errors are not guaranteed to have valid stat/raid mod placements
		!props.loadout.optimizationTypeList.some((x) =>
			[
				ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration,
				ELoadoutOptimizationTypeId.MissingArmor,
				ELoadoutOptimizationTypeId.NoExoticArmor,
				ELoadoutOptimizationTypeId.Error,
			].includes(x)
		);

	const useModDetailsView = !useModPlacementView && !!modPlacement;
	const cannotRenderModView = !useModDetailsView && !useModPlacementView;

	return (
		<Box>
			<Box sx={{ marginTop: '8px' }} className="mod-placement-wrapper">
				{useModPlacementView && (
					<Box>
						<Box
							sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}
						>
							Mods
						</Box>
						<Box
							className="mod-placement-wrapper"
							sx={{ overflowX: 'auto', width: '100%' }}
						>
							<ModPlacement
								exoticArmorItem={exoticArmorItem}
								modPlacement={modPlacement}
								artificeModIdList={props.loadout.artificeModIdList}
								armorItems={props.loadout.armor}
								classItem={classItem}
								armorSlotMods={props.loadout.armorSlotMods}
								withArmorItemIcons
								showHelpText={false}
							/>
						</Box>
					</Box>
				)}
				{useModDetailsView && (
					<ModDetails
						armorStatModIdList={props.loadout.armorStatMods}
						exoticArmorItem={exoticArmorItem}
						modPlacement={modPlacement}
						artificeModIdList={props.loadout.artificeModIdList}
						armorItems={props.loadout.armor}
						armorSlotMods={props.loadout.armorSlotMods}
						raidModIdList={props.loadout.raidMods}
					/>
				)}
				{cannotRenderModView && <Box>Unable to render mods</Box>}
			</Box>
			<Box sx={{ marginTop: '8px' }}>
				<SubclassSummary loadout={props.loadout} />
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
