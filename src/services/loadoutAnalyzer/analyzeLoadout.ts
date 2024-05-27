import { getDefaultArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	DoProcessArmorParams,
	doProcessArmor,
} from '@dlb/services/processArmor';
import {
	AnalyzableLoadout,
	ELoadoutOptimizationTypeId,
	LoadoutOptimizationTypeToLoadoutOptimizationMapping,
	humanizeOptimizationTypes,
} from '@dlb/types/AnalyzableLoadout';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import {
	getArmorStatMappingFromFragments,
	getArmorStatMappingFromMods,
	getDefaultArmorStatMapping,
} from '@dlb/types/ArmorStat';
import {
	EExoticArtificeAssumption,
	EGearTierId,
	EIntrinsicArmorPerkOrAttributeId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import {
	getValidRaidModArmorSlotPlacements,
	replaceAllReducedCostVariantMods,
} from '@dlb/types/Mod';
import { cloneDeep, isEmpty } from 'lodash';
import extractMetadataPostArmorProcessing, {
	getDefaultPostArmorProcessingInfo,
} from './helpers/extractMetadataPostArmorProcessing';
import extractMetadataPreArmorProcessing from './helpers/extractMetadataPreArmorProcessing';
import { generatePreProcessedArmor } from './helpers/generatePreProcessedArmor';
import {
	AnalyzeLoadoutParams,
	AnalyzeLoadoutResult,
	ELoadoutVariantCheckType,
	GetLoadoutsThatCanBeOptimizedProgressMetadata,
	LoadoutVariantCheckSplit,
	LoadoutVariants,
	ModReplacer,
} from './helpers/types';
import { findAvailableExoticArmorItem, unflattenMods } from './helpers/utils';

// Order matters here for short-circuiting
export const LoadoutVariantCheckOrder: Record<
	ELoadoutVariantCheckType,
	LoadoutVariantCheckSplit
> = {
	[ELoadoutVariantCheckType.Base]: {
		beforeProcessing: [
			ELoadoutOptimizationTypeId.NoExoticArmor,
			ELoadoutOptimizationTypeId.MissingArmor,
			ELoadoutOptimizationTypeId.WastedStatTiers,
			ELoadoutOptimizationTypeId.UnusedFragmentSlots,
			ELoadoutOptimizationTypeId.UnspecifiedAspect,
			ELoadoutOptimizationTypeId.UnmetDIMStatConstraints,
			ELoadoutOptimizationTypeId.UnusableMods,
			ELoadoutOptimizationTypeId.UnmasterworkedArmor,
			ELoadoutOptimizationTypeId.DeprecatedMods,
			ELoadoutOptimizationTypeId.MutuallyExclusiveMods,
			ELoadoutOptimizationTypeId.UnstackableMods,
		],
		afterProcessing: [
			ELoadoutOptimizationTypeId.UnusedModSlots,
			ELoadoutOptimizationTypeId.HigherStatTiers,
			ELoadoutOptimizationTypeId.LowerCost,
			ELoadoutOptimizationTypeId.FewerWastedStats,
			ELoadoutOptimizationTypeId.InvalidLoadoutConfiguration,
		],
	},
	[ELoadoutVariantCheckType.SeasonalMods]: {
		beforeProcessing: [],
		afterProcessing: [
			ELoadoutOptimizationTypeId.BuggedAlternateSeasonMods,
			ELoadoutOptimizationTypeId.BuggedAlternateSeasonModsCorrectable,
			ELoadoutOptimizationTypeId.SeasonalMods,
			ELoadoutOptimizationTypeId.SeasonalModsCorrectable,
		],
	},
	[ELoadoutVariantCheckType.ExoticArtifice]: {
		beforeProcessing: [],
		afterProcessing: [
			ELoadoutOptimizationTypeId.ExoticArtificeHigherStatTiers,
			ELoadoutOptimizationTypeId.ExoticArtificeLowerCost,
		],
	},
};

export const LoadoutVariantCheckTypeToModReplacerMapping: Record<
	ELoadoutVariantCheckType,
	ModReplacer
> = {
	[ELoadoutVariantCheckType.Base]: (armorSlotMods) => armorSlotMods,
	[ELoadoutVariantCheckType.SeasonalMods]: replaceAllReducedCostVariantMods,
	[ELoadoutVariantCheckType.ExoticArtifice]: (armorSlotMods) => armorSlotMods,
};

export default function analyzeLoadout(
	params: AnalyzeLoadoutParams
): AnalyzeLoadoutResult {
	// throw new Error('Fake error');
	const {
		loadout,
		armor,
		allClassItemMetadata,
		availableExoticArmor,
		masterworkAssumption,
		buggedAlternateSeasonModIdList,
	} = params;

	const {
		allLoadoutModsIdList,
		usesAlternateSeasonArtifactMods,
		usesAlternateSeasonBuggedArtifactMods,
		usesAlternateSeasonNonBuggedArtifactMods,
		usesActiveSeasonArtifactModsWithNoFullCostVariant,
		usesActiveSeasonReducedCostArtifactMods,
		usesMutuallyExclusiveMods,
		usesActiveSeasonArtifactMods,
		usesUnstackableMods,
		...rest
	} = extractMetadataPreArmorProcessing({
		loadout,
		buggedAlternateSeasonModIdList,
	});

	let metadata = cloneDeep(rest.metadata);

	// DIM Loadouts will try to auto-correct any discounted mods from previous seasons
	// by replacing them with the full cost variants. Sometimes there is not enough
	// armor energy capacity to slot the full cost variants. We will check for both
	// the discounted and full cost variants to see if DIM can handle this or not.

	// By the time we get here we will already have this loadout's mods
	// in the "DIM Corrected State" Where DIM will have swapped out any previous
	// season discounted mods with their full cost variants
	const loadoutVariants: LoadoutVariants = [
		{
			modIdList:
				LoadoutVariantCheckTypeToModReplacerMapping[
					ELoadoutVariantCheckType.Base
				](allLoadoutModsIdList),
			loadoutVariantCheckType: ELoadoutVariantCheckType.Base,
		},
	];

	// The alternate check overrides the seasonal check
	// So don't even bother checking for seasonal loadouts if
	// the base variant mods contain alternate season reduced cost mods
	if (
		(usesActiveSeasonArtifactMods && !usesAlternateSeasonArtifactMods) ||
		usesAlternateSeasonBuggedArtifactMods
	) {
		loadoutVariants.push({
			modIdList:
				LoadoutVariantCheckTypeToModReplacerMapping[
					ELoadoutVariantCheckType.SeasonalMods
				](allLoadoutModsIdList),
			loadoutVariantCheckType: ELoadoutVariantCheckType.SeasonalMods,
		});
	}

	const exoticArmor = loadout.armor.find(
		(x) => x.gearTierId === EGearTierId.Exotic
	);
	if (exoticArmor && !exoticArmor.isArtifice) {
		loadoutVariants.push({
			modIdList:
				LoadoutVariantCheckTypeToModReplacerMapping[
					ELoadoutVariantCheckType.ExoticArtifice
				](allLoadoutModsIdList),
			loadoutVariantCheckType: ELoadoutVariantCheckType.ExoticArtifice,
		});
	}

	const optimizationTypeIdList: ELoadoutOptimizationTypeId[] = [
		...loadout.optimizationTypeList,
	];

	const variantHasResultsMapping: Record<ELoadoutVariantCheckType, boolean> = {
		[ELoadoutVariantCheckType.Base]: false,
		[ELoadoutVariantCheckType.SeasonalMods]: false,
		[ELoadoutVariantCheckType.ExoticArtifice]: false,
	};

	loadoutVariants.forEach(
		({ modIdList, loadoutVariantCheckType: loadoutVariantCheckType }) => {
			const { armorSlotMods, armorStatMods, artificeModIdList, raidMods } =
				unflattenMods(modIdList);

			let postArmorProcessingInfo = getDefaultPostArmorProcessingInfo();

			// Replace the mods in the loadout with the mods from the variant
			const _loadout: AnalyzableLoadout = {
				armorSlotMods,
				armorStatMods,
				artificeModIdList,
				raidMods,
				...loadout,
			};

			const doChecks = (
				optimizationTypes: ELoadoutOptimizationTypeId[],
				_metadata: GetLoadoutsThatCanBeOptimizedProgressMetadata
			): boolean => {
				let shortCircuit = false;
				for (const optimizationType of optimizationTypes) {
					const checker =
						LoadoutOptimizationTypeToLoadoutOptimizationMapping[
							optimizationType
						].checker;
					const result = checker({
						...params,
						...postArmorProcessingInfo,
						loadout: _loadout,
						modIdList,
						metadata: _metadata,
						variantHasResultsMapping,
						usesAlternateSeasonArtifactMods,
						usesAlternateSeasonNonBuggedArtifactMods,
						usesAlternateSeasonBuggedArtifactMods,
						usesMutuallyExclusiveMods,
						usesActiveSeasonArtifactModsWithNoFullCostVariant,
						usesActiveSeasonReducedCostArtifactMods,
						usesActiveSeasonArtifactMods,
						usesUnstackableMods,
					});
					if (result.meetsOptimizationCriteria) {
						optimizationTypeIdList.push(optimizationType);
						if (result.metadataOverrides) {
							metadata = {
								...metadata,
								...result.metadataOverrides,
							};
						}
						if (result.shortCircuit) {
							shortCircuit = true;
							break;
						}
					}
				}
				return shortCircuit;
			};

			const shortCircuit = doChecks(
				LoadoutVariantCheckOrder[loadoutVariantCheckType].beforeProcessing,
				metadata
			);
			if (shortCircuit) {
				return {
					optimizationTypeList: optimizationTypeIdList,
					metadata,
					canBeOptimized: !isEmpty(optimizationTypeIdList),
				};
			}

			const { preProcessedArmor, allClassItemMetadata: _allClassItemMetadata } =
				generatePreProcessedArmor({
					armor,
					loadout,
					allClassItemMetadata,
					availableExoticArmor,
					exoticArtificeAssumption:
						loadoutVariantCheckType === ELoadoutVariantCheckType.ExoticArtifice
							? EExoticArtificeAssumption.All
							: EExoticArtificeAssumption.None,
					masterworkAssumption: EMasterworkAssumption.All,
				});

			// Collect any stats that are not directly provided by explicit stat mods
			let allNonStatModsIdList = [...loadout.raidMods];
			ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
				allNonStatModsIdList = [
					...allNonStatModsIdList,
					...armorSlotMods[armorSlotId],
				];
			});
			const modArmorStatMapping = getArmorStatMappingFromMods(
				allNonStatModsIdList,
				loadout.destinyClassId
			);

			// TODO: Flesh out the non-default stuff like
			// raid mods, placements, armor slot mods,
			const doProcessArmorParams: DoProcessArmorParams = {
				masterworkAssumption,
				desiredArmorStats: loadout.desiredStatTiers,
				armorItems: preProcessedArmor,
				fragmentArmorStatMapping: getArmorStatMappingFromFragments(
					loadout.fragmentIdList,
					loadout.destinyClassId
				),
				modArmorStatMapping,
				potentialRaidModArmorSlotPlacements: getValidRaidModArmorSlotPlacements(
					armorSlotMods,
					loadout.raidMods
				),
				armorSlotMods,
				raidMods: loadout.raidMods.filter((x) => x !== null),
				intrinsicArmorPerkOrAttributeIds: loadout.hasHalloweenMask
					? [EIntrinsicArmorPerkOrAttributeId.HalloweenMask]
					: [],
				destinyClassId: loadout.destinyClassId,
				reservedArmorSlotEnergy: getDefaultArmorSlotEnergyMapping(),
				useZeroWastedStats: false,
				useBonusResilience: loadout.hasBonusResilienceOrnament,
				selectedExoticArmorItem: findAvailableExoticArmorItem(
					loadout.exoticHash,
					loadout.destinyClassId,
					availableExoticArmor
				),
				alwaysConsiderCollectionsRolls: false,
				allClassItemMetadata: _allClassItemMetadata,
				assumedStatValuesStatMapping: getDefaultArmorStatMapping(),
			};

			const processedArmor = doProcessArmor(doProcessArmorParams);

			const postProcessingData = extractMetadataPostArmorProcessing({
				processedArmor,
				loadout,
				preArmorProcessingMetadata: metadata,
				modIdList,
			});

			// TODO: Why is this cloned here? Like why is this var set at all?
			postArmorProcessingInfo = cloneDeep(postProcessingData.info);
			// TODO: Should the metadata really be cloned on the Seaonal check? I think not?
			if (loadoutVariantCheckType === ELoadoutVariantCheckType.Base) {
				metadata = cloneDeep(postProcessingData.metadata);
			}
			variantHasResultsMapping[loadoutVariantCheckType] =
				postProcessingData.info.hasResults;

			doChecks(
				LoadoutVariantCheckOrder[loadoutVariantCheckType].afterProcessing,
				postProcessingData.metadata
			);
		}
	);

	// Do this to fake a high score
	// const humanizedOptimizationTypes = [];

	const humanizedOptimizationTypes = humanizeOptimizationTypes(
		optimizationTypeIdList
	);

	return {
		optimizationTypeList: humanizedOptimizationTypes,
		metadata,
		canBeOptimized: !isEmpty(optimizationTypeIdList),
	};
}
