import { selectAnalyzableLoadouts } from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { ArmorSlotIdList, getArmorSlot } from '@dlb/types/ArmorSlot';
import { getMod } from '@dlb/types/Mod';
import { getActiveSeasonArtifactModIdList } from '@dlb/types/ModCategory';
import { Box } from '@mui/material';
import { ArmorSlotModList, InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function UnusableMods(props: ResolutionInstructionProps) {
	const { loadout } = props;

	const { buggedAlternateSeasonModIdList } = useAppSelector(
		selectAnalyzableLoadouts
	);

	const activeSeasonArtifactModIdList = getActiveSeasonArtifactModIdList();

	console.log(
		'++++++ activeSeasonArtifactModIdList',
		activeSeasonArtifactModIdList
	);

	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				Remove the following mods from the loadout to resolve this optimization:
			</InspectingOptimizationDetailsHelp>
			{ArmorSlotIdList.map((armorSlotId) => {
				const armorSlot = getArmorSlot(armorSlotId);
				// TODO: Is this actually the right logic? Won't this render the
				// current season artifact mods as well? Which is wrong for "Unusable Mods"
				const artifactModList = loadout.armorSlotMods[armorSlotId]
					.filter((x) => x !== null)
					.map((modId) => getMod(modId))
					.filter(
						(mod) =>
							mod.isArtifactMod &&
							!activeSeasonArtifactModIdList.includes(mod.id) &&
							!buggedAlternateSeasonModIdList.includes(mod.id)
					);
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
