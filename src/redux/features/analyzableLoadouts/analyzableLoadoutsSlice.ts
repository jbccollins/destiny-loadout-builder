import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';

import { GetLoadoutsThatCanBeOptimizedProgress } from '@dlb/services/loadoutAnalyzer/loadoutAnalyzer';
import {
	AnalysisResults,
	AnalyzableLoadoutBreakdown,
	getDefaultAnalyzableLoadoutBreakdown,
} from '@dlb/types/AnalyzableLoadout';
import { NIL, v4 as uuid } from 'uuid';

export type AnalyzableLoadoutsValueState = {
	analyzableLoadoutBreakdown: AnalyzableLoadoutBreakdown;
	isAnalyzing: boolean;
	isAnalyzed: boolean;
	progressCompletionCount: number;
	progressCanBeOptimizedCount: number;
	progressErroredCount: number;
	analysisResults: AnalysisResults;
	hiddenLoadoutIdList: string[];
};

export interface AnalyzableLoadoutsState {
	value: AnalyzableLoadoutsValueState;
	uuid: string;
}

const initialState: AnalyzableLoadoutsState = {
	value: {
		analyzableLoadoutBreakdown: getDefaultAnalyzableLoadoutBreakdown(),
		isAnalyzing: false,
		isAnalyzed: false,
		progressCompletionCount: 0,
		progressCanBeOptimizedCount: 0,
		progressErroredCount: 0,
		analysisResults: {},
		hiddenLoadoutIdList: [],
	},
	uuid: NIL,
};

export const analyzableLoadoutsSlice = createSlice({
	name: 'analyzableLoadouts',
	initialState,
	reducers: {
		setAnalyzableLoadoutsBreakdown: (
			state,
			action: PayloadAction<AnalyzableLoadoutBreakdown>
		) => {
			state.value.analyzableLoadoutBreakdown = action.payload;
			state.uuid = uuid();
		},
		setIsAnalyzing: (state, action: PayloadAction<boolean>) => {
			state.value.isAnalyzing = action.payload;
			state.uuid = uuid();
		},
		setIsAnalyzed: (state, action: PayloadAction<boolean>) => {
			state.value.isAnalyzed = action.payload;
			state.uuid = uuid();
		},
		clearProgressCompletionCount: (state) => {
			state.value.progressCompletionCount = 0;
			state.uuid = uuid();
		},
		incrementProgressCompletionCount: (state) => {
			state.value.progressCompletionCount =
				state.value.progressCompletionCount + 1;
			state.uuid = uuid();
		},
		clearProgressCanBeOptimizedCount: (state) => {
			state.value.progressCanBeOptimizedCount = 0;
			state.uuid = uuid();
		},
		incrementProgressCanBeOptimizedCount: (state) => {
			state.value.progressCanBeOptimizedCount =
				state.value.progressCanBeOptimizedCount + 1;
			state.uuid = uuid();
		},
		clearProgressErroredCount: (state) => {
			state.value.progressErroredCount = 0;
			state.uuid = uuid();
		},
		incrementProgressErroredCount: (state) => {
			state.value.progressErroredCount = state.value.progressErroredCount + 1;
			state.uuid = uuid();
		},
		setAnalysisResults: (state, action: PayloadAction<AnalysisResults>) => {
			state.value.analysisResults = action.payload;
			state.uuid = uuid();
		},
		addAnalysisResult: (
			state,
			action: PayloadAction<GetLoadoutsThatCanBeOptimizedProgress>
		) => {
			state.value.analysisResults[action.payload.loadoutId] = {
				optimizationTypeList: action.payload.optimizationTypeList,
				metadata: action.payload.metadata,
			};
			state.uuid = uuid();
		},
		setHiddenLoadoutIdList: (
			state,
			action: PayloadAction<{ loadoutIdList: string[]; validate: boolean }>
		) => {
			// On initial load, we don't want to validate the hidden loadout id list, just trust it from localStorage
			const { loadoutIdList, validate } = action.payload;
			// Deleted loadout ids get removed here
			const validHiddenIdList = validate
				? loadoutIdList.filter(
						(loadoutId) =>
							!!state.value.analyzableLoadoutBreakdown.validLoadouts[
								loadoutId
							] ||
							!!state.value.analyzableLoadoutBreakdown.invalidLoadouts[
								loadoutId
							]
				  )
				: loadoutIdList;
			localStorage.setItem(
				'hiddenLoadoutIdList',
				JSON.stringify(validHiddenIdList)
			);
			state.value.hiddenLoadoutIdList = validHiddenIdList;
			state.uuid = uuid();
		},
	},
});

export const {
	setAnalyzableLoadoutsBreakdown,
	setIsAnalyzed,
	setIsAnalyzing,
	incrementProgressCompletionCount,
	clearProgressCompletionCount,
	incrementProgressCanBeOptimizedCount,
	clearProgressCanBeOptimizedCount,
	clearProgressErroredCount,
	incrementProgressErroredCount,
	setAnalysisResults,
	addAnalysisResult,
	setHiddenLoadoutIdList,
} = analyzableLoadoutsSlice.actions;

export const selectAnalyzableLoadouts = (state: AppState) =>
	state.analyzableLoadouts.value;

export default analyzableLoadoutsSlice.reducer;
