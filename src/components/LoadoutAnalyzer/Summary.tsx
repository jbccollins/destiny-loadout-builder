import CustomTooltip from '@dlb/components/CustomTooltip';
import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import useRichValidLoadouts from '@dlb/hooks/useRichValidLoadouts';
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
import { DestinyClassIdList, getDestinyClass } from '@dlb/types/DestinyClass';
import { EDestinyClassId } from '@dlb/types/IdEnums';
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
import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react';

function calculateWeightedScore(
	loadoutCategoryCounts: Partial<Record<ELoadoutOptimizationCategoryId, number>>
): number {
	if (isEmpty(loadoutCategoryCounts)) {
		return null;
	}
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
	if (weightedAverageScore === null) {
		return '-';
	}
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
		'-': 'white',
	};

	return gradeColors[letterGrade] || 'initial'; // Default to black for unknown grades
}

type SummaryProps = {
	hiddenLoadoutIdList: string[];
	isAnalyzing: boolean;
	analysisProgressValue: number;
	ignoredLoadoutOptimizationTypeIdList: ELoadoutOptimizationTypeId[];
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
	ignoredLoadoutOptimizationTypeIdList: ELoadoutOptimizationTypeId[];
}) => {
	const theme = useTheme();
	const [showGradeDetails, setShowGradeDetails] = useState(false);
	const {
		loadouts,
		hiddenLoadoutIdList,
		ignoredLoadoutOptimizationTypeIdList,
	} = props;
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

	const classSpecificLoadoutCounts = useMemo(() => {
		const clasSpecificLoadoutCounts: Record<EDestinyClassId, number> = {
			[EDestinyClassId.Hunter]: 0,
			[EDestinyClassId.Titan]: 0,
			[EDestinyClassId.Warlock]: 0,
		};

		DestinyClassIdList.forEach((destinyClassId) => {
			clasSpecificLoadoutCounts[destinyClassId] = loadouts.filter(
				(x) => x.destinyClassId === destinyClassId
			).length;
		});

		return clasSpecificLoadoutCounts;
	}, [loadouts]);

	const classSpecificLoadoutCategoryCounts = useMemo(() => {
		const classSpecificLoadoutCategoryCounts: Record<
			EDestinyClassId,
			Partial<Record<ELoadoutOptimizationCategoryId, number>>
		> = {
			[EDestinyClassId.Hunter]: {},
			[EDestinyClassId.Titan]: {},
			[EDestinyClassId.Warlock]: {},
		};
		DestinyClassIdList.forEach((destinyClassId) => {
			loadouts
				.filter(
					(x) =>
						x.destinyClassId === destinyClassId &&
						!hiddenLoadoutIdList.includes(x.id)
				)
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
					classSpecificLoadoutCategoryCounts[destinyClassId][categoryId] =
						classSpecificLoadoutCategoryCounts[destinyClassId][categoryId]
							? classSpecificLoadoutCategoryCounts[destinyClassId][categoryId] +
							  1
							: 1;
				});
		});

		return classSpecificLoadoutCategoryCounts;
	}, [loadouts, hiddenLoadoutIdList]);

	const numHiddenLoadouts = useMemo(
		() => loadouts.filter((x) => hiddenLoadoutIdList.includes(x.id)).length,
		[loadouts, hiddenLoadoutIdList]
	);

	const grade = useMemo(() => {
		const weightedScore = calculateWeightedScore(loadoutCategoryCounts);
		console.log({ weightedScore });
		return assignLetterGrade(weightedScore);
	}, [loadoutCategoryCounts]);

	const classSpecificGrades = useMemo(() => {
		const classSpecificGrades: Record<EDestinyClassId, string> = {
			[EDestinyClassId.Hunter]: '-',
			[EDestinyClassId.Titan]: '-',
			[EDestinyClassId.Warlock]: '-',
		};

		DestinyClassIdList.forEach((destinyClassId) => {
			const weightedScore = calculateWeightedScore(
				classSpecificLoadoutCategoryCounts[destinyClassId]
			);
			classSpecificGrades[destinyClassId] = assignLetterGrade(weightedScore);
		});

		return classSpecificGrades;
	}, [classSpecificLoadoutCategoryCounts]);

	const gradeColor = useMemo(() => getGradeColor(grade), [grade]);

	const classSpecificGradeColors = useMemo(
		() => ({
			[EDestinyClassId.Hunter]: getGradeColor(
				classSpecificGrades[EDestinyClassId.Hunter]
			),
			[EDestinyClassId.Titan]: getGradeColor(
				classSpecificGrades[EDestinyClassId.Titan]
			),
			[EDestinyClassId.Warlock]: getGradeColor(
				classSpecificGrades[EDestinyClassId.Warlock]
			),
		}),
		[classSpecificGrades]
	);

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					gap: '4px',
					flexWrap: 'wrap',
					// alignItems: 'center',
				}}
			>
				<Box
					sx={{
						backgroundColor: 'black',
						width: '64px',
						height: '130px',
						textAlign: 'center',
						borderRadius: '8px',

						marginRight: theme.spacing(1),
						marginTop: theme.spacing(1),
						marginBottom: theme.spacing(1),
						position: 'relative',
					}}
				>
					<Box
						sx={{
							color: gradeColor,
							fontSize: '40px',
							fontWeight: 'bold',
						}}
					>
						{grade}
					</Box>
					<Box sx={{ fontWeight: 'bold' }}>{loadouts.length}</Box>
					<Box sx={{ fontSize: '11px' }}>Loadouts Analyzed</Box>
				</Box>

				<Box>
					<Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
						<Box
							sx={{
								fontWeight: 'bold',
								fontSize: '20px',
								marginTop: theme.spacing(1),
								marginBottom: theme.spacing(1),
							}}
						>
							Loadout Health Grade
						</Box>

						<CustomTooltip title={gradingHelpText}>
							<HelpIcon />
						</CustomTooltip>
					</Box>
					<Box sx={{ display: 'flex', gap: '8px', cursor: 'default' }}>
						{DestinyClassIdList.map((destinyClassId) => {
							const destinyClass = getDestinyClass(destinyClassId);
							return (
								<CustomTooltip
									key={destinyClassId}
									title={`${destinyClass.name} sub-grade`}
								>
									<Box
										sx={{
											background: 'black',
											padding: '4px',
											paddingRight: '8px',
											borderRadius: '12px',
											width: '74px',
										}}
									>
										<Box
											sx={{
												color: classSpecificGradeColors[destinyClassId],
												fontWeight: 'bold',
												fontSize: '20px',
												display: 'flex',
												gap: '4px',
												alignItems: 'center',
											}}
										>
											<BungieImage
												width={40}
												height={40}
												src={destinyClass.icon}
											/>
											{classSpecificGrades[destinyClassId]}
										</Box>
										<Box sx={{ textAlign: 'center', fontSize: '11px' }}>
											{classSpecificLoadoutCounts[destinyClassId]}/
											{loadouts.length}
										</Box>
									</Box>
								</CustomTooltip>
							);
						})}
					</Box>
				</Box>
			</Box>

			<Box
				onClick={() => setShowGradeDetails(!showGradeDetails)}
				sx={{
					cursor: 'pointer',
					display: 'inline-block',
					marginTop: theme.spacing(1),
				}}
			>
				Show Grade Details
				{(numHiddenLoadouts > 0 ||
					ignoredLoadoutOptimizationTypeIdList.length) > 0 && '*'}
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
	const {
		hiddenLoadoutIdList,
		isAnalyzing,
		analysisProgressValue,
		ignoredLoadoutOptimizationTypeIdList,
	} = props;
	const theme = useTheme();
	const loadouts = useRichValidLoadouts();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
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
					ignoredLoadoutOptimizationTypeIdList={
						ignoredLoadoutOptimizationTypeIdList
					}
				/>
			)}
		</Box>
	);
}
