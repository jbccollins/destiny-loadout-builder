import {
	ELoadoutOptimizationTypeId,
	getLoadoutOptimization,
	OrderedLoadoutOptimizationTypeList,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	ELoadoutOptimizationCategoryId,
	getLoadoutOptimizationCategory,
	OrderedLoadoutOptimizationCategoryIdList,
} from '@dlb/types/AnalyzableLoadout';
import { Help } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { Box, IconButton } from '@mui/material';
import { useMemo, useState } from 'react';
import CustomDialog from '../CustomDialog';
import CustomTooltip from '../CustomTooltip';
import IconPill from './IconPill';
import { loadoutOptimizationIconMapping } from './LoadoutAnalyzer';

export const Legend = () => {
	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setOpen(false);
	};
	// Group by category
	const categories = useMemo(() => {
		const categories: Record<
			ELoadoutOptimizationCategoryId,
			ELoadoutOptimizationTypeId[]
		> = {
			[ELoadoutOptimizationCategoryId.COSMETIC]: [],
			[ELoadoutOptimizationCategoryId.IMPROVEMENT]: [],
			[ELoadoutOptimizationCategoryId.WARNING]: [],
			[ELoadoutOptimizationCategoryId.PROBLEM]: [],
			[ELoadoutOptimizationCategoryId.ERROR]: [],
			[ELoadoutOptimizationCategoryId.NONE]: [],
		};
		OrderedLoadoutOptimizationTypeList.forEach((x) => {
			const { category } = getLoadoutOptimization(x);
			categories[category].push(x);
		});
		return categories;
	}, []);
	return (
		<>
			<CustomTooltip title="View Legend" hideOnMobile>
				<IconButton onClick={() => setOpen(!open)} size="small">
					<InfoIcon />
				</IconButton>
			</CustomTooltip>

			<CustomDialog
				title={'Optimization Legend'}
				open={open}
				onClose={handleClose}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '24px',
					}}
				>
					{OrderedLoadoutOptimizationCategoryIdList.map((categoryId) => {
						const optimizationTypeIdList = categories[categoryId];
						const { name, color, description } =
							getLoadoutOptimizationCategory(categoryId);
						return (
							<Box key={categoryId}>
								<Box>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: '8px',
											color: color,
											fontWeight: 'bold',
											fontSize: '1.4rem',
											marginLeft: '8px',
											marginBottom: '8px',
										}}
									>
										<Box>{name}</Box>
										<CustomTooltip title={description}>
											<Help sx={{ color: 'white' }} />
										</CustomTooltip>
									</Box>
								</Box>
								{optimizationTypeIdList.map((key) => {
									const { category, name, description } =
										getLoadoutOptimization(key);
									const { color } = getLoadoutOptimizationCategory(category);
									return (
										<Box
											key={key}
											sx={{
												display: 'flex',
												flexDirection: 'column',
												gap: '8px',
												padding: '8px',
												'&:nth-of-type(odd)': { background: 'rgb(50, 50, 50)' },
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													gap: '8px',
												}}
											>
												<IconPill key={key} color={color} tooltipText={name}>
													{loadoutOptimizationIconMapping[key]}
												</IconPill>
												<Box>{name}</Box>
											</Box>
											<Box>{description}</Box>
										</Box>
									);
								})}
							</Box>
						);
					})}
				</Box>
			</CustomDialog>
		</>
	);
};
