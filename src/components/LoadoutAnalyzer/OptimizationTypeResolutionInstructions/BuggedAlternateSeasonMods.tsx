import { selectAnalyzableLoadouts } from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import { ArmorSlotIdList, getArmorSlot } from '@dlb/types/ArmorSlot';
import { getMod } from '@dlb/types/Mod';
import { Box } from '@mui/material';
import { ArmorSlotModList, InspectingOptimizationDetailsHelp } from './Helpers';
import { ResolutionInstructionProps } from './types';

export default function BuggedAlternateSeasonMods(
	props: ResolutionInstructionProps
) {
	const { buggedAlternateSeasonModIdList } = useAppSelector(
		selectAnalyzableLoadouts
	);

	const { loadout } = props;
	return (
		<Box>
			<InspectingOptimizationDetailsHelp>
				This is a bug on Bungie&apos;s end and there is nothing you can do to
				resolve this without removing the affected mods from this loadout.
				Bungie may fix this at any time. Here are the mods that are affected:
			</InspectingOptimizationDetailsHelp>
			{ArmorSlotIdList.map((armorSlotId) => {
				const armorSlot = getArmorSlot(armorSlotId);
				const artifactModList = loadout.armorSlotMods[armorSlotId]
					.filter((x) => x !== null)
					.map((modId) => getMod(modId))
					.filter((mod) => buggedAlternateSeasonModIdList.includes(mod.id));

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
