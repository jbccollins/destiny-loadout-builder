import { ArmorSlotIdList, getArmorSlot } from '@dlb/types/ArmorSlot';
import { getMod } from '@dlb/types/Mod';
import { getActiveSeasonArtifactModIdList } from '@dlb/types/ModCategory';
import { Box } from '@mui/material';
import { ArmorSlotModList, InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function SeasonalMods(props: ResolutionInstructionProps) {
	const activeSeasonArtifactModIdList = getActiveSeasonArtifactModIdList();

	const { loadout } = props;
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				Remove the following mods from the loadout to resolve this optimization:
			</InspectingOptimizationDetailsHelp>
			{ArmorSlotIdList.map((armorSlotId) => {
				const armorSlot = getArmorSlot(armorSlotId);
				const artifactModList = loadout.armorSlotMods[armorSlotId]
					.filter((x) => x !== null)
					.map((modId) => getMod(modId))
					.filter((mod) => activeSeasonArtifactModIdList.includes(mod.id));

				return (
					<ArmorSlotModList
						key={armorSlotId}
						modList={artifactModList}
						armorSlot={armorSlot}
					/>
				);
			})}
		</Box>
	);
}
