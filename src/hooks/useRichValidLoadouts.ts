import { selectAnalyzableLoadouts } from '@dlb/redux/features/analyzableLoadouts/analyzableLoadoutsSlice';
import { selectIgnoredLoadoutOptimizationTypes } from '@dlb/redux/features/ignoredLoadoutOptimizationTypes/ignoredLoadoutOptimizationTypesSlice';
import { useAppSelector } from '@dlb/redux/hooks';
import {
	ELoadoutType,
	filterOptimizationTypeList,
} from '@dlb/types/AnalyzableLoadout';
import { useMemo } from 'react';

export default function useRichValidLoadouts() {
	const analyzableLoadouts = useAppSelector(selectAnalyzableLoadouts);
	const ignoredLoadoutOptimizationTypeIdList = useAppSelector(
		selectIgnoredLoadoutOptimizationTypes
	);
	const { analysisResults, analyzableLoadoutBreakdown } = analyzableLoadouts;
	const { validLoadouts } = analyzableLoadoutBreakdown;
	const richValidLoadouts = useMemo(
		() =>
			Object.entries(validLoadouts)
				.map(([key, value]) => {
					const analysisResult = analysisResults[key];

					const optimizationTypeList = filterOptimizationTypeList(
						analysisResult?.optimizationTypeList || [],
						ignoredLoadoutOptimizationTypeIdList
					);

					return {
						...value,
						...analysisResult,
						optimizationTypeList,
					};
				})
				.sort((a, b) => {
					// Sort by three factors
					// D2 loadouts always before DIM
					// D2 loadouts are sorted by index
					// DIM loadouts are sorted by name
					if (a.loadoutType === ELoadoutType.InGame) {
						if (b.loadoutType === ELoadoutType.InGame) {
							return a.index - b.index;
						} else {
							return -1;
						}
					} else {
						if (b.loadoutType === ELoadoutType.InGame) {
							return 1;
						} else {
							return a.name.localeCompare(b.name);
						}
					}
				}),
		[validLoadouts, analysisResults, ignoredLoadoutOptimizationTypeIdList]
	);
	return richValidLoadouts;
}
