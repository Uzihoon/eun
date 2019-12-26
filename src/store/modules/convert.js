import { createAction, handleActions } from "redux-actions";
import { Map, List, fromJS } from "immutable";
import reverseSeq from "img/reverse.png";
import reverseNucleo from "img/reversenu.png";
import merge from "img/merge.png";

const CONVERT_FILE = "convert/CONVERT_FILE";
const ADD_FILE = "convert/ADD_FILE";
const DELETE_FILE = "convert/DELETE_FILE";
const SET_GAUGE = "convert/SET_GAUGE";
const SET_CONVERT = "convert/SET_CONVERT";

export const convertFile = createAction(CONVERT_FILE);
export const addFile = createAction(ADD_FILE);
export const setGauge = createAction(SET_GAUGE);
export const setConvert = createAction(SET_CONVERT);
export const deleteFile = createAction(DELETE_FILE);

const initialState = Map({
  convertList: List([
    {
      title: "Reverse sequence",
      icon: reverseSeq,
      id: "reverseSeq"
    },
    {
      title: "Reverse nucleotide",
      icon: reverseNucleo,
      id: "reverseNucleo"
    },
    {
      title: "Merge files",
      icon: merge,
      id: "merge"
    }
  ]),
  convertFileList: List([]),
  gauge: 0,
  download: null
});

export default handleActions(
  {
    [ADD_FILE]: (state, action) => {
      const { payload: fileList } = action;
      const convertFileList = state
        .get("convertFileList")
        .concat(fromJS(fileList));
      return state.set("convertFileList", convertFileList);
    },
    [DELETE_FILE]: (state, action) => {
      const { payload: file } = action;
      const convertFileList = state
        .get("convertFileList")
        .filter(e => e.name !== file.name);
      return state.set("convertFileList", convertFileList);
    },
    [SET_GAUGE]: (state, action) => {
      return state.set("gauge", action.payload);
    },
    [SET_CONVERT]: (state, action) => {
      const { k, v } = action.payload;
      return state.set(k, v);
    }
  },
  initialState
);
