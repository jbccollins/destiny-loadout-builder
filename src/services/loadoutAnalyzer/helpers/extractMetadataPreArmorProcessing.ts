import { EModId } from '@dlb/generated/mod/EModId';
import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { getDefaultModPlacements } from '@dlb/services/processArmor/getModCombos';
import { getWastedStats, sumModCosts } from '@dlb/services/processArmor/utils';
import { AnalyzableLoadout } from '@dlb/types/AnalyzableLoadout';
import { getDefaultArmorStatMapping } from '@dlb/types/ArmorStat';
import {
	getMod,
	hasActiveSeasonArtifactMods,
	hasActiveSeasonArtifactModsWithNoFullCostVariant,
	hasActiveSeasonReducedCostVariantMods,
	hasAlternateSeasonArtifactMods,
	hasAlternateSeasonReducedCostVariantMods,
	hasMutuallyExclusiveMods,
	hasNonBuggedAlternateSeasonMods,
} from '@dlb/types/Mod';
import { GetLoadoutsThatCanBeOptimizedProgressMetadata } from './types';
import { flattenMods } from './utils';

export const getInitialMetadata =
	(): GetLoadoutsThatCanBeOptimizedProgressMetadata => {
		return {
			maxPossibleDesiredStatTiers: getDefaultArmorStatMapping(),
			maxPossibleReservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
			lowestCost: Infinity,
			currentCost: Infinity,
			lowestWastedStats: Infinity,
			currentWastedStats: Infinity,
			mutuallyExclusiveModGroups: [],
			unstackableModIdList: [],
			modPlacement: getDefaultModPlacements().placement,
			unusedModSlots: {},
		};
	};

type ExtractProcessedArmorDataParams = {
	loadout: AnalyzableLoadout;
	buggedAlternateSeasonModIdList: EModId[];
};

type ExtractProcessedArmorDataOutput = {
	metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata;
	allLoadoutModsIdList: EModId[];
	usesAlternateSeasonReducedCostVariantArtifactMods: boolean;
	usesAlternateSeasonNonBuggedArtifactMods: boolean;
	usesAlternateSeasonBuggedArtifactMods: boolean;
	usesAlternateSeasonArtifactMods: boolean;
	usesMutuallyExclusiveMods: boolean;
	usesActiveSeasonArtifactModsWithNoFullCostVariant: boolean;
	usesActiveSeasonReducedCostArtifactMods: boolean;
	usesActiveSeasonArtifactMods: boolean;
};

export default function extractMetadataPreArmorProcessing(
	params: ExtractProcessedArmorDataParams
): ExtractProcessedArmorDataOutput {
	const { loadout, buggedAlternateSeasonModIdList } = params;
	const metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata =
		getInitialMetadata();
	const allLoadoutModsIdList = flattenMods(loadout);
	const allModsIdList = allLoadoutModsIdList.map((x) => getMod(x));

	metadata.currentCost = sumModCosts(loadout.armorStatMods);
	const wastedStats = getWastedStats(loadout.achievedStats);
	metadata.currentWastedStats = wastedStats;

	const usesAlternateSeasonReducedCostVariantArtifactMods =
		hasAlternateSeasonReducedCostVariantMods(allLoadoutModsIdList);

	const loadoutSpecificBuggedAlternateSeasonModIdList =
		buggedAlternateSeasonModIdList.filter((x) =>
			allLoadoutModsIdList.includes(x)
		);
	const usesAlternateSeasonNonBuggedArtifactMods =
		hasNonBuggedAlternateSeasonMods(
			allLoadoutModsIdList,
			loadoutSpecificBuggedAlternateSeasonModIdList
		);
	const usesAlternateSeasonBuggedArtifactMods =
		loadoutSpecificBuggedAlternateSeasonModIdList.length > 0;

	const usesAlternateSeasonArtifactMods =
		hasAlternateSeasonArtifactMods(allLoadoutModsIdList);

	const usesActiveSeasonArtifactModsWithNoFullCostVariant =
		hasActiveSeasonArtifactModsWithNoFullCostVariant(allLoadoutModsIdList);

	const [usesMutuallyExclusiveMods, mutuallyExclusiveModGroups] =
		hasMutuallyExclusiveMods(allModsIdList);
	metadata.mutuallyExclusiveModGroups = mutuallyExclusiveModGroups;

	const usesActiveSeasonReducedCostArtifactMods =
		hasActiveSeasonReducedCostVariantMods(allLoadoutModsIdList);

	const usesActiveSeasonArtifactMods =
		hasActiveSeasonArtifactMods(allLoadoutModsIdList);

	return {
		metadata,
		usesAlternateSeasonReducedCostVariantArtifactMods,
		allLoadoutModsIdList,
		usesAlternateSeasonNonBuggedArtifactMods,
		usesAlternateSeasonBuggedArtifactMods,
		usesAlternateSeasonArtifactMods,
		usesMutuallyExclusiveMods,
		usesActiveSeasonArtifactModsWithNoFullCostVariant,
		usesActiveSeasonReducedCostArtifactMods,
		usesActiveSeasonArtifactMods,
	};
}
