import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@dlb/redux/store';
import { EExoticArtificeAssumption } from '@dlb/types/IdEnums';
import { NIL, v4 as uuid } from 'uuid';

export interface AnalyzerExoticArtificeAssumptionState {
  value: EExoticArtificeAssumption;
  uuid: string;
}

const initialState: AnalyzerExoticArtificeAssumptionState = {
  value: EExoticArtificeAssumption.All,
  uuid: NIL,
};

export const analyzerExoticArtificeAssumptionSlice = createSlice({
  name: 'analyzerExoticArtificeAssumption',
  initialState,
  reducers: {
    setAnalyzerExoticArtificeAssumption: (
      state,
      action: PayloadAction<EExoticArtificeAssumption>
    ) => {
      state.value = action.payload;
      state.uuid = uuid();
    },
  },
});

export const { setAnalyzerExoticArtificeAssumption } =
  analyzerExoticArtificeAssumptionSlice.actions;

export const selectAnalyzerExoticArtificeAssumption = (state: AppState) =>
  state.analyzerExoticArtificeAssumption.value;

export default analyzerExoticArtificeAssumptionSlice.reducer;
