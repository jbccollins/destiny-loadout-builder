import {
	selectOptimizationTypeFilter,
	setOptimizationTypeFilter,
} from '@dlb/redux/features/optimizationTypeFilter/optimizationTypeFilterSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import { ELoadoutOptimizationTypeId, OrderedLoadoutOptimizationTypeListWithoutNone, getLoadoutOptimization, getLoadoutOptimizationCategory } from '@dlb/types/AnalyzableLoadout';
import { Box } from '@mui/material';
import IconMultiSelectDropdown, { IOption } from '../IconMultiSelectDropdown';
import IconPill from './IconPill';
import { loadoutOptimizationIconMapping } from './LoadoutAnalyzer';

const getOptionValue = (
	optimizationType: ELoadoutOptimizationTypeId
): IOption => {
	const { category, name, description } =
		getLoadoutOptimization(optimizationType);
	const { color } = getLoadoutOptimizationCategory(category);
	const icon = (
		<IconPill color={color} tooltipText={name}>
			{loadoutOptimizationIconMapping[optimizationType]}
		</IconPill>
	);
	return {
		name: name,
		id: optimizationType,
		icon: icon,
		description: description,
	};
};

export default function OptimizationTypeFilter() {
	const dispatch = useAppDispatch();
	const optimizationTypeFilterValue = useAppSelector(
		selectOptimizationTypeFilter
	);
	const handleChange = (value: ELoadoutOptimizationTypeId[]) => {
		dispatch(setOptimizationTypeFilter(value));
	};
	// TODO: Disable options in this filter when there are no loadouts that can be optimized for that optimization type
	return (
		<Box>
			<Box sx={{ marginBottom: '2px' }}>Optimization Type:</Box>
			<IconMultiSelectDropdown
				getOptionValue={getOptionValue}
				getOptionStat={() => null}
				options={OrderedLoadoutOptimizationTypeListWithoutNone}
				value={optimizationTypeFilterValue}
				onChange={handleChange}
				title={''}
				id={'optimization-type-filter'}
			/>
		</Box>
	);
}
