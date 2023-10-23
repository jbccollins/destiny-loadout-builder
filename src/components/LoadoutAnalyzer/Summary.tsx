import {
	ELoadoutOptimizationTypeId,
	getLoadoutOptimization,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	AnalyzableLoadout,
	ELoadoutOptimizationCategoryId,
	getLoadoutOptimizationCategory,
	SeverityOrderedLoadoutOptimizationCategoryIdList,
} from '@dlb/types/AnalyzableLoadout';
import HelpIcon from '@mui/icons-material/Help';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
	Box,
	Collapse,
	IconButton,
	LinearProgress,
	useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import CustomTooltip from '../CustomTooltip';

function calculateWeightedScore(
	loadoutCategoryCounts: Partial<Record<ELoadoutOptimizationCategoryId, number>>
): number {
	const maxSeverity = 3; // Maximum severity level
	let totalWeightedSeverity = 0;
	let totalWeight = 0;

	SeverityOrderedLoadoutOptimizationCategoryIdList.forEach((categoryId) => {
		const { severity } = getLoadoutOptimizationCategory(categoryId);
		if (!loadoutCategoryCounts[categoryId]) {
			return;
		}
		totalWeightedSeverity += loadoutCategoryCounts[categoryId] * severity;
		totalWeight += loadoutCategoryCounts[categoryId];
	});

	if (totalWeight === 0) {
		// Handle the case where there are no severity counts
		return 100; // Return a perfect score when there are no severity counts
	}

	const weightedScore =
		(totalWeightedSeverity / totalWeight / maxSeverity) * 100;

	return 100 - Math.round(weightedScore);
}

// Define a function to assign letter grades with +/- variants
function assignLetterGrade(weightedAverageScore: number): string {
	if (weightedAverageScore === 100) {
		return 'A+';
	} else if (weightedAverageScore >= 93) {
		return 'A';
	} else if (weightedAverageScore >= 90) {
		return 'A-';
	} else if (weightedAverageScore >= 87) {
		return 'B+';
	} else if (weightedAverageScore >= 83) {
		return 'B';
	} else if (weightedAverageScore >= 80) {
		return 'B-';
	} else if (weightedAverageScore >= 77) {
		return 'C+';
	} else if (weightedAverageScore >= 73) {
		return 'C';
	} else if (weightedAverageScore >= 70) {
		return 'C-';
	} else if (weightedAverageScore >= 67) {
		return 'D+';
	} else if (weightedAverageScore >= 63) {
		return 'D';
	} else if (weightedAverageScore >= 60) {
		return 'D-';
	}
	return 'F';
}

function getGradeColor(letterGrade: string): string {
	const gradeColors = {
		'A+': '#00FF00', // Bright Green
		A: '#33FF00', // Green
		'A-': '#66FF00', // Light Green
		'B+': '#99FF00', // Lime Green
		B: '#CCFF00', // Yellow-Green
		'B-': '#FFFF00', // Yellow
		'C+': '#FFCC00', // Orange-Yellow
		C: '#FF9900', // Orange
		'C-': '#FF6600', // Dark Orange
		'D+': '#FF3300', // Bright Red-Orange
		D: '#FF0000', // Red
		'D-': '#FF0000', // Red
		F: '#FF0000', // Red
	};

	return gradeColors[letterGrade] || 'initial'; // Default to black for unknown grades
}

type SummaryProps = {
	loadouts: AnalyzableLoadout[];
	hiddenLoadoutIdList: string[];
	isAnalyzing: boolean;
	analysisProgressValue: number;
};

const gradingHelpText = `
Your grade is calculated based on the weighted average of the
optimizations that can be made to your loadouts. The more severe the
optimization, the higher the weighting and the more it will negatively
affect your grade. Hidden loadouts are not included in the
calculation.
`;

const Progress = (props: { value: number }) => {
	return (
		<Box sx={{ width: '100%', height: '40px' }}>
			<Box>Analysis Progress:</Box>
			<Box>
				<LinearProgress key={1} variant="determinate" value={props.value} />
			</Box>
		</Box>
	);
};

