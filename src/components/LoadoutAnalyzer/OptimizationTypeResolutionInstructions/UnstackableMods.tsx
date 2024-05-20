import { ArmorSlotIdList, getArmorSlot } from '@dlb/types/ArmorSlot';
import { getMod } from '@dlb/types/Mod';
import { Box } from '@mui/material';
import { ArmorSlotModList, InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function UnstackableMods(props: ResolutionInstructionProps) {
	const { metadata } = props.loadout;

	return (
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
	);
}
