import { createAction, handleActions } from "redux-actions";
import { Map, fromJS, List } from "immutable";

const ANALYSIS_FILES = "analysis/ANALYSIS_FILES";
const ANALYSISED = "analysis/ANALYSISED";
const SAVE_ANALYSIS = "analysis/SAVE_ANALYSIS";
const REST_ANALYSIS = "analysis/RESET_ANALYSIS";
const RUN_SAMPLE = "analysis/RUN_SAMPLE";

export const analysisFiles = createAction(ANALYSIS_FILES);
export const saveAnalysis = createAction(SAVE_ANALYSIS);
export const analysised = createAction(ANALYSISED);
export const resetAnalysis = createAction(REST_ANALYSIS);
export const runSample = createAction(RUN_SAMPLE);

const initialState = Map({
  analysisFiles: Map({}),
  analysis: Map({}),
  summary: List([]),
  failList: List([]),
  indel: Map({})
});

export default handleActions(
  {
    [SAVE_ANALYSIS]: (state, action) => {
      const { type, data } = action.payload;
      return state.set(type, fromJS(data));
    },
    [ANALYSISED]: (state, action) => {
      const { fileId, data } = action.payload;
      return state.setIn(["analysis", fileId], fromJS(data));
    },
    [REST_ANALYSIS]: (state, action) => {
      return state
        .set("analysis", Map({}))
        .set("failList", List([]))
        .set("summary", List([]));
    }
  },
  initialState
);
