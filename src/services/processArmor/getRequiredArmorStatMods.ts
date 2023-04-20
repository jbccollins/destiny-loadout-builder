import { EModId } from '@dlb/generated/mod/EModId';
import {
	StatList,
	ArmorMetadataItem,
	AvailableExoticArmorItem,
} from '@dlb/types/Armor';
import {
	ArmorStatMapping,
	ArmorStatIdList,
	getArmorStatModSpitFromArmorStatId,
	getArmorStatMappingFromMods,
	sumArmorStatMappings,
} from '@dlb/types/ArmorStat';
import { EDestinyClassId, EArmorStatId } from '@dlb/types/IdEnums';
import { MinorStatModIdList, getMod } from '@dlb/types/Mod';
import { getArtificeAdjustedRequiredMods } from './getArtificeAdjustedRequiredMods';
import { getRequiredArtificeModIdList } from './getRequiredArtificeModIdList';
import {
	canUseMinorStatMod,
	getArmorStatMappingFromStatList,
	getMaxPossibleRemainingStatValue,
	roundUp10,
} from './utils';

export type RequiredStatMods = {
	requiredArmorStatModIdList: EModId[];
	requiredArtificeModIdList: EModId[];
	requiredArmorStatModsArmorStatMapping: ArmorStatMapping;
	numUnusedArtificeMods: number;
};

export type GetRequiredArmorStatModsParams = {
	desiredArmorStats: ArmorStatMapping;
	stats: StatList; // Includes masterworked / assume masterworked
	numRemainingArmorPieces: number;
	destinyClassId: EDestinyClassId;
	numSeenArtificeArmorItems: number;
	armorMetadataItem: ArmorMetadataItem;
	selectedExotic: AvailableExoticArmorItem;
};

