import {
	ELoadoutOptimizationTypeId,
	getLoadoutOptimization,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	AnalyzableLoadout,
	ELoadoutOptimizationCategoryId,
	getLoadoutOptimizationCategory,
} from '@dlb/types/AnalyzableLoadout';
import { Box } from '@mui/material';
import { useMemo } from 'react';

type SummaryProps = {
	loadouts: AnalyzableLoadout[];
	hiddenLoadoutIdList: string[];
};
export default function Summary(props: SummaryProps) {
	const { loadouts, hiddenLoadoutIdList } = props;

	const loadoutCategoryCounts = useMemo(() => {
		const loadoutCategoryCounts: Partial<
			Record<ELoadoutOptimizationCategoryId, number>
		> = {};
		loadouts
			.filter((x) => !hiddenLoadoutIdList.includes(x.id))
			.forEach((loadout) => {
				const { optimizationTypeList } = loadout;
				let highestSeverityOptimizationTypeId: ELoadoutOptimizationTypeId =
					ELoadoutOptimizationTypeId.None;

				optimizationTypeList.forEach((optimizationType) => {
					const { category: categoryId } =
						getLoadoutOptimization(optimizationType);
					const category = getLoadoutOptimizationCategory(categoryId);
					if (
						category.severity >
						getLoadoutOptimizationCategory(
							getLoadoutOptimization(highestSeverityOptimizationTypeId).category
						).severity
					) {
						highestSeverityOptimizationTypeId = optimizationType;
					}
				});
				const { category: categoryId } = getLoadoutOptimization(
					highestSeverityOptimizationTypeId
				);
				loadoutCategoryCounts[categoryId] = loadoutCategoryCounts[categoryId]
					? loadoutCategoryCounts[categoryId] + 1
					: 1;
			});
		return loadoutCategoryCounts;
	}, [loadouts, hiddenLoadoutIdList]);
	return (
		<Box>
			{(Object.keys(loadoutCategoryCounts) as ELoadoutOptimizationCategoryId[])
				.sort(
					(a, b) =>
						getLoadoutOptimizationCategory(a).severity -
						getLoadoutOptimizationCategory(b).severity
				)
				.map((categoryId) => {
					return (
						<Box key={categoryId}>
							{categoryId}: {loadoutCategoryCounts[categoryId]}
						</Box>
					);
				})}
		</Box>
	);
}
