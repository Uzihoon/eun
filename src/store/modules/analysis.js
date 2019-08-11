import { createAction, handleActions } from "redux-actions";
import { Map, fromJS, List } from "immutable";

const ANALYSIS_FILES = "analysis/ANALYSIS_FILES";
const SAVE_ANALYSIS = "analysis/SAVE_ANALYSIS";

export const analysisFiles = createAction(ANALYSIS_FILES);
export const saveAnalysis = createAction(SAVE_ANALYSIS);

const initialState = Map({
  analysisFiles: Map({}),
  analysis: Map({}),
  summary: List([])
});

export default handleActions(
  {
    [SAVE_ANALYSIS]: (state, action) => {
      const { type, data } = action.payload;
      return state.set(type, fromJS(data));
    }
  },
  initialState
);