const ScoredResults = (props: {
	loadouts: AnalyzableLoadout[];
	hiddenLoadoutIdList: string[];
}) => {
	const theme = useTheme();
	const [showGradeDetails, setShowGradeDetails] = useState(false);
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
								getLoadoutOptimization(highestSeverityOptimizationTypeId)
									.category
							).severity ||
						highestSeverityOptimizationTypeId ===
							ELoadoutOptimizationTypeId.None
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

	const numHiddenLoadouts = useMemo(
		() => loadouts.filter((x) => hiddenLoadoutIdList.includes(x.id)).length,
		[hiddenLoadoutIdList]
	);

	const grade = useMemo(() => {
		const weightedScore = calculateWeightedScore(loadoutCategoryCounts);
		console.log({ weightedScore });
		return assignLetterGrade(weightedScore);
	}, [loadoutCategoryCounts]);

	const gradeColor = useMemo(() => getGradeColor(grade), [grade]);

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					gap: '4px',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						color: gradeColor,
						backgroundColor: 'black',
						width: '80px',
						height: '80px',
						textAlign: 'center',
						lineHeight: '80px',
						alignItems: 'center',
						borderRadius: '50%',
						fontSize: '40px',
						fontWeight: 'bold',
						marginRight: theme.spacing(1),
						marginTop: theme.spacing(1),
						marginBottom: theme.spacing(1),
						position: 'relative',
					}}
				>
					{grade}
					{/* {numHiddenLoadouts > 0 && (
						<Box
							sx={{
								color: 'white',
								fontSize: '40px',
								position: 'absolute',
								width: '1px',
								height: '1px',
								lineHeight: '0px',
								left: '70px',
								top: '20px',
								fontWeight: 'normal',
								// verticalAlign: 'bottom',
							}}
						>
							*
						</Box>
					)} */}
				</Box>

				<Box
					sx={{
						fontWeight: 'bold',
						fontSize: '20px',
					}}
				>
					Loadout Health Grade
				</Box>
				<CustomTooltip title={gradingHelpText}>
					<HelpIcon />
				</CustomTooltip>
			</Box>

			<Box
				onClick={() => setShowGradeDetails(!showGradeDetails)}
				sx={{ cursor: 'pointer', display: 'inline-block' }}
			>
				Show Grade Details{numHiddenLoadouts > 0 && '*'}
				<IconButton aria-label="expand row" size="small">
					{showGradeDetails ? (
						<KeyboardArrowUpIcon />
					) : (
						<KeyboardArrowDownIcon />
					)}
				</IconButton>
			</Box>
			<Collapse in={showGradeDetails}>
				{/* <Box
					sx={{
						fontWeight: 'bold',
						marginTop: '4px',
						marginBottom: '4px',
						fontSize: '18px',
					}}
				>
					Optimization Categories
				</Box> */}
				<Box
					sx={{
						marginTop: '4px',
						marginBottom: '4px',
						fontSize: '12px',
					}}
				>
					{gradingHelpText}
				</Box>
				<Box
					sx={{
						marginTop: theme.spacing(2),
					}}
				>
					{SeverityOrderedLoadoutOptimizationCategoryIdList.map(
						(categoryId) => {
							const { name, color, severity } =
								getLoadoutOptimizationCategory(categoryId);
							return (
								<Box
									key={categoryId}
									sx={{
										padding: '4px',
										background: 'rgba(30,30,30,0.5)',
										display: 'flex',
										gap: '4px',
										'&:nth-of-type(even)': {
											background: 'rgba(20,20,20,0.5)',
										},
									}}
								>
									<Box
										sx={{
											color: color,
										}}
									>
										{name}
									</Box>
									<Box>: {loadoutCategoryCounts[categoryId] || 0}</Box>
									<Box
										sx={{
											flex: '1 1 auto',
											textAlign: 'right',
										}}
									>
										weight: {severity}
									</Box>
								</Box>
							);
						}
					)}
					{numHiddenLoadouts > 0 && (
						<Box
							sx={{
								marginTop: '8px',
							}}
						>
							<Box>
								{numHiddenLoadouts} loadout{numHiddenLoadouts > 1 && 's'} hidden
							</Box>
							<Box
								sx={{
									marginTop: '4px',
									fontSize: '12px',
								}}
							>
								*Hidden loadouts are not included in the calculation of your
								Loadout Health Grade.
							</Box>
						</Box>
					)}
				</Box>
			</Collapse>
		</Box>
	);
};

export default function Summary(props: SummaryProps) {
	const { loadouts, hiddenLoadoutIdList, isAnalyzing, analysisProgressValue } =
		props;
	const theme = useTheme();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				// alignItems: 'center',
				marginBottom: theme.spacing(4),
				gap: '4px',
				background: 'rgb(50, 50, 50)',
				padding: theme.spacing(1),
				position: 'relative',
				marginLeft: '-8px',
				width: 'calc(100% + 16px)',
				borderRadius: '4px',
			}}
		>
			{isAnalyzing && <Progress value={analysisProgressValue} />}
			{!isAnalyzing && (
				<ScoredResults
					loadouts={loadouts}
					hiddenLoadoutIdList={hiddenLoadoutIdList}
				/>
			)}
		</Box>
	);
}