// Get the required armor stat mods for a given combination.
// If we don't have a full combination yet then assume that we have the
// max possible stat value for each remaining stat.
export const getRequiredArmorStatMods = ({
	desiredArmorStats,
	stats,
	numRemainingArmorPieces,
	destinyClassId,
	numSeenArtificeArmorItems,
	selectedExotic,
	armorMetadataItem,
}: GetRequiredArmorStatModsParams): RequiredStatMods => {
	const requiredArmorStatMods: EModId[] = [];
	stats.forEach((stat, i) => {
		const armorStat = ArmorStatIdList[i];
		const desiredStat = desiredArmorStats[armorStat];
		// Assume that for each remaining armor piece we have perfect stats
		const diff =
			desiredStat -
			(stat +
				getMaxPossibleRemainingStatValue(
					numRemainingArmorPieces,
					0, // numSeenArtificeArmorItems,
					armorMetadataItem,
					selectedExotic
				));
		// If the desired stat is less than or equal to the total possible stat
		// then we don't need any stat mods or artifice stat mods to boost that stat
		if (diff <= 0) {
			return;
		}
		// TODO: Prefering minor stat mods where possible will prevent the extrapolation
		// from getting ALL possible results. For example, if we need 14 of a stat we can use either
		// a major mod and a minor mod, or two major mods or three minor mods. But the way this code
		// is written we will never use two major mods. The only time this would matter is for
		// checking zero wasted stats. We can't currently just strip out this logic since
		// the `numPotentiallyReplaceableMajorMods` in `getArtificeAdjustedRequiredMods` would be affected by this.
		const withMinorStatMod = canUseMinorStatMod(diff);
		// TODO: We can optimize this a bit I think... Like if we only need two major and one minor
		// and we have no remaining pieces then we can probably just push five minor stat mods.
		// Maybe that should be a setting.. like "Prefer minor mods" or something idk.
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
	let requiredArtificeModIdList: EModId[] = [];
	let adjustedArmorStatMods: EModId[] = [...requiredArmorStatMods];
	let numUnusedArtificeMods = 0;

	// TODO: This is an upper bound for the number of artifice items left.
	// Constrain this further by checking which slot has an exotic and which
	// slots even have artifice pieces available.
	// In the future if we allow the usage of a loadout without an exotic this will need to change.
	const numPotentialArtificeItems =
		numSeenArtificeArmorItems + numRemainingArmorPieces;
	// Find a single permutation of artifice mods to pad the stats. Only do this if necessary
	if (
		(numRemainingArmorPieces === 0 || requiredArmorStatMods.length > 5) &&
		numPotentialArtificeItems > 0
	) {
		const baseArmorStatMapping = getArmorStatMappingFromStatList(stats);
		const artificeAdjustedRequiredMods = getArtificeAdjustedRequiredMods(
			requiredArmorStatMods,
			destinyClassId,
			desiredArmorStats,
			baseArmorStatMapping,
			numPotentialArtificeItems
		);
		const {
			armorStatModIdList: _adjustedArmorStatMods,
			artificeModIdList: _requiredArtificeModIdList,
		} = artificeAdjustedRequiredMods[0];
		adjustedArmorStatMods = _adjustedArmorStatMods;
		requiredArtificeModIdList = _requiredArtificeModIdList;
		let numUsedArtificeMods = requiredArtificeModIdList.length;
		// TODO: This isn't taking into consideration the cost of armor mods
		// potentially preventing any of these combos from working
		artificeAdjustedRequiredMods.forEach((combo) => {
			if (combo.artificeModIdList.length < numUsedArtificeMods) {
				numUsedArtificeMods = combo.artificeModIdList.length;
			}
		});
		numUnusedArtificeMods = numPotentialArtificeItems - numUsedArtificeMods;
	}

	// Try to optimize a bit further by swapping out major mods with minor mods
	// and padding with unused artifice mods
	if (
		numRemainingArmorPieces === 0 &&
		numSeenArtificeArmorItems > 0 &&
		requiredArtificeModIdList.length <= numSeenArtificeArmorItems // TODO <= ??? Why not just <
	) {
		let optimizedArmorStatMods = [...adjustedArmorStatMods];
		for (let i = 0; i < adjustedArmorStatMods.length; i++) {
			// If this is a minor mod we can't optimize it any further
			// TODO: This is almost certainly wrong behavior. In the case
			// where all we need is a single minor mod to reach our desired stats
			// we can just replace that minor mod with one or two artifice mods
			if (MinorStatModIdList.includes(adjustedArmorStatMods[i])) {
				continue;
			}
			// TODO: If stat mods ever give more than one bonus this won't work
			// Additionally this cast to EArmorStatId won't work if there are ever class specific
			// Armor stat mods...
			const armorStatId = getMod(adjustedArmorStatMods[i]).bonuses[0]
				.stat as EArmorStatId;
			const minorMod = getArmorStatModSpitFromArmorStatId(armorStatId).minor;
			const _optimizedArmorStatMods = [...optimizedArmorStatMods];
			// Swap out the currently considered mod
			_optimizedArmorStatMods[i] = minorMod;

			const optimizedArmorStatMapping = getArmorStatMappingFromMods(
				_optimizedArmorStatMods,
				destinyClassId
			);

			const baseArmorStatMapping = getArmorStatMappingFromStatList(stats);
			const totalArmorStatMapping = sumArmorStatMappings([
				optimizedArmorStatMapping,
				baseArmorStatMapping,
			]);
			const _requiredArtificeModIdList = getRequiredArtificeModIdList({
				desiredArmorStats,
				totalArmorStatMapping,
			});
			if (_requiredArtificeModIdList.length > numSeenArtificeArmorItems) {
				continue;
			} else {
				optimizedArmorStatMods = _optimizedArmorStatMods;
				requiredArtificeModIdList = _requiredArtificeModIdList;
			}
		}
		adjustedArmorStatMods = optimizedArmorStatMods;
	}

	// TODO: If we have extra artifice mods available then try adding those to fill in the gaps.
	// This is a future optimization. We currently only add artifice mods if they are required to
	// hit the stats you want. Ideally we would prefer artifice mods over armor stat mods since
	// artifice mods have no cost. Actually... this might already be happening
	// if (
	// 	numRemainingArmorPieces === 0 &&
	// 	numSeenArtificeArmorItems > 0 &&
	// 	requiredArtificeModIdList.length < numSeenArtificeArmorItems
	// ) {
	// 	let numExtraArtificeMods = numSeenArtificeArmorItems - requiredArtificeModIdList.length
	//	// Figure out how to add more stat tiers with artifice mods here!
	// }
	return {
		requiredArmorStatModIdList: adjustedArmorStatMods,
		requiredArtificeModIdList,
		requiredArmorStatModsArmorStatMapping: getArmorStatMappingFromMods(
			adjustedArmorStatMods,
			destinyClassId
		),
		numUnusedArtificeMods,
	};
};
