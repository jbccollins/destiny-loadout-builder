import { EModId } from '@dlb/generated/mod/EModId';
import { StatList } from '@dlb/types/Armor';
import {
	ArmorStatMapping,
	ArmorStatIdList,
	getArmorStatModSpitFromArmorStatId,
} from '@dlb/types/ArmorStat';
import { EDestinyClassId } from '@dlb/types/IdEnums';
import {
	canUseMinorStatMod,
	roundUp10,
	getTotalModCost,
	getArmorStatMappingFromStatList,
} from './utils';
import { getArtificeAdjustedRequiredMods } from './getArtificeAdjustedRequiredMods';
import { extrapolateMajorModsIntoMinorMods } from './extrapolateMajorModsIntoMinorMods';

export type StatModCombo = {
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
};

export type StatModComboWithMetadata = StatModCombo & {
	metadata: {
		totalArmorStatModCost: number;
	};
};

export type GetAllStatModCombosParams = {
	desiredArmorStats: ArmorStatMapping;
	stats: StatList; // Includes masterworked / assume masterworked
	destinyClassId: EDestinyClassId;
	numSeenArtificeArmorItems: number;
};

// Only run this once a full set of armor is known
export const getAllStatModCombos = ({
	desiredArmorStats,
	stats,
	destinyClassId,
	numSeenArtificeArmorItems,
}: GetAllStatModCombosParams): StatModComboWithMetadata[] => {
	let allStatModCombos: StatModCombo[] = [];

	/*
	Step 1:
	Figure out which armor stat mods we would need to do hit the desiredArmorStats
	*/
	const requiredArmorStatMods: EModId[] = [];
	stats.forEach((stat, i) => {
		const armorStat = ArmorStatIdList[i];
		const desiredStat = desiredArmorStats[armorStat];
		const diff = desiredStat - stat;
		// If the desired stat is less than or equal to the total possible stat
		// then we don't need any stat mods or artifice stat mods to boost that stat
		if (diff <= 0) {
			return;
		}
		const withMinorStatMod = canUseMinorStatMod(diff);
		// Note that this will only ever pick a single minor mod of the same type.
		// So it will never pick two minor mobility mods even if that is cheaper
		// than a single major mobility mod. In a future step will remidiate this.
		// In short, this step prioritizes choosing fewer mods at a higher total cost
		// if that saves an entire mod slot from being used. In some cases this can be useful.
		// In other cases it could be a hindrance. So we'll calculate out all major/minor
		// combos later on.
		const numRequiredMajorMods =
			roundUp10(diff) / 10 - (withMinorStatMod ? 1 : 0);
		const { major, minor } = getArmorStatModSpitFromArmorStatId(armorStat);
		for (let i = 0; i < numRequiredMajorMods; i++) {
			requiredArmorStatMods.push(major);
		}
		if (withMinorStatMod) {
			requiredArmorStatMods.push(minor);
		}
	});

	/*
	Step 2
	If there is a combination of mods that works, set it's extrapolation as
	the current result list. If there are any artifice armor pieces in this
	armor combo we'll handle them in the next step.
	*/
	if (numSeenArtificeArmorItems === 0 && requiredArmorStatMods.length <= 5) {
		const baseStatModCombo = {
			armorStatModIdList: requiredArmorStatMods,
			artificeModIdList: [],
			armorStatModCost: getTotalModCost(requiredArmorStatMods),
		};
		allStatModCombos = extrapolateMajorModsIntoMinorMods(
			[baseStatModCombo],
			destinyClassId
		);
	} else if (numSeenArtificeArmorItems > 0) {
		/*
		Step 2.1:
		Add artifice mods to reduce cost if possible. This potentially create
		a variety of mod combinations with different costs. These different costs
		can affect where we can place raid mods and also inform the desired
		stat tier preview. High cost combos that use fewer artifice mods might
		allow an extra stat tier and the desired stat preview needs to be aware of that.
		*/
		const baseArmorStatMapping = getArmorStatMappingFromStatList(stats);
		const artificeAdjustedRequiredMods = getArtificeAdjustedRequiredMods(
			requiredArmorStatMods,
			destinyClassId,
			desiredArmorStats,
			baseArmorStatMapping,
			numSeenArtificeArmorItems
		);

		artificeAdjustedRequiredMods.forEach((x) => {
			const artificeStatModCombo: StatModCombo = {
				armorStatModIdList: x.armorStatModIdList,
				artificeModIdList: x.artificeModIdList,
			};
			allStatModCombos.push(artificeStatModCombo);

			// TODO: Make getArtificeAdjustedRequiredMods return all combos of mods
			// not just combos of 5. This will require extrapolating within that function
		});
		//});
	}

	// Step 3: TODO: Optimize this further to add combos that don't NEED
	// to use artifice mods to hit the desired stat tiers but CAN use artifice
	// mods to reduce the combo cost

	// Extract metadata
	const allStatModCombosWithMetadata: StatModComboWithMetadata[] =
		allStatModCombos.map(({ armorStatModIdList, artificeModIdList }) => ({
			armorStatModIdList,
			artificeModIdList,
			metadata: {
				totalArmorStatModCost: getTotalModCost(armorStatModIdList),
			},
		}));

	// Return sorted results with the cheapest first and the tiebreaker being number
	// of mods used where fewer is better.
	return allStatModCombosWithMetadata.sort(
		(a, b) =>
			a.metadata.totalArmorStatModCost - b.metadata.totalArmorStatModCost ||
			a.armorStatModIdList.length - b.armorStatModIdList.length
	);
};
