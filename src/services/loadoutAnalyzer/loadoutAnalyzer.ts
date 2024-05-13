
import {
	ELoadoutOptimizationTypeId,
	humanizeOptimizationTypes
} from '@dlb/types/AnalyzableLoadout';
import analyzeLoadout from './analyzeLoadout';
import { EGetLoadoutsThatCanBeOptimizedProgressType, GetLoadoutsThatCanBeOptimizedOutputItem, GetLoadoutsThatCanBeOptimizedParams } from './helpers/types';


// We assume that the DIM mods will be swapped appropriately
// before the analyzer even runs. This is how DIM behaves internally
// and we want to mimic that behavior.
// "Seasonal D2" doesn't require any mod swapping. Just check if the loadout contains an in-season reduced cost mod
// "Unusable Mods" should be D2 specific. DIM loadouts will never have unusable mods since we pre-swap the mods on initial DIM loadout ingestion.
// "Unavailable Mods" is gone. DIM loadouts will never have unavailable mods since we pre-swap the mods on initial DIM loadout ingestion.
// "Invalid Loadout Configuration" might need to be DIM specific. The description should mention that the user may have initially created that loadout using reduced cost mods that are now out-of-season
// If "Invalid Loadout Configuration" is DIM specific, then we need to have separate checks for mutually exclusive mods and
export const getLoadoutsThatCanBeOptimized = (
	params: GetLoadoutsThatCanBeOptimizedParams
): GetLoadoutsThatCanBeOptimizedOutputItem[] => {
	const result: GetLoadoutsThatCanBeOptimizedOutputItem[] = [];
	const {
		loadouts,
		armor,
		masterworkAssumption,
		allClassItemMetadata,
		progressCallback,
		availableExoticArmor,
		buggedAlternateSeasonModIdList,
	} = params;
	Object.values(loadouts).forEach((loadout) => {
		try {
			// throw new Error('test');
			const {
				optimizationTypeList,
				metadata,
			} = analyzeLoadout({
				armor,
				masterworkAssumption,
				allClassItemMetadata,
				availableExoticArmor,
				buggedAlternateSeasonModIdList,
				loadout,
			})

			const humanizedOptimizationTypes =
				humanizeOptimizationTypes(optimizationTypeList);

			// Do this to fake a high score
			// const humanizedOptimizationTypes = [];

			if (humanizedOptimizationTypes.length > 0) {
				result.push({
					optimizationTypeList: humanizedOptimizationTypes,
					loadoutId: loadout.dlbGeneratedId,
				});
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: true,
					loadoutId: loadout.dlbGeneratedId,
					optimizationTypeList: humanizedOptimizationTypes,
					metadata,
				});
				return;
			} else {
				progressCallback({
					type: EGetLoadoutsThatCanBeOptimizedProgressType.Progress,
					canBeOptimized: false,
					loadoutId: loadout.dlbGeneratedId,
					optimizationTypeList: [],
					metadata,
				});
				return;
			}
		} catch (e) {
			progressCallback({
				type: EGetLoadoutsThatCanBeOptimizedProgressType.Error,
				loadoutId: loadout.dlbGeneratedId,
				optimizationTypeList: [ELoadoutOptimizationTypeId.Error],
			});
		}
	});

	return result;
};

