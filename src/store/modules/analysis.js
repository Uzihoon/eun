import { createAction, handleActions } from "redux-actions";
import { Map, fromJS, List } from "immutable";

const ANALYSIS_FILES = "analysis/ANALYSIS_FILES";
const ANALYSISED = "analysis/ANALYSISED";
const SAVE_ANALYSIS = "analysis/SAVE_ANALYSIS";
const REST_ANALYSIS = "analysis/RESET_ANALYSIS";
const RUN_SAMPLE = "analysis/RUN_SAMPLE";
const SAVE_ANALYSISES = "analysis/SAVE_ANALYSISES";
const SAVE_ANALYSIS_IMMU = "analysis/SAVE_ANALYSIS_IMMU";

export const analysisFiles = createAction(ANALYSIS_FILES);
export const saveAnalysis = createAction(SAVE_ANALYSIS);
export const analysised = createAction(ANALYSISED);
export const resetAnalysis = createAction(REST_ANALYSIS);
export const runSample = createAction(RUN_SAMPLE);
export const saveAnalysises = createAction(SAVE_ANALYSISES);
export const saveAnalysisImmu = createAction(SAVE_ANALYSIS_IMMU);

const initialState = Map({
  analysisFiles: Map({}),
  analysis: Map({}),
  summary: Map({}),
  failList: List([]),
  indel: Map({}),
  format: Map({}),
  analysisList: Map({}),
  analysised: false
});

export default handleActions(
  {
    [SAVE_ANALYSIS]: (state, action) => {
      const { type, data } = action.payload;
      return state.set(type, fromJS(data));
    },
    [SAVE_ANALYSIS_IMMU]: (state, action) => {
      const { type, data } = action.payload;
      return state.set(type, data);
    },
    [SAVE_ANALYSISES]: (state, action) => {
      const { types, data } = action.payload;
      return state.setIn(types, fromJS(data));
    },
    [ANALYSISED]: (state, action) => {
      const { fileId, data, analysisId } = action.payload;
      return state.setIn(["analysisList", analysisId, fileId], fromJS(data));
    },
    [REST_ANALYSIS]: (state, action) => {
      return state
        .set("analysis", Map({}))
        .set("failList", List([]))
        .set("summary", Map({}));
    }
  },
  initialState
);
