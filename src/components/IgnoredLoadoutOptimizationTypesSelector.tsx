"use client";

import {
	selectIgnoredLoadoutOptimizationTypes,
	setIgnoredLoadoutOptimizationTypes,
} from '@dlb/redux/features/ignoredLoadoutOptimizationTypes/ignoredLoadoutOptimizationTypesSlice';
import { useAppDispatch, useAppSelector } from '@dlb/redux/hooks';
import {
	ELoadoutOptimizationTypeId,
	IgnorableLoadoutOptimizationTypes,
} from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
	Box,
	Checkbox,
	Collapse,
	FormControlLabel,
	FormGroup,
	IconButton,
} from '@mui/material';
import { useState } from 'react';

export default function IgnoredLoadoutOptimizationTypesSelector() {
	const ignoredLoadoutOptimizationTypes = useAppSelector(
		selectIgnoredLoadoutOptimizationTypes
	);
	const dispatch = useAppDispatch();
	const handleChange = (value: ELoadoutOptimizationTypeId[]) => {
		dispatch(setIgnoredLoadoutOptimizationTypes(value));
	};
	const [open, setOpen] = useState(false);
	return (
		<Box sx={{ paddingLeft: '8px' }}>
			<Box>
				<Box
					onClick={() => setOpen(!open)}
					sx={{
						cursor: 'pointer',
						marginTop: '16px',
						display: 'inline-block',
					}}
				>
					Manage Analyzer Optimizations
					<IconButton aria-label="expand row" size="small">
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</Box>
				<Box>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box
							sx={{
								fontStyle: 'italic',
								fontSize: '14px',
							}}
						>
							Uncheck any optimizations that you want to ignore.
						</Box>
						<FormGroup>
							{IgnorableLoadoutOptimizationTypes.map(
								(loadoutOptimizationType) => {
									const { id, name, color } = loadoutOptimizationType;
									return (
										<Box key={id}>
											<FormControlLabel
												sx={{
													color,
												}}
												control={
													<Checkbox
														checked={
															!ignoredLoadoutOptimizationTypes.includes(id)
														}
														onChange={(e) => {
															const value = !e.target.checked
																? [...ignoredLoadoutOptimizationTypes, id]
																: ignoredLoadoutOptimizationTypes.filter(
																		(x) => x !== id
																  );
															handleChange(value);
														}}
													/>
												}
												label={name}
											/>
										</Box>
									);
								}
							)}
						</FormGroup>
					</Collapse>
				</Box>
			</Box>
		</Box>
	);
}
