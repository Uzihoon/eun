import { createAction, handleActions } from "redux-actions";
import { Map } from "immutable";

const ANALYSIS_FILES = "analysis/ANALYSIS_FILES";

export const analysisFiles = createAction(ANALYSIS_FILES);

const initialState = Map({
  analysisFiles: Map({})
});

export default handleActions({}, initialState);
