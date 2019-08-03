import { createAction, handleActions } from "redux-actions";
import { Map, List, fromJS } from "immutable";

const HANDLE_FILE_LIST = "upload/HANDLE_FILE_LIST";

export const handleFileList = createAction(HANDLE_FILE_LIST);

const initialState = Map({
  fileList: List([])
});

export default handleActions(
  {
    [HANDLE_FILE_LIST]: (state, action) => {
      const { payload: fileList } = action;
      return state.set("fileList", fromJS(fileList));
    }
  },
  initialState
);
