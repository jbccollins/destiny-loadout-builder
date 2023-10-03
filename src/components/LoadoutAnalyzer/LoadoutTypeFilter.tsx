import {
	selectLoadoutTypeFilter,
	setLoadoutTypeFilter,
} from '@dlb/redux/features/loadoutTypeFilter/loadoutTypeFilterSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	ELoadoutFilterTypeList,
	ELoadoutTypeFilter,
} from '@dlb/types/AnalyzableLoadout';
import { Box } from '@mui/material';
import { TierBlock } from '../TierBlock';

export default function LoadoutTypeFilter() {
	const dispatch = useAppDispatch();
	const loadoutTypeFilter = useAppSelector(selectLoadoutTypeFilter);
	const handleClick = (value: ELoadoutTypeFilter) => {
		dispatch(setLoadoutTypeFilter(value));
	};
	return (
		<Box>
			<Box sx={{ marginBottom: '2px' }}>Loadout Type:</Box>
			<Box
				sx={{
					background: 'rgb(50, 50, 50)',
					display: 'flex',
					alignItems: 'center',
					border: '1px solid white',
					borderRadius: '4px',
				}}
			>
				{ELoadoutFilterTypeList.map((x, i) => {
					return (
						<TierBlock
							sx={{
								cursor: 'pointer',
							}}
							first={i === 0}
							last={i === ELoadoutFilterTypeList.length - 1}
							filled={x === loadoutTypeFilter}
							key={x}
							onClick={() => handleClick(x)}
							backgroundColor={'rgb(40, 40, 40)'}
						>
							{x}
						</TierBlock>
					);
				})}
			</Box>
		</Box>
	);
}
